'use server'

import { getAllProfiles, getProfileBySlug, getServiceByProfileIdAndSlug, getAllServicesByProfileId, getSocialLinks } from '@/lib/database'

export async function fetchAllProfiles() {
  return await getAllProfiles()
}

export async function fetchProfileBySlug(slug:string) {
  return await getProfileBySlug(slug)
}

export async function fetchServicesByProfileId(profileId:number) {
  return await getAllServicesByProfileId(profileId)
}

export async function fetchServiceByProfileIdAndSlug(profileId:number, serviceSlug:string) {
  return await getServiceByProfileIdAndSlug(profileId, serviceSlug)
}

export async function fetchSocialLinksByProfileId(profileId:number) {
  return await getSocialLinks(profileId)
}