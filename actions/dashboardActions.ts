'use server'

import { auth, currentUser } from "@clerk/nextjs/server"
import {
    updateProfile, addService, deleteService, updateService,
    addSocialLink, updateSocialLink, deleteSocialLink, reorderServices,
    getCollaborators, addCollaborator, removeCollaborator, isAuthorized, isProfileOwner
} from "@/lib/database"
import { revalidatePath } from "next/cache"

async function getAuthContext() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")
    const user = await currentUser()
    return {
        userId,
        email: user?.emailAddresses[0]?.emailAddress
    }
}

export async function reorderServicesAction(profileId: number, items: { id: number, sortOrder: number }[]) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await reorderServices(profileId, items)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function editProfileAction(id: number, data: any) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(id, userId, email))) throw new Error("Forbidden")

    const success = await updateProfile(id, data, userId, email)
    if (success) {
        revalidatePath("/dashboard")
        if (data.slug) revalidatePath(`/${data.slug}`)
    }
    return success
}

export async function addServiceAction(profileId: number, data: any) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await addService(profileId, data)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function deleteServiceAction(id: number, profileId: number) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await deleteService(id, profileId)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function updateServiceAction(id: number, profileId: number, data: any) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await updateService(id, profileId, data)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function addSocialLinkAction(profileId: number, platform: string, url: string) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await addSocialLink(profileId, platform, url)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function updateSocialLinkAction(id: number, profileId: number, data: any) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await updateSocialLink(id, profileId, data)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function deleteSocialLinkAction(id: number, profileId: number) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    const success = await deleteSocialLink(id, profileId)
    if (success) revalidatePath("/dashboard")
    return success
}

// Collaborator Actions
export async function getCollaboratorsAction(profileId: number) {
    const { userId, email } = await getAuthContext()
    if (!(await isAuthorized(profileId, userId, email))) throw new Error("Forbidden")

    return await getCollaborators(profileId)
}

export async function addCollaboratorAction(profileId: number, targetEmail: string) {
    const { userId } = await getAuthContext()
    // Only owners can add collaborators
    if (!(await isProfileOwner(profileId, userId))) throw new Error("Forbidden: Only owner can manage collaborators")

    const success = await addCollaborator(profileId, targetEmail)
    if (success) revalidatePath("/dashboard")
    return success
}

export async function removeCollaboratorAction(id: number, profileId: number) {
    const { userId } = await getAuthContext()
    // Only owners can remove collaborators
    if (!(await isProfileOwner(profileId, userId))) throw new Error("Forbidden: Only owner can manage collaborators")

    const success = await removeCollaborator(id, profileId)
    if (success) revalidatePath("/dashboard")
    return success
}

