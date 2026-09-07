const drugs = [
  { name: "Oxytocin Inj.", facility: "Dabugam PHC", days: 2, level: 12, status: "critical" },
  { name: "ORS Sachets", facility: "Kundei SC", days: 4, level: 22, status: "critical" },
  { name: "Amoxicillin 500mg", facility: "CHC Umerkote", days: 9, level: 48, status: "low" },
  { name: "Iron-Folic Acid", facility: "Raighar SC", days: 14, level: 61, status: "ok" },
  { name: "Metformin 500mg", facility: "District Hospital", days: 21, level: 78, status: "ok" },
]

const barColor: Record<string, string> = {
  critical: "bg-destructive",
  low: "bg-[var(--warning)]",
  ok: "bg-[var(--success)]",
}

const labelColor: Record<string, string> = {
  critical: "text-destructive",
  low: "text-[var(--warning-foreground)]",
  ok: "text-[var(--success-foreground)]",
}

export function SupplyChain() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold">Essential Drug Availability</h2>
          <p className="text-xs text-muted-foreground">Predictive stockout · consumption velocity</p>
        </div>
        <span className="text-xs text-destructive">3 alerts</span>
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {drugs.map((d) => (
          <li key={d.name + d.facility} className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.facility}</p>
              </div>
              <p className={`text-xs tabular-nums ${labelColor[d.status]}`}>{d.days}d cover</p>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div className={`h-1 rounded-full ${barColor[d.status]}`} style={{ width: `${d.level}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
