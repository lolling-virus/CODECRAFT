/**
 * SwasthyaSetu — High-Risk Patient Registries & ASHA Frontline Worklist
 * Cohort management for High-Risk Pregnancies (HRP), Non-Communicable Diseases (NCD),
 * and Pediatric Malnutrition (SAM/MAM) with micro-visit scheduling.
 */

const PatientRegistries = {
  activeFilter: 'hrp', // 'hrp', 'ncd', 'child'

  records: [
    {
      id: "REG-HRP-01",
      name: "Sunita Devi",
      age: 28,
      village: "Rampur",
      type: "hrp",
      riskLevel: "Red",
      gestationWeeks: 32,
      edd: "2026-10-30",
      riskFactors: ["Gestational Hypertension (BP 154/98)", "Moderate Anemia (Hb 8.2)", "G3P2"],
      assignedAsha: "Kiran Bala (+91 98391 22810)",
      dueDate: "Today (Overdue for BP check)",
      institutionalPlan: "Sitapur District Women's Hospital",
      status: "Visit Pending"
    },
    {
      id: "REG-HRP-02",
      name: "Geeta Yadav",
      age: 24,
      village: "Bithoor Rural",
      type: "hrp",
      riskLevel: "Yellow",
      gestationWeeks: 24,
      edd: "2026-12-25",
      riskFactors: ["Severe Anemia (Hb 7.8 g/dL)", "Underweight (BMI 17.2)"],
      assignedAsha: "Anita Singh",
      dueDate: "Tomorrow",
      institutionalPlan: "CHC Bilhaur FRU",
      status: "Visit Scheduled"
    },
    {
      id: "REG-NCD-01",
      name: "Ramesh Patel",
      age: 54,
      village: "Kalyanpur",
      type: "ncd",
      riskLevel: "Yellow",
      condition: "Type-2 Diabetes & Stage-2 HTN",
      lastCheck: "BP 162/100, Fasting Glucose 218 mg/dL",
      compliance: "Irregular (Missed 10 doses)",
      assignedAsha: "Sarita Shukla",
      dueDate: "In 2 days (Refill reminder)",
      status: "Visit Pending"
    },
    {
      id: "REG-NCD-02",
      name: "Ram Prasad",
      age: 62,
      village: "Rampur",
      type: "ncd",
      riskLevel: "Yellow",
      condition: "Hypertension & Previous TIA",
      lastCheck: "BP 148/92, Pulse 76",
      compliance: "Good (Adherence 95%)",
      assignedAsha: "Kiran Bala",
      dueDate: "In 5 days",
      status: "Controlled"
    },
    {
      id: "REG-SAM-01",
      name: "Baby Aarav (s/o Meera)",
      age: "9 months",
      village: "Shivrajpur",
      type: "child",
      riskLevel: "Red",
      condition: "Severe Acute Malnutrition (SAM) + Pneumonia",
      muac: "112 mm (Red Zone)",
      weight: "5.2 kg (-3 SD)",
      assignedAsha: "Meena Kumari",
      dueDate: "Immediate (NRC Transfer Follow-up)",
      status: "Critical Monitoring"
    }
  ],

  init() {
    this.renderRegistryCards();
  },

  setFilter(filterType) {
    this.activeFilter = filterType;
    document.querySelectorAll('.registry-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filterType);
    });
    this.renderRegistryCards();
  },

  renderRegistryCards() {
    const container = document.getElementById('registry-cards-container');
    if (!container) return;

    const filtered = this.records.filter(r => r.type === this.activeFilter);

    container.innerHTML = filtered.map(item => {
      const riskClass = item.riskLevel === 'Red' ? 'hrp-red' : 'hrp-yellow';

      if (item.type === 'hrp') {
        return `
          <div class="hrp-patient-card">
            <span class="hrp-risk-tag ${riskClass}">${item.riskLevel} Risk</span>
            <strong style="font-size:1.05rem; color:var(--text-primary);">${item.name} (${item.age}y)</strong>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">📍 Village: ${item.village} • G${item.gestationWeeks}w</div>

            <div class="due-date-callout">
              📅 <strong>Next ASHA Visit:</strong> ${item.dueDate}
            </div>

            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;">
              <strong>Risk Criteria:</strong>
              <ul style="padding-left:16px; margin-top:4px; line-height:1.4;">
                ${item.riskFactors.map(rf => `<li>${rf}</li>`).join('')}
              </ul>
            </div>

            <div style="font-size:0.75rem; color:#38bdf8; margin-bottom:12px;">
              🏥 Delivery Plan: <strong>${item.institutionalPlan}</strong>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.72rem; color:var(--text-muted);">ASHA: ${item.assignedAsha}</span>
              <button class="btn btn-primary btn-sm" onclick="PatientRegistries.completeVisit('${item.id}')">
                <span>✓ Complete Visit</span>
              </button>
            </div>
          </div>
        `;
      } else if (item.type === 'ncd') {
        return `
          <div class="hrp-patient-card">
            <span class="hrp-risk-tag ${riskClass}">${item.riskLevel} Priority</span>
            <strong style="font-size:1.05rem; color:var(--text-primary);">${item.name} (${item.age}y)</strong>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">📍 Village: ${item.village} • ${item.condition}</div>

            <div class="due-date-callout" style="border-left-color:#38bdf8; background:rgba(56,189,248,0.1); color:#38bdf8;">
              📅 <strong>Next Routine Screening:</strong> ${item.dueDate}
            </div>

            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;">
              <strong>Recent Biomarkers:</strong> ${item.lastCheck}
            </div>
            <div style="font-size:0.78rem; color:#f87171; margin-bottom:12px;">
              <strong>Adherence:</strong> ${item.compliance}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.72rem; color:var(--text-muted);">ASHA: ${item.assignedAsha}</span>
              <button class="btn btn-secondary btn-sm" onclick="PatientRegistries.sendSmsReminder('${item.id}')">
                <span>📲 SMS Recall</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Child SAM
        return `
          <div class="hrp-patient-card">
            <span class="hrp-risk-tag hrp-red">Red Flag SAM</span>
            <strong style="font-size:1.05rem; color:var(--text-primary);">${item.name} (${item.age})</strong>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">📍 Village: ${item.village}</div>

            <div class="due-date-callout" style="border-left-color:#ef4444; background:rgba(239,68,68,0.12); color:#fca5a5;">
              🚨 <strong>Action:</strong> ${item.dueDate}
            </div>

            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:6px;">
              <strong>MUAC:</strong> <span style="color:#ef4444; font-weight:700;">${item.muac}</span> • Weight: ${item.weight}
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:12px;">
              ${item.condition}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.72rem; color:var(--text-muted);">ASHA: ${item.assignedAsha}</span>
              <button class="btn btn-primary btn-sm" onclick="PatientRegistries.completeVisit('${item.id}')">
                <span>NRC Nutrition Visit</span>
              </button>
            </div>
          </div>
        `;
      }
    }).join('');
  },

  completeVisit(recordId) {
    const rec = this.records.find(r => r.id === recordId);
    if (!rec) return;

    rec.status = "Completed";
    rec.dueDate = "Next visit in 14 days";
    this.renderRegistryCards();

    if (window.OfflineSync) {
      window.OfflineSync.queueAction('asha_home_visit_completed', {
        recordId: rec.id,
        patient: rec.name,
        timestamp: new Date().toISOString()
      });
      window.OfflineSync.showToast(`✅ Home visit logged for ${rec.name}. Micro-plan updated.`, 'success');
    }
  },

  sendSmsReminder(recordId) {
    const rec = this.records.find(r => r.id === recordId);
    if (!rec) return;

    if (window.OfflineSync) {
      window.OfflineSync.showToast(`📲 Automated Voice/SMS Medication Recall sent to ${rec.name}`, 'info');
    }
  }
};

window.PatientRegistries = PatientRegistries;
