/**
 * SETU HEALTH - RURAL CARE PATHWAY PLATFORM
 * Core JavaScript Application
 * Features:
 * - Supabase Integration & Offline Fallback Data Store
 * - Role-Based Routing (Health Worker / Doctor / Patient)
 * - 7-Stage Rural Pathway Workflow (Identify -> Triage -> Facility -> Teleconsult -> Referral -> Follow-up -> Record)
 */

// ==========================================================================
// 1. SUPABASE INTEGRATION & CONFIGURATION
// ==========================================================================
const SUPABASE_STORAGE_KEY = 'setu_supabase_config';
let supabaseClient = null;

const SupabaseManager = {
  config: {
    url: '',
    anonKey: ''
  },
  isConnected: false,

  init() {
    const saved = localStorage.getItem(SUPABASE_STORAGE_KEY);
    if (saved) {
      try {
        this.config = JSON.parse(saved);
        if (this.config.url && this.config.anonKey && window.supabase) {
          supabaseClient = window.supabase.createClient(this.config.url, this.config.anonKey);
          this.testConnection();
        }
      } catch (e) {
        console.warn('Failed to parse Supabase config', e);
      }
    }
    this.updateStatusBadge();
  },

  async saveConfig(url, anonKey) {
    this.config.url = url.trim();
    this.config.anonKey = anonKey.trim();
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(this.config));

    if (this.config.url && this.config.anonKey && window.supabase) {
      try {
        supabaseClient = window.supabase.createClient(this.config.url, this.config.anonKey);
        await this.testConnection();
      } catch (err) {
        this.isConnected = false;
        showToast('Supabase Error: ' + err.message);
      }
    } else {
      this.isConnected = false;
    }
    this.updateStatusBadge();
    return this.isConnected;
  },

  async testConnection() {
    if (!supabaseClient) return false;
    try {
      // Try querying facilities or patients table
      const { data, error } = await supabaseClient.from('facilities').select('id').limit(1);
      if (!error) {
        this.isConnected = true;
        this.updateStatusBadge();
        showToast('Connected to Supabase Database successfully!');
        return true;
      } else {
        // Table might not exist yet, but client connected
        this.isConnected = true;
        this.updateStatusBadge();
        return true;
      }
    } catch (e) {
      this.isConnected = false;
      this.updateStatusBadge();
      return false;
    }
  },

  updateStatusBadge() {
    const badges = document.querySelectorAll('.supabase-status-badge');
    badges.forEach(badge => {
      if (this.isConnected) {
        badge.innerHTML = `<span class="status-dot"></span> Supabase Connected`;
        badge.title = 'Live connection to Supabase database active';
      } else {
        badge.innerHTML = `<span class="status-dot offline"></span> Demo Mode (Offline Sync)`;
        badge.title = 'Running locally on indexed storage. Click to connect live Supabase!';
      }
    });
  }
};

