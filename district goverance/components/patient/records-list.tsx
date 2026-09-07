const records = [
  { title: "Blood Test Report", type: "Lab", date: "05 Sep 2026", facility: "PHC Rampur" },
  { title: "Teleconsultation Notes", type: "Consult", date: "05 Sep 2026", facility: "Dr. M. Sharma" },
  { title: "ECG Report", type: "Lab", date: "28 Aug 2026", facility: "District Hospital" },
  { title: "Prescription", type: "Rx", date: "28 Aug 2026", facility: "Dr. R. Verma" },
]

const tint: Record<string, string> = {
  Lab: "bg-[var(--info)]/12 text-[var(--info-foreground)]",
  Consult: "bg-primary/12 text-primary",
  Rx: "bg-[var(--success)]/12 text-[var(--success-foreground)]",
}

export function RecordsList() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Health Records</h2>
        <button className="text-[11px] font-medium text-primary hover:underline">View all</button>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {records.map((r) => (
          <li key={r.title} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tint[r.type]}`}>
                {r.type}
              </span>
              <div>
                <p className="text-sm font-medium leading-tight">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.facility}</p>
              </div>
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">{r.date}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
