"use client"

import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalyzeButtonProps {
  onClick: () => void
  loading: boolean
  disabled: boolean
}

export function AnalyzeButton({
  onClick,
  loading,
  disabled,
}: AnalyzeButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      size="lg"
      className="w-full text-base font-medium"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {"Analyse en cours\u2026"}
        </>
      ) : (
        <>
          <Search className="mr-2 h-5 w-5" />
          Analyser
        </>
      )}
    </Button>
  )
}
