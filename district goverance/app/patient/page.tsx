import { PatientHeader } from "@/components/patient/patient-header"
import { NextAppointment } from "@/components/patient/next-appointment"
import { QuickActions } from "@/components/patient/quick-actions"
import { VitalsSummary } from "@/components/patient/vitals-summary"
import { Medications } from "@/components/patient/medications"
import { ReferralStatus } from "@/components/patient/referral-status"
import { RecordsList } from "@/components/patient/records-list"

export default function PatientPage() {
  return (
    <div className="min-h-screen bg-background">
      <PatientHeader />

      <main className="mx-auto max-w-5xl space-y-5 px-5 py-6">
        <NextAppointment />

        <QuickActions />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <VitalsSummary />
          <Medications />
        </div>

        <ReferralStatus />

        <RecordsList />

        <footer className="flex flex-col justify-between gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground sm:flex-row">
          <p>Sehat Setu &middot; Patient Portal</p>
          <p>ABHA linked &middot; Data shared only with your consent</p>
        </footer>
      </main>
    </div>
  )
}
