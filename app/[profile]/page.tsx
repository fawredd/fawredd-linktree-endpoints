'use client'
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { TheContext } from "@/components/context-provider";

export default  function HomePage() {
  const context = useContext(TheContext);
  useEffect(() => {
    if (!context) {
      throw new Error('HomePage debe ser usado dentro de un GeneralContext');
    }
      context.setHeroImageURL('/heroMgdBackground.jpg1')
      context.setLogoImageUrl('/Logo-MGD-PNG-transparente.png')
  }, [context]);

  const router = useRouter();
  const profile = router.query.profile?.toString()
  if (!profile) return notFound();
  const cleanProfile = sanitizeSlug(profile);
  // HERE I SHOULD CHECK IF THE PROFILE EXISTS IN THE DATABASE and fetch profile data
  // if( !profileExists(cleanProfile)) return notFound();


  const {titulo, descripcion} = {titulo:`Welcome to \n${cleanProfile}\n homepage`,descripcion:''}

  return (
  <div className="container mx-auto">
    <div className="m-4 relative">
      <div className="mx-auto p-3 text-white">
        <h1 className="text-center text-3xl font-bold mb-6 whitespace-pre-wrap">{titulo}</h1>
        <div className="text-justify whitespace-pre-wrap">
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

