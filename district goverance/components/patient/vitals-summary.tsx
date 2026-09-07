const vitals = [
  { label: "Blood Pressure", value: "128/84", unit: "mmHg", status: "warning", note: "Slightly high" },
  { label: "Blood Sugar", value: "96", unit: "mg/dL", status: "success", note: "Normal" },
  { label: "Heart Rate", value: "74", unit: "bpm", status: "success", note: "Normal" },
  { label: "Weight", value: "62", unit: "kg", status: "info", note: "Stable" },
]

const dot: Record<string, string> = {
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  info: "bg-[var(--info)]",
}

export function VitalsSummary() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">My Vitals</h2>
        <span className="text-[11px] text-muted-foreground">Updated 2 days ago</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {vitals.map((v) => (
          <div key={v.label} className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${dot[v.status]}`} />
              <p className="text-[11px] text-muted-foreground">{v.label}</p>
            </div>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums leading-none tracking-tight">
              {v.value}
              <span className="ml-1 text-xs font-normal text-muted-foreground">{v.unit}</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{v.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
