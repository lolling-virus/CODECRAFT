/**
 * SwasthyaSetu — Essential Medicine Availability & Stock-Out Prevention (e-Aushadhi)
 * Real-time visibility into Essential Drug Lists (EDL), predictive burn-rate alerts,
 * and automated inter-facility stock replenishment requests.
 */

const MedicineInventory = {
  facilityStock: [
    {
      id: "DRUG-01",
      name: "Iron & Folic Acid (IFA) Adult",
      category: "Maternal Health",
      subCentreStock: 1200,
      phcStock: 8500,
      dailyBurnRate: 65,
      daysRemaining: 18,
      status: "Optimal",
      batchNo: "IFA-26B09",
      expiryDate: "2027-11"
    },
    {
      id: "DRUG-02",
      name: "Labetalol 100mg Tablet",
      category: "Maternal / Antihypertensive",
      subCentreStock: 40,
      phcStock: 320,
      dailyBurnRate: 15,
      daysRemaining: 2,
      status: "Critical",
      batchNo: "LAB-25H11",
      expiryDate: "2027-06"
    },
    {
      id: "DRUG-03",
      name: "Oxytocin Injection 10 IU/mL",
      category: "Emergency Obstetric",
      subCentreStock: 12,
      phcStock: 140,
      dailyBurnRate: 4,
      daysRemaining: 3,
      status: "Critical",
      batchNo: "OXY-26A02",
      expiryDate: "2026-12"
    },
    {
      id: "DRUG-04",
      name: "Metformin 500mg Tablet",
      category: "NCD / Diabetes",
      subCentreStock: 180,
      phcStock: 2400,
      dailyBurnRate: 35,
      daysRemaining: 5,
      status: "Warning",
      batchNo: "MET-25K04",
      expiryDate: "2028-01"
    },
    {
      id: "DRUG-05",
      name: "Telmisartan 40mg Tablet",
      category: "NCD / Hypertension",
      subCentreStock: 240,
      phcStock: 3100,
      dailyBurnRate: 28,
      daysRemaining: 8,
      status: "Warning",
      batchNo: "TEL-26C14",
      expiryDate: "2027-09"
    },
    {
      id: "DRUG-06",
      name: "Oral Rehydration Salts (ORS) 20.5g",
      category: "Child Health & Diarrhea",
      subCentreStock: 650,
      phcStock: 4200,
      dailyBurnRate: 20,
      daysRemaining: 32,
      status: "Optimal",
      batchNo: "ORS-26E01",
      expiryDate: "2028-05"
    },
    {
      id: "DRUG-07",
      name: "Amoxicillin Dispersible 250mg",
      category: "Pediatric Antibiotic",
      subCentreStock: 150,
      phcStock: 1100,
      dailyBurnRate: 12,
      daysRemaining: 12,
      status: "Warning",
      batchNo: "AMX-25M19",
      expiryDate: "2027-04"
    },
    {
      id: "DRUG-08",
      name: "Magnesium Sulfate 50% Injection",
      category: "Emergency Obstetric (Eclampsia)",
      subCentreStock: 10,
      phcStock: 85,
      dailyBurnRate: 2,
      daysRemaining: 5,
      status: "Warning",
      batchNo: "MGS-26B12",
      expiryDate: "2027-08"
    },
    {
      id: "DRUG-09",
      name: "Paracetamol 500mg Tablet",
      category: "Analgesic / Antipyretic",
      subCentreStock: 1800,
      phcStock: 12000,
      dailyBurnRate: 80,
      daysRemaining: 22,
      status: "Optimal",
      batchNo: "PCM-26D07",
      expiryDate: "2028-03"
    }
  ],

  init() {
    this.renderInventory();
  },

  renderInventory() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = this.facilityStock.map(d => {
      let statusBadge = '';
      if (d.status === 'Optimal') {
        statusBadge = `<span class="stock-indicator-pill stock-optimal">● ${d.daysRemaining}d Safe</span>`;
      } else if (d.status === 'Warning') {
        statusBadge = `<span class="stock-indicator-pill stock-warning">⚠️ ${d.daysRemaining}d Low</span>`;
      } else {
        statusBadge = `<span class="stock-indicator-pill stock-critical">🚨 ${d.daysRemaining}d Urgent</span>`;
      }

      return `
        <tr>
          <td>
            <strong style="color:var(--text-primary); font-size:0.88rem;">${d.name}</strong>
            <div style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);">${d.id} • Batch: ${d.batchNo}</div>
          </td>
          <td><span class="encounter-facility-tag tag-phc">${d.category}</span></td>
          <td><strong style="color:#2dd4bf; font-family:var(--font-mono);">${d.subCentreStock}</strong> units</td>
          <td><span style="font-family:var(--font-mono);">${d.phcStock}</span> units</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="MedicineInventory.requestTransfer('${d.id}')">
              <span>Request Re-stock</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  requestTransfer(drugId) {
    const drug = this.facilityStock.find(d => d.id === drugId);
    if (!drug) return;

    // Simulate transfer replenishment
    const qty = 200;
    drug.subCentreStock += qty;
    drug.daysRemaining = Math.floor(drug.subCentreStock / drug.dailyBurnRate);
    drug.status = drug.daysRemaining > 14 ? "Optimal" : drug.daysRemaining > 5 ? "Warning" : "Critical";

    this.renderInventory();

    if (window.OfflineSync) {
      window.OfflineSync.queueAction('requisition_drug_restock', {
        drugId: drug.id,
        drugName: drug.name,
        qty,
        destination: "Sub-Centre Rampur Dispensary",
        source: "District Drug Warehouse Sitapur"
      });
      window.OfflineSync.showToast(`📦 Restock Requisition approved! ${qty} units of ${drug.name} dispatched to Sub-Centre.`, 'success');
    }
  }
};

window.MedicineInventory = MedicineInventory;
