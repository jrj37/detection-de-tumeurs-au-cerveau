"use client"

import Link from "next/link"
import { Brain, ShieldAlert, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  onOpenDisclaimer: () => void
}

export function SiteHeader({ onOpenDisclaimer }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
        >
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-lg tracking-tight">JRscan</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenDisclaimer}
            className="text-muted-foreground hover:text-foreground"
          >
            <ShieldAlert className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Avertissement</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/confidentialite">
              <Lock className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">{"Confidentialit\u00e9"}</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
