const actions = [
  { label: "Book\nConsult", accent: "text-primary" },
  { label: "Symptom\nCheck", accent: "text-[var(--info-foreground)]" },
  { label: "Order\nMedicine", accent: "text-[var(--success-foreground)]" },
  { label: "Emergency\nSOS", accent: "text-[var(--destructive)]" },
]

export function QuickActions() {
  return (
    <section className="grid grid-cols-4 gap-3">
      {actions.map((a) => (
        <button
          key={a.label}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-colors hover:bg-secondary"
        >
          <span className={`h-8 w-8 rounded-full border-2 border-current ${a.accent}`} aria-hidden />
          <span className="whitespace-pre-line text-[11px] font-medium leading-tight text-foreground">
            {a.label}
          </span>
        </button>
      ))}
    </section>
  )
}
