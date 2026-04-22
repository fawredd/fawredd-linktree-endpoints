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
  background_color: string | null
  border_color: string | null
  font_color: string | null
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
  id: number;
  slug: string;
  title: string;
  description: string | null;
  hero_image: string | null;
  background_image: string | null;
  sort_order: number; // Cambiado de sortOrder
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile_id: number; // Cambiado de profileId
}

export interface ProfileManager {
  id: number
  profile_id: number
  email: string
  created_at: string
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    const result = await sql`
      SELECT * FROM fawredd_linktree.profiles 
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
      SELECT * FROM fawredd_linktree.social_links 
      WHERE profile_id = ${profileId} AND is_active = true
      ORDER BY sort_order ASC, created_at ASC
    `
    return result as SocialLink[]
  } catch (error) {
    console.error("Error fetching social links:", error)
    return []
  }
}

export async function getAllProfiles(clerkId?: string, email?: string): Promise<Profile[]> {
  try {
    const result = clerkId
      ? await sql`
          SELECT p.* FROM fawredd_linktree.profiles p
          LEFT JOIN fawredd_linktree.profile_managers pm ON p.id = pm.profile_id
          WHERE (p.clerk_id = ${clerkId} OR pm.email = ${email || ''})
          AND p.is_active = true
          GROUP BY p.id
          ORDER BY p.created_at DESC
        `
      : await sql`
          SELECT * FROM fawredd_linktree.profiles 
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
      SELECT * FROM fawredd_linktree.services 
      WHERE profile_id = ${profileId} AND is_active = true AND slug = ${serviceSlug}
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
      SELECT * FROM fawredd_linktree.services 
      WHERE is_active = true and profile_id = ${profileId}
      ORDER BY sort_order ASC
    `
    return result as Service[] | []
  } catch (error) {
    console.error("Error fetching all services:", error)
    return []
  }
}

