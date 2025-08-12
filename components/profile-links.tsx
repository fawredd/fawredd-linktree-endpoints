import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Mail } from "lucide-react"
import type { ProfileLink } from "@/lib/database"

interface ProfileLinksProps {
  links: ProfileLink[]
}

const ProfileLinks = ({ links }: ProfileLinksProps) => {
  if (links.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Card key={link.id} className="p-0 overflow-hidden">
          <Button variant="ghost" className="w-full h-auto p-4 justify-start text-left hover:bg-amber-50" asChild>
            <a
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : "_self"}
              rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  <div className="font-medium text-amber-900 mb-1">{link.title}</div>
                  {link.description && <div className="text-sm text-gray-600">{link.description}</div>}
                </div>
                <div className="ml-4 text-amber-800">
                  {link.url.startsWith("mailto:") ? <Mail className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                </div>
              </div>
            </a>
          </Button>
        </Card>
      ))}
    </div>
  )
}

export default ProfileLinks
