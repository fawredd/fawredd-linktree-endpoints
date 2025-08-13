import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, Share } from "lucide-react"

interface HeroSectionProps {
  backgroundImage?: string
  profileImage?: string
  profileName?: string
}


const HeroSection =({
  backgroundImage = "/placeholder.svg",
  profileImage = "/placeholder.svg",
  profileName = "Profile",
}: HeroSectionProps) => {

  return (
    <div className="relative w-full h-40 border-b-2 mb-12 md:mb-28">
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
      {/* Fondo de la sección Hero */}
      <Image
        src={backgroundImage}
        alt={`${profileName} hero background`}
        className="object-cover w-full h-full"
        width={400}
        height={96}
      />

      {/* Superposición para el efecto borroso/oscuro */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Círculo de la foto de perfil que se superpone */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 md:-bottom-16">
        <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-lg">
          {/* Aquí puedes colocar la imagen de perfil */}
          <Image
            src={profileImage}
            alt={`${profileName} picture`}
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
