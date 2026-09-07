/**
 * SwasthyaSetu — Frontline Digital Triage & Clinical Decision Support System (CDSS)
 * Protocol-driven risk stratification based on MoHFW Ayushman Bharat & WHO IMNCI standards.
 */

const DigitalTriage = {
  presets: {
    maternal_preeclampsia: {
      patientName: "Sunita Devi",
      age: 28,
      category: "Maternal",
      bp_sys: 168,
      bp_dia: 108,
      pulse: 98,
      spo2: 97,
      temp: 98.6,
      resp: 22,
      glucose: 110,
      hb: 8.2,
      danger_headache: true,
      danger_vision: true,
      danger_bleeding: false,
      danger_chest_pain: false,
      danger_breathing: false,
      danger_child_indrawing: false
    },
    pediatric_sam_pneumonia: {
      patientName: "Baby Aarav",
      age: 0.75,
      category: "Pediatric",
      bp_sys: 88,
      bp_dia: 54,
      pulse: 142,
      spo2: 91,
      temp: 101.4,
      resp: 52,
      glucose: 75,
      hb: 7.2,
      danger_headache: false,
      danger_vision: false,
      danger_bleeding: false,
      danger_chest_pain: false,
      danger_breathing: true,
      danger_child_indrawing: true
    },
    ncd_uncontrolled_htn: {
      patientName: "Ramesh Patel",
      age: 54,
      category: "Adult Chronic",
      bp_sys: 158,
      bp_dia: 98,
      pulse: 84,
      spo2: 96,
      temp: 98.4,
      resp: 18,
      glucose: 245,
      hb: 13.5,
      danger_headache: false,
      danger_vision: false,
      danger_bleeding: false,
      danger_chest_pain: false,
      danger_breathing: false,
      danger_child_indrawing: false
    },
    routine_wellness: {
      patientName: "Priya Sharma",
      age: 32,
      category: "Maternal PNC",
      bp_sys: 118,
      bp_dia: 76,
      pulse: 74,
      spo2: 99,
      temp: 98.4,
      resp: 16,
      glucose: 92,
      hb: 11.4,
      danger_headache: false,
      danger_vision: false,
      danger_bleeding: false,
      danger_chest_pain: false,
      danger_breathing: false,
      danger_child_indrawing: false
    }
  },

  currentAssessment: null,

  init() {
    this.bindEvents();
    // Load default preset on initial view
    this.loadPreset('maternal_preeclampsia');
  },

  bindEvents() {
    const form = document.getElementById('triage-evaluation-form');
    if (form) {
      form.addEventListener('input', () => this.evaluate());
    }

    const presetSelect = document.getElementById('triage-preset-selector');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => this.loadPreset(e.target.value));
    }
  },

  loadPreset(presetKey) {
    const data = this.presets[presetKey];
    if (!data) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    const setCheck = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.checked = !!val;
        const pill = el.closest('.check-pill');
        if (pill) {
          if (val) pill.classList.add('checked');
          else pill.classList.remove('checked');
        }
      }
    };

    setVal('triage-patient-name', data.patientName);
    setVal('triage-patient-age', data.age);
    setVal('triage-patient-category', data.category);
    setVal('vitals-bp-sys', data.bp_sys);
    setVal('vitals-bp-dia', data.bp_dia);
    setVal('vitals-pulse', data.pulse);
    setVal('vitals-spo2', data.spo2);
    setVal('vitals-temp', data.temp);
    setVal('vitals-resp', data.resp);
    setVal('vitals-glucose', data.glucose);
    setVal('vitals-hb', data.hb);

    setCheck('flag-headache', data.danger_headache);
    setCheck('flag-vision', data.danger_vision);
    setCheck('flag-bleeding', data.danger_bleeding);
    setCheck('flag-chest-pain', data.danger_chest_pain);
    setCheck('flag-breathing', data.danger_breathing);
    setCheck('flag-child-indrawing', data.danger_child_indrawing);

    this.evaluate();
  },

  evaluate() {
    const getNum = (id, def = 0) => {
      const el = document.getElementById(id);
      return el ? parseFloat(el.value) || def : def;
    };

    const getBool = (id) => {
      const el = document.getElementById(id);
      return el ? el.checked : false;
    };

    const patientName = document.getElementById('triage-patient-name')?.value || 'Anonymous Patient';
    const patientAge = getNum('triage-patient-age', 25);
    const category = document.getElementById('triage-patient-category')?.value || 'Adult';

    const bpSys = getNum('vitals-bp-sys', 120);
    const bpDia = getNum('vitals-bp-dia', 80);
    const pulse = getNum('vitals-pulse', 75);
    const spo2 = getNum('vitals-spo2', 98);
    const temp = getNum('vitals-temp', 98.6);
    const resp = getNum('vitals-resp', 18);
    const glucose = getNum('vitals-glucose', 100);
    const hb = getNum('vitals-hb', 12);

    const flagHeadache = getBool('flag-headache');
    const flagVision = getBool('flag-vision');
    const flagBleeding = getBool('flag-bleeding');
    const flagChestPain = getBool('flag-chest-pain');
    const flagBreathing = getBool('flag-breathing');
    const flagChildIndrawing = getBool('flag-child-indrawing');

    let triageLevel = 'Green';
    let reasons = [];
    let protocols = [];
    let actionRecommendation = '';

    // ==========================================
    // Clinical Decision Rules (WHO / MoHFW)
    // ==========================================

    // 1. Red Flags (Immediate Emergency)
    if (flagChestPain) {
      triageLevel = 'Red';
      reasons.push('Acute crushing chest pain (suspected ACS / Myocardial Infarction)');
      protocols.push('Administer Aspirin 300mg chewable + Clopidogrel 300mg immediately (if authorized)');
      protocols.push('Keep patient in semi-Fowler position, administer high-flow O2 if SpO2 < 94%');
    }
    if (flagBleeding) {
      triageLevel = 'Red';
      reasons.push('Active antepartum/postpartum hemorrhage or acute vascular bleeding');
      protocols.push('Start two wide-bore IV lines with Normal Saline / Ringer Lactate');
      protocols.push('Notify District Hospital Blood Bank for immediate cross-matching');
    }
    if (bpSys >= 160 || bpDia >= 110) {
      triageLevel = 'Red';
      reasons.push(`Critical Hypertensive Crisis (${bpSys}/${bpDia} mmHg) - High Eclampsia / Stroke Risk`);
      protocols.push('Administer oral Labetalol 100mg or Nifedipine 10mg immediately under tele-guidance');
      protocols.push('Prepare Magnesium Sulfate loading dose if obstetric convulsions occur');
    }
    if (spo2 < 90) {
      triageLevel = 'Red';
      reasons.push(`Severe Hypoxemia (SpO2 ${spo2}%) - Acute Respiratory Failure`);
      protocols.push('Start supplemental oxygen via nasal cannula or non-rebreather mask');
      protocols.push('Maintain airway, ensure suction is ready for secretions');
    }
    if (flagChildIndrawing || (patientAge < 5 && resp >= 50)) {
      triageLevel = 'Red';
      reasons.push('Severe Pediatric Pneumonia with subcostal chest indrawing / tachypnea');
      protocols.push('Administer first dose of dispersible Amoxicillin');
      protocols.push('Initiate rapid transit to First Referral Unit (FRU / CHC)');
    }
    if (glucose < 54) {
      triageLevel = 'Red';
      reasons.push(`Severe Hypoglycemia (${glucose} mg/dL) - Impending Coma`);
      protocols.push('Administer 25% Dextrose IV or oral sugar solution if conscious');
    }

    // 2. Yellow Flags (Priority Referral within 24h)
    if (triageLevel !== 'Red') {
      if ((bpSys >= 140 && bpSys < 160) || (bpDia >= 90 && bpDia < 110)) {
        triageLevel = 'Yellow';
        reasons.push(`Stage-1/2 Hypertension (${bpSys}/${bpDia} mmHg)`);
        protocols.push('Schedule assisted teleconsultation with Medical Officer / Specialist today');
        protocols.push('Repeat BP in resting position after 15 minutes');
      }
      if (spo2 >= 90 && spo2 < 94) {
        triageLevel = 'Yellow';
        reasons.push(`Mild to Moderate Hypoxemia (SpO2 ${spo2}%)`);
        protocols.push('Incentive spirometry, bronchodilator nebulization at PHC');
      }
      if (hb < 9) {
        triageLevel = 'Yellow';
        reasons.push(`Moderate to Severe Anemia (Hb ${hb} g/dL)`);
        protocols.push('Prescribe double therapeutic IFA regimen + Iron Sucrose evaluation at CHC');
      }
      if (glucose > 200) {
        triageLevel = 'Yellow';
        reasons.push(`Uncontrolled Hyperglycemia (${glucose} mg/dL)`);
        protocols.push('Evaluate for diabetic ketoacidosis (urine ketones), adjust oral hypoglycemics');
      }
      if (flagHeadache || flagVision) {
        triageLevel = 'Yellow';
        reasons.push('Neurological danger symptom (severe headache / visual disturbance)');
        protocols.push('Check for papilledema, fundoscopy referral to District Hospital');
      }
    }

    // 3. Green Level (Routine Care)
    if (triageLevel === 'Green') {
      reasons.push('Vital signs within standard physiological limits');
      protocols.push('Dispense routine maintenance oral medications');
      protocols.push('Advise on balanced diet, hydration, and hygiene');
      protocols.push('Schedule routine follow-up in 14-28 days at Village Sub-Centre');
      actionRecommendation = 'Routine primary care protocol. Continue oral medications and scheduled follow-up at local Sub-Centre.';
    } else if (triageLevel === 'Yellow') {
      actionRecommendation = 'Priority Referral. Patient requires assisted teleconsultation with specialist or physical visit to CHC within 24 hours.';
    } else {
      actionRecommendation = 'CRITICAL EMERGENCY: Immediate 108 Ambulance Dispatch, Frontline Stabilization, and District Hospital Red-Alert.';
    }

    this.currentAssessment = {
      patientName,
      patientAge,
      category,
      triageLevel,
      reasons,
      protocols,
      actionRecommendation,
      timestamp: new Date().toISOString(),
      vitals: { bpSys, bpDia, pulse, spo2, temp, resp, glucose, hb }
    };

    this.renderResults();
  },

  renderResults() {
    const res = this.currentAssessment;
    if (!res) return;

    const resultBox = document.getElementById('triage-score-box');
    const tagEl = document.getElementById('triage-badge-tag');
    const recEl = document.getElementById('triage-rec-text');
    const reasonsList = document.getElementById('triage-reasons-list');
    const protocolsList = document.getElementById('triage-protocols-list');

    if (!resultBox) return;

    resultBox.className = `triage-score-display ${res.triageLevel.toLowerCase()}`;
    tagEl.textContent = `${res.triageLevel.toUpperCase()} PRIORITY`;
    recEl.textContent = res.actionRecommendation;

    reasonsList.innerHTML = res.reasons.map(r => `<li>${r}</li>`).join('');
    protocolsList.innerHTML = res.protocols.map(p => `<li>${p}</li>`).join('');

    const btn108 = document.getElementById('triage-sos-action-btn');
    if (btn108) {
      btn108.style.display = res.triageLevel === 'Red' ? 'inline-flex' : 'none';
    }

    const btnTele = document.getElementById('triage-tele-action-btn');
    if (btnTele) {
      btnTele.style.display = res.triageLevel !== 'Green' ? 'inline-flex' : 'none';
    }
  },

  speakTriage() {
    if (!this.currentAssessment) return;
    const level = this.currentAssessment.triageLevel.toLowerCase();
    if (window.VoiceLiteracy) {
      window.VoiceLiteracy.speakTopic(`triage_${level}`);
    }
  },

  launchAssistedTeleconsultFromTriage() {
    if (window.Teleconsult) {
      window.Teleconsult.startConsultForTriage(this.currentAssessment);
    }
    // Switch tab to teleconsult
    const teleNavBtn = document.querySelector('[data-tab="teleconsult"]');
    if (teleNavBtn) teleNavBtn.click();
  },

  dispatchEmergency108() {
    const modal = document.getElementById('emergency-sos-modal');
    if (modal) modal.classList.add('open');
    if (window.VoiceLiteracy) {
      window.VoiceLiteracy.playEmergencyTone();
      window.VoiceLiteracy.speakTopic('triage_red');
    }
    if (window.OfflineSync) {
      window.OfflineSync.queueAction('dispatch_108_emergency', this.currentAssessment);
    }
  }
};

window.DigitalTriage = DigitalTriage;