// ==========================================================================
// 2. MOCK / RESILIENT DATA STORE
// ==========================================================================
const DEFAULT_PATIENTS = [
  {
    id: 'p-101',
    name: 'Sunita Devi',
    age: 26,
    gender: 'Female',
    village: 'Rampur',
    phone: '98765 11223',
    abhaId: '91-4421-8930-1122',
    problem: 'Pre-eclampsia: Severe headache, blurred vision, swelling in feet',
    vitals: { bpSys: 165, bpDia: 105, pulse: 92, spo2: 96, temp: 98.6, glucose: 110 },
    triageLevel: 'Emergency',
    facility: 'District Civil Hospital',
    referral: {
      reason: 'Hypertensive crisis in pregnancy (34 weeks)',
      ambulance: '108 Ambulance (MH-20-AB-4412)',
      eta: '14 min',
      qrCode: 'REF-SUNITA-9144-EMG'
    },
    followUp: { date: '2026-09-12', notes: 'ASHA home visit for post-delivery BP check' },
    status: 'In Transit'
  },
  {
    id: 'p-102',
    name: 'Ramesh Patil',
    age: 58,
    gender: 'Male',
    village: 'Beed Khurd',
    phone: '98765 99881',
    abhaId: '91-7712-3344-9988',
    problem: 'Chest discomfort radiating to left arm, sweating on exertion',
    vitals: { bpSys: 145, bpDia: 92, pulse: 104, spo2: 94, temp: 98.4, glucose: 185 },
    triageLevel: 'Emergency',
    facility: 'Majalgaon Community Health Centre (CHC)',
    referral: {
      reason: 'Suspected Acute Coronary Syndrome (ACS)',
      ambulance: '108 Ambulance (MH-20-CZ-8101)',
      eta: '22 min',
      qrCode: 'REF-RAMESH-9177-EMG'
    },
    followUp: { date: '2026-09-15', notes: 'Cardiology OPD follow-up and ECG check' },
    status: 'Bed Allocated'
  },
  {
    id: 'p-103',
    name: 'Baby of Meena',
    age: 1,
    gender: 'Male',
    village: 'Rampur',
    phone: '98765 44556',
    abhaId: '91-5540-8821-4455',
    problem: 'Persistent watery diarrhea for 2 days, mild dehydration',
    vitals: { bpSys: 90, bpDia: 60, pulse: 118, spo2: 98, temp: 100.2, glucose: 95 },
    triageLevel: 'Urgent',
    facility: 'Beed Primary Health Centre (PHC)',
    referral: {
      reason: 'Oral rehydration therapy and pediatric evaluation',
      ambulance: 'Not Required (Private auto)',
      eta: 'Arrived',
      qrCode: 'REF-MEENA-9155-URG'
    },
    followUp: { date: '2026-09-09', notes: 'ASHA zinc supplement & ORS verification' },
    status: 'Under Observation'
  },
  {
    id: 'p-104',
    name: 'Anjali Sharma',
    age: 32,
    gender: 'Female',
    village: 'Shivajinagar',
    phone: '98765 66778',
    abhaId: '91-8890-1234-5678',
    problem: 'Seasonal allergic bronchitis, dry cough and mild wheeze',
    vitals: { bpSys: 118, bpDia: 76, pulse: 74, spo2: 99, temp: 98.2, glucose: 102 },
    triageLevel: 'Routine',
    facility: 'Rampur Ayushman Arogya Mandir (SC)',
    referral: {
      reason: 'Tele-consultation completed, regular inhaler prescribed',
      ambulance: 'Not Required',
      eta: '-',
      qrCode: 'REF-ANJALI-9188-ROU'
    },
    followUp: { date: '2026-09-18', notes: 'Routine check after 10 days of medication' },
    status: 'Routine Care'
  }
];

const FACILITIES_DATA = [
  {
    id: 'fac-1',
    name: 'Rampur Ayushman Arogya Mandir (SC)',
    type: 'Sub-Centre',
    distance: 1.2,
    travelTime: '6 mins',
    doctorOnDuty: false,
    bedsFree: 2,
    icuFree: 0,
    oxygen: false,
    specialties: ['First Aid', 'Antenatal Check', 'NCD Screening', 'Tele-OPD']
  },
  {
    id: 'fac-2',
    name: 'Beed Primary Health Centre (PHC)',
    type: 'PHC',
    distance: 5.8,
    travelTime: '15 mins',
    doctorOnDuty: true,
    bedsFree: 6,
    icuFree: 0,
    oxygen: true,
    specialties: ['General Medicine', 'Normal Deliveries', 'Basic Lab', 'Tele-consult']
  },
  {
    id: 'fac-3',
    name: 'Majalgaon Community Health Centre (CHC)',
    type: 'CHC',
    distance: 14.2,
    travelTime: '28 mins',
    doctorOnDuty: true,
    bedsFree: 18,
    icuFree: 2,
    oxygen: true,
    specialties: ['Obstetrics & Gynae', 'General Surgery', '24x7 Emergency', 'X-Ray & Lab']
  },
  {
    id: 'fac-4',
    name: 'District Civil Hospital',
    type: 'District Hospital',
    distance: 32.5,
    travelTime: '55 mins',
    doctorOnDuty: true,
    bedsFree: 45,
    icuFree: 8,
    oxygen: true,
    specialties: ['Cardiology', 'ICU & Trauma', 'High-Risk Obstetrics', 'Blood Bank', 'Pediatric ICU']
  }
];

// Local state
let state = {
  currentRole: 'health_worker', // 'health_worker' | 'doctor' | 'patient' | 'other'
  currentUser: {
    name: 'Rekha Tai (ASHA)',
    roleTitle: 'ASHA Facilitator',
    location: 'Rampur Village',
    avatarInitials: 'RT'
  },
  currentStep: 1, // 1 to 7
  activePatient: DEFAULT_PATIENTS[0],
  patients: JSON.parse(localStorage.getItem('setu_patients')) || DEFAULT_PATIENTS,
  teleconsultState: {
    active: false,
    timer: 0,
    muted: false,
    cameraOff: false
  }
};

