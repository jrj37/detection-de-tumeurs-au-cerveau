"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <p className="flex-1 leading-relaxed text-foreground">{message}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="h-6 w-6 shrink-0 p-0 text-muted-foreground hover:text-foreground"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
