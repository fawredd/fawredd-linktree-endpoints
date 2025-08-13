import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Profile {
  id: number
  slug: string
  name: string
  description: string | null
  profile_image_url: string | null
  background_image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: number
  profile_id: number
  platform: string
  url: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Service {
  id: number
  slug: string
  title: string
  description: string | null
  hero_image: string | null
  background_image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  profileId: string
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    const result = await sql`
      SELECT * FROM profiles 
      WHERE slug = ${slug} AND is_active = true
      LIMIT 1
    `
    return (result[0] as Profile) || null
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

export async function getSocialLinks(profileId: number): Promise<SocialLink[]> {
  try {
    const result = await sql`
      SELECT * FROM social_links 
      WHERE profile_id = ${profileId} AND is_active = true
      ORDER BY sort_order ASC, created_at ASC
    `
    return result as SocialLink[]
  } catch (error) {
    console.error("Error fetching social links:", error)
    return []
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const result = await sql`
      SELECT * FROM profiles 
      WHERE is_active = true
      ORDER BY created_at DESC
    `
    return result as Profile[]
  } catch (error) {
    console.error("Error fetching all profiles:", error)
    return []
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const result = await sql`
      SELECT * FROM services 
      WHERE slug = ${slug} AND is_active = true
      LIMIT 1
    `
    return (result[0] as Service) || null
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const result = await sql`
      SELECT * FROM services 
      WHERE is_active = true
      ORDER BY created_at DESC
    `
    return result as Service[]
  } catch (error) {
    console.error("Error fetching all services:", error)
    return []
  }
}
