export function NextAppointment() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-primary text-primary-foreground">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-primary-foreground/70">Next teleconsultation</p>
          <p className="mt-1 text-xl font-semibold tracking-tight">Dr. Meena Sharma</p>
          <p className="text-sm text-primary-foreground/80">General Medicine · PHC Rampur</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Today, 11:30 AM</p>
            <p className="text-[11px] text-primary-foreground/70">Starts in 45 min</p>
          </div>
          <button className="rounded-lg bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
            Join call
          </button>
        </div>
      </div>
    </section>
  )
}
