"use client"

const modules = [
  { label: "Governance Overview", active: true },
  { label: "Digital Triage" },
  { label: "Longitudinal Records" },
  { label: "Teleconsultation" },
  { label: "Referral & Escalation", badge: "7" },
  { label: "Supply Chain", badge: "3" },
  { label: "Patient Follow-up" },
  { label: "Queue & OPD" },
  { label: "Disease Surveillance" },
]

export function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="px-6 py-6">
        <p className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">Sehat Setu</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Public Health Backbone</p>
      </div>

      <nav className="flex-1 px-3">
        {modules.map((m) => (
          <button
            key={m.label}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
              m.active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
            }`}
          >
            <span className="leading-tight">{m.label}</span>
            {m.badge && <span className="text-[11px] tabular-nums text-muted-foreground">{m.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          <p className="text-[11px] text-muted-foreground">142 facilities synced · 2 min ago</p>
        </div>
      </div>
    </aside>
  )
}
