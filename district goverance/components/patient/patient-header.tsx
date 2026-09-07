export function PatientHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            AK
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Good morning</p>
            <h1 className="text-lg font-semibold leading-tight tracking-tight">Anita Kumari</h1>
            <p className="text-[11px] text-muted-foreground">34 yrs · Female · Rampur Village</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-border bg-secondary px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">ABHA Health ID</p>
            <p className="font-mono text-sm tabular-nums text-foreground">14-2938-4756-1209</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success)]/12 px-2.5 py-1 text-[11px] font-medium text-[var(--success-foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            Synced
          </span>
        </div>
      </div>
    </header>
  )
}
