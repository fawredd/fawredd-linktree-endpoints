import { Card } from "@/components/ui/card"
import { Mail } from "lucide-react"

interface NewsletterCardProps {
  title?: string
  subtitle?: string
  description?: string
  onSubscribe?: () => void
}

const NewsletterCard = ({
  title = "Suscríbete gratis",
  subtitle = "a mi Newsletter",
  description = "y entérate primero de todos mis anuncios",
  onSubscribe,
}: NewsletterCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-amber-200 to-amber-300 border-0 shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-amber-900" />
            </div>
          </div>
          <div className="flex-1 text-left">
            <div className="text-white font-medium text-lg leading-tight">{title}</div>
            <div className="text-white font-medium text-lg leading-tight">{subtitle}</div>
            <div className="text-white/90 text-sm mt-1 leading-relaxed">{description}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NewsletterCard
