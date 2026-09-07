import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { KpiCards } from "@/components/kpi-cards"
import { ReferralLoop } from "@/components/referral-loop"
import { SupplyChain } from "@/components/supply-chain"
import { Surveillance } from "@/components/surveillance"
import { CarePathway } from "@/components/care-pathway"
import { FacilityWorklist } from "@/components/facility-worklist"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex-1 space-y-6 p-6">
          <KpiCards />

          <CarePathway />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ReferralLoop />
            </div>
            <SupplyChain />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Surveillance />
            <FacilityWorklist />
          </div>

          <footer className="flex flex-col justify-between gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground sm:flex-row">
            <p>Sehat Setu &middot; Integrated Healthcare Access &amp; Quality Support v1.0</p>
            <p>ABDM-FHIR &middot; SNOMED-CT &middot; ICD-11 &middot; Offline-First</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
