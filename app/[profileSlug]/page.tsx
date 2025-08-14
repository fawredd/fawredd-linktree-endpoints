import { notFound } from "next/navigation";
import Link from 'next/link'
import {fetchProfileBySlug,fetchServicesByProfileId} from "@/actions/dbActions";

interface HomePageProps {
  params: Promise<{ profileSlug:string}>
}
export default async  function HomePage({ params }: HomePageProps) {
  const {profileSlug} = await params
  if (!profileSlug) return notFound();
  const cleanProfileSlug = sanitizeSlug(profileSlug);
  const profile = await fetchProfileBySlug(cleanProfileSlug)
  if (!profile) return notFound();
  const services = await fetchServicesByProfileId(profile.id);

  const {titulo, descripcion} = {titulo:`Welcome to \n${profile.name}`,descripcion:profile.description}

  return (
  <div className="container mx-auto">
    <div className="m-4 relative">
      <div className="mx-auto p-3">
        <h1 className="text-center text-2xl font-bold mb-6 whitespace-pre-wrap">{titulo}</h1>
        <div className="text-justify whitespace-pre-wrap">
          {descripcion}
          {services &&
            <ul key="servicesList">
            {services.map(
              (element,elementIndex)=>(
              <Link key={`servicesListLink${elementIndex}`} href={`/${profile.slug}/${element.slug}`} >
                <li key={`serviceElement${elementIndex}`} className='m-4 py-1 px-2 text-center border bg-black opacity-40 rounded-md'>
                  <span className='text-white'>{element.title.trim()}</span>
                </li>
              </Link>
              ))}
            </ul>
          }
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