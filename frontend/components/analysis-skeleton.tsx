"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Loading message */}
      <div className="flex items-center justify-center gap-2 rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {"Analyse en cours\u2026 cela peut prendre quelques secondes"}
      </div>

      {/* Skeleton card */}
      <Card>
        <div className="border-b bg-accent/30 px-4 py-2.5">
          <Skeleton className="h-3.5 w-64" />
        </div>
        <CardHeader className="pb-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          ))}
          <Skeleton className="h-3 w-48" />
        </CardContent>
      </Card>

      {/* Skeleton explainability */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="mt-4 h-20 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
