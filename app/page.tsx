import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { getAllServices } from "@/lib/database"

export default async function HomePage() {
  const services = await getAllServices()

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Servicios Profesionales</h1>
            <p className="text-stone-600">Descubre nuestros servicios especializados</p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center">
                <div className="text-2xl text-stone-400">🔧</div>
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">No hay servicios disponibles</h2>
              <p className="text-stone-600">Pronto tendremos servicios increíbles para ti!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Servicios Disponibles</h2>
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/${service.slug}`} className="block">
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-800/20">
                            <Image
                              src={service.hero_image || "/placeholder.svg?height=64&width=64&query=service icon"}
                              alt={`${service.title} service`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-amber-900 truncate">{service.title}</h3>
                          <p className="text-sm text-stone-600 truncate">/{service.slug}</p>
                          {service.description && (
                            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{service.description}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <ExternalLink className="w-5 h-5 text-amber-800" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="font-semibold text-amber-900 mb-2">¿Necesitas nuestros servicios?</h3>
              <p className="text-sm text-amber-800 mb-4">
                Contáctanos para conocer más sobre nuestros servicios profesionales y cómo podemos ayudarte a alcanzar
                tus objetivos.
              </p>
              <Button
                variant="outline"
                className="border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white bg-transparent"
              >
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
