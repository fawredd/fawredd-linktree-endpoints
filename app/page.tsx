import HeroSection from "@/components/hero";

export default async function HomePage() {
  return (
    <>
      <HeroSection
        backgroundImage="/public/heroImage.jpg"
        profileImage="/public/fawreddProfileImage.jpeg"
        profileName="fawredd"
      />
      <div className="container mx-auto">
        <div className="m-4 relative">
          <div className="mx-auto p-3 text-white">
            <h1 className="text-center text-3xl font-bold mb-6">
              fawredd linktr.ee endpoints
            </h1>
            <div className="text-justify">
              Create your own linktr.ee endpoints websites with this Next.js
              app.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
