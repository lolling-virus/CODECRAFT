const facilities = [
  { name: "District Hospital", wait: 18, queue: 42, teleconsult: 6, load: "high" },
  { name: "CHC Umerkote", wait: 26, queue: 31, teleconsult: 4, load: "high" },
  { name: "Dabugam PHC", wait: 9, queue: 12, teleconsult: 2, load: "normal" },
  { name: "Raighar PHC", wait: 6, queue: 8, teleconsult: 1, load: "normal" },
]

export function FacilityWorklist() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold">Queue & OPD Telemetry</h2>
          <p className="text-xs text-muted-foreground">Live wait times & token load</p>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-2.5 font-normal">Facility</th>
              <th className="px-3 py-2.5 text-right font-normal">Avg Wait</th>
              <th className="px-3 py-2.5 text-right font-normal">In Queue</th>
              <th className="px-6 py-2.5 text-right font-normal">Tele</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border border-t border-border">
            {facilities.map((f) => (
              <tr key={f.name}>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        f.load === "high" ? "bg-[var(--warning)]" : "bg-[var(--success)]"
                      }`}
                    />
                    <span className="font-medium">{f.name}</span>
                  </div>
                </td>
                <td
                  className={`px-3 py-3 text-right font-mono tabular-nums ${
                    f.wait >= 20 ? "text-[var(--warning-foreground)]" : "text-foreground"
                  }`}
                >
                  {f.wait}m
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">{f.queue}</td>
                <td className="px-6 py-3 text-right font-mono tabular-nums text-muted-foreground">{f.teleconsult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
