"use client"

import { useEffect, useState } from "react"
import { RefreshCw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  file: File
  onReplace: () => void
  disabled?: boolean
}

export function ImagePreview({ file, onReplace, disabled }: ImagePreviewProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  if (!url) return null

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card transition-all duration-300",
          zoomed ? "max-h-[500px]" : "max-h-[280px]"
        )}
      >
        <img
          src={url || "/placeholder.svg"}
          alt={"Image import\u00e9e pour analyse"}
          className={cn(
            "mx-auto block h-full w-full object-contain transition-transform duration-300",
            zoomed ? "scale-110" : "scale-100"
          )}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="truncate text-sm text-muted-foreground">
          {file.name}{" "}
          <span className="text-xs">
            ({(file.size / 1024 / 1024).toFixed(2)} Mo)
          </span>
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Zoom arri\u00e8re" : "Zoom avant"}
          >
            {zoomed ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReplace}
            disabled={disabled}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Remplacer
          </Button>
        </div>
      </div>
    </div>
  )
}
