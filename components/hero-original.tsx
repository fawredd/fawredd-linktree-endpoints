import Image from "next/image"

const HeroSection = () => {
  return (
    <div className="relative w-full h-80 bg-gray-200">
      {/* Fondo de la sección Hero */}
      <Image
        src="/path/to/your/hero-image.jpg" // Reemplaza con la ruta de tu imagen de fondo
        alt="Hero background"
        layout="fill"
        objectFit="cover"
        className="rounded-b-2xl"
      />

      {/* Superposición para el efecto borroso/oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-2xl"></div>

      {/* Círculo de la foto de perfil que se superpone */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
        <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg">
          {/* Aquí puedes colocar la imagen de perfil */}
          <Image
            src="/path/to/your/profile-image.jpg" // Reemplaza con la ruta de tu foto de perfil
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
