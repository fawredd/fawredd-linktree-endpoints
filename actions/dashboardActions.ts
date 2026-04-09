'use server'

import { auth } from "@clerk/nextjs/server"
import { updateProfile, addService, deleteService, updateService, addSocialLink, updateSocialLink, deleteSocialLink, reorderServices } from "@/lib/database"

export async function reorderServicesAction(profileId: number, items: { id: number, sortOrder: number }[]) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await reorderServices(profileId, items)
    if (success) revalidatePath("/dashboard")
    return success
}

import { revalidatePath } from "next/cache"

export async function editProfileAction(id: number, data: any) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await updateProfile(id, data, userId)
    if (success) {
        revalidatePath("/dashboard")
        revalidatePath(`/${data.slug}`)
    }
    return success
}

export async function addServiceAction(profileId: number, data: any) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Note: We should verify profile ownership here too if we want to be strict
    const success = await addService(profileId, data)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function deleteServiceAction(id: number, profileId: number) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await deleteService(id, profileId)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function updateServiceAction(id: number, profileId: number, data: any) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await updateService(id, profileId, data)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function addSocialLinkAction(profileId: number, platform: string, url: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await addSocialLink(profileId, platform, url)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function updateSocialLinkAction(id: number, profileId: number, data: any) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await updateSocialLink(id, profileId, data)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function deleteSocialLinkAction(id: number, profileId: number) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const success = await deleteSocialLink(id, profileId)
    if (success) revalidatePath("/dashboard")
    return success
}

