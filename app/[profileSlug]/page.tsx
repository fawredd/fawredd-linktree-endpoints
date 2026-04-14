import { notFound } from "next/navigation";
import Link from "next/link";
import {
  fetchProfileBySlug,
  fetchServicesByProfileId,
  fetchSocialLinksByProfileId,
} from "@/actions/dbActions";

import type { Metadata } from "next";
import SocialLinks from "@/components/social-links";

type Props = {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profileSlug } = await params;
  if (!profileSlug) return { title: "Not Found" };

  const cleanProfileSlug = sanitizeSlug(profileSlug);
  const profile = await fetchProfileBySlug(cleanProfileSlug);

  if (!profile) return { title: "Not Found" };

  return {
    title: profile.title || `${profileSlug} home page`,
    description:
      profile.description ||
      `Welcome to the link page for ${profile.title || profileSlug}`,
    openGraph: {
      title: profile.title || `${profileSlug} home page`,
      description:
        profile.description ||
        `Welcome to the link page for ${profile.title || profileSlug}`,
      url: `/${cleanProfileSlug}`,
      type: "profile",
      images: profile.profile_image_url
        ? [
            {
              url: profile.profile_image_url,
              width: 800,
              height: 600,
              alt: `Profile image for ${profile.title || profileSlug}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.title || `${profileSlug} home page`,
      description:
        profile.description ||
        `Welcome to the link page for ${profile.title || profileSlug}`,
      images: profile.profile_image_url ? [profile.profile_image_url] : [],
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

interface HomePageProps {
  params: Promise<{ profileSlug: string }>;
}
export default async function HomePage({ params }: HomePageProps) {
  const { profileSlug } = await params;
  if (!profileSlug) return notFound();
  const cleanProfileSlug = sanitizeSlug(profileSlug);
  const profile = await fetchProfileBySlug(cleanProfileSlug);
  if (!profile) return notFound();
  const services = await fetchServicesByProfileId(profile.id);
  const socialLinks = await fetchSocialLinksByProfileId(profile.id);

  const { titulo, descripcion } = {
    titulo: profile.title,
    descripcion: profile.description,
  };
  const borderColor = profile.border_color || "#6366f1";
  const fontColor = profile.font_color || "#ffffff";

  return (
    <div className="container mx-auto">
      <div className="m-4 relative">
        <div className="mx-auto p-3">
          <div
            className="mx-auto m-4 p-2 whitespace-pre-wrap border rounded-lg"
            style={{ borderColor }}
          >
            <h1 className="text-center p-2 text-3x1 md:text-4xl font-bold whitespace-pre-wrap">
              {titulo}
            </h1>
            <p className="mx-auto p-4 text-center md:text-2xl mb-2">
              {descripcion}
            </p>
          </div>
          <div className="text-justify whitespace-pre-wrap">
            {services && (
              <ul key="servicesList">
                {services.map((element, elementIndex) => (
                  <Link
                    key={`servicesListLink${elementIndex}`}
                    href={`/${profile.slug}/${element.slug}`}
                  >
                    <li
                      key={`serviceElement${elementIndex}`}
                      className="m-4 py-3 px-2 text-center rounded-md border-2 hover:opacity-80 transition-opacity"
                      style={{ borderColor, color: fontColor }}
                    >
                      <span className="font-medium">
                        {element.title.trim()}
                      </span>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
          <SocialLinks socialLinks={socialLinks} />
        </div>
      </div>
    </div>
  );
}

function sanitizeSlug(paramSlug: string | undefined): string {
  if (!paramSlug) {
    return ""; // Handle empty or undefined input
  }
  const decodedSlug = decodeURIComponent(paramSlug);
  const lowercasedSlug = decodedSlug.toLowerCase();
  const sanitizedSlug = lowercasedSlug
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return sanitizedSlug;
}
