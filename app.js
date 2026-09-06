/**
 * SwasthyaSetu — Main Application Orchestrator
 * Controls personas, navigation tabs, multilingual translations, audio feedback, and modal management.
 */

const AppState = {
  currentRole: 'asha', // 'asha', 'mo', 'specialist', 'cmo'
  currentTab: 'triage',
  currentLang: 'en',
  soundEnabled: true,
  audioCtx: null
};

// ============================================================================
// Multilingual UI Dictionary (6 Languages)
// ============================================================================
const Translations = {
  en: {
    app_title: "SwasthyaSetu",
    app_subtitle: "Integrated Rural Healthcare Network",
    role_asha: "Frontline ASHA / ANM (Sub-Centre)",
    role_mo: "Medical Officer (PHC)",
    role_specialist: "District Specialist (DH Hub)",
    role_cmo: "District Health Officer (Command)",
    tab_triage: "Digital Triage & CDSS",
    tab_teleconsult: "Assisted Teleconsultation",
    tab_records: "Longitudinal Records (ABHA)",
    tab_referrals: "Closed-Loop Referrals",
    tab_diagnostics: "Diagnostics Network",
    tab_inventory: "Medicine Inventory (e-Aushadhi)",
    tab_registries: "High-Risk Registries",
    tab_dashboard: "Command Dashboard",
    hero_title: "Strengthening Rural Public Healthcare with",
    hero_highlight: "Integrated Clinical Decision Intelligence",
    hero_desc: "Bridging the last-mile care continuum between village Sub-Centres (Ayushman Arogya Mandir), Primary Health Centres, and District Hospitals through assisted teleconsultation, closed-loop referrals, and offline-first records.",
    stat_wait_time: "Wait Time Reduction",
    stat_referral_rate: "Referral Completion",
    stat_stock_rate: "Drug Availability",
    stat_travel_saved: "Travel Saved"
  },
  hi: {
    app_title: "स्वास्थ्य सेतु",
    app_subtitle: "एकीकृत ग्रामीण स्वास्थ्य नेटवर्क",
    role_asha: "आशा / एएनएम दीदी (उप-स्वास्थ्य केंद्र)",
    role_mo: "चिकित्सा अधिकारी (पीएचसी)",
    role_specialist: "जिला विशेषज्ञ डॉक्टर (जिला अस्पताल)",
    role_cmo: "मुख्य चिकित्सा अधिकारी (कमांड सेंटर)",
    tab_triage: "डिजिटल ट्रायज व निर्णय सहायता",
    tab_teleconsult: "सहायता प्राप्त टेली-परामर्श",
    tab_records: "दीर्घकालिक स्वास्थ्य रिकॉर्ड (आभा)",
    tab_referrals: "बंद-लूप रेफरल ट्रैकिंग",
    tab_diagnostics: "जांच व लैब नेटवर्क",
    tab_inventory: "दवा उपलब्धता (ई-औषधि)",
    tab_registries: "उच्च जोखिम रोगी रजिस्टर",
    tab_dashboard: "जिला स्वास्थ्य डैशबोर्ड",
    hero_title: "ग्रामीण सार्वजनिक स्वास्थ्य प्रणाली को सशक्त बनाएं",
    hero_highlight: "एकीकृत डिजिटल स्वास्थ्य व टेली-परामर्श से",
    hero_desc: "उप-स्वास्थ्य केंद्र, प्राथमिक स्वास्थ्य केंद्र और जिला अस्पताल के बीच की दूरी को मिटाएं—समय पर विशेषज्ञ सलाह, सुरक्षित रेफरल और दवा उपलब्धता सुनिश्चित करें।",
    stat_wait_time: "प्रतीक्षा समय में कमी",
    stat_referral_rate: "रेफरल पूर्णता दर",
    stat_stock_rate: "दवा उपलब्धता",
    stat_travel_saved: "बचत यात्रा दूरी"
  },
  bn: {
    app_title: "স্বাস্থ্য সেতু",
    app_subtitle: "সমন্বিত গ্রামীণ স্বাস্থ্য নেটওয়ার্ক",
    role_asha: "আশা কর্মী / এএনএম (উপ-স্বাস্থ্য কেন্দ্র)",
    role_mo: "মেডিকেল অফিসার (পিএইচসি)",
    role_specialist: "জেলা বিশেষজ্ঞ চিকিৎসক",
    role_cmo: "জেলা স্বাস্থ্য আধিকারিক (কমান্ড সেন্টার)",
    tab_triage: "ডিজিটাল ট্রায়াজ ও সিদ্ধান্ত সহায়তা",
    tab_teleconsult: "সহায়তাপ্রাপ্ত টেলি-পরামর্শ",
    tab_records: "রোগীর স্বাস্থ্য রেকর্ড (আভা)",
    tab_referrals: "ক্লোজড-লুপ রেফারেল ট্র্যাকার",
    tab_diagnostics: "ডায়াগনস্টিক ল্যাব নেটওয়ার্ক",
    tab_inventory: "ওষুধ মজুত ও সরবরাহ",
    tab_registries: "উচ্চ ঝুঁকিপূর্ণ রোগী রেজিস্ট্রি",
    tab_dashboard: "জেলা স্বাস্থ্য ড্যাশবোর্ড",
    hero_title: "গ্রামীণ জনস্বাস্থ্য পরিকাঠামো শক্তিশালীকরণ",
    hero_highlight: "সমন্বিত ডিজিটাল সিদ্ধান্ত ব্যবস্থার মাধ্যমে",
    hero_desc: "উপ-স্বাস্থ্য কেন্দ্র থেকে জেলা হাসপাতাল পর্যন্ত সার্বক্ষণিক স্বাস্থ্যসেবা নিশ্চিতকরণ।",
    stat_wait_time: "অপেক্ষার সময় হ্রাস",
    stat_referral_rate: "রেফারেল সম্পূর্ণতা",
    stat_stock_rate: "ওষুধের প্রাপ্যতা",
    stat_travel_saved: "সঞ্চয়কৃত যাতায়াত"
  },
  ta: {
    app_title: "சுவாஸ்த்ய சேது",
    app_subtitle: "ஒருங்கிணைந்த கிராமப்புற சுகாதார அமைப்பு",
    role_asha: "ஆஷா / ஏஎன்எம் (துணை சுகாதார நிலையம்)",
    role_mo: "மருத்துவ அலுவலர் (பிஎச்சி)",
    role_specialist: "மாவட்ட சிறப்பு மருத்துவர்",
    role_cmo: "மாவட்ட தலைமை மருத்துவ அலுவலர்",
    tab_triage: "டிஜிட்டல் ட்ரையாஜ் மற்றும் வழிகாட்டுதல்",
    tab_teleconsult: "தொலை மருத்துவ ஆலோசனை",
    tab_records: "மருத்துவ பதிவுகள் (ஆபா)",
    tab_referrals: "பரிந்துரை கண்காணிப்பு",
    tab_diagnostics: "ஆய்வக நெட்வொர்க்",
    tab_inventory: "மருந்து இருப்பு",
    tab_registries: "அதிக ஆபத்துள்ள நோயாளிகள் பட்டியல்",
    tab_dashboard: "மாவட்ட கட்டுப்பாட்டு அறை",
    hero_title: "கிராமப்புற சுகாதாரத்தை மேம்படுத்துதல்",
    hero_highlight: "ஒருங்கிணைந்த தொழில்நுட்ப உதவி மூலம்",
    hero_desc: "கிராமப்புற துணை நிலையங்கள் முதல் மாவட்ட மருத்துவமனை வரை தொடர்ச்சியான சிகிச்சை.",
    stat_wait_time: "காத்திருப்பு நேரம் குறைப்பு",
    stat_referral_rate: "பரிந்துரை நிறைவு விகிதம்",
    stat_stock_rate: "மருந்து இருப்பு",
    stat_travel_saved: "பயண தூரம் சேமிப்பு"
  },
  te: {
    app_title: "స్వాస్థ్య సేతు",
    app_subtitle: "సమీకృత గ్రామీణ ఆరోగ్య నెట్‌వర్క్",
    role_asha: "ఆశా / ఏఎన్ఎమ్ (సబ్ సెంటర్)",
    role_mo: "మెడికల్ ఆఫీసర్ (పీహెచ్‌సీ)",
    role_specialist: "జిల్లా నిపుణుల వైద్యులు",
    role_cmo: "జిల్లా ఆరోగ్య అధికారి",
    tab_triage: "డిజిటల్ ట్రయాజ్",
    tab_teleconsult: "టెలిమెడిసిన్ కన్సల్టేషన్",
    tab_records: "ఆరోగ్య రికార్డులు (ఆభా)",
    tab_referrals: "రిఫరల్ ట్రాకింగ్",
    tab_diagnostics: "ల్యాబ్ నెట్‌వర్క్",
    tab_inventory: "మందుల లభ్యత",
    tab_registries: "హై-రిస్క్ రోగుల రిజిస్ట్రీ",
    tab_dashboard: "కమాండ్ డాష్‌బోర్డ్",
    hero_title: "గ్రామీణ ప్రజారోగ్య వ్యవస్థ బలోపేతం",
    hero_highlight: "సమీకృత డిజిటల్ నిర్ణయ మద్దతుతో",
    hero_desc: "గ్రామ సబ్ సెంటర్ల నుండి జిల్లా ఆసుపత్రుల వరకు నిరంతర ఆరోగ్య సేవలు.",
    stat_wait_time: "వేచి ఉండే సమయం తగ్గింపు",
    stat_referral_rate: "రిఫరల్ పూర్తయిన రేటు",
    stat_stock_rate: "మందుల లభ్యత",
    stat_travel_saved: "ఆదా అయిన ప్రయాణ దూరం"
  },
  mr: {
    app_title: "स्वास्थ्य सेतू",
    app_subtitle: "एकात्मिक ग्रामीण आरोग्य नेटवर्क",
    role_asha: "आशा / एएनएम ताई (उपकेंद्र)",
    role_mo: "वैद्यकीय अधिकारी (प्राथमिक आरोग्य केंद्र)",
    role_specialist: "जिल्हा तज्ज्ञ डॉक्टर",
    role_cmo: "जिल्हा शल्यचिकित्सक (कमांड सेंटर)",
    tab_triage: "डिजिटल ट्रायज व निर्णय साहाय्य",
    tab_teleconsult: "सहाय्यित टेली-सल्लागार",
    tab_records: "आरोग्य नोंदी (आभा)",
    tab_referrals: "रेफरल ट्रॅकिंग प्रणाली",
    tab_diagnostics: "निदान व लॅब समन्वय",
    tab_inventory: "औषध उपलब्धता",
    tab_registries: "उच्च जोखीम रुग्ण नोंदवही",
    tab_dashboard: "जिल्हा आरोग्य डॅशबोर्ड",
    hero_title: "ग्रामीण आरोग्य व्यवस्थेचे सक्षमीकरण",
    hero_highlight: "एकात्मिक डिजिटल आरोग्य तंत्रज्ञानाद्वारे",
    hero_desc: "उपकेंद्र, प्राथमिक आरोग्य केंद्र आणि जिल्हा रुग्णालय यांच्यातील माहितीची अखंडता.",
    stat_wait_time: "प्रतीक्षा वेळेत घट",
    stat_referral_rate: "रेफरल पूर्णता दर",
    stat_stock_rate: "औषध उपलब्धता",
    stat_travel_saved: "प्रवासातील अंतर बचत"
  }
};

