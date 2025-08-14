import HeroSection from "@/components/hero";

export default async function HomePage() {
  return (
    <>
      <HeroSection
        backgroundImage="/heroImage.jpg"
        profileImage="/fawreddProfileImage.jpeg"
        profileName="fawredd"
      />
      <div className="container mx-auto">
        <div className="m-4 relative">
          <div className="mx-auto p-3">
            <h1 className="text-center text-2xl font-bold mb-6">
              fawredd linktr.ee endpoints
            </h1>
            <div className="text-justify  text-white">
               This Next.js application allows you to easily create and manage a single, centralized landing page for all your important links
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
