import { MetadataRoute } from 'next'
import { fetchAllProfiles } from '@/actions/dbActions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  try {
    const profiles = await fetchAllProfiles()
    
    const profileUrls = profiles.map((profile: { slug: string }) => ({
      url: `${baseUrl}/${profile.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      ...profileUrls,
    ]
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      }
    ]
  }
}
