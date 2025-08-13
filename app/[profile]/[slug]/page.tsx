import {notFound} from "next/navigation";
import { descripciones } from "@/assets/descriptions";

interface HomePageProps {
  params: Promise<{ slug: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { slug } = await params;
  const cleanSlug = sanitizeSlug(slug);
  console.log(slug, cleanSlug)
  const {titulo, descripcion} = descripciones[cleanSlug] || {titulo:'',descripcion:''}
  if (!titulo) return notFound()
  return (
  <div className="container mx-auto">
    <div className="m-4 relative">
      <div className="mx-auto p-3 text-white">
        <h1 className="text-center text-3xl font-bold mb-6">{titulo}</h1>
        <div className="text-justify">
          {descripcion}
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