export async function updateProfile(id: number, data: Partial<Profile>, clerkId: string, email?: string): Promise<boolean> {
  try {
    await sql`
      UPDATE fawredd_linktree.profiles 
      SET 
        name = CASE WHEN ${data.name !== undefined} THEN ${data.name} ELSE name END,
        title = CASE WHEN ${data.title !== undefined} THEN ${data.title} ELSE title END,
        description = CASE WHEN ${data.description !== undefined} THEN ${data.description} ELSE description END,
        slug = CASE WHEN ${data.slug !== undefined} THEN ${data.slug} ELSE slug END,
        profile_image_url = CASE WHEN ${data.profile_image_url !== undefined} THEN ${data.profile_image_url} ELSE profile_image_url END,
        hero_image_url = CASE WHEN ${data.hero_image_url !== undefined} THEN ${data.hero_image_url} ELSE hero_image_url END,
        background_color = CASE WHEN ${data.background_color !== undefined} THEN ${data.background_color} ELSE background_color END,
        border_color = CASE WHEN ${data.border_color !== undefined} THEN ${data.border_color} ELSE border_color END,
        font_color = CASE WHEN ${data.font_color !== undefined} THEN ${data.font_color} ELSE font_color END,
        is_active = CASE WHEN ${data.is_active !== undefined} THEN ${data.is_active} ELSE is_active END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND (clerk_id = ${clerkId} OR id IN (SELECT profile_id FROM fawredd_linktree.profile_managers WHERE email = ${email || ''}))
    `;
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}

export async function addService(profileId: number, data: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'profileId'>): Promise<boolean> {
  try {
    await sql`
      INSERT INTO fawredd_linktree.services (slug, title, description, hero_image, profile_id, sort_order, is_active)
      VALUES (${data.slug}, ${data.title}, ${data.description}, ${data.hero_image}, ${profileId}, ${data.sort_order}, true)
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
      UPDATE fawredd_linktree.services SET is_active = false WHERE id = ${id} AND profile_id = ${profileId}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    return false;
  }
}

export async function updateService(id: number, profileId: number, data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at' | 'profileId'>>): Promise<boolean> {
  try {
    await sql`
      UPDATE fawredd_linktree.services 
      SET 
        slug = CASE WHEN ${data.slug !== undefined} THEN ${data.slug} ELSE slug END,
        title = CASE WHEN ${data.title !== undefined} THEN ${data.title} ELSE title END,
        description = CASE WHEN ${data.description !== undefined} THEN ${data.description} ELSE description END,
        hero_image = CASE WHEN ${data.hero_image !== undefined} THEN ${data.hero_image} ELSE hero_image END,
        background_image = CASE WHEN ${data.background_image !== undefined} THEN ${data.background_image} ELSE background_image END,
        sort_order = CASE WHEN ${data.sort_order !== undefined} THEN ${data.sort_order} ELSE sort_order END,
        is_active = CASE WHEN ${data.is_active !== undefined} THEN ${data.is_active} ELSE is_active END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND profile_id = ${profileId}
    `;
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
        UPDATE fawredd_linktree.services 
        SET sort_order = ${item.sortOrder}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${item.id} AND profile_id = ${profileId}
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
    const nextOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order FROM fawredd_linktree.social_links WHERE profile_id = ${profileId}`;
    const sortOrder = (nextOrder[0] as { next_order: number }).next_order;

    await sql`
      INSERT INTO fawredd_linktree.social_links (profile_id, platform, url, sort_order, is_active)
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
    await sql`
      UPDATE fawredd_linktree.social_links 
      SET 
        platform = CASE WHEN ${data.platform !== undefined} THEN ${data.platform} ELSE platform END,
        url = CASE WHEN ${data.url !== undefined} THEN ${data.url} ELSE url END,
        is_active = CASE WHEN ${data.is_active !== undefined} THEN ${data.is_active} ELSE is_active END,
        sort_order = CASE WHEN ${data.sort_order !== undefined} THEN ${data.sort_order} ELSE sort_order END
      WHERE id = ${id} AND profile_id = ${profileId}
    `;
    return true;
  } catch (error) {
    console.error("Error updating social link:", error);
    return false;
  }
}

export async function deleteSocialLink(id: number, profileId: number): Promise<boolean> {
  try {
    await sql`
      UPDATE fawredd_linktree.social_links SET is_active = false WHERE id = ${id} AND profile_id = ${profileId}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting social link:", error);
    return false;
  }
}

// Collaborator functions
export async function getCollaborators(profileId: number): Promise<ProfileManager[]> {
  try {
    const result = await sql`
      SELECT * FROM fawredd_linktree.profile_managers 
      WHERE profile_id = ${profileId} 
      ORDER BY created_at ASC
    `
    return result as ProfileManager[]
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return []
  }
}

export async function addCollaborator(profileId: number, email: string): Promise<boolean> {
  try {
    await sql`
      INSERT INTO fawredd_linktree.profile_managers (profile_id, email)
      VALUES (${profileId}, ${email})
      ON CONFLICT (profile_id, email) DO NOTHING
    `
    return true
  } catch (error) {
    console.error("Error adding collaborator:", error)
    return false
  }
}

export async function removeCollaborator(id: number, profileId: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM fawredd_linktree.profile_managers WHERE id = ${id} AND profile_id = ${profileId}
    `
    return true
  } catch (error) {
    console.error("Error removing collaborator:", error)
    return false
  }
}

export async function isAuthorized(profileId: number, clerkId: string, email?: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM fawredd_linktree.profiles 
      WHERE id = ${profileId} AND clerk_id = ${clerkId}
      UNION
      SELECT 1 FROM fawredd_linktree.profile_managers 
      WHERE profile_id = ${profileId} AND email = ${email || ''}
    `
    return result.length > 0
  } catch {
    return false
  }
}

export async function createProfile(
  clerkId: string,
  name: string,
  slug: string
): Promise<{ success: true; profileId: number } | { success: false; error: 'name_exists' | 'slug_exists' | 'db_error' }> {
  try {
    // Check for duplicate name (case-insensitive, global)
    const nameCheck = await sql`
      SELECT id FROM fawredd_linktree.profiles WHERE LOWER(name) = LOWER(${name}) AND is_active = true LIMIT 1
    `
    if (nameCheck.length > 0) {
      return { success: false, error: 'name_exists' }
    }

    // Check for duplicate slug (exact, global)
    const slugCheck = await sql`
      SELECT id FROM fawredd_linktree.profiles WHERE slug = ${slug} AND is_active = true LIMIT 1
    `
    if (slugCheck.length > 0) {
      return { success: false, error: 'slug_exists' }
    }

    const result = await sql`
      INSERT INTO fawredd_linktree.profiles (clerk_id, name, slug, is_active, created_at, updated_at)
      VALUES (${clerkId}, ${name}, ${slug}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id
    `
    const profileId = (result[0] as { id: number }).id
    return { success: true, profileId }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { success: false, error: 'db_error' }
  }
}

export async function isProfileOwner(profileId: number, clerkId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM fawredd_linktree.profiles 
      WHERE id = ${profileId} AND clerk_id = ${clerkId}
    `
    return result.length > 0
  } catch {
    return false
  }
}

