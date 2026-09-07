/**
 * SwasthyaSetu — District Health Command & Quality Monitoring Dashboard
 * Real-time public health metrics: referral closure rates, wait-time reductions,
 * travel distance savings, and facility quality performance.
 */

const DistrictDashboard = {
  kpis: {
    referralCompletionRate: 92.4, // %
    referralDiff: "+58.4%", // vs traditional paper
    waitReductionMinutes: 22, // mins wait vs 276 mins before
    waitReductionPercent: 78.5,
    medicineAvailabilityIndex: 98.2, // %
    travelSavedKm: 28450,
    teleconsultsCompleted: 1482,
    hrpFollowupCompliance: 94.7
  },

  facilities: [
    { name: "Sub-Centre Rampur (Arogya Mandir)", type: "Sub-Centre", teleconsults: 210, referrals: 32, stockIndex: "98%", status: "Optimal" },
    { name: "Sub-Centre Shivrajpur", type: "Sub-Centre", teleconsults: 184, referrals: 28, stockIndex: "95%", status: "Optimal" },
    { name: "PHC Bithoor Hub", type: "PHC", teleconsults: 412, referrals: 64, stockIndex: "99%", status: "Optimal" },
    { name: "PHC Chaubepur", type: "PHC", teleconsults: 320, referrals: 45, stockIndex: "96%", status: "Optimal" },
    { name: "CHC Bilhaur FRU", type: "CHC", teleconsults: 246, referrals: 58, stockIndex: "97%", status: "Optimal" },
    { name: "Sitapur District Women's Hospital", type: "District Hospital", teleconsults: 110, referrals: 88, stockIndex: "99%", status: "Optimal" }
  ],

  init() {
    this.renderKPIs();
    this.renderCharts();
    this.renderFacilitiesTable();
  },

  renderKPIs() {
    const kpiRow = document.getElementById('dashboard-kpis-container');
    if (!kpiRow) return;

    kpiRow.innerHTML = `
      <div class="kpi-metric-card">
        <div class="kpi-metric-title">Closed-Loop Referral Completion</div>
        <div class="kpi-big-num" style="color:#2dd4bf;">${this.kpis.referralCompletionRate}%</div>
        <div class="kpi-diff-badge diff-good">
          <span>▲ ${this.kpis.referralDiff}</span> <span style="color:var(--text-muted);">vs paper referral baseline</span>
        </div>
      </div>

      <div class="kpi-metric-card">
        <div class="kpi-metric-title">Median Specialist Wait Time</div>
        <div class="kpi-big-num" style="color:#38bdf8;">${this.kpis.waitReductionMinutes}m</div>
        <div class="kpi-diff-badge diff-good">
          <span>▼ ${this.kpis.waitReductionPercent}%</span> <span style="color:var(--text-muted);">reduced from 4.6 hrs</span>
        </div>
      </div>

      <div class="kpi-metric-card">
        <div class="kpi-metric-title">Travel Distance Saved (Month)</div>
        <div class="kpi-big-num" style="color:#34d399;">${this.kpis.travelSavedKm.toLocaleString()} <span style="font-size:1.1rem;">km</span></div>
        <div class="kpi-diff-badge diff-good">
          <span>₹ 4.2 Lakh</span> <span style="color:var(--text-muted);">patient transit costs saved</span>
        </div>
      </div>

      <div class="kpi-metric-card">
        <div class="kpi-metric-title">Essential Medicine Availability</div>
        <div class="kpi-big-num" style="color:#fbbf24;">${this.kpis.medicineAvailabilityIndex}%</div>
        <div class="kpi-diff-badge diff-good">
          <span>98.2%</span> <span style="color:var(--text-muted);">zero stock-out target met</span>
        </div>
      </div>
    `;
  },

  renderCharts() {
    const chartContainer = document.getElementById('dashboard-chart-svg');
    if (!chartContainer) return;

    // SVG Bar chart showing monthly teleconsultation growth and referral loop completion
    chartContainer.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style="overflow:visible;">
        <defs>
          <linearGradient id="barGradientTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#0d9488" stop-opacity="0.3" />
          </linearGradient>
          <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.3" />
          </linearGradient>
        </defs>

        <!-- Y Axis Guidelines -->
        <line x1="30" y1="160" x2="480" y2="160" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
        <line x1="30" y1="110" x2="480" y2="110" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
        <line x1="30" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
        <line x1="30" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />

        <!-- Bar Groups (Months: May, Jun, Jul, Aug, Sep) -->
        <!-- May -->
        <rect x="50" y="115" width="22" height="45" rx="4" fill="url(#barGradientTeal)" />
        <rect x="76" y="130" width="22" height="30" rx="4" fill="url(#barGradientBlue)" />
        <text x="74" y="178" font-size="10" fill="#94a3b8" text-anchor="middle">May</text>

        <!-- Jun -->
        <rect x="135" y="95" width="22" height="65" rx="4" fill="url(#barGradientTeal)" />
        <rect x="161" y="115" width="22" height="45" rx="4" fill="url(#barGradientBlue)" />
        <text x="159" y="178" font-size="10" fill="#94a3b8" text-anchor="middle">Jun</text>

        <!-- Jul -->
        <rect x="220" y="70" width="22" height="90" rx="4" fill="url(#barGradientTeal)" />
        <rect x="246" y="95" width="22" height="65" rx="4" fill="url(#barGradientBlue)" />
        <text x="244" y="178" font-size="10" fill="#94a3b8" text-anchor="middle">Jul</text>

        <!-- Aug -->
        <rect x="305" y="45" width="22" height="115" rx="4" fill="url(#barGradientTeal)" />
        <rect x="331" y="65" width="22" height="95" rx="4" fill="url(#barGradientBlue)" />
        <text x="329" y="178" font-size="10" fill="#94a3b8" text-anchor="middle">Aug</text>

        <!-- Sep (Current) -->
        <rect x="390" y="25" width="22" height="135" rx="4" fill="url(#barGradientTeal)" />
        <rect x="416" y="40" width="22" height="120" rx="4" fill="url(#barGradientBlue)" />
        <text x="414" y="178" font-size="10" fill="#2dd4bf" font-weight="700" text-anchor="middle">Sep (Live)</text>
      </svg>
    `;
  },

  renderFacilitiesTable() {
    const tableBody = document.getElementById('dashboard-facilities-tbody');
    if (!tableBody) return;

    tableBody.innerHTML = this.facilities.map(f => `
      <tr>
        <td>
          <strong style="color:var(--text-primary); font-size:0.86rem;">${f.name}</strong>
        </td>
        <td><span class="encounter-facility-tag tag-phc">${f.type}</span></td>
        <td style="font-family:var(--font-mono); color:#2dd4bf; font-weight:700;">${f.teleconsults}</td>
        <td style="font-family:var(--font-mono);">${f.referrals}</td>
        <td><span class="stock-indicator-pill stock-optimal">● ${f.stockIndex}</span></td>
        <td><span style="color:#34d399; font-weight:600; font-size:0.8rem;">✓ ${f.status}</span></td>
      </tr>
    `).join('');
  }
};

window.DistrictDashboard = DistrictDashboard;
