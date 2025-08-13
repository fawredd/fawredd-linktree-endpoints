import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-stone-200 rounded-full flex items-center justify-center">
          <div className="text-4xl text-stone-400">?</div>
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Sitio No Encontrado</h1>

        <Button asChild>
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  )
}
