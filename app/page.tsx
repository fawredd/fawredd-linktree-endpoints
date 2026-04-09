import HeroSection from "@/components/hero";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <>
      <HeroSection
        backgroundImage="/heroImage.jpg"
        profileImage="/fawreddProfileImage.jpeg"
        profileName="fawredd"
      />
      <div className="container mx-auto">
        <div className="m-4 relative">
          <div className="mx-auto p-3 text-center">
            <h1 className="text-2xl font-bold mb-6 text-white">
              fawredd linktr.ee endpoints
            </h1>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              This Next.js application allows you to easily create and manage a single, centralized landing page for all your important links.
            </p>

            {userId ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400">
                  Go to your Dashboard
                </Button>
              </Link>
            ) : (
              <SignInButton mode="redirect">
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  Get Started - Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
