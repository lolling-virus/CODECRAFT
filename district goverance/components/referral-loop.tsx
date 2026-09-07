const referrals = [
  {
    id: "REF-4821",
    patient: "Sunita D. · 27F · ANC",
    from: "Kundei Sub-Centre",
    to: "District Hospital",
    stage: "Specialist Review",
    priority: "Emergency",
    step: 3,
    eta: "Ambulance 8 min away",
  },
  {
    id: "REF-4815",
    patient: "Ramesh N. · 54M · Cardiac",
    from: "Dabugam PHC",
    to: "CHC Umerkote",
    stage: "Bed Allocated",
    priority: "Urgent",
    step: 2,
    eta: "Slot 14:30 confirmed",
  },
  {
    id: "REF-4809",
    patient: "Baby of Lata · 3d · Neonatal",
    from: "Raighar Sub-Centre",
    to: "District Hospital",
    stage: "Consult Completed",
    priority: "Routine",
    step: 4,
    eta: "Follow-up scheduled",
  },
]

const stages = ["Initiated", "In Transit", "Received", "Closed"]

const priorityPill: Record<string, string> = {
  Emergency: "bg-destructive/10 text-destructive",
  Urgent: "bg-[var(--warning)]/15 text-[var(--warning-foreground)]",
  Routine: "bg-[var(--success)]/12 text-[var(--success-foreground)]",
}

const barColor: Record<string, string> = {
  Emergency: "bg-destructive",
  Urgent: "bg-[var(--warning)]",
  Routine: "bg-[var(--success)]",
}

export function ReferralLoop() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold">Closed-Loop Referral Tracking</h2>
          <p className="text-xs text-muted-foreground">Sub-Centre → PHC → CHC → District Hospital</p>
        </div>
        <span className="text-xs text-muted-foreground">7 active</span>
      </div>

      <div className="divide-y divide-border border-t border-border">
        {referrals.map((r) => (
          <div key={r.id} className="px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                <span className="text-sm font-medium">{r.patient}</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityPill[r.priority]}`}
              >
                {r.priority}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {r.from} <span className="text-foreground">→ {r.to}</span>
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              {stages.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={`h-1 rounded-full ${i < r.step ? barColor[r.priority] : "bg-border"}`} />
                  <p
                    className={`mt-1 text-[10px] ${
                      i === r.step - 1 ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground">
              {r.stage} · {r.eta}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
