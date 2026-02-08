"use client"

import { AlertTriangle, Clock, Info } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "@/lib/mock-results"

interface ResultCardProps {
  result: AnalysisResult
}

function ConfidenceBar({
  label,
  confidence,
  percentage,
  isMain,
}: {
  label: string
  confidence: number
  percentage?: number
  isMain: boolean
}) {
  const pct = percentage ?? Math.round(confidence * 100)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className={cn("font-medium", isMain && "text-foreground")}>
          {label}
        </span>
        <span className="tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isMain ? "bg-primary" : "bg-primary/40"
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${pct}%`}
        />
      </div>
    </div>
  )
}

export function ResultCard({ result }: ResultCardProps) {
  const formattedTime = new Date(result.timestamp).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* Warning banner */}
      <div className="flex items-center gap-2 border-b bg-accent/50 px-4 py-2.5 text-xs leading-relaxed text-accent-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        {"R\u00e9sultat indicatif \u2014 ne remplace pas un avis m\u00e9dical"}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {"Type pr\u00e9dit"}
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {result.mainLabel}
            </h3>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
              result.isUncertain
                ? "bg-warning/10 text-warning-foreground"
                : "bg-accent text-accent-foreground"
            )}
          >
            {result.isUncertain && (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            {result.isUncertain
              ? "Incertain"
              : `${Math.round(result.mainConfidence * 100)}%`}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Uncertainty warning */}
        {result.isUncertain && (
          <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="leading-relaxed text-foreground">
              {"R\u00e9sultat incertain : la confiance du mod\u00e8le est faible. Une interpr\u00e9tation par un professionnel est indispensable."}
            </p>
          </div>
        )}

        {/* Top 3 predictions */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">
            {"Top 3 des pr\u00e9dictions"}
          </p>
          {result.top3.map((pred, i) => (
            <ConfidenceBar
              key={pred.label}
              label={pred.label}
              confidence={pred.confidence}
              percentage={pred.percentage}
              isMain={i === 0}
            />
          ))}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {"Analyse r\u00e9alis\u00e9e le"} {formattedTime}
        </div>
      </CardContent>
    </Card>
  )
}
