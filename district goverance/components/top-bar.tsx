"use client"

import { ChevronDown, Search } from "lucide-react"

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold tracking-tight">District Governance</h1>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            Nabarangpur, Odisha
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">Real-time overview across all facility tiers</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search ABHA ID, facility…"
            className="h-8 w-52 border-b border-border bg-transparent pl-6 pr-2 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
        </div>

        <span className="text-xs text-muted-foreground">FHIR R4</span>

        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] font-medium">
            DR
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-medium">Dr. R. Mishra</p>
            <p className="text-[10px] text-muted-foreground">District Health Officer</p>
          </div>
        </div>
      </div>
    </header>
  )
}
