/**
 * SwasthyaSetu — Assisted Teleconsultation Suite (Virtual OPD)
 * Connects village Sub-Centres / PHCs to District Hospital Specialists with live vitals stream,
 * real-time animated ECG canvas, digital stethoscope simulation, and digital Rx dispatch.
 */

const Teleconsult = {
  callActive: false,
  callDurationSeconds: 0,
  timerInterval: null,
  ecgAnimId: null,
  stethoscopeActive: false,

  specialists: [
    {
      id: "SPEC-01",
      name: "Dr. Ananya Roy",
      designation: "Chief Consultant Gynecologist & Obstetrician",
      hospital: "Sitapur District Women's Hospital",
      avatar: "AR",
      status: "Available"
    },
    {
      id: "SPEC-02",
      name: "Dr. R. K. Saxena",
      designation: "Senior Physician (Internal Medicine)",
      hospital: "District Civil Hospital Sitapur",
      avatar: "RS",
      status: "Available"
    },
    {
      id: "SPEC-03",
      name: "Dr. Meenakshi Sundaram",
      designation: "Pediatric Critical Care Specialist",
      hospital: "District Pediatric Hub & NRC",
      avatar: "MS",
      status: "In Consult"
    }
  ],

  activeSpecialist: null,
  activePatient: null,

  currentPrescription: {
    drugs: [
      { name: "Labetalol 100mg", dosage: "1 tab BD after meals", duration: "14 days", instructions: "Hold if systolic BP < 110 mmHg" },
      { name: "Iron & Folic Acid (IFA)", dosage: "1 tab OD after lunch", duration: "30 days", instructions: "Do not take with tea or milk" }
    ],
    doctorNotes: "Patient evaluated via teleconsultation at Sub-Centre Rampur with ASHA worker Kiran Bala. Maternal BP currently 154/98. Advised twice-weekly BP recording at Sub-Centre.",
    nextFollowUp: "In 7 days at Sub-Centre or earlier if headache/visual disturbance occurs."
  },

  init() {
    this.activeSpecialist = this.specialists[0];
    this.activePatient = window.HealthRecords ? window.HealthRecords.getActivePatient() : null;
    this.initECGCanvas();
    this.renderPrescription();
  },

  startConsultForTriage(triageData) {
    if (triageData) {
      this.activePatient = {
        name: triageData.patientName,
        age: triageData.patientAge,
        category: triageData.category,
        vitals: {
          bp: `${triageData.vitals.bpSys}/${triageData.vitals.bpDia}`,
          pulse: triageData.vitals.pulse,
          spo2: triageData.vitals.spo2,
          hemoglobin: triageData.vitals.hb
        }
      };
    }
    this.startCall();
  },

  startCall() {
    this.callActive = true;
    this.callDurationSeconds = 0;
    const callStatusEl = document.getElementById('tele-call-status');
    const timerEl = document.getElementById('tele-call-timer');
    const startBtn = document.getElementById('tele-start-btn');
    const endBtn = document.getElementById('tele-end-btn');

    if (callStatusEl) callStatusEl.textContent = 'CONNECTED (ENCRYPTED)';
    if (startBtn) startBtn.style.display = 'none';
    if (endBtn) endBtn.style.display = 'inline-flex';

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.callDurationSeconds++;
      const mins = String(Math.floor(this.callDurationSeconds / 60)).padStart(2, '0');
      const secs = String(this.callDurationSeconds % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);

    this.startECGAnimation();

    if (window.OfflineSync) {
      window.OfflineSync.showToast(`Assisted Teleconsultation connected with ${this.activeSpecialist.name}`, 'success');
    }
  },

  endCall() {
    this.callActive = false;
    clearInterval(this.timerInterval);
    cancelAnimationFrame(this.ecgAnimId);

    const callStatusEl = document.getElementById('tele-call-status');
    const startBtn = document.getElementById('tele-start-btn');
    const endBtn = document.getElementById('tele-end-btn');

    if (callStatusEl) callStatusEl.textContent = 'SESSION CONCLUDED';
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (endBtn) endBtn.style.display = 'none';

    if (window.OfflineSync) {
      window.OfflineSync.showToast('Teleconsultation ended. Clinical notes & Rx dispatched.', 'info');
      window.OfflineSync.queueAction('teleconsult_completed', {
        specialist: this.activeSpecialist.name,
        patient: this.activePatient?.name,
        duration: this.callDurationSeconds,
        rx: this.currentPrescription
      });
    }
  },

  toggleStethoscope() {
    this.stethoscopeActive = !this.stethoscopeActive;
    const stethBtn = document.getElementById('steth-toggle-btn');
    if (stethBtn) {
      if (this.stethoscopeActive) {
        stethBtn.style.background = '#2dd4bf';
        stethBtn.style.color = '#000';
        stethBtn.title = 'Digital Stethoscope: BROADCASTING AUDIO';
        if (window.OfflineSync) {
          window.OfflineSync.showToast('Digital Stethoscope active: Streaming cardiac & pulmonary sounds', 'info');
        }
      } else {
        stethBtn.style.background = 'rgba(255, 255, 255, 0.06)';
        stethBtn.style.color = 'var(--text-primary)';
        stethBtn.title = 'Digital Stethoscope: Muted';
      }
    }
  },

  initECGCanvas() {
    const canvas = document.getElementById('tele-ecg-canvas');
    if (!canvas) return;
    canvas.width = 180;
    canvas.height = 48;
    this.drawECGBaseline(canvas);
  },

  drawECGBaseline(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.2)';
    ctx.lineWidth = 1;
    // Grid
    for (let x = 0; x < canvas.width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  },

  startECGAnimation() {
    const canvas = document.getElementById('tele-ecg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let x = 0;
    let points = new Array(canvas.width).fill(canvas.height / 2);

    const animate = () => {
      if (!this.callActive) return;

      x = (x + 2) % canvas.width;

      // Generate ECG P-Q-R-S-T wave pulse periodically
      const cyclePos = x % 45;
      let yVal = canvas.height / 2;
      if (cyclePos === 10) yVal -= 4; // P wave
      else if (cyclePos === 16) yVal += 4; // Q dip
      else if (cyclePos === 19) yVal -= 20; // R peak
      else if (cyclePos === 22) yVal += 8; // S dip
      else if (cyclePos === 30) yVal -= 6; // T wave

      points[x] = yVal;

      this.drawECGBaseline(canvas);

      ctx.beginPath();
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#2dd4bf';
      ctx.shadowBlur = 4;

      for (let i = 0; i < canvas.width; i++) {
        if (i === 0) ctx.moveTo(i, points[i]);
        else if (Math.abs(i - x) > 6) ctx.lineTo(i, points[i]);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      this.ecgAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  addDrugToRx() {
    const nameInput = document.getElementById('rx-new-drug-name');
    const dosageInput = document.getElementById('rx-new-dosage');
    const durationInput = document.getElementById('rx-new-duration');

    if (!nameInput || !nameInput.value.trim()) return;

    this.currentPrescription.drugs.push({
      name: nameInput.value.trim(),
      dosage: dosageInput ? dosageInput.value.trim() : "1 tab OD",
      duration: durationInput ? durationInput.value.trim() : "14 days",
      instructions: "Take as directed by doctor"
    });

    nameInput.value = '';
    this.renderPrescription();
    if (window.OfflineSync) {
      window.OfflineSync.showToast('Drug added to digital prescription', 'success');
    }
  },

  renderPrescription() {
    const container = document.getElementById('tele-rx-drugs-container');
    if (!container) return;

    container.innerHTML = this.currentPrescription.drugs.map((d, index) => `
      <div class="rx-drug-item">
        <div>
          <div class="rx-drug-name">${d.name}</div>
          <div class="rx-instructions">${d.instructions} (${d.duration})</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="rx-dosage">${d.dosage}</span>
          <button style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;" onclick="Teleconsult.removeDrug(${index})" title="Remove drug">✕</button>
        </div>
      </div>
    `).join('');
  },

  removeDrug(index) {
    this.currentPrescription.drugs.splice(index, 1);
    this.renderPrescription();
  },

  dispatchPrescriptionToDispensary() {
    if (window.OfflineSync) {
      window.OfflineSync.queueAction('rx_dispense_order', {
        patient: this.activePatient?.name,
        doctor: this.activeSpecialist.name,
        rx: this.currentPrescription
      });
      window.OfflineSync.showToast('✅ Prescription digitally signed and transmitted to local PHC dispensary!', 'success');
    }
  }
};

window.Teleconsult = Teleconsult;
