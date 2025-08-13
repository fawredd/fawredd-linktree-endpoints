import { fetchProfileBySlug } from "@/actions/dbActions";
import HeroSection from "@/components/hero";
import { notFound } from "next/navigation";

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{profileSlug: string}>;
}>) {
  const { profileSlug } = await params;
  if (!profileSlug) notFound();
  const profile = await fetchProfileBySlug(profileSlug);
  if (!profile) notFound();

  return (
    <>
      <HeroSection
        backgroundImage={profile.hero_image_url || "/placeholder.svg"}
        profileImage={profile.profile_image_url || "/placeholder.svg"}
        profileName={profile.name || "Profile"}
      />
      {children}
    </>
  );
}
