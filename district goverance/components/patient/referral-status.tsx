const steps = [
  { label: "Sub-Centre", done: true },
  { label: "PHC Rampur", done: true },
  { label: "District Hospital", done: false, active: true },
  { label: "Follow-up", done: false },
]

export function ReferralStatus() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">My Referral</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--warning)]/15 px-2.5 py-1 text-[11px] font-medium text-[var(--warning-foreground)]">
          In progress
        </span>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Cardiology consultation · Referred by Dr. Meena Sharma
      </p>

      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                  s.done
                    ? "bg-[var(--success)] text-white"
                    : s.active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <span
                className={`text-center text-[10px] leading-tight ${
                  s.active ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`mx-1 mb-4 h-px flex-1 ${s.done ? "bg-[var(--success)]" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-secondary p-3">
        <p className="text-[11px] text-muted-foreground">Next step</p>
        <p className="text-sm font-medium">Visit District Hospital · Appointment on 12 Sep, 10:00 AM</p>
      </div>
    </section>
  )
}
