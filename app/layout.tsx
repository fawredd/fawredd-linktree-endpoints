import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import '@fontsource/twinkle-star';
import "./globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "fawredd endpoints websites",
    template: "%s | fawredd"
  },
  description: "Your endpoints descriptions",
  generator: "fawredd",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Fawredd Linktree Endpoints",
  },
  verification:{
    google: process.env.GOOGLE_SITE_VERIFICATION,
  }
}

import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <head>
          <style>{`
            html {
              font-family: ${GeistSans.style.fontFamily};
              --font-sans: ${GeistSans.variable};
              --font-mono: ${GeistMono.variable};
            }
          `}</style>
        </head>
        <body className="font-sans antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