function savePatientsToStorage() {
  localStorage.setItem('setu_patients', JSON.stringify(state.patients));
}

// ==========================================================================
// 3. AUTHENTICATION & ROLE SWITCHING
// ==========================================================================
function selectRole(role) {
  state.currentRole = role;
  
  // Highlight role card in sign-in form
  document.querySelectorAll('.role-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.role === role);
  });

  // Update demo placeholder credentials
  const idInput = document.getElementById('loginIdentifier');
  const pwdInput = document.getElementById('loginPassword');

  if (role === 'health_worker') {
    idInput.value = '98765 43210';
    pwdInput.value = '123456';
    state.currentUser = { name: 'Rekha Tai', roleTitle: 'ASHA Facilitator', location: 'Rampur Sub-Centre', avatarInitials: 'RT' };
  } else if (role === 'doctor') {
    idInput.value = '98111 22334';
    pwdInput.value = 'doctor123';
    state.currentUser = { name: 'Dr. Anand Verma, MD', roleTitle: 'Medical Officer (PHC/CHC)', location: 'Beed PHC Cluster', avatarInitials: 'AV' };
  } else if (role === 'patient') {
    idInput.value = '91-4421-8930';
    pwdInput.value = 'sunita2026';
    state.currentUser = { name: 'Sunita Devi', roleTitle: 'Patient / Citizen', location: 'Village Rampur', avatarInitials: 'SD' };
  } else {
    idInput.value = '98222 55667';
    pwdInput.value = 'admin123';
    state.currentUser = { name: 'S. K. Deshmukh', roleTitle: 'Block Health Admin', location: 'District HQ', avatarInitials: 'SD' };
  }
}

function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  
  showToast(`Signed in as ${state.currentUser.name} (${state.currentUser.roleTitle})`);
  launchPortal();
}

function launchPortal() {
  document.getElementById('authScreen').style.display = 'none';
  const portal = document.getElementById('portalScreen');
  portal.style.display = 'flex';

  renderUserHeader();
  renderRoleDashboard();
  setPathwayStep(1);
}

function handleSignOut() {
  document.getElementById('portalScreen').style.display = 'none';
  document.getElementById('authScreen').style.display = 'flex';
  showToast('You have signed out.');
}

function switchRoleDirect(role) {
  selectRole(role);
  renderUserHeader();
  renderRoleDashboard();
  showToast(`Switched view to ${state.currentUser.roleTitle}`);
}

function renderUserHeader() {
  document.getElementById('navUserName').innerText = state.currentUser.name;
  document.getElementById('navUserAvatar').innerText = state.currentUser.avatarInitials;

  const rolePill = document.getElementById('navRolePill');
  rolePill.className = `role-badge-pill ${state.currentRole}`;
  
  if (state.currentRole === 'health_worker') {
    rolePill.innerHTML = `<i data-feather="heart"></i> ASHA / ANM Field Portal`;
  } else if (state.currentRole === 'doctor') {
    rolePill.innerHTML = `<i data-feather="activity"></i> Doctor Clinical Suite`;
  } else if (state.currentRole === 'patient') {
    rolePill.innerHTML = `<i data-feather="user"></i> Patient Health Hub`;
  } else {
    rolePill.innerHTML = `<i data-feather="shield"></i> Health Admin`;
  }
  feather.replace();
}

// ==========================================================================
// 4. ROLE-SPECIFIC DASHBOARD SWITCHING
// ==========================================================================
function renderRoleDashboard() {
  // Hide all role sections
  document.querySelectorAll('.role-dashboard-view').forEach(view => {
    view.classList.remove('active');
  });

  if (state.currentRole === 'health_worker') {
    document.getElementById('ashaDashboard').classList.add('active');
    renderAshaPatientTable();
    updateAshaKPIs();
  } else if (state.currentRole === 'doctor') {
    document.getElementById('doctorDashboard').classList.add('active');
    renderDoctorQueue();
    updateDoctorKPIs();
  } else if (state.currentRole === 'patient') {
    document.getElementById('patientDashboard').classList.add('active');
    renderPatientHub();
  } else {
    document.getElementById('ashaDashboard').classList.add('active');
  }

  feather.replace();
}

