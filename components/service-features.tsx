import type { ServiceFeature } from "@/lib/database"
import { Card } from "@/components/ui/card"
import { Mail, KeyIcon as Strategy, TrendingUp, Settings } from "lucide-react"

interface ServiceFeaturesProps {
  features: ServiceFeature[]
}

const getFeatureIcon = (iconName: string | null) => {
  switch (iconName) {
    case "newsletter":
      return <Mail className="w-6 h-6" />
    case "strategy":
      return <Strategy className="w-6 h-6" />
    case "market":
      return <TrendingUp className="w-6 h-6" />
    case "process":
      return <Settings className="w-6 h-6" />
    default:
      return <Settings className="w-6 h-6" />
  }
}

export default function ServiceFeatures({ features }: ServiceFeaturesProps) {
  // Separate newsletter features from regular features
  const newsletterFeatures = features.filter((f) => f.icon === "newsletter")
  const regularFeatures = features.filter((f) => f.icon !== "newsletter")

  return (
    <div className="space-y-6">
      {/* Newsletter features as special cards */}
      {newsletterFeatures.map((feature) => (
        <Card
          key={feature.id}
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-3xl shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">{getFeatureIcon(feature.icon)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
              {feature.description && <p className="text-white/90 text-sm leading-relaxed">{feature.description}</p>}
            </div>
          </div>
        </Card>
      ))}

      {/* Regular service features */}
      {regularFeatures.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-amber-800 text-center mb-6 tracking-wider">SERVICIOS</h2>
          <div className="space-y-4">
            {regularFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-stone-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-amber-600">{getFeatureIcon(feature.icon)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800 mb-1">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-stone-600 text-sm leading-relaxed">{feature.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
