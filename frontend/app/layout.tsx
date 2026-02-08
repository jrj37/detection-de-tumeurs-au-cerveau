import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JRscan - Classification d\'images de tumeurs',
  description: 'Outil de recherche pour la classification d\'images de tumeurs cerebrales par intelligence artificielle. Demonstration uniquement.',
}

export const viewport: Viewport = {
  themeColor: '#1a8a8a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
