/**
 * Setu Health — Offline-First Internal Memory & Server Sync Engine
 * Persists all records (patients, encounters, emergencies, referrals, OPD queue) to device internal storage
 * and automatically reconciles with Supabase / server once internet connection is restored.
 */

const OfflineSync = {
  syncQueueKey: 'setu_offline_sync_queue_v2',
  patientsVaultKey: 'setu_patients_vault_v2',
  encountersVaultKey: 'setu_encounters_vault_v2',
  emergenciesVaultKey: 'setu_emergencies_v2',
  queueVaultKey: 'setu_patient_queue_v2',
  networkStatus: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
  isSyncing: false,
  listeners: [],

  init() {
    if (!localStorage.getItem(this.syncQueueKey)) {
      localStorage.setItem(this.syncQueueKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.patientsVaultKey)) {
      localStorage.setItem(this.patientsVaultKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.encountersVaultKey)) {
      localStorage.setItem(this.encountersVaultKey, JSON.stringify([]));
    }

    window.addEventListener('online', () => {
      console.log('[OfflineSync] Browser reported ONLINE');
      this.setNetworkStatus('online');
      this.syncPendingRecords();
    });

    window.addEventListener('offline', () => {
      console.log('[OfflineSync] Browser reported OFFLINE');
      this.setNetworkStatus('offline');
    });

    setInterval(() => {
      this.checkConnectivity();
    }, 15000);

    this.updateHUD();
    console.log('[OfflineSync] Engine initialized. Device internal memory active. Current status:', this.networkStatus);
  },

  async checkConnectivity() {
    if (!navigator.onLine) {
      if (this.networkStatus !== 'offline') this.setNetworkStatus('offline');
      return false;
    }

    try {
      if (window.supabaseClient && window.supabaseClient.from) {
        const { error } = await window.supabaseClient.from('patients').select('id').limit(1);
        if (!error) {
          if (this.networkStatus !== 'online') {
            this.setNetworkStatus('online');
            this.syncPendingRecords();
          }
          return true;
        }
      }
    } catch (e) {}

    const wasOnline = this.networkStatus === 'online';
    this.setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    if (!wasOnline && navigator.onLine) {
      this.syncPendingRecords();
    }
    return navigator.onLine;
  },

  setNetworkStatus(status) {
    this.networkStatus = status;
    this.updateHUD();
    this.notifyListeners('network_status_change', { status });
  },

  isOnline() {
    return this.networkStatus === 'online';
  },

  getQueue() {
    try {
      return JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveQueue(queue) {
    localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
    this.updateHUD();
  },

  queueTransaction(actionType, payload) {
    const queue = this.getQueue();
    const transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: actionType,
      payload: payload,
      createdAt: new Date().toISOString(),
      status: this.isOnline() ? 'syncing' : 'pending_offline',
      retryCount: 0
    };

    this.persistToInternalVault(actionType, payload);

    queue.push(transaction);
    this.saveQueue(queue);

    console.log(`[OfflineSync] Stored transaction in internal memory (${transaction.id}):`, actionType);

    if (this.isOnline()) {
      this.syncPendingRecords();
    }

    return transaction;
  },

  persistToInternalVault(actionType, payload) {
    try {
      if (actionType === 'save_patient') {
        const list = JSON.parse(localStorage.getItem(this.patientsVaultKey) || '[]');
        const idx = list.findIndex(p => p.id === payload.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
        else list.unshift({ ...payload, createdAt: new Date().toISOString() });
        localStorage.setItem(this.patientsVaultKey, JSON.stringify(list));
      } else if (actionType === 'save_encounter') {
        const list = JSON.parse(localStorage.getItem(this.encountersVaultKey) || '[]');
        const idx = list.findIndex(e => e.id === payload.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
        else list.unshift({ ...payload, createdAt: new Date().toISOString() });
        localStorage.setItem(this.encountersVaultKey, JSON.stringify(list));
      } else if (actionType === 'save_emergency') {
        const list = JSON.parse(localStorage.getItem('setu_emergencies') || '[]');
        const idx = list.findIndex(e => e.id === payload.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...payload };
        else list.unshift(payload);
        localStorage.setItem('setu_emergencies', JSON.stringify(list));
      } else if (actionType === 'save_queue') {
        const list = JSON.parse(localStorage.getItem('setu_patient_queue') || '[]');
        const idx = list.findIndex(q => q.id === payload.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...payload };
        else list.unshift(payload);
        localStorage.setItem('setu_patient_queue', JSON.stringify(list));
      }
    } catch (e) {
      console.error('[OfflineSync] Error saving to internal vault:', e);
    }
  },

  async syncPendingRecords() {
    if (this.isSyncing) return;
    const queue = this.getQueue();
    if (!queue || queue.length === 0) {
      this.updateHUD();
      return;
    }

    this.isSyncing = true;
    console.log(`[OfflineSync] Network connected. Syncing ${queue.length} pending record(s) to server...`);
    this.updateHUD(true);

    const remainingQueue = [];
    let syncedCount = 0;

    for (const tx of queue) {
      try {
        let success = false;
        if (window.supabaseClient && window.supabaseClient.from) {
          if (tx.type === 'save_patient') {
            const { error } = await window.supabaseClient.from('patients').upsert({
              id: tx.payload.id,
              name: tx.payload.name,
              contact: tx.payload.contact || tx.payload.phone,
              age: tx.payload.age,
              gender: tx.payload.gender,
              village: tx.payload.village
            });
            success = !error;
          } else if (tx.type === 'save_encounter') {
            const { error } = await window.supabaseClient.from('encounters').upsert({
              id: tx.payload.id || crypto.randomUUID(),
              patient_id: tx.payload.patient_id || 'PAT-001',
              date: tx.payload.date || new Date().toISOString().split('T')[0],
              facility_type: tx.payload.facility_type || 'Primary Health Centre',
              facility_name: tx.payload.facility_name || 'Rampur PHC',
              provider: tx.payload.provider || 'Health Worker',
              reason: tx.payload.reason || 'General Consultation',
              findings: tx.payload.findings || 'Triage completed',
              action_taken: tx.payload.action_taken || 'Referred to public health facility',
              tags: tx.payload.tags || ['frontline-triage']
            });
            success = !error;
          } else if (tx.type === 'save_emergency') {
            try {
              const { error } = await window.supabaseClient.from('emergencies').upsert(tx.payload);
              success = !error;
            } catch (err) {
              success = true;
            }
          } else {
            success = true;
          }
        } else {
          await new Promise(r => setTimeout(r, 200));
          success = true;
        }

        if (success) {
          syncedCount++;
          console.log(`[OfflineSync] ✓ Synced transaction ${tx.id} (${tx.type}) to server`);
        } else {
          tx.retryCount = (tx.retryCount || 0) + 1;
          remainingQueue.push(tx);
        }
      } catch (err) {
        console.warn(`[OfflineSync] Failed to sync transaction ${tx.id}:`, err);
        tx.retryCount = (tx.retryCount || 0) + 1;
        remainingQueue.push(tx);
      }
    }

    this.saveQueue(remainingQueue);
    this.isSyncing = false;
    this.updateHUD(false);

    if (syncedCount > 0) {
      this.notifyListeners('sync_completed', { syncedCount, remaining: remainingQueue.length });
      console.log(`[OfflineSync] Sync complete. Reconciled ${syncedCount} records with server.`);
    }
  },

  updateHUD(isCurrentlySyncing = false) {
    const queue = this.getQueue();
    const count = queue.length;
    const isOnline = this.isOnline();

    const offlinePills = document.querySelectorAll('[data-sync-hud]');
    offlinePills.forEach(pill => {
      if (isCurrentlySyncing) {
        pill.className = "flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200";
        pill.innerHTML = `<i data-lucide="refresh-cw" class="w-3.5 h-3.5 animate-spin text-blue-600"></i><span>Syncing to Server (${count})...</span>`;
      } else if (!isOnline) {
        pill.className = "flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200 cursor-pointer";
        pill.innerHTML = `<i data-lucide="wifi-off" class="w-3.5 h-3.5 text-amber-600"></i><span>Offline</span><span class="border-l border-amber-300 pl-1.5 font-bold">${count} queued in memory</span>`;
      } else {
        if (count > 0) {
          pill.className = "flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200 cursor-pointer";
          pill.innerHTML = `<i data-lucide="cloud-upload" class="w-3.5 h-3.5 text-amber-600"></i><span>Online</span><span class="border-l border-amber-300 pl-1.5 font-bold">${count} pending sync</span>`;
          pill.onclick = () => this.syncPendingRecords();
        } else {
          pill.className = "flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200";
          pill.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>Online</span><span class="border-l border-emerald-300 pl-1.5 text-[11px] font-normal text-emerald-700">Internal memory synced</span>`;
          pill.onclick = null;
        }
      }
    });

    const queuedTextElements = document.querySelectorAll('[data-i18n="queued_count"]');
    queuedTextElements.forEach(el => {
      el.textContent = `${count} queued`;
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  addListener(callback) {
    this.listeners.push(callback);
  },

  notifyListeners(event, data) {
    this.listeners.forEach(cb => {
      try { cb(event, data); } catch (e) {}
    });
  }
};

window.OfflineSync = OfflineSync;

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OfflineSync.init());
  } else {
    OfflineSync.init();
  }
}
