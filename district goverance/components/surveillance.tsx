const trend = [
  { d: "Mon", v: 34 },
  { d: "Tue", v: 41 },
  { d: "Wed", v: 38 },
  { d: "Thu", v: 52 },
  { d: "Fri", v: 61 },
  { d: "Sat", v: 78 },
  { d: "Sun", v: 92 },
]

const clusters = [
  { block: "Umerkote Block", condition: "Acute Diarrheal", cases: 92, trend: "+38%", level: "high" },
  { block: "Dabugam Block", condition: "Dengue (suspected)", cases: 27, trend: "+12%", level: "watch" },
  { block: "Raighar Block", condition: "ILI / Fever", cases: 15, trend: "-4%", level: "normal" },
]

const levelPill: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  watch: "bg-[var(--warning)]/15 text-[var(--warning-foreground)]",
  normal: "bg-[var(--success)]/12 text-[var(--success-foreground)]",
}

export function Surveillance() {
  const max = Math.max(...trend.map((t) => t.v))
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold">Disease Surveillance</h2>
          <p className="text-xs text-muted-foreground">Outbreak signals · last 7 days</p>
        </div>
        <span className="text-xs text-destructive">1 outbreak flag</span>
      </div>

      <div className="border-t border-border px-6 py-5">
        <div className="flex items-end gap-2">
          {trend.map((t) => {
            const ratio = t.v / max
            const color = ratio > 0.8 ? "var(--destructive)" : ratio > 0.55 ? "var(--warning)" : "var(--info)"
            return (
              <div key={t.d} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end">
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${ratio * 100}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{t.d}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Case reports rising in Umerkote — auto-alert sent to District Health Officer.
        </p>
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {clusters.map((c) => (
          <li key={c.block} className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${levelPill[c.level]}`}>
                {c.level}
              </span>
              <div>
                <p className="text-sm font-medium">{c.condition}</p>
                <p className="text-[11px] text-muted-foreground">{c.block}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold tabular-nums">{c.cases}</p>
              <p className={`text-[11px] ${c.trend.startsWith("+") ? "text-destructive" : "text-muted-foreground"}`}>
                {c.trend}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