// ==========================================================================
// 5. 7-STAGE PATHWAY WORKFLOW LOGIC
// "Patient/ASHA identifies problem → triage → finds appropriate facility →
//  appointment/teleconsultation → referral → follow-up → record updated"
// ==========================================================================
function setPathwayStep(stepNum) {
  state.currentStep = stepNum;

  // Highlight active step in the top stepper bar
  document.querySelectorAll('.pathway-step-node').forEach(node => {
    const s = parseInt(node.dataset.step, 10);
    node.classList.remove('active', 'completed');
    if (s === stepNum) {
      node.classList.add('active');
    } else if (s < stepNum) {
      node.classList.add('completed');
    }
  });

  // Switch visible pathway tab section
  document.querySelectorAll('.pathway-section-view').forEach(sec => {
    sec.style.display = 'none';
  });

  const targetView = document.getElementById(`stepView_${stepNum}`);
  if (targetView) {
    targetView.style.display = 'block';
  }

  feather.replace();
}

// --- STEP 1: IDENTIFY PROBLEM (ASHA / PATIENT INTAKE) ---
function handleIdentifyProblemSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('step1_name').value.trim();
  const age = parseInt(document.getElementById('step1_age').value, 10) || 25;
  const gender = document.getElementById('step1_gender').value;
  const village = document.getElementById('step1_village').value.trim();
  const abha = document.getElementById('step1_abha').value.trim() || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const complaints = document.getElementById('step1_complaints').value.trim();
  const isPregnant = document.getElementById('step1_pregnant') ? document.getElementById('step1_pregnant').checked : false;

  const newPatient = {
    id: 'p-' + Date.now(),
    name,
    age,
    gender,
    village,
    phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
    abhaId: abha,
    problem: complaints + (isPregnant ? ' [Pregnancy Alert]' : ''),
    vitals: { bpSys: 120, bpDia: 80, pulse: 78, spo2: 98, temp: 98.4, glucose: 105 },
    triageLevel: 'Routine',
    facility: 'Beed Primary Health Centre (PHC)',
    referral: {
      reason: 'Under initial screening',
      ambulance: 'Not Dispatched',
      eta: '-',
      qrCode: `REF-${name.split(' ')[0].toUpperCase()}-${Date.now().toString().slice(-4)}`
    },
    followUp: { date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], notes: 'Initial intake follow-up' },
    status: 'Screened'
  };

  state.patients.unshift(newPatient);
  state.activePatient = newPatient;
  savePatientsToStorage();

  // If Supabase is connected, sync
  syncToSupabase('patients', {
    abha_id: newPatient.abhaId,
    full_name: newPatient.name,
    age: newPatient.age,
    gender: newPatient.gender,
    village: newPatient.village,
    asha_worker_id: state.currentUser.name
  });

  showToast(`Patient ${name} registered! Moving to Step 2: Clinical Triage.`);
  
  // Fill Step 2 form automatically
  document.getElementById('step2_patientNameDisplay').innerText = `${newPatient.name} (${newPatient.age}y/${newPatient.gender}) · ABHA: ${newPatient.abhaId}`;
  setPathwayStep(2);
}

// Voice note simulator for Step 1
let isRecordingVoice = false;
function toggleVoiceRecording() {
  const btn = document.getElementById('voiceRecordBtn');
  const waves = document.getElementById('voiceWaveBox');
  const status = document.getElementById('voiceStatusText');
  const complaintsInput = document.getElementById('step1_complaints');

  isRecordingVoice = !isRecordingVoice;
  if (isRecordingVoice) {
    btn.style.background = '#10b981';
    btn.innerHTML = `<i data-feather="square"></i>`;
    waves.style.display = 'flex';
    status.innerText = 'Listening in Hindi / Marathi / English... (Simulated)';
    feather.replace();

    setTimeout(() => {
      if (isRecordingVoice) {
        complaintsInput.value = "Patient reports persistent high fever for 3 days with severe chills and body ache. Mild breathing discomfort reported when walking.";
        toggleVoiceRecording();
        showToast('Voice transcribed to Chief Complaints successfully!');
      }
    }, 2800);
  } else {
    btn.style.background = '#ef4444';
    btn.innerHTML = `<i data-feather="mic"></i>`;
    waves.style.display = 'none';
    status.innerText = 'Click mic to record patient voice in regional language';
    feather.replace();
  }
}

