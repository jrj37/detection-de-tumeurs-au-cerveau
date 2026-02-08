import Link from "next/link"
import { ArrowLeft, Shield, Database, Eye, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Confidentialit\u00e9 - JRscan",
  description:
    "Politique de confidentialit\u00e9 de JRscan, outil de classification d\u2019images de tumeurs.",
}

const sections = [
  {
    icon: Database,
    title: "Aucun stockage par d\u00e9faut",
    content:
      "Les images que vous importez sont trait\u00e9es localement dans votre navigateur ou envoy\u00e9es de mani\u00e8re temporaire au serveur d\u2019analyse. Elles ne sont pas stock\u00e9es de mani\u00e8re permanente sur nos serveurs, sauf si vous en faites explicitement la demande.",
  },
  {
    icon: Eye,
    title: "Aucune donn\u00e9e personnelle collect\u00e9e",
    content:
      "Nous ne demandons aucune information personnelle (nom, adresse, num\u00e9ro de t\u00e9l\u00e9phone) pour utiliser cet outil. Aucun cookie de suivi publicitaire n\u2019est utilis\u00e9.",
  },
  {
    icon: Shield,
    title: "S\u00e9curit\u00e9 des donn\u00e9es",
    content:
      "Les communications entre votre navigateur et nos serveurs sont chiffr\u00e9es via HTTPS. Les r\u00e9sultats d\u2019analyse ne sont pas partag\u00e9s avec des tiers.",
  },
]

export default function ConfidentialitePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4 sm:px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
              {"Politique de confidentialit\u00e9"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {"Nous prenons la protection de vos donn\u00e9es au s\u00e9rieux. Voici comment nous traitons les informations dans JRscan."}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.title}>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        {section.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {section.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Contact */}
          <div className="mt-8 rounded-lg border bg-card p-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Contact
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {"Pour toute question relative \u00e0 la confidentialit\u00e9 de vos donn\u00e9es, vous pouvez nous contacter \u00e0 :"}
                </p>
                <a
                  href="mailto:contact@jrscan-demo.fr"
                  className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                >
                  contact@jrscan-demo.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-muted-foreground sm:px-6">
            <p>
            {"JRscan \u2014 Outil de d\u00e9monstration pour la recherche. Ne constitue pas un dispositif m\u00e9dical."}
          </p>
        </div>
      </footer>
    </div>
  )
}
