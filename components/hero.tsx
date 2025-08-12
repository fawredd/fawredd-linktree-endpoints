import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, Share } from "lucide-react"

interface HeroSectionProps {
  backgroundImage?: string
  profileImage?: string
  profileName?: string
}

const HeroSection = ({
  backgroundImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/baseLayout-dWWCDxrbCBH1OZZynhhmicJ5d4UKsI.jpeg",
  profileImage = "/diverse-group-profile.png",
  profileName = "Profile",
}: HeroSectionProps) => {
  return (
    <div className="relative w-full h-80 bg-gray-200">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white/95 rounded-full px-4 py-2"
        >
          <Bell className="w-4 h-4 mr-2" />
          Subscribe
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white/95 rounded-full p-2"
        >
          <Share className="w-4 h-4" />
        </Button>
      </div>

      <Image
        src={backgroundImage || "/placeholder.svg"}
        alt="Hero background"
        fill
        className="object-cover rounded-b-2xl"
        priority
      />

      <div className="absolute inset-0 bg-black/40 rounded-b-2xl"></div>

      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 z-10">
        <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-amber-800">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={`${profileName} profile picture`}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