// --- STEP 2: TRIAGE EVALUATOR ---
function calculateTriageScore() {
  const bpSys = parseInt(document.getElementById('vitals_bpsys').value, 10) || 120;
  const bpDia = parseInt(document.getElementById('vitals_bpdia').value, 10) || 80;
  const pulse = parseInt(document.getElementById('vitals_pulse').value, 10) || 75;
  const spo2 = parseInt(document.getElementById('vitals_spo2').value, 10) || 98;
  const temp = parseFloat(document.getElementById('vitals_temp').value) || 98.4;
  const glucose = parseInt(document.getElementById('vitals_glucose').value, 10) || 100;
  const dangerSign = document.getElementById('vitals_dangerSigns').value;

  let score = 0;
  let urgency = 'Routine';
  let badgeClass = 'routine';

  // Clinical calculation criteria (ICMR / Rural Health triage guidelines)
  if (bpSys >= 160 || bpDia >= 100 || spo2 < 92 || pulse > 120 || dangerSign === 'severe') {
    urgency = 'Emergency';
    badgeClass = 'emergency';
    score = 9;
  } else if (bpSys >= 140 || bpDia >= 90 || spo2 < 95 || pulse > 100 || temp > 101 || dangerSign === 'moderate') {
    urgency = 'Urgent';
    badgeClass = 'urgent';
    score = 5;
  } else {
    urgency = 'Routine';
    badgeClass = 'routine';
    score = 2;
  }

  const badgeEl = document.getElementById('triageScoreBadge');
  badgeEl.className = `badge-priority ${badgeClass}`;
  badgeEl.innerText = `${urgency} (Risk Score: ${score}/10)`;

  const recEl = document.getElementById('triageRecommendation');
  if (urgency === 'Emergency') {
    recEl.innerHTML = `<strong style="color:#b91c1c;">Immediate referral to CHC / District Hospital required!</strong> Dispatch 108 Ambulance and alert emergency bed.`;
  } else if (urgency === 'Urgent') {
    recEl.innerHTML = `<strong style="color:#92400e;">Referral or Same-day Doctor Teleconsultation recommended.</strong> Connect with Primary Health Centre (PHC).`;
  } else {
    recEl.innerHTML = `<strong style="color:#065f46;">Stable for Local Sub-Centre OPD.</strong> Routine medication and ASHA follow-up advised.`;
  }

  // Update active patient vitals
  if (state.activePatient) {
    state.activePatient.vitals = { bpSys, bpDia, pulse, spo2, temp, glucose };
    state.activePatient.triageLevel = urgency;
  }
}

function handleTriageConfirm() {
  if (state.activePatient) {
    savePatientsToStorage();
    renderAshaPatientTable();
    renderDoctorQueue();

    syncToSupabase('triage_assessments', {
      patient_id: state.activePatient.id,
      systolic_bp: state.activePatient.vitals.bpSys,
      diastolic_bp: state.activePatient.vitals.bpDia,
      pulse_rate: state.activePatient.vitals.pulse,
      spo2_percentage: state.activePatient.vitals.spo2,
      urgency_level: state.activePatient.triageLevel,
      triaged_by: state.currentUser.name
    });
  }

  showToast(`Triage completed: Marked as ${state.activePatient ? state.activePatient.triageLevel : 'Assessed'}. Finding appropriate facility...`);
  setPathwayStep(3);
}

// --- STEP 3: APPROPRIATE FACILITY FINDER ---
function renderFacilityCards(filterType = 'all') {
  const listEl = document.getElementById('facilityResultsList');
  if (!listEl) return;

  listEl.innerHTML = '';
  const filtered = filterType === 'all' ? FACILITIES_DATA : FACILITIES_DATA.filter(f => f.type.toLowerCase().includes(filterType.toLowerCase()));

  filtered.forEach(fac => {
    const isRecommended = (state.activePatient && state.activePatient.triageLevel === 'Emergency' && (fac.type === 'District Hospital' || fac.type === 'CHC')) ||
                          (state.activePatient && state.activePatient.triageLevel === 'Routine' && fac.type === 'Sub-Centre');

    const card = document.createElement('div');
    card.className = 'facility-card-item';
    card.style.borderColor = isRecommended ? '#10b981' : 'var(--border-light)';
    card.innerHTML = `
      <div class="facility-info-meta">
        <div style="display:flex; align-items:center; gap:8px;">
          <h4>${fac.name}</h4>
          ${isRecommended ? '<span class="facility-tag" style="background:#def7ec; color:#03543f;">Recommended for Triage</span>' : ''}
        </div>
        <p><i data-feather="map-pin" style="width:12px;height:12px;"></i> ${fac.distance} km away · Travel time approx ${fac.travelTime}</p>
        <div class="facility-tags">
          <span class="facility-tag">${fac.type}</span>
          <span class="facility-tag" style="${fac.doctorOnDuty ? 'color:#03543f;' : 'color:#92400e;'}">${fac.doctorOnDuty ? '● Doctor on Duty' : '○ Nurse / CHO on Duty'}</span>
          <span class="facility-tag">${fac.bedsFree} Beds Free</span>
          ${fac.oxygen ? '<span class="facility-tag">O2 Available</span>' : ''}
        </div>
      </div>
      <div>
        <button class="btn-hero-action" style="font-size:12px; padding:7px 12px;" onclick="selectFacility('${fac.id}')">
          Route Patient →
        </button>
      </div>
    `;
    listEl.appendChild(card);
  });
  feather.replace();
}

