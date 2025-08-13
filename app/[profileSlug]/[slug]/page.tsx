import { notFound } from "next/navigation";
import {fetchProfileBySlug,fetchServiceByProfileIdAndSlug} from "@/actions/dbActions";

interface HomePageProps {
  params: Promise<{ profileSlug: string; slug: string }>;
}
export default async  function HomePage({ params }: HomePageProps) {
  const {profileSlug, slug} = await params
  if (!profileSlug) return notFound();
  const cleanProfileSlug = sanitizeSlug(profileSlug)
   
  const cleanServiceSlug = sanitizeSlug(slug)
  const profile = await fetchProfileBySlug(cleanProfileSlug)
  if (!profile) return notFound();
  const services = await fetchServiceByProfileIdAndSlug(profile.id, cleanServiceSlug);
  if (!services) notFound();

  return (
  <div className="container mx-auto">
    <div className="m-4 relative">
      <div className="mx-auto p-3 text-white">
        <h1 className="text-center text-3xl font-bold mb-6 whitespace-pre-wrap">{services.title}</h1>
        <div className="text-justify whitespace-pre-wrap">
          {services.description}
        </div>
      </div>
    </div>
  </div>
  )
}

function sanitizeSlug(paramSlug:string | undefined): string {
    if (!paramSlug) {
        return ''; // Handle empty or undefined input
    }
    const decodedSlug = decodeURIComponent(paramSlug);
    const lowercasedSlug = decodedSlug.toLowerCase();
    const sanitizedSlug = lowercasedSlug
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    return sanitizedSlug;
}

