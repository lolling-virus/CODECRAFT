const meds = [
  { name: "Amlodipine 5mg", schedule: "1 tablet · after breakfast", next: "Taken", done: true },
  { name: "Metformin 500mg", schedule: "1 tablet · after lunch", next: "Due 1:00 PM", done: false },
  { name: "Iron + Folic Acid", schedule: "1 tablet · after dinner", next: "Due 8:00 PM", done: false },
]

export function Medications() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Today&apos;s Medicines</h2>
        <span className="text-[11px] text-muted-foreground">1 of 3 taken</span>
      </div>
      <ul className="flex flex-col gap-2">
        {meds.map((m) => (
          <li
            key={m.name}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  m.done
                    ? "border-[var(--success)] bg-[var(--success)]/15 text-[var(--success-foreground)]"
                    : "border-border text-muted-foreground"
                }`}
              >
                {m.done ? "✓" : ""}
              </span>
              <div>
                <p className="text-sm font-medium leading-tight">{m.name}</p>
                <p className="text-[11px] text-muted-foreground">{m.schedule}</p>
              </div>
            </div>
            <span
              className={`text-[11px] font-medium ${
                m.done ? "text-muted-foreground" : "text-[var(--warning-foreground)]"
              }`}
            >
              {m.next}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
