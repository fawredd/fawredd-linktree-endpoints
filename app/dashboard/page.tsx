import { auth, currentUser } from "@clerk/nextjs/server";
import { getAllProfiles } from "@/lib/database";
import DashboardShell from "@/components/dashboard-shell";
import Link from "next/link";
import { Plus, ExternalLink, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!userId) {
        return null; // Should be handled by middleware, but safety first
    }

    const profiles = await getAllProfiles(userId, email);

    return (
        <DashboardShell>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Your Linktree Profiles</h2>
                        <p className="text-slate-400">Manage your profiles and their associated links.</p>
                    </div>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold">
                        <Plus size={18} className="mr-2" />
                        Create New Profile
                    </Button>
                </div>

                {profiles.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4 bg-slate-900/20">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200">No profiles found</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            You haven&apos;t created any Linktree profiles yet. Get started by creating your first one.
                        </p>
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                            Set up your first profile
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map((profile) => (
                            <div
                                key={profile.id}
                                className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                            >
                                {profile.clerk_id !== userId && (
                                    <span className="absolute top-3 right-3 z-10 bg-indigo-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-md">
                                        <Users size={10} /> SHARED
                                    </span>
                                )}
                                <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 flex items-end px-6 pb-0">
                                    <div className="w-16 h-16 rounded-xl border-4 border-slate-900 bg-slate-800 overflow-hidden transform translate-y-4">
                                        {profile.profile_image_url ? (
                                            <img src={profile.profile_image_url} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                <User size={32} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 pt-8">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                                                {profile.name}
                                            </h4>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                /{profile.slug}
                                            </p>
                                        </div>
                                        <button className="text-slate-600 hover:text-white transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className="mt-8 flex items-center gap-2">
                                        <Link
                                            href={`/dashboard/${profile.slug}`}
                                            className="flex-1 text-center py-2 px-4 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                                        >
                                            Manage Content
                                        </Link>
                                        <Link
                                            href={`/${profile.slug}`}
                                            target="_blank"
                                            className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-indigo-400"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}

// Minimal User icon for placeholder
function User({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