function selectFacility(facId) {
  const fac = FACILITIES_DATA.find(f => f.id === facId);
  if (fac && state.activePatient) {
    state.activePatient.facility = fac.name;
    savePatientsToStorage();
    showToast(`Facility selected: ${fac.name}. Next: Book Appointment / Teleconsultation.`);
    setPathwayStep(4);
  }
}

// --- STEP 4: APPOINTMENT / TELECONSULTATION ---
let teleconsultTimerInterval = null;

function startTeleconsultSimulation() {
  const teleView = document.getElementById('teleconsultActiveRoom');
  const lobbyView = document.getElementById('teleconsultLobby');
  if (teleView && lobbyView) {
    lobbyView.style.display = 'none';
    teleView.style.display = 'flex';
  }

  state.teleconsultState.active = true;
  state.teleconsultState.timer = 0;
  
  if (teleconsultTimerInterval) clearInterval(teleconsultTimerInterval);
  teleconsultTimerInterval = setInterval(() => {
    state.teleconsultState.timer++;
    const mins = String(Math.floor(state.teleconsultState.timer / 60)).padStart(2, '0');
    const secs = String(state.teleconsultState.timer % 60).padStart(2, '0');
    const timerEl = document.getElementById('teleconsultTimerDisplay');
    if (timerEl) timerEl.innerText = `${mins}:${secs}`;
  }, 1000);

  showToast('Connecting via e-Sanjeevani Teleconsultation server...');
}

function endTeleconsultSimulation() {
  if (teleconsultTimerInterval) clearInterval(teleconsultTimerInterval);
  state.teleconsultState.active = false;

  const teleView = document.getElementById('teleconsultActiveRoom');
  const lobbyView = document.getElementById('teleconsultLobby');
  if (teleView && lobbyView) {
    teleView.style.display = 'none';
    lobbyView.style.display = 'block';
  }

  showToast('Teleconsultation concluded. Doctor notes & prescription recorded.');
  setPathwayStep(5);
}

function toggleTeleMute() {
  state.teleconsultState.muted = !state.teleconsultState.muted;
  const btn = document.getElementById('btnMuteAudio');
  if (btn) {
    btn.innerHTML = state.teleconsultState.muted ? `<i data-feather="mic-off"></i>` : `<i data-feather="mic"></i>`;
    feather.replace();
  }
  showToast(state.teleconsultState.muted ? 'Microphone muted' : 'Microphone unmuted');
}

// --- STEP 5: REFERRAL & TRANSPORT ---
function generateReferralSlip() {
  if (!state.activePatient) return;

  const refCode = `SETU-REF-${Math.floor(100000 + Math.random() * 900000)}`;
  state.activePatient.referral.qrCode = refCode;
  state.activePatient.referral.ambulance = '108 Ambulance (MH-20-CZ-9912)';
  state.activePatient.referral.eta = '18 mins';
  state.activePatient.status = 'Referral Dispatched';
  savePatientsToStorage();

  const codeEl = document.getElementById('referralDisplayCode');
  if (codeEl) codeEl.innerText = refCode;

  syncToSupabase('referrals', {
    patient_id: state.activePatient.id,
    referral_reason: state.activePatient.problem,
    priority: state.activePatient.triageLevel,
    qr_reference_code: refCode,
    ambulance_status: 'Dispatched'
  });

  showToast(`Referral Slip #${refCode} Generated! 108 Ambulance dispatched.`);
  setPathwayStep(6);
}

