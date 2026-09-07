/**
 * SwasthyaSetu — Closed-Loop Referral Tracking & 108 Transit Pipeline
 * Tracks patient journey from Sub-Centre ➔ PHC ➔ CHC ➔ District Hospital with live bed board,
 * ambulance coordination, and post-discharge counter-referral to frontline ASHA workers.
 */

const ReferralTracker = {
  hospitals: [
    {
      id: "HOSP-01",
      name: "Sitapur District Women's Hospital",
      tier: "District Hospital (MCH Center)",
      distance: "38 km (approx 45 mins via 108)",
      totalBeds: 120,
      availableMaternalBeds: 14,
      availableIcuBeds: 3,
      bloodStock: "A+, B+, O+ (Safe Stock)",
      specialistOnDuty: "Dr. Ananya Roy, MD (Obs/Gyn)",
      status: "Accepting Emergency Transfers"
    },
    {
      id: "HOSP-02",
      name: "CHC Bilhaur First Referral Unit (FRU)",
      tier: "Community Health Centre",
      distance: "16 km (approx 20 mins)",
      totalBeds: 30,
      availableMaternalBeds: 6,
      availableIcuBeds: 1,
      bloodStock: "Storage Center Link Active",
      specialistOnDuty: "Dr. R. K. Saxena, MD (Medicine)",
      status: "Normal Operations"
    },
    {
      id: "HOSP-03",
      name: "District Civil Hospital Sitapur",
      tier: "District Tertiary Hospital",
      distance: "42 km (approx 50 mins)",
      totalBeds: 250,
      availableMaternalBeds: 32,
      availableIcuBeds: 5,
      bloodStock: "Full Blood Bank Active",
      specialistOnDuty: "Dr. V. P. Pathak (Surgeon)",
      status: "Trauma Level 2 Active"
    },
    {
      id: "HOSP-04",
      name: "PHC Bithoor Stabilization Unit",
      tier: "Primary Health Centre",
      distance: "6 km (approx 8 mins)",
      totalBeds: 6,
      availableMaternalBeds: 3,
      availableIcuBeds: 0,
      bloodStock: "Basic Emergency Drug Depot",
      specialistOnDuty: "Dr. K. S. Verma (MBBS)",
      status: "Stabilization Only"
    }
  ],

  activeReferrals: [
    {
      id: "REF-2026-8801",
      patientName: "Sunita Devi",
      age: 28,
      gender: "Female",
      abhaId: "91-4521-8832-1094",
      priority: "Emergency (Red)",
      fromFacility: "Sub-Centre Rampur (ASHA Kiran Bala)",
      toFacility: "Sitapur District Women's Hospital",
      indication: "Severe Preeclampsia (BP 168/108, headache, vision blur)",
      transportType: "108 Emergency Ambulance (Vehicle #UP-32-EG-4421)",
      driverContact: "+91 94151 33400",
      transitStatus: "In Transit",
      stageIndex: 2, // 0: Drafted, 1: Accepted, 2: In Transit, 3: Arrived, 4: Treated, 5: Closed-Loop Discharged
      initiatedAt: "2026-09-05 19:40",
      eta: "18 mins"
    },
    {
      id: "REF-2026-8794",
      patientName: "Baby Aarav",
      age: "9 months",
      gender: "Male",
      abhaId: "91-7782-9901-4432",
      priority: "Urgent (Yellow)",
      fromFacility: "PHC Bithoor",
      toFacility: "District Pediatric Hub & NRC",
      indication: "Severe Acute Malnutrition (SAM) with Tachypnea (MUAC 112mm)",
      transportType: "102 Janani Shishu Express",
      driverContact: "+91 98390 11982",
      transitStatus: "Arrived at DH",
      stageIndex: 3,
      initiatedAt: "2026-09-05 16:15",
      eta: "Arrived (Triage Room 4)"
    },
    {
      id: "REF-2026-8740",
      patientName: "Ramesh Patel",
      age: 54,
      gender: "Male",
      abhaId: "91-2298-1144-8721",
      priority: "Routine Elective (Yellow)",
      fromFacility: "PHC Chaubepur",
      toFacility: "CHC Bilhaur FRU",
      indication: "Diabetic Neuropathy & Uncontrolled Blood Sugar (218 mg/dL)",
      transportType: "Self / Community Bus",
      driverContact: "N/A",
      transitStatus: "Closed Loop (Counter-Referral Completed)",
      stageIndex: 5,
      initiatedAt: "2026-09-03 10:00",
      eta: "Discharged with ASHA Care Plan"
    }
  ],

  pipelineStages: [
    "1. Triage Initiated",
    "2. DH Bed Accepted",
    "3. 108 Ambulance Transit",
    "4. Arrived & Evaluated",
    "5. Inpatient Care",
    "6. Counter-Referral Closed"
  ],

  selectedReferralId: "REF-2026-8801",

  init() {
    this.renderBedsMatrix();
    this.renderReferralsList();
  },

  renderBedsMatrix() {
    const container = document.getElementById('hospital-beds-matrix-container');
    if (!container) return;

    container.innerHTML = this.hospitals.map(h => `
      <div class="hospital-bed-card">
        <div class="hosp-name">${h.name}</div>
        <div class="hosp-dist">📍 ${h.distance}</div>
        <div class="bed-stat-row">
          <span>Available Beds:</span>
          <span class="bed-count ${h.availableMaternalBeds < 5 ? 'critical' : ''}">${h.availableMaternalBeds} / ${h.totalBeds}</span>
        </div>
        <div class="bed-stat-row">
          <span>ICU / HDU:</span>
          <span class="bed-count ${h.availableIcuBeds < 2 ? 'critical' : ''}">${h.availableIcuBeds} Free</span>
        </div>
        <div style="font-size:0.72rem; color:#38bdf8; margin-top:8px;">🩺 ${h.specialistOnDuty}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">🩸 ${h.bloodStock}</div>
      </div>
    `).join('');
  },

  renderReferralsList() {
    const container = document.getElementById('referrals-pipeline-container');
    if (!container) return;

    const activeRef = this.activeReferrals.find(r => r.id === this.selectedReferralId) || this.activeReferrals[0];

    // Pipeline steps HTML
    let stepsHTML = this.pipelineStages.map((stageName, idx) => {
      let stateClass = '';
      if (idx < activeRef.stageIndex) stateClass = 'completed';
      else if (idx === activeRef.stageIndex) stateClass = 'active';

      return `
        <div class="step-node ${stateClass}">
          <div class="step-circle">${idx < activeRef.stageIndex ? '✓' : (idx + 1)}</div>
          <div class="step-title">${stageName}</div>
        </div>
      `;
    }).join('');

    // Referral list items
    let listHTML = this.activeReferrals.map(r => {
      const isSel = r.id === activeRef.id;
      const isRed = r.priority.includes('Red');
      return `
        <div class="encounter-card" style="cursor:pointer; border-color:${isSel ? '#2dd4bf' : 'var(--glass-border)'};" onclick="ReferralTracker.selectReferral('${r.id}')">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="color:var(--text-primary); font-size:0.95rem;">${r.patientName} (${r.age})</strong>
            <span class="encounter-facility-tag ${isRed ? 'tag-dh' : 'tag-chc'}">${r.priority}</span>
          </div>
          <div style="font-size:0.78rem; color:#38bdf8; margin-bottom:4px;">${r.id} • ABHA: ${r.abhaId}</div>
          <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:6px;"><strong>Indication:</strong> ${r.indication}</div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
            <span>From: ${r.fromFacility}</span>
            <span style="color:#2dd4bf; font-weight:600;">➔ ${r.toFacility}</span>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="pipeline-steps-bar">
        ${stepsHTML}
      </div>

      <div style="display:grid; grid-template-columns: 1.4fr 1.6fr; gap:24px;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h4 style="font-size:1rem; font-weight:700; color:var(--text-primary);">Active District Referrals</h4>
            <button class="btn btn-primary btn-sm" onclick="ReferralTracker.openNewReferralModal()">➕ Create e-Referral</button>
          </div>
          ${listHTML}
        </div>

        <div>
          <!-- Detailed Inspector of Active Referral -->
          <div class="triage-form-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="font-size:1.05rem; font-weight:700; color:#2dd4bf;">Referral Dossier: ${activeRef.id}</h4>
              <span class="encounter-facility-tag tag-dh">${activeRef.transitStatus}</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin-bottom:16px;">
              <div class="vital-field">
                <label>Originating Facility</label>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${activeRef.fromFacility}</div>
              </div>
              <div class="vital-field">
                <label>Receiving Facility</label>
                <div style="font-size:0.85rem; font-weight:600; color:#2dd4bf;">${activeRef.toFacility}</div>
              </div>
              <div class="vital-field">
                <label>Transport Logistics</label>
                <div style="font-size:0.82rem; color:var(--text-secondary);">${activeRef.transportType}</div>
              </div>
              <div class="vital-field">
                <label>Driver / 108 Dispatch</label>
                <div style="font-size:0.82rem; color:#38bdf8;">${activeRef.driverContact} (ETA: ${activeRef.eta})</div>
              </div>
            </div>

            <div class="clinical-guidance-box">
              <div class="guidance-title">📋 Clinical Summary & Handoff Directive</div>
              <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
                ${activeRef.indication}. Patient stabilized with initial frontline protocol. Vital signs monitored continuously. Receiving OB/GYN team at District Hospital alerted for immediate arrival.
              </div>
            </div>

            <!-- Action Controls to Advance Pipeline Stage -->
            <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
              ${activeRef.stageIndex < 5 ? `
                <button class="btn btn-primary btn-sm" onclick="ReferralTracker.advanceStage('${activeRef.id}')">
                  <span>Advance Status ➔ (${ReferralTracker.pipelineStages[activeRef.stageIndex + 1]})</span>
                </button>
              ` : `
                <div style="color:#34d399; font-weight:700; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
                  <span>✓ Closed-Loop Complete: Counter-referral received by Village ASHA</span>
                </div>
              `}
              <button class="btn btn-secondary btn-sm" onclick="ReferralTracker.printReferralSlip('${activeRef.id}')">
                <span>🖨️ Print e-Referral Slip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectReferral(refId) {
    this.selectedReferralId = refId;
    this.renderReferralsList();
  },

  advanceStage(refId) {
    const ref = this.activeReferrals.find(r => r.id === refId);
    if (!ref || ref.stageIndex >= 5) return;

    ref.stageIndex++;
    if (ref.stageIndex === 3) {
      ref.transitStatus = "Arrived at DH Triage";
      ref.eta = "Patient at Hospital";
    } else if (ref.stageIndex === 4) {
      ref.transitStatus = "Inpatient / Specialist Intervention";
      ref.eta = "Admitted to Ward 3";
    } else if (ref.stageIndex === 5) {
      ref.transitStatus = "Closed-Loop Discharged";
      ref.eta = "Counter-Referral Sent to ASHA";
    }

    if (window.OfflineSync) {
      window.OfflineSync.queueAction('referral_stage_advanced', {
        referralId: ref.id,
        stage: ReferralTracker.pipelineStages[ref.stageIndex]
      });
      window.OfflineSync.showToast(`Referral ${ref.id} advanced to: ${ReferralTracker.pipelineStages[ref.stageIndex]}`, 'success');
    }

    this.renderReferralsList();
  },

  printReferralSlip(refId) {
    const ref = this.activeReferrals.find(r => r.id === refId);
    if (!ref) return;
    window.print();
  },

  openNewReferralModal() {
    const modal = document.getElementById('new-referral-modal');
    if (modal) modal.classList.add('open');
  },

  closeNewReferralModal() {
    const modal = document.getElementById('new-referral-modal');
    if (modal) modal.classList.remove('open');
  },

  submitNewReferral(e) {
    if (e) e.preventDefault();
    const patientName = document.getElementById('new-ref-name').value;
    const toFacility = document.getElementById('new-ref-facility').value;
    const priority = document.getElementById('new-ref-priority').value;
    const indication = document.getElementById('new-ref-indication').value;

    const newRef = {
      id: "REF-2026-" + Math.floor(1000 + Math.random() * 9000),
      patientName,
      age: 28,
      gender: "Female",
      abhaId: "91-4521-8832-1094",
      priority,
      fromFacility: "Sub-Centre Rampur (ASHA Assisted)",
      toFacility,
      indication,
      transportType: "108 Emergency Ambulance (Dispatched)",
      driverContact: "+91 94150 99281",
      transitStatus: "DH Bed Accepted",
      stageIndex: 1,
      initiatedAt: new Date().toLocaleTimeString(),
      eta: "25 mins"
    };

    this.activeReferrals.unshift(newRef);
    this.selectedReferralId = newRef.id;
    this.closeNewReferralModal();
    this.renderReferralsList();

    if (window.OfflineSync) {
      window.OfflineSync.queueAction('create_referral', newRef);
      window.OfflineSync.showToast('✅ e-Referral created & 108 ambulance dispatch requested', 'success');
    }
  }
};

window.ReferralTracker = ReferralTracker;
