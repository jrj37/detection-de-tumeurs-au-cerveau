export interface PredictionResult {
  label: string
  confidence: number
  percentage?: number
}

export interface AnalysisResult {
  id: string
  timestamp: string
  mainLabel: string
  mainConfidence: number
  mainPercentage?: number
  top3: PredictionResult[]
  allClasses?: PredictionResult[]
  isUncertain: boolean
  summary: string
  advice: string[]
}

export const mockResults: AnalysisResult[] = [
  {
    id: "result-001",
    timestamp: new Date().toISOString(),
    mainLabel: "Meningiome",
    mainConfidence: 0.62,
    top3: [
      { label: "Meningiome", confidence: 0.62 },
      { label: "Gliome", confidence: 0.28 },
      { label: "Adenome hypophysaire", confidence: 0.10 },
    ],
    isUncertain: false,
    summary:
      "Le modele estime avec une probabilite de 62% qu'il s'agit d'un meningiome. Ce resultat est indicatif et ne constitue pas un diagnostic medical.",
    advice: [
      "Consultez un neuroradiologue pour une interpretation professionnelle.",
      "Ce resultat ne prend pas en compte votre historique medical.",
      "Une IRM complementaire peut etre necessaire pour confirmer.",
    ],
  },
  {
    id: "result-002",
    timestamp: new Date().toISOString(),
    mainLabel: "Gliome",
    mainConfidence: 0.85,
    top3: [
      { label: "Gliome", confidence: 0.85 },
      { label: "Meningiome", confidence: 0.10 },
      { label: "Adenome hypophysaire", confidence: 0.05 },
    ],
    isUncertain: false,
    summary:
      "Le modele estime avec une probabilite de 85% qu'il s'agit d'un gliome. Ce resultat est indicatif et ne constitue pas un diagnostic medical.",
    advice: [
      "Consultez un neuroradiologue pour une interpretation professionnelle.",
      "Ce resultat ne prend pas en compte votre historique medical.",
      "Des examens complementaires sont recommandes.",
    ],
  },
  {
    id: "result-003",
    timestamp: new Date().toISOString(),
    mainLabel: "Adenome hypophysaire",
    mainConfidence: 0.42,
    top3: [
      { label: "Adenome hypophysaire", confidence: 0.42 },
      { label: "Meningiome", confidence: 0.35 },
      { label: "Gliome", confidence: 0.23 },
    ],
    isUncertain: true,
    summary:
      "Le modele n'a pas pu determiner avec certitude le type de tumeur. La probabilite la plus elevee est de 42%, ce qui est insuffisant pour une estimation fiable.",
    advice: [
      "Le resultat est incertain : consultez imperativement un specialiste.",
      "L'image pourrait necessiter un recadrage ou une meilleure resolution.",
      "Une analyse complementaire par un professionnel est indispensable.",
    ],
  },
]

export function getRandomMockResult(): AnalysisResult {
  const index = Math.floor(Math.random() * mockResults.length)
  return {
    ...mockResults[index],
    id: `result-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
}
