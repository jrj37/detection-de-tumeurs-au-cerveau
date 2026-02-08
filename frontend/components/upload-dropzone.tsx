"use client"

import React from "react"

import { useCallback, useRef, useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void
  onError: (message: string) => void
  disabled?: boolean
}

export function UploadDropzone({
  onFileSelected,
  onError,
  disabled = false,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSelect = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        onError(
          "Format non support\u00e9. Veuillez utiliser une image JPG, PNG ou WebP."
        )
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        onError(
          `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). La taille maximale est de ${MAX_SIZE_MB} Mo.`
        )
        return
      }
      onFileSelected(file)
    },
    [onFileSelected, onError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) validateAndSelect(file)
    },
    [disabled, validateAndSelect]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragOver(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) validateAndSelect(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [validateAndSelect]
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-200 sm:p-12",
        isDragOver && !disabled
          ? "border-primary bg-accent/60 scale-[1.01]"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/30",
        disabled && "pointer-events-none opacity-50"
      )}
      role="button"
      tabIndex={0}
      aria-label={"Zone de d\u00e9p\u00f4t d\u2019image"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="sr-only"
        onChange={handleFileChange}
        disabled={disabled}
        aria-label="Choisir un fichier image"
      />

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
        {isDragOver ? (
          <ImageIcon className="h-7 w-7 text-primary" />
        ) : (
          <Upload className="h-7 w-7 text-primary" />
        )}
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-base font-medium text-foreground">
          {isDragOver
            ? "Rel\u00e2chez pour importer"
            : "Glissez-d\u00e9posez votre image ici"}
        </p>
        <p className="text-sm text-muted-foreground">
          {"JPG, PNG ou WebP \u2014 max 10 Mo"}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Parcourir
      </Button>
    </div>
  )
}
