"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Info, Lightbulb } from "lucide-react"
import type { AnalysisResult } from "@/lib/mock-results"

interface ExplainabilityPanelProps {
  result: AnalysisResult
}

export function ExplainabilityPanel({ result }: ExplainabilityPanelProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
      <CardContent className="pt-6">
        <Tabs defaultValue="resume">
          <TabsList className="w-full">
            <TabsTrigger value="resume" className="flex-1">
              {"R\u00e9sum\u00e9"}
            </TabsTrigger>
            <TabsTrigger value="conseils" className="flex-1">
              Conseils
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-4">
            <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground">
                {result.summary}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="conseils" className="mt-4">
            <ul className="flex flex-col gap-3">
              {result.advice.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3 text-sm"
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="interpret" className="border-b-0">
              <AccordionTrigger className="text-sm text-primary hover:no-underline">
                {"Comment interpr\u00e9ter ces r\u00e9sultats\u00a0?"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    {"Le pourcentage affich\u00e9 repr\u00e9sente la probabilit\u00e9 estim\u00e9e par le mod\u00e8le d\u2019IA pour chaque type de tumeur. Ce n\u2019est pas une certitude m\u00e9dicale."}
                  </p>
                  <p>
                    {"Un score \u00e9lev\u00e9 (> 70%) indique une forte confiance du mod\u00e8le, mais ne remplace jamais l\u2019expertise d\u2019un radiologue ou d\u2019un oncologue."}
                  </p>
                  <p>
                    {"Un score faible (< 50%) signifie que le mod\u00e8le h\u00e9site entre plusieurs types. Dans ce cas, le r\u00e9sultat est marqu\u00e9 comme \u00ab\u00a0incertain\u00a0\u00bb et une consultation sp\u00e9cialis\u00e9e est fortement recommand\u00e9e."}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
