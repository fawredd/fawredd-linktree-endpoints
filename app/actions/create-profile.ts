"use server"

import { auth } from "@clerk/nextjs/server"
import { createProfile } from "@/lib/database"
import { revalidatePath } from "next/cache"

export type CreateProfileResult =
    | { success: true }
    | { success: false; error: string }

export async function createProfileAction(
    formData: FormData
): Promise<CreateProfileResult> {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "You must be signed in to create a profile." }
    }

    const rawName = formData.get("name")
    const rawSlug = formData.get("slug")

    if (typeof rawName !== "string" || rawName.trim().length === 0) {
        return { success: false, error: "Profile name is required." }
    }

    if (typeof rawSlug !== "string" || rawSlug.trim().length === 0) {
        return { success: false, error: "URL slug is required." }
    }

    const name = rawName.trim()
    const slug = rawSlug.trim().toLowerCase()

    // Ensure slug is URL-safe
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugPattern.test(slug)) {
        return {
            success: false,
            error: "Slug must contain only lowercase letters, numbers, and hyphens.",
        }
    }

    const result = await createProfile(userId, name, slug)

    if (!result.success) {
        if (result.error === "name_exists") {
            return { success: false, error: "A profile with this name already exists." }
        }
        if (result.error === "slug_exists") {
            return {
                success: false,
                error: "This URL slug is already taken. Please choose another.",
            }
        }
        return { success: false, error: "Something went wrong. Please try again." }
    }

    revalidatePath("/dashboard")
    return { success: true }
}
