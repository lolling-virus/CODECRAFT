/**
 * SwasthyaSetu — Hub-and-Spoke Diagnostic Lab Network
 * Solves irregular diagnostics in rural facilities via barcode sample tracking,
 * cold-chain courier logistics, and critical-value alert notifications.
 */

const DiagnosticLab = {
  catalog: [
    { code: "LAB-CBC", name: "Complete Blood Count (CBC) & Hb", category: "Hematology", turnaround: "4 hours", facilityLevel: "PHC / Central Lab" },
    { code: "LAB-GLUC", name: "Blood Glucose (Fasting / PP)", category: "Biochemistry", turnaround: "30 mins", facilityLevel: "Sub-Centre Rapid Kit" },
    { code: "LAB-A1C", name: "Glycated Hemoglobin (HbA1c)", category: "Biochemistry", turnaround: "24 hours", facilityLevel: "CHC / District Central Lab" },
    { code: "LAB-MAL", name: "Malaria Rapid Diagnostic (Pf/Pv)", category: "Microbiology", turnaround: "15 mins", facilityLevel: "Sub-Centre Point-of-Care" },
    { code: "LAB-DEN", name: "Dengue NS1 Antigen & IgM", category: "Serology", turnaround: "30 mins", facilityLevel: "PHC Rapid Kit" },
    { code: "LAB-URINE", name: "Urine Routine & Albumin Test", category: "Clinical Pathology", turnaround: "15 mins", facilityLevel: "Sub-Centre Dipstick" },
    { code: "LAB-TB", name: "Sputum Smear / Truenat TB PCR", category: "Molecular Diagnostics", turnaround: "2 hours", facilityLevel: "CHC Truenat Point" },
    { code: "LAB-USG", name: "Obstetric Ultrasound Doppler", category: "Radiology", turnaround: "Immediate", facilityLevel: "CHC / District Hospital" }
  ],

  activeOrders: [
    {
      sampleId: "SAMP-88210-BL",
      barcode: "||| |||| || ||||| | |||||",
      patientName: "Sunita Devi",
      testName: "CBC with Complete Hemoglobin Profile",
      collectionSite: "Sub-Centre Rampur",
      collectedAt: "2026-09-05 08:30",
      status: "Ready",
      courierRoute: "Sub-Centre ➔ PHC Bithoor ➔ District Lab",
      resultValue: "Hb: 8.2 g/dL (Low), Platelets: 210,000 /mcL, TLC: 7,800 /mcL",
      isCritical: true,
      criticalNote: "⚠️ Moderate Microcytic Anemia in High-Risk Pregnancy (32w)"
    },
    {
      sampleId: "SAMP-88219-GL",
      barcode: "|| ||||| ||| || | |||| ||",
      patientName: "Ramesh Patel",
      testName: "HbA1c Glycated Hemoglobin",
      collectionSite: "PHC Chaubepur",
      collectedAt: "2026-09-04 11:00",
      status: "Ready",
      courierRoute: "PHC Chaubepur ➔ District Central Lab",
      resultValue: "HbA1c: 9.2% (Target < 7.0%), Fasting Glucose: 218 mg/dL",
      isCritical: true,
      criticalNote: "⚠️ Severe Uncontrolled Hyperglycemia - Action Required"
    },
    {
      sampleId: "SAMP-88245-UR",
      barcode: "|||| || |||| ||| || |||||",
      patientName: "Sunita Devi",
      testName: "Urine Albumin & Microscopy",
      collectionSite: "Sub-Centre Rampur",
      collectedAt: "2026-09-05 09:00",
      status: "Ready",
      courierRoute: "Point-of-Care Dipstick (Arogya Mandir)",
      resultValue: "Albumin: +2 Positive, Sugar: Nil, Pus cells: 1-2 /HPF",
      isCritical: true,
      criticalNote: "⚠️ Proteinuria Detected - Preeclampsia Protocol Triggered"
    },
    {
      sampleId: "SAMP-88301-TB",
      barcode: "|| ||| ||||| || ||| |||||",
      patientName: "Mohammed Ali",
      testName: "Truenat Molecular TB Test & Rifampicin Resistance",
      collectionSite: "CHC Bilhaur FRU",
      collectedAt: "2026-09-05 14:15",
      status: "In Transit",
      courierRoute: "CHC Bilhaur ➔ District TB Centre",
      resultValue: "Processing PCR amplifications...",
      isCritical: false,
      criticalNote: null
    }
  ],

  init() {
    this.renderDiagnostics();
  },

  renderDiagnostics() {
    const ordersContainer = document.getElementById('lab-orders-container');
    const catalogContainer = document.getElementById('lab-catalog-container');

    if (ordersContainer) {
      ordersContainer.innerHTML = this.activeOrders.map(order => {
        let statusBadge = order.status === 'Ready' ?
          `<span class="lab-result-status lab-status-ready">✓ Report Ready</span>` :
          `<span class="lab-result-status lab-status-transit">🚚 ${order.status}</span>`;

        if (order.isCritical) {
          statusBadge = `<span class="lab-result-status lab-status-critical">🚨 CRITICAL ALERT</span>`;
        }

        return `
          <div class="barcode-sample-card">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span class="barcode-display">${order.sampleId}</span>
                ${statusBadge}
              </div>
              <strong style="font-size:0.92rem; color:var(--text-primary);">${order.testName}</strong>
              <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">
                Patient: <strong>${order.patientName}</strong> • Collected: ${order.collectedAt} at ${order.collectionSite}
              </div>
              <div style="font-size:0.75rem; color:#38bdf8; margin-top:4px;">
                📍 Route: ${order.courierRoute}
              </div>
              ${order.status === 'Ready' ? `
                <div style="margin-top:8px; padding:8px 12px; background:rgba(15,23,42,0.8); border-radius:6px; font-size:0.83rem;">
                  <strong>Result:</strong> <span style="color:#2dd4bf; font-family:var(--font-mono);">${order.resultValue}</span>
                  ${order.criticalNote ? `<div style="color:#f87171; font-weight:700; margin-top:4px;">${order.criticalNote}</div>` : ''}
                </div>
              ` : ''}
            </div>
            <div style="text-align:right;">
              <div style="font-family:monospace; letter-spacing:3px; font-size:1.1rem; color:var(--text-muted);">${order.barcode}</div>
              <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="DiagnosticLab.viewFullReport('${order.sampleId}')">
                <span>View Slip</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (catalogContainer) {
      catalogContainer.innerHTML = this.catalog.map(cat => `
        <div class="encounter-card" style="margin-bottom:10px; padding:12px 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:var(--text-primary); font-size:0.85rem;">${cat.name}</strong>
            <span class="encounter-facility-tag tag-phc">${cat.category}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
            <span>Level: ${cat.facilityLevel}</span>
            <span style="color:#2dd4bf;">⏱️ ${cat.turnaround}</span>
          </div>
        </div>
      `).join('');
    }
  },

  orderNewTest(testCode, patientName) {
    const item = this.catalog.find(c => c.code === testCode) || this.catalog[0];
    const newOrder = {
      sampleId: "SAMP-" + Math.floor(10000 + Math.random() * 90000) + "-POC",
      barcode: "||| || |||| ||| || |||",
      patientName: patientName || "Sunita Devi",
      testName: item.name,
      collectionSite: "Sub-Centre Rampur",
      collectedAt: new Date().toLocaleTimeString(),
      status: "In Transit",
      courierRoute: "Sub-Centre ➔ PHC Bithoor Hub",
      resultValue: "Specimen in transport cold-box (4°C)...",
      isCritical: false,
      criticalNote: null
    };

    this.activeOrders.unshift(newOrder);
    this.renderDiagnostics();

    if (window.OfflineSync) {
      window.OfflineSync.queueAction('order_diagnostic_test', newOrder);
      window.OfflineSync.showToast(`🧪 Lab specimen collected & barcoded: ${newOrder.sampleId}`, 'success');
    }
  },

  viewFullReport(sampleId) {
    const order = this.activeOrders.find(o => o.sampleId === sampleId);
    if (!order) return;
    alert(`DIGITAL PATHOLOGY REPORT\nSample ID: ${order.sampleId}\nPatient: ${order.patientName}\nTest: ${order.testName}\nFindings: ${order.resultValue}\nStatus: ${order.status}`);
  }
};

window.DiagnosticLab = DiagnosticLab;
