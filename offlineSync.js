/**
 * SwasthyaSetu — Offline-First Resilience & Sync Queue Engine
 * Handles low-connectivity (2G/Edge), offline local persistence, and background sync reconciliation.
 */

const OfflineSync = {
  currentMode: 'online-4g', // 'online-4g', 'online-2g', 'offline'
  syncQueueKey: 'swasthya_sync_queue_v1',
  listeners: [],

  init() {
    if (!localStorage.getItem(this.syncQueueKey)) {
      localStorage.setItem(this.syncQueueKey, JSON.stringify([]));
    }
    // Listen to real browser online/offline events as baseline
    window.addEventListener('online', () => {
      if (this.currentMode === 'offline') {
        this.setNetworkMode('online-4g');
      }
    });
    window.addEventListener('offline', () => {
      this.setNetworkMode('offline');
    });
    this.updateHUD();
  },

  setNetworkMode(mode) {
    this.currentMode = mode;
    console.log(`[OfflineSync] Network mode switched to: ${mode}`);

    // Update UI badge
    document.querySelectorAll('.net-mode-btn').forEach(btn => {
      btn.classList.remove('active', 'offline-active');
      if (btn.dataset.mode === mode) {
        if (mode === 'offline') {
          btn.classList.add('offline-active');
        } else {
          btn.classList.add('active');
        }
      }
    });

    const indicator = document.getElementById('network-status-indicator');
    if (indicator) {
      if (mode === 'online-4g') {
        indicator.innerHTML = '<span class="pulse-dot" style="background:#10b981"></span> 4G High-Speed';
        indicator.style.color = '#34d399';
      } else if (mode === 'online-2g') {
        indicator.innerHTML = '<span class="pulse-dot" style="background:#f59e0b"></span> 2G / Edge';
        indicator.style.color = '#fbbf24';
      } else {
        indicator.innerHTML = '<span class="pulse-dot" style="background:#ef4444"></span> Offline Mode';
        indicator.style.color = '#f87171';
      }
    }

    if (mode !== 'offline' && this.getQueueCount() > 0) {
      this.syncNow();
    }

    this.notifyListeners('network_change', { mode });
  },

  getNetworkMode() {
    return this.currentMode;
  },

  isOnline() {
    return this.currentMode !== 'offline';
  },

  getQueue() {
    try {
      return JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
    } catch (e) {
      return [];
    }
  },

  getQueueCount() {
    return this.getQueue().length;
  },

  queueAction(actionType, data) {
    const queue = this.getQueue();
    const item = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: actionType,
      payload: data,
      timestamp: new Date().toISOString(),
      status: this.isOnline() ? 'synced' : 'pending_offline'
    };

    if (this.isOnline()) {
      // In online mode (or 2G simulated delay), immediately process
      const delay = this.currentMode === 'online-2g' ? 1200 : 200;
      setTimeout(() => {
        console.log(`[OfflineSync] Transaction synced instantly: ${actionType}`, item);
        this.notifyListeners('synced_item', item);
      }, delay);
    } else {
      queue.unshift(item);
      localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
      console.warn(`[OfflineSync] Queued offline transaction: ${actionType}`, item);
      this.updateHUD();
      this.notifyListeners('queued_item', item);
    }

    return item;
  },

  syncNow() {
    const queue = this.getQueue();
    if (queue.length === 0) {
      this.showToast('All records up-to-date. No offline transactions pending.', 'info');
      return;
    }

    const syncBtn = document.getElementById('sync-trigger-btn');
    if (syncBtn) {
      syncBtn.innerHTML = '🔄 Syncing...';
      syncBtn.style.opacity = '0.7';
    }

    const delay = this.currentMode === 'online-2g' ? 2000 : 800;
    setTimeout(() => {
      const processedCount = queue.length;
      localStorage.setItem(this.syncQueueKey, JSON.stringify([]));
      this.updateHUD();
      if (syncBtn) {
        syncBtn.innerHTML = '🔄 Sync (<span class="sync-count" id="sync-pending-count">0</span>)';
        syncBtn.style.opacity = '1';
      }
      this.showToast(`Sync complete! Reconciled ${processedCount} pending record(s) with District Health Registry.`, 'success');
      this.notifyListeners('sync_complete', { count: processedCount });
    }, delay);
  },

  updateHUD() {
    const count = this.getQueueCount();
    const counterElem = document.getElementById('sync-pending-count');
    if (counterElem) {
      counterElem.textContent = count;
    }
    const syncPill = document.getElementById('sync-trigger-btn');
    if (syncPill) {
      syncPill.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  },

  showToast(msg, type = 'info') {
    let toast = document.getElementById('swasthya-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'swasthya-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #0f172a;
        color: #fff;
        border: 1px solid rgba(45, 212, 191, 0.4);
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        padding: 12px 20px;
        border-radius: 12px;
        z-index: 9999;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform: translateY(20px);
        opacity: 0;
      `;
      document.body.appendChild(toast);
    }

    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    toast.style.borderColor = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#0d9488';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
    }, 3800);
  },

  subscribe(callback) {
    this.listeners.push(callback);
  },

  notifyListeners(event, data) {
    this.listeners.forEach(fn => {
      try { fn(event, data); } catch (e) { console.error(e); }
    });
  }
};

window.OfflineSync = OfflineSync;
