"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { UploadDropzone } from "@/components/upload-dropzone"
import { ImagePreview } from "@/components/image-preview"
import { AnalyzeButton } from "@/components/analyze-button"
import { ErrorBanner } from "@/components/error-banner"
import { ResultCard } from "@/components/result-card"
import { ExplainabilityPanel } from "@/components/explainability-panel"
import { AnalysisSkeleton } from "@/components/analysis-skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Download, RotateCcw } from "lucide-react"
import { getRandomMockResult, type AnalysisResult } from "@/lib/mock-results"

type AppState = "upload" | "ready" | "analyzing" | "results"

export default function Page() {
  const [appState, setAppState] = useState<AppState>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useState(false)

  // Show disclaimer on first visit (check localStorage)
  useEffect(() => {
    const seen = localStorage.getItem("jrscan_disclaimer_seen")
    if (seen === "true") {
      setHasSeenDisclaimer(true)
    } else {
      setDisclaimerOpen(true)
    }
  }, [])

  const handleCloseDisclaimer = useCallback(() => {
    setDisclaimerOpen(false)
    setHasSeenDisclaimer(true)
    localStorage.setItem("jrscan_disclaimer_seen", "true")
  }, [])

  const handleFileSelected = useCallback((f: File) => {
    setFile(f)
    setError(null)
    setResult(null)
    setAppState("ready")
    toast.success("Image import\u00e9e avec succ\u00e8s")
  }, [])

  const handleReplace = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
    setAppState("upload")
    setConsent(false)
  }, [])

  const handleError = useCallback((msg: string) => {
    setError(msg)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file || !consent) return
    setError(null)
    setResult(null)
    setAppState("analyzing")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("L'analyse a échoué. Veuillez réessayer.")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
      setAppState("results")
      toast.success("Analyse terminée")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "L'analyse a échoué. Veuillez réessayer ou utiliser une autre image."
      )
      setAppState("ready")
    }
  }, [file, consent])

  const handleNewAnalysis = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
    setConsent(false)
    setAppState("upload")
  }, [])

  const canAnalyze = file !== null && consent && appState !== "analyzing"

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-right" />
      <MedicalDisclaimer
        open={disclaimerOpen}
        onClose={handleCloseDisclaimer}
      />
      <SiteHeader onOpenDisclaimer={() => setDisclaimerOpen(true)} />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Page title */}
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Classification d{"'"}images de tumeurs
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              {"Importez une image m\u00e9dicale pour obtenir une estimation algorithmique du type de tumeur."}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Error banner */}
            {error && (
              <ErrorBanner
                message={error}
                onDismiss={() => setError(null)}
              />
            )}

            {/* Upload or preview */}
            {appState === "upload" && (
              <UploadDropzone
                onFileSelected={handleFileSelected}
                onError={handleError}
              />
            )}

            {file && appState !== "upload" && (
              <ImagePreview
                file={file}
                onReplace={handleReplace}
                disabled={appState === "analyzing"}
              />
            )}

            {/* Consent + Analyze (only when file ready, before results) */}
            {(appState === "ready" || appState === "analyzing") && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    disabled={appState === "analyzing"}
                  />
                  <Label
                    htmlFor="consent"
                    className="text-sm leading-relaxed text-foreground cursor-pointer"
                  >
                    {"Je comprends que ceci n\u2019est pas un diagnostic m\u00e9dical et que les r\u00e9sultats sont purement indicatifs."}
                  </Label>
                </div>

                <AnalyzeButton
                  onClick={handleAnalyze}
                  loading={appState === "analyzing"}
                  disabled={!canAnalyze}
                />

                {appState === "analyzing" && (
                  <p className="text-center text-sm text-muted-foreground">
                    {"Analyse en cours\u2026 cela peut prendre quelques secondes"}
                  </p>
                )}
              </div>
            )}

            {/* Loading skeleton */}
            {appState === "analyzing" && <AnalysisSkeleton />}

            {/* Results */}
            {appState === "results" && result && (
              <div className="flex flex-col gap-4">
                <ResultCard result={result} />
                <ExplainabilityPanel result={result} />

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => window.print()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exporter le rapport
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleNewAnalysis}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Nouvelle analyse
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-2xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          <p>
            {"JRscan \u2014 Outil de d\u00e9monstration pour la recherche. Ne constitue pas un dispositif m\u00e9dical."}
          </p>
        </div>
      </footer>
    </div>
  )
}
