import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Profile {
  id: number
  clerk_id: string | null
  slug: string
  name: string
  title: string | null
  description: string | null
  profile_image_url: string | null
  hero_image_url: string | null
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
  sortOrder: number
  is_active: boolean
  created_at: string
  updated_at: string
  profileId: number
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

export async function getAllProfiles(clerkId?: string): Promise<Profile[]> {
  try {
    const result = clerkId
      ? await sql`
          SELECT * FROM profiles 
          WHERE clerk_id = ${clerkId} AND is_active = true
          ORDER BY created_at DESC
        `
      : await sql`
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

export async function getServiceByProfileIdAndSlug(profileId: number, serviceSlug: string): Promise<Service | null> {
  try {
    const result = await sql`
      SELECT * FROM services 
      WHERE "profileId" = ${profileId} AND is_active = true AND slug = ${serviceSlug}
    `
    return (result[0] as Service) || null
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}

export async function getAllServicesByProfileId(profileId: number): Promise<Service[]> {
  try {
    const result = await sql`
      SELECT * FROM services 
      WHERE is_active = true and "profileId" = ${profileId}
      ORDER BY "sortOrder" ASC
    `
    return result as Service[] | []
  } catch (error) {
    console.error("Error fetching all services:", error)
    return []
  }
}

export async function updateProfile(id: number, data: Partial<Profile>, clerkId: string): Promise<boolean> {
  try {
    // Basic implementation of dynamic update
    const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'clerk_id' && k !== 'created_at');
    if (fields.length === 0) return true;

    const setClause = fields.map(f => `"${f}" = ${JSON.stringify(data[f as keyof Partial<Profile>])}`).join(', ');

    // Using simple approach since we don't have a query builder
    await sql.unsafe(`
      UPDATE profiles 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND clerk_id = '${clerkId}'
    `);

    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}

export async function addService(profileId: number, data: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'profileId'>): Promise<boolean> {
  try {
    await sql`
      INSERT INTO services (slug, title, description, hero_image, "profileId", "sortOrder", is_active)
      VALUES (${data.slug}, ${data.title}, ${data.description}, ${data.hero_image}, ${profileId}, ${data.sortOrder}, true)
    `;
    return true;
  } catch (error) {
    console.error("Error adding service:", error);
    return false;
  }
}

export async function deleteService(id: number, profileId: number): Promise<boolean> {
  try {
    await sql`
      UPDATE services SET is_active = false WHERE id = ${id} AND "profileId" = ${profileId}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    return false;
  }
}

export async function updateService(id: number, profileId: number, data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at' | 'profileId'>>): Promise<boolean> {
  try {
    const fields = Object.keys(data);
    if (fields.length === 0) return true;

    const setClause = fields.map(f => `"${f}" = ${JSON.stringify(data[f as keyof Partial<Omit<Service, 'id' | 'created_at' | 'updated_at' | 'profileId'>>])}`).join(', ');

    await sql.unsafe(`
      UPDATE services 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND "profileId" = ${profileId}
    `);
    return true;
  } catch (error) {
    console.error("Error updating service:", error);
    return false;
  }
}

export async function reorderServices(profileId: number, items: { id: number, sortOrder: number }[]): Promise<boolean> {
  try {
    // We update each item's sort order. Ideally this should be a transaction.
    for (const item of items) {
      await sql`
        UPDATE services 
        SET "sortOrder" = ${item.sortOrder}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${item.id} AND "profileId" = ${profileId}
      `;
    }
    return true;
  } catch (error) {
    console.error("Error reordering services:", error);
    return false;
  }
}

export async function addSocialLink(profileId: number, platform: string, url: string): Promise<boolean> {
  try {
    const nextOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order FROM social_links WHERE profile_id = ${profileId}`;
    const sortOrder = (nextOrder[0] as { next_order: number }).next_order;

    await sql`
      INSERT INTO social_links (profile_id, platform, url, sort_order, is_active)
      VALUES (${profileId}, ${platform}, ${url}, ${sortOrder}, true)
    `;
    return true;
  } catch (error) {
    console.error("Error adding social link:", error);
    return false;
  }
}

export async function updateSocialLink(id: number, profileId: number, data: Partial<Omit<SocialLink, 'id' | 'profile_id' | 'created_at'>>): Promise<boolean> {
  try {
    const fields = Object.keys(data);
    if (fields.length === 0) return true;

    const setClause = fields.map(f => `"${f}" = ${JSON.stringify(data[f as keyof Partial<Omit<SocialLink, 'id' | 'profile_id' | 'created_at'>>])}`).join(', ');

    await sql.unsafe(`
      UPDATE social_links 
      SET ${setClause}
      WHERE id = ${id} AND profile_id = ${profileId}
    `);
    return true;
  } catch (error) {
    console.error("Error updating social link:", error);
    return false;
  }
}

export async function deleteSocialLink(id: number, profileId: number): Promise<boolean> {
  try {
    await sql`
      UPDATE social_links SET is_active = false WHERE id = ${id} AND profile_id = ${profileId}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting social link:", error);
    return false;
  }
}