// ============================================================================
// Web Audio Synthesizer
// ============================================================================
const SoundFX = {
  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) AppState.audioCtx = new AudioContext();
    } catch (e) {}
  },

  playTone(freq = 600, duration = 0.06, type = 'sine') {
    if (!AppState.soundEnabled) return;
    if (!AppState.audioCtx) this.init();
    if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }
    if (!AppState.audioCtx) return;

    try {
      const osc = AppState.audioCtx.createOscillator();
      const gain = AppState.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, AppState.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, AppState.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, AppState.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(AppState.audioCtx.destination);
      osc.start();
      osc.stop(AppState.audioCtx.currentTime + duration);
    } catch (e) {}
  },

  playClick() { this.playTone(800, 0.04); },
  playSuccess() {
    this.playTone(523, 0.08);
    setTimeout(() => this.playTone(659, 0.08), 70);
    setTimeout(() => this.playTone(784, 0.12), 140);
  }
};

// ============================================================================
// Particle Canvas Background
// ============================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const numParticles = Math.min(45, Math.floor(width / 30));

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.35 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(45, 212, 191, 0.4)';
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.08)';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// ============================================================================
// Core Navigation & Persona Management
// ============================================================================
const App = {
  init() {
    initParticleCanvas();
    SoundFX.init();

    // Initialize all sub-modules
    if (window.OfflineSync) window.OfflineSync.init();
    if (window.HealthRecords) window.HealthRecords.init();
    if (window.DigitalTriage) window.DigitalTriage.init();
    if (window.Teleconsult) window.Teleconsult.init();
    if (window.ReferralTracker) window.ReferralTracker.init();
    if (window.DiagnosticLab) window.DiagnosticLab.init();
    if (window.MedicineInventory) window.MedicineInventory.init();
    if (window.PatientRegistries) window.PatientRegistries.init();
    if (window.DistrictDashboard) window.DistrictDashboard.init();

    this.bindDOMEvents();
    this.applyTranslations('en');
    this.switchTab('triage');

    console.log('[SwasthyaSetu] Platform fully mounted and active.');
  },

  bindDOMEvents() {
    // Tab buttons
    document.querySelectorAll('.module-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        SoundFX.playClick();
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
      });
    });

    // Persona / Role buttons
    document.querySelectorAll('.role-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.playClick();
        this.switchRole(btn.dataset.role);
      });
    });

    // Language dropdown
    const langSelect = document.getElementById('lang-select-dropdown');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        SoundFX.playClick();
        this.setLanguage(e.target.value);
      });
    }

    // Network Simulator Buttons
    document.querySelectorAll('.net-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.playClick();
        if (window.OfflineSync) {
          window.OfflineSync.setNetworkMode(btn.dataset.mode);
        }
      });
    });

    // Emergency SOS Trigger
    const sosBtn = document.getElementById('emergency-sos-top-btn');
    if (sosBtn) {
      sosBtn.addEventListener('click', () => {
        if (window.DigitalTriage) window.DigitalTriage.dispatchEmergency108();
      });
    }

    // Modal Close buttons
    document.querySelectorAll('.modal-close-x, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.swasthya-modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.swasthya-modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
    });

    // Sound toggle button
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        AppState.soundEnabled = !AppState.soundEnabled;
        soundBtn.style.opacity = AppState.soundEnabled ? '1' : '0.4';
        if (AppState.soundEnabled) SoundFX.playSuccess();
      });
    }
  },

  switchTab(tabId) {
    AppState.currentTab = tabId;

    // Update nav buttons
    document.querySelectorAll('.module-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    if (window.MobileWeb) {
      window.MobileWeb.setActiveDockItem(tabId);
    }

    // Show corresponding section
    document.querySelectorAll('.app-module-section').forEach(sec => {
      sec.style.display = sec.id === `section-${tabId}` ? 'block' : 'none';
    });

    // Specific module renders
    if (tabId === 'records' && window.HealthRecords) window.HealthRecords.renderRecordView();
    if (tabId === 'referrals' && window.ReferralTracker) window.ReferralTracker.renderReferralsList();
    if (tabId === 'diagnostics' && window.DiagnosticLab) window.DiagnosticLab.renderDiagnostics();
    if (tabId === 'inventory' && window.MedicineInventory) window.MedicineInventory.renderInventory();
    if (tabId === 'registries' && window.PatientRegistries) window.PatientRegistries.renderRegistryCards();
    if (tabId === 'dashboard' && window.DistrictDashboard) window.DistrictDashboard.renderKPIs();
  },

  switchRole(role) {
    AppState.currentRole = role;

    document.querySelectorAll('.role-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === role);
    });

    const facilityBadge = document.getElementById('facility-tier-badge');

    if (role === 'asha') {
      if (facilityBadge) facilityBadge.innerHTML = '📍 Sub-Centre (Arogya Mandir Rampur)';
      this.switchTab('triage');
    } else if (role === 'mo') {
      if (facilityBadge) facilityBadge.innerHTML = '🏥 Primary Health Centre (PHC Bithoor)';
      this.switchTab('teleconsult');
    } else if (role === 'specialist') {
      if (facilityBadge) facilityBadge.innerHTML = '🏛️ District Women\'s Hospital (Sitapur)';
      this.switchTab('teleconsult');
    } else if (role === 'cmo') {
      if (facilityBadge) facilityBadge.innerHTML = '📊 District Health Command Hub';
      this.switchTab('dashboard');
    }

    if (window.OfflineSync) {
      window.OfflineSync.showToast(`Switched active workspace persona: ${role.toUpperCase()}`, 'info');
    }
  },

  setLanguage(lang) {
    AppState.currentLang = lang;
    this.applyTranslations(lang);
    if (window.VoiceLiteracy) window.VoiceLiteracy.setLanguage(lang);
  },

  applyTranslations(lang) {
    const dict = Translations[lang] || Translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.dataset.i18n;
      if (dict[key]) {
        elem.textContent = dict[key];
      }
    });
  },

  openSyncDrawer() {
    const modal = document.getElementById('sync-drawer-modal');
    if (!modal) return;
    modal.classList.add('open');

    const listEl = document.getElementById('sync-transactions-list');
    if (!listEl || !window.OfflineSync) return;

    const queue = window.OfflineSync.getQueue();
    if (queue.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; padding:16px; text-align:center;">All records reconciled. No offline transactions pending.</div>';
    } else {
      listEl.innerHTML = queue.map(q => `
        <div class="encounter-card" style="margin-bottom:8px; padding:10px 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:var(--text-primary); font-size:0.85rem;">${q.type}</strong>
            <span class="encounter-facility-tag tag-chc">Pending Sync</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); margin-top:2px;">${q.id} • ${q.timestamp}</div>
        </div>
      `).join('');
    }
  },

  manualTriggerSync() {
    if (window.OfflineSync) {
      window.OfflineSync.syncNow();
      setTimeout(() => this.openSyncDrawer(), 400);
    }
  }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());