// --- STEP 6: FOLLOW-UP TRACKER ---
function scheduleFollowUp(e) {
  if (e) e.preventDefault();
  const date = document.getElementById('followUpDate').value;
  const notes = document.getElementById('followUpNotes').value;

  if (state.activePatient) {
    state.activePatient.followUp = { date, notes };
    state.activePatient.status = 'Follow-up Scheduled';
    savePatientsToStorage();

    syncToSupabase('follow_ups', {
      patient_id: state.activePatient.id,
      visit_date: date,
      observations: notes,
      asha_id: state.currentUser.name
    });
  }

  showToast(`Follow-up task set for ${date}. Moving to Step 7: Record Updated.`);
  setPathwayStep(7);
}

// --- STEP 7: RECORD UPDATED ---
function finalizeHealthRecord() {
  if (!state.activePatient) return;

  const syncTime = new Date().toLocaleTimeString();
  const syncDate = new Date().toLocaleDateString();

  document.getElementById('recordSyncTimestamp').innerText = `Synced to ABDM & ABHA Locker on ${syncDate} at ${syncTime}`;
  document.getElementById('recordAbhaIdDisplay').innerText = state.activePatient.abhaId;
  document.getElementById('recordPatientNameDisplay').innerText = state.activePatient.name;
  document.getElementById('recordDiagnosisDisplay').innerText = state.activePatient.problem;
  document.getElementById('recordFacilityDisplay').innerText = state.activePatient.facility;

  syncToSupabase('health_records', {
    patient_id: state.activePatient.id,
    final_diagnosis: state.activePatient.problem,
    treatment_summary: `Triaged: ${state.activePatient.triageLevel}. Facility: ${state.activePatient.facility}`,
    care_pathway_summary: state.activePatient
  });

  showToast('Patient Care Pathway Complete! Electronic Health Record (EHR) Updated.');
}

// ==========================================================================
// 6. ROLE DASHBOARD RENDERERS
// ==========================================================================

