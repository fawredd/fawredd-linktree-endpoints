import { Instagram, Youtube, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

interface SocialLink {
  platform: string
  url: string
}

interface SocialLinksProps {
  socialLinks: SocialLink[]
}

const SocialLinks = ({ socialLinks }: SocialLinksProps) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-6 h-6" />
      case "youtube":
        return <Youtube className="w-6 h-6" />
      case "tiktok":
        return <TikTokIcon />
      case "email":
        return <Mail className="w-6 h-6" />
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center gap-4 mt-6">
      {socialLinks.map((link, index) => (
        <Button
          key={index}
          variant="ghost"
          size="lg"
          className="w-12 h-12 rounded-full bg-amber-800/10 hover:bg-amber-800/20 text-amber-800 p-0"
          asChild
        >
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {getIcon(link.platform)}
          </a>
        </Button>
      ))}
    </div>
  )
}

export default SocialLinks
