const steps = [
  {
    title: "Frontline Screening & Triage",
    tier: "ASHA / Sub-Centre",
    detail: "Protocol-based scoring, red-flag detection, risk categorization.",
    accent: "var(--info)",
  },
  {
    title: "Assisted Teleconsultation",
    tier: "PHC Medical Officer",
    detail: "Hybrid video/audio consult, BLE device vitals, e-prescription.",
    accent: "var(--primary)",
  },
  {
    title: "Advanced Care & Referral",
    tier: "District Hospital Specialist",
    detail: "Pre-arrival bed allocation, specialist review, lab attachment.",
    accent: "var(--warning)",
  },
  {
    title: "Closed-Loop Follow-up",
    tier: "Community Home Visit",
    detail: "ANC/PNC reminders, drop-out detection, chronic tracking.",
    accent: "var(--success)",
  },
]

export function CarePathway() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">End-to-End Care Pathway</h2>
      <p className="text-xs text-muted-foreground">Unified data backbone across public health tiers</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="border-t-2 pt-3" style={{ borderColor: s.accent }}>
            <span className="font-mono text-[11px] font-medium" style={{ color: s.accent }}>
              0{i + 1}
            </span>
            <p className="mt-2 text-sm font-medium leading-tight text-pretty">{s.title}</p>
            <p className="mt-1 text-[11px] font-medium" style={{ color: s.accent }}>
              {s.tier}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
