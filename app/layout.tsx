import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import '@fontsource/twinkle-star';
import "./globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "fawredd linktr.ee endpoints websites",
  description: "Crea los enlaces de asociados a linktr.ee",
  generator: "fawredd",
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
