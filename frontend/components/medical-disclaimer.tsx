"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

interface MedicalDisclaimerProps {
  open: boolean
  onClose: () => void
}

export function MedicalDisclaimer({ open, onClose }: MedicalDisclaimerProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <ShieldAlert className="h-6 w-6 text-accent-foreground" />
          </div>
          <DialogTitle className="text-center text-xl">
            Avertissement {"m\u00e9dical"}
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            {"Cet outil est un d\u00e9monstrateur de recherche destin\u00e9 \u00e0 des fins \u00e9ducatives et exp\u00e9rimentales. Il ne constitue en aucun cas un dispositif m\u00e9dical certifi\u00e9."}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-accent/50 p-4 text-sm leading-relaxed text-foreground">
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {"Les r\u00e9sultats affich\u00e9s sont des estimations algorithmiques, pas des diagnostics."}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {"Consultez toujours un professionnel de sant\u00e9 qualifi\u00e9 pour toute question m\u00e9dicale."}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {"Ne prenez aucune d\u00e9cision m\u00e9dicale sur la seule base de cet outil."}
            </li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto">
            {"J\u2019ai compris"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
