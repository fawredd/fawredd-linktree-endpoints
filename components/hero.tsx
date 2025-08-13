import Image from "next/image"

const HeroSection = () => {
  return (
    <div className="relative w-full h-40 border-b-2 mb-8 md:mb-28">
      {/* Fondo de la sección Hero */}
      <Image
        src="/heroBackground.jpg"
        alt="Hero background"
        layout="fill"
        objectFit="cover"
      />

      {/* Superposición para el efecto borroso/oscuro */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Círculo de la foto de perfil que se superpone */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 md:-bottom-16">
        <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-lg">
          {/* Aquí puedes colocar la imagen de perfil */}
          <Image
            src="/Logo-MGD-PNG-transparente.png" // Reemplaza con la ruta de tu foto de perfil
            alt="Profile picture"
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
