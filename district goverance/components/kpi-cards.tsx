const kpis = [
  {
    label: "Referral Completion",
    value: "92.4",
    unit: "%",
    target: "Target > 90%",
    delta: "+4.1",
    good: true,
    accent: "var(--success)",
  },
  {
    label: "Consultation Lead Time",
    value: "24",
    unit: "min",
    target: "Target < 30 min",
    delta: "-6",
    good: true,
    accent: "var(--info)",
  },
  {
    label: "Medicine Availability",
    value: "93.1",
    unit: "%",
    target: "Target > 95%",
    delta: "-1.8",
    good: false,
    accent: "var(--warning)",
  },
  {
    label: "Record Coverage",
    value: "87.6",
    unit: "%",
    target: "ABHA linked",
    delta: "+2.3",
    good: true,
    accent: "var(--primary)",
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="relative bg-card p-5">
          <span className="absolute left-0 top-0 h-full w-0.5" style={{ backgroundColor: k.accent }} />
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: k.accent }} />
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
              {k.value}
              <span className="ml-0.5 text-base font-normal text-muted-foreground">{k.unit}</span>
            </p>
            <span
              className={`text-xs tabular-nums ${k.good ? "text-[var(--success-foreground)]" : "text-destructive"}`}
            >
              {k.delta}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{k.target}</p>
        </div>
      ))}
    </div>
  )
}
