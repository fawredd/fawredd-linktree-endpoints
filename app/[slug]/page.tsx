import { notFound } from "next/navigation"
import type { Metadata } from "next"
import HeroSection from "@/components/hero"
import ServiceFeatures from "@/components/service-features"
import { getServiceBySlug, getServiceFeatures } from "@/lib/database"

interface ServicePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    return {
      title: "Servicio No Encontrado",
      description: "El servicio solicitado no pudo ser encontrado.",
    }
  }

  return {
    title: service.title,
    description: service.description || `${service.title} - Servicios profesionales`,
    openGraph: {
      title: service.title,
      description: service.description || `${service.title} - Servicios profesionales`,
      images: service.hero_image ? [service.hero_image] : [],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  const features = await getServiceFeatures(service.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <HeroSection
        backgroundImage={service.background_image || undefined}
        profileImage={service.hero_image || undefined}
        profileName={service.title}
      />

      <div className="px-4 pt-20 pb-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-2">{service.title}</h1>

          {service.description && <p className="text-stone-600 text-sm leading-relaxed mb-6">{service.description}</p>}

          {features.length > 0 && (
            <div className="mt-8">
              <ServiceFeatures features={features} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
