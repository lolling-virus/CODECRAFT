/**
 * SwasthyaSetu — Longitudinal Patient Health Records (ABHA / ABDM Interoperable EHR)
 * Tracks continuous medical history across Sub-Centres, PHCs, CHCs, and District Hospitals.
 */

const HealthRecords = {
  patients: [
    {
      id: "P101",
      abhaId: "91-4521-8832-1094",
      name: "Sunita Devi",
      age: 28,
      gender: "Female",
      village: "Rampur, Block Bithoor",
      contact: "+91 98391 22810",
      category: "High-Risk Pregnancy (HRP)",
      riskLevel: "Red",
      vitals: {
        bp: "154/98",
        pulse: 94,
        spo2: 97,
        temp: 98.4,
        resp: 22,
        glucose: 114,
        hemoglobin: 8.2,
        fhr: 144
      },
      allergies: ["Penicillin", "Sulfa drugs"],
      activeConditions: ["Gestational Hypertension", "Moderate Microcytic Anemia", "G3P2 at 32w Gestation"],
      currentMeds: [
        { name: "Labetalol 100mg", dosage: "1 tab BD", duration: "Ongoing" },
        { name: "Iron & Folic Acid (IFA)", dosage: "1 tab OD", duration: "180 days" },
        { name: "Calcium Carbonate 500mg", dosage: "1 tab BD", duration: "Ongoing" }
      ],
      encounters: [
        {
          id: "ENC-901",
          date: "2026-09-02",
          facilityType: "District Hospital",
          facilityName: "Sitapur District Women's Hospital",
          provider: "Dr. Ananya Roy, MD (Obstetrics)",
          reason: "Urgent Specialist Evaluation for Elevated BP & Pedal Edema",
          findings: "Uterine height corresponds to 32 weeks. Fetal heart sound regular (144 bpm). Urine albumin +2. Initiated oral Labetalol.",
          actionTaken: "Prescribed Labetalol 100mg BD. Counseled ASHA worker for twice-weekly home BP monitoring. Scheduled repeat USG Doppler.",
          tags: ["HRP", "Preeclampsia", "Tele-follow-up"]
        },
        {
          id: "ENC-842",
          date: "2026-08-15",
          facilityType: "Primary Health Centre",
          facilityName: "PHC Bithoor",
          provider: "Dr. K. S. Verma (Medical Officer)",
          reason: "Routine ANC-3 Checkup",
          findings: "BP 142/90 mmHg. Weight 54 kg (+3.5 kg in 4 weeks). Mild bilateral pedal edema. Hb test reported 8.2 g/dL.",
          actionTaken: "Upgraded case to Yellow Priority. Initiated assisted teleconsultation with District Hospital Gynecologist. Doubled IFA dosage.",
          tags: ["ANC-3", "Anemia", "e-Referral Initiated"]
        },
        {
          id: "ENC-780",
          date: "2026-07-10",
          facilityType: "Sub-Centre",
          facilityName: "Arogya Mandir Sub-Centre Rampur",
          provider: "Kiran Bala (ASHA) / Anita Singh (ANM)",
          reason: "Village Village Health & Nutrition Day (VHND) Registration",
          findings: "Gravida 3, Para 2. Last menstrual period confirmed. Td-1 toxoid administered.",
          actionTaken: "Issued Mother-Child Protection (MCP) card. Linked ABHA identity. Distributed 30 IFA tablets.",
          tags: ["VHND", "Immunization", "ASHA Home Visit"]
        }
      ]
    },
    {
      id: "P102",
      abhaId: "91-2298-1144-8721",
      name: "Ramesh Patel",
      age: 54,
      gender: "Male",
      village: "Kalyanpur, Block Chaubepur",
      contact: "+91 94150 77612",
      category: "Non-Communicable Disease (NCD)",
      riskLevel: "Yellow",
      vitals: {
        bp: "162/100",
        pulse: 82,
        spo2: 96,
        temp: 98.6,
        resp: 18,
        glucose: 218,
        hemoglobin: 13.4,
        fhr: null
      },
      allergies: ["None known"],
      activeConditions: ["Type-2 Diabetes Mellitus (Uncontrolled)", "Stage-2 Hypertension", "Early Diabetic Neuropathy"],
      currentMeds: [
        { name: "Metformin 500mg", dosage: "1 tab BD after meals", duration: "Chronic" },
        { name: "Telmisartan 40mg", dosage: "1 tab OD morning", duration: "Chronic" },
        { name: "Atorvastatin 10mg", dosage: "1 tab HS", duration: "Chronic" }
      ],
      encounters: [
        {
          id: "ENC-611",
          date: "2026-08-28",
          facilityType: "Community Health Centre",
          facilityName: "CHC Bilhaur First Referral Unit",
          provider: "Dr. R. K. Saxena, MD (Internal Medicine)",
          reason: "Quarterly NCD Screening & Neuropathy Evaluation",
          findings: "Fasting blood sugar 218 mg/dL, HbA1c 9.2%. Mild loss of vibratory sensation in bilateral lower extremities.",
          actionTaken: "Adjusted Metformin to 1000mg BD. Added Glimepiride 1mg OD. Prescribed diabetic footwear and annual retinal screening.",
          tags: ["NCD", "Diabetes", "Teleconsult Review"]
        },
        {
          id: "ENC-540",
          date: "2026-06-12",
          facilityType: "Primary Health Centre",
          facilityName: "PHC Chaubepur",
          provider: "Dr. Shalini Tripathi (Medical Officer)",
          reason: "Prescription Refill & Blood Pressure Check",
          findings: "BP 160/98 mmHg. Patient reported non-adherence for 10 days due to local dispensary stock-out.",
          actionTaken: "Issued 30-day stock from PHC reserve. Enrolled in mobile SMS medication reminder queue.",
          tags: ["NCD Refill", "Adherence Alert"]
        }
      ]
    },
    {
      id: "P103",
      abhaId: "91-7782-9901-4432",
      name: "Baby Aarav (s/o Meera)",
      age: "9 months",
      gender: "Male",
      village: "Shivrajpur, Block Bithoor",
      contact: "+91 97922 44319",
      category: "Severe Child Malnutrition (SAM)",
      riskLevel: "Red",
      vitals: {
        bp: "88/54",
        pulse: 138,
        spo2: 94,
        temp: 100.2,
        resp: 48,
        glucose: 78,
        hemoglobin: 7.4,
        fhr: null
      },
      allergies: ["None known"],
      activeConditions: ["Severe Acute Malnutrition (SAM)", "Pediatric Tachypnea", "Moderate Dehydration"],
      currentMeds: [
        { name: "Amoxicillin Dispersible 125mg", dosage: "1 tab BD", duration: "7 days" },
        { name: "Oral Rehydration Salt (ORS)", dosage: "Ad libitum", duration: "5 days" },
        { name: "Zinc Sulfate 20mg", dosage: "1 tab OD", duration: "14 days" }
      ],
      encounters: [
        {
          id: "ENC-402",
          date: "2026-09-04",
          facilityType: "Sub-Centre",
          facilityName: "Arogya Mandir Sub-Centre Shivrajpur",
          provider: "Suman Lata (CHO)",
          reason: "Emergency Assessment for Lethargy & Fast Breathing",
          findings: "Weight 5.2 kg (MUAC: 112mm - Red Zone). Mild subcostal chest indrawing, fever 100.2°F, respiratory rate 48/min.",
          actionTaken: "Assessed Red-Flag Triage. Contacted 108 ambulance for immediate transfer to Nutrition Rehabilitation Centre (NRC) at District Hospital.",
          tags: ["SAM", "NRC Referral", "108 Ambulance Dispatch"]
        }
      ]
    },
    {
      id: "P104",
      abhaId: "91-6654-3321-9988",
      name: "Priya Sharma",
      age: 32,
      gender: "Female",
      village: "Mandhana, Block Bithoor",
      contact: "+91 91250 88764",
      category: "Post-Partum & Child Health",
      riskLevel: "Green",
      vitals: {
        bp: "118/76",
        pulse: 76,
        spo2: 99,
        temp: 98.4,
        resp: 16,
        glucose: 94,
        hemoglobin: 11.2,
        fhr: null
      },
      allergies: ["None"],
      activeConditions: ["Post-Partum Day 14 (PNC-2)", "Lactation Support"],
      currentMeds: [
        { name: "Iron Folic Acid (PNC)", dosage: "1 tab OD", duration: "180 days" },
        { name: "Calcium + Vitamin D3", dosage: "1 tab OD", duration: "180 days" }
      ],
      encounters: [
        {
          id: "ENC-310",
          date: "2026-08-30",
          facilityType: "Sub-Centre",
          facilityName: "Arogya Mandir Mandhana",
          provider: "Lata Devi (ASHA)",
          reason: "PNC Home Visit 14-Days",
          findings: "Vitals normal. Baby feeding well, passes stool normally. No fever, foul lochia, or perineal pain.",
          actionTaken: "Counseled on exclusive breastfeeding for 6 months and post-partum nutrition. Scheduled 6-week immunization.",
          tags: ["PNC-2", "ASHA Visit", "Wellness"]
        }
      ]
    }
  ],

  activePatientId: "P101",

  init() {
    console.log('[HealthRecords] Loaded EHR system with', this.patients.length, 'patients.');
  },

  async loadFromSupabase() {
    const { data, error } = await supabaseClient
        .from('patients')
        .select('*');

    if (error) {
        console.error('[HealthRecords] Supabase load failed:', error);
        return;
    }

    console.log('[HealthRecords] Patients from Supabase:', data);
},

  getAllPatients() {
    return this.patients;
  },

  getActivePatient() {
    return this.patients.find(p => p.id === this.activePatientId) || this.patients[0];
  },

  selectPatient(patientId) {
    this.activePatientId = patientId;
    this.renderRecordView();
  },

  addEncounter(patientId, encounter) {
    const p = this.patients.find(pt => pt.id === patientId);
    if (!p) return;
    encounter.id = 'ENC-' + Math.floor(1000 + Math.random() * 9000);
    encounter.date = new Date().toISOString().split('T')[0];
    p.encounters.unshift(encounter);

    // Also queue for offline sync if in offline mode
    if (window.OfflineSync) {
      window.OfflineSync.queueAction('add_encounter', { patientId, encounter });
    }

    this.renderRecordView();
    return encounter;
  },

  // FHIR R4 Bundle JSON Export for ABDM Compliance
  exportFHIR(patientId) {
    const p = this.patients.find(pt => pt.id === patientId) || this.getActivePatient();
    const fhirBundle = {
      resourceType: "Bundle",
      id: "bundle-" + p.id + "-" + Date.now(),
      type: "document",
      timestamp: new Date().toISOString(),
      identifier: {
        system: "https://healthid.ndhm.gov.in/abha",
        value: p.abhaId
      },
      entry: [
        {
          fullUrl: `urn:uuid:patient-${p.id}`,
          resource: {
            resourceType: "Patient",
            id: p.id,
            identifier: [{ system: "ABDM-ABHA", value: p.abhaId }],
            name: [{ text: p.name }],
            gender: p.gender.toLowerCase(),
            telecom: [{ system: "phone", value: p.contact }],
            address: [{ text: p.village }]
          }
        },
        ...p.encounters.map(enc => ({
          fullUrl: `urn:uuid:${enc.id}`,
          resource: {
            resourceType: "Encounter",
            id: enc.id,
            status: "finished",
            class: { code: enc.facilityType },
            serviceProvider: { display: enc.facilityName },
            participant: [{ individual: { display: enc.provider } }],
            reasonCode: [{ text: enc.reason }],
            period: { start: enc.date }
          }
        }))
      ]
    };
    return JSON.stringify(fhirBundle, null, 2);
  },

  renderRecordView() {
    const p = this.getActivePatient();
    const container = document.getElementById('record-profile-content');
    if (!container) return;

    const riskBadgeClass = p.riskLevel === 'Red' ? 'tag-dh' : p.riskLevel === 'Yellow' ? 'tag-chc' : 'tag-sc';

    let encountersHTML = '';
    p.encounters.forEach(enc => {
      const tagClass = enc.facilityType.includes('District') ? 'tag-dh' :
                       enc.facilityType.includes('Community') ? 'tag-chc' :
                       enc.facilityType.includes('Primary') ? 'tag-phc' : 'tag-sc';

      const tagsPills = enc.tags.map(t => `<span class="encounter-facility-tag ${tagClass}">${t}</span>`).join(' ');

      encountersHTML += `
        <div class="encounter-card">
          <div class="encounter-dot"></div>
          <div class="encounter-header">
            <div>
              <span class="encounter-facility-tag ${tagClass}">${enc.facilityType}</span>
              <strong style="margin-left: 8px; color: var(--text-primary);">${enc.facilityName}</strong>
            </div>
            <span class="encounter-date">${enc.date}</span>
          </div>
          <div style="font-size: 0.8rem; color: #2dd4bf; margin-bottom: 6px;">Provider: ${enc.provider}</div>
          <div class="encounter-summary"><strong>Clinical Reason:</strong> ${enc.reason}</div>
          <div class="encounter-summary" style="font-size:0.83rem;"><strong>Findings:</strong> ${enc.findings}</div>
          <div class="encounter-summary" style="font-size:0.83rem; color: #94a3b8;"><strong>Plan:</strong> ${enc.actionTaken}</div>
          <div class="encounter-tags-row">${tagsPills}</div>
        </div>
      `;
    });

    let medsHTML = p.currentMeds.map(m => `
      <div class="rx-drug-item" style="margin-bottom:6px;">
        <div>
          <div class="rx-drug-name">${m.name}</div>
          <div class="rx-instructions">${m.duration}</div>
        </div>
        <div class="rx-dosage">${m.dosage}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="record-profile-header">
        <div class="patient-info-core">
          <div class="patient-avatar-box">${p.name.charAt(0)}</div>
          <div class="patient-name-wrap">
            <h3>${p.name} <span class="encounter-facility-tag ${riskBadgeClass}">${p.riskLevel} Priority</span></h3>
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:4px;">
              <span class="abha-id-tag">🪪 ABHA: ${p.abhaId}</span>
              <span style="font-size:0.8rem; color:var(--text-secondary);">${p.age} yrs • ${p.gender} • 📍 ${p.village}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="HealthRecords.downloadFHIR()">
            <span>📋 Export FHIR JSON</span>
          </button>
          <button class="btn btn-primary btn-sm" onclick="HealthRecords.openNewEncounterModal()">
            <span>➕ Add Clinical Encounter</span>
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1.8fr 1fr; gap:24px;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h4 style="font-family:var(--font-display); font-size:1.1rem; color:var(--text-primary);">
              Continuum of Care Timeline (Sub-Centre ➔ PHC ➔ CHC ➔ DH)
            </h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">${p.encounters.length} logged visits</span>
          </div>
          <div class="timeline-encounters-wrap">
            ${encountersHTML}
          </div>
        </div>

        <div>
          <!-- Patient Clinical Snapshot Card -->
          <div class="triage-form-card" style="margin-bottom:20px;">
            <h4 style="font-size:0.95rem; font-weight:700; color:#2dd4bf; margin-bottom:12px;">Current Baseline Vitals</h4>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
              <div class="vital-field"><label>BP</label><div class="stat-value" style="font-size:1.1rem;">${p.vitals.bp} <span class="vital-unit">mmHg</span></div></div>
              <div class="vital-field"><label>Pulse</label><div class="stat-value" style="font-size:1.1rem;">${p.vitals.pulse} <span class="vital-unit">bpm</span></div></div>
              <div class="vital-field"><label>SpO2</label><div class="stat-value teal" style="font-size:1.1rem;">${p.vitals.spo2}%</div></div>
              <div class="vital-field"><label>Hemoglobin</label><div class="stat-value ${p.vitals.hemoglobin < 9 ? 'rose' : 'teal'}" style="font-size:1.1rem;">${p.vitals.hemoglobin} <span class="vital-unit">g/dL</span></div></div>
            </div>
            ${p.vitals.fhr ? `<div style="margin-top:10px; font-size:0.8rem; color:#38bdf8;"><strong>Fetal Heart Rate:</strong> ${p.vitals.fhr} bpm</div>` : ''}
          </div>

          <!-- Active Diagnoses & Allergies -->
          <div class="triage-form-card" style="margin-bottom:20px;">
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:10px;">Active Diagnoses</h4>
            <ul style="padding-left:18px; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; margin-bottom:14px;">
              ${p.activeConditions.map(c => `<li>${c}</li>`).join('')}
            </ul>

            <h4 style="font-size:0.95rem; font-weight:700; color:#f87171; margin-bottom:6px;">⚠️ Allergies</h4>
            <div style="font-size:0.82rem; color:#fca5a5;">${p.allergies.join(', ')}</div>
          </div>

          <!-- Current Active Medications -->
          <div class="triage-form-card">
            <h4 style="font-size:0.95rem; font-weight:700; color:#38bdf8; margin-bottom:12px;">Active Regimen</h4>
            ${medsHTML}
          </div>
        </div>
      </div>
    `;
  },

  downloadFHIR() {
    const data = this.exportFHIR(this.activePatientId);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABHA_${this.getActivePatient().name.replace(/\s+/g, '_')}_FHIR_Bundle.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.OfflineSync) {
      window.OfflineSync.showToast('Exported interoperable ABDM FHIR R4 Bundle JSON', 'success');
    }
  },

  openNewEncounterModal() {
    const modal = document.getElementById('new-encounter-modal');
    if (modal) modal.classList.add('open');
  },

  closeNewEncounterModal() {
    const modal = document.getElementById('new-encounter-modal');
    if (modal) modal.classList.remove('open');
  },

  submitNewEncounter(e) {
    if (e) e.preventDefault();
    const facilityType = document.getElementById('enc-facility-type').value;
    const facilityName = document.getElementById('enc-facility-name').value;
    const provider = document.getElementById('enc-provider').value;
    const reason = document.getElementById('enc-reason').value;
    const findings = document.getElementById('enc-findings').value;
    const actionTaken = document.getElementById('enc-action').value;

    this.addEncounter(this.activePatientId, {
      facilityType,
      facilityName,
      provider,
      reason,
      findings,
      actionTaken,
      tags: [facilityType.split(' ')[0], "Routine Check"]
    });

    this.closeNewEncounterModal();
    if (window.OfflineSync) {
      window.OfflineSync.showToast('Encounter successfully added to patient timeline', 'success');
    }
  }
};

window.HealthRecords = HealthRecords;
