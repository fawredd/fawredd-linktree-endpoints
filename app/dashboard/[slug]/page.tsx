import { auth } from "@clerk/nextjs/server";
import { getProfileBySlug, getAllServicesByProfileId, getSocialLinks } from "@/lib/database";
import { notFound, redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import ProfileEditor from "@/components/profile-editor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProfileDetailPage({ params }: Props) {
    const { userId } = await auth();
    const { slug } = await params;

    if (!userId) {
        redirect("/");
    }

    const profile = await getProfileBySlug(slug);

    // Security Check: Only allow owner to edit
    if (!profile || profile.clerk_id !== userId) {
        notFound();
    }

    const services = await getAllServicesByProfileId(profile.id);
    const socialLinks = await getSocialLinks(profile.id);

    return (
        <DashboardShell>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                        <p className="text-sm text-slate-500">/{profile.slug}</p>
                    </div>
                </div>

                <ProfileEditor profile={profile} services={services} socialLinks={socialLinks} />
            </div>
        </DashboardShell>
    );
}