// --- HEALTH WORKER (ASHA) TABLE ---
function renderAshaPatientTable() {
  const tbody = document.getElementById('ashaPatientsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  state.patients.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="patient-cell">
          <div class="patient-avatar-mini">${p.name.charAt(0)}</div>
          <div class="patient-name-box">
            <div class="name">${p.name}</div>
            <div class="sub">${p.gender}, ${p.age}y · ${p.village}</div>
          </div>
        </div>
      </td>
      <td><span style="font-family:var(--font-mono); font-size:12px;">${p.abhaId}</span></td>
      <td>
        <span class="badge-priority ${p.triageLevel.toLowerCase()}">
          ${p.triageLevel}
        </span>
      </td>
      <td>${p.facility}</td>
      <td><strong>${p.status || 'Active'}</strong></td>
      <td>
        <button class="btn-hero-secondary" style="font-size:11px; padding:4px 8px;" onclick="loadPatientToPathway('${p.id}')">
          Open Pathway →
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateAshaKPIs() {
  const countScreened = state.patients.length;
  const countEmergencies = state.patients.filter(p => p.triageLevel === 'Emergency').length;
  const countReferrals = state.patients.filter(p => p.status && p.status.includes('Referral')).length;

  document.getElementById('ashaKpiScreened').innerText = countScreened;
  document.getElementById('ashaKpiEmergency').innerText = countEmergencies;
  document.getElementById('ashaKpiReferrals').innerText = countReferrals;
  document.getElementById('ashaKpiFollowup').innerText = '6 Due';
}

// --- DOCTOR DASHBOARD QUEUE ---
function renderDoctorQueue() {
  const queueEl = document.getElementById('doctorQueueList');
  if (!queueEl) return;

  queueEl.innerHTML = '';
  const sorted = [...state.patients].sort((a, b) => {
    const order = { Emergency: 0, Urgent: 1, Routine: 2 };
    return order[a.triageLevel] - order[b.triageLevel];
  });

  sorted.forEach(p => {
    const item = document.createElement('div');
    item.className = 'facility-card-item';
    item.innerHTML = `
      <div class="facility-info-meta">
        <div style="display:flex; align-items:center; gap:8px;">
          <h4>${p.name}</h4>
          <span class="badge-priority ${p.triageLevel.toLowerCase()}">${p.triageLevel}</span>
        </div>
        <p>${p.problem}</p>
        <div class="facility-tags">
          <span class="facility-tag">BP: ${p.vitals.bpSys}/${p.vitals.bpDia}</span>
          <span class="facility-tag">SpO2: ${p.vitals.spo2}%</span>
          <span class="facility-tag">Pulse: ${p.vitals.pulse} bpm</span>
          <span class="facility-tag">${p.village}</span>
        </div>
      </div>
      <div style="display:flex; gap:6px;">
        <button class="btn-hero-action" style="font-size:11.5px; padding:6px 10px;" onclick="doctorJoinTeleconsult('${p.id}')">
          <i data-feather="video" style="width:12px;height:12px;"></i> Consult
        </button>
      </div>
    `;
    queueEl.appendChild(item);
  });
  feather.replace();
}

function updateDoctorKPIs() {
  const emergencyCount = state.patients.filter(p => p.triageLevel === 'Emergency').length;
  document.getElementById('docKpiQueue').innerText = state.patients.length;
  document.getElementById('docKpiEmergency').innerText = emergencyCount;
  document.getElementById('docKpiBeds').innerText = '14 / 20';
  document.getElementById('docKpiPrescriptions').innerText = '19';
}

function doctorJoinTeleconsult(patientId) {
  loadPatientToPathway(patientId);
  setPathwayStep(4);
  startTeleconsultSimulation();
}

// --- PATIENT HUB ---
function renderPatientHub() {
  const current = state.patients.find(p => p.name.includes('Sunita')) || state.patients[0];
  state.activePatient = current;

  document.getElementById('patientHubName').innerText = current.name;
  document.getElementById('patientHubAbha').innerText = current.abhaId;
  document.getElementById('patientHubVitalsBP').innerText = `${current.vitals.bpSys}/${current.vitals.bpDia} mmHg`;
  document.getElementById('patientHubVitalsSpO2').innerText = `${current.vitals.spo2}%`;
  document.getElementById('patientHubVitalsPulse').innerText = `${current.vitals.pulse} bpm`;
  document.getElementById('patientHubTriageBadge').innerText = current.triageLevel;
  document.getElementById('patientHubTriageBadge').className = `badge-priority ${current.triageLevel.toLowerCase()}`;
  document.getElementById('patientHubFacilityName').innerText = current.facility;
  document.getElementById('patientHubQrCode').innerText = current.referral.qrCode;
}

function loadPatientToPathway(patientId) {
  const p = state.patients.find(item => item.id === patientId);
  if (p) {
    state.activePatient = p;
    showToast(`Loaded pathway for ${p.name}`);
    setPathwayStep(2);
  }
}

// ==========================================================================
// 7. SUPABASE SYNC HELPER
// ==========================================================================
async function syncToSupabase(table, recordData) {
  if (!supabaseClient || !SupabaseManager.isConnected) {
    console.log(`[Offline Fallback] Stored to local storage for table "${table}":`, recordData);
    return;
  }
  try {
    const { data, error } = await supabaseClient.from(table).insert([recordData]);
    if (error) {
      console.warn(`Supabase insert error on ${table}:`, error);
    } else {
      console.log(`Supabase synced successfully on ${table}:`, data);
    }
  } catch (err) {
    console.warn(`Supabase sync catch error:`, err);
  }
}

// Modal open/close
function openSupabaseModal() {
  document.getElementById('supabaseConfigModal').classList.add('open');
  const urlInput = document.getElementById('supabaseUrlInput');
  const keyInput = document.getElementById('supabaseKeyInput');
  urlInput.value = SupabaseManager.config.url || '';
  keyInput.value = SupabaseManager.config.anonKey || '';
}

function closeSupabaseModal() {
  document.getElementById('supabaseConfigModal').classList.remove('open');
}

async function handleSupabaseFormSave(e) {
  e.preventDefault();
  const url = document.getElementById('supabaseUrlInput').value;
  const key = document.getElementById('supabaseKeyInput').value;

  const success = await SupabaseManager.saveConfig(url, key);
  if (success) {
    closeSupabaseModal();
  }
}

// Toast helper
function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ==========================================================================
// 8. APP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  SupabaseManager.init();
  renderFacilityCards('all');

  // Attach search listeners
  const facFilter = document.getElementById('facilityFilterSelect');
  if (facFilter) {
    facFilter.addEventListener('change', (e) => renderFacilityCards(e.target.value));
  }

  feather.replace();
});
