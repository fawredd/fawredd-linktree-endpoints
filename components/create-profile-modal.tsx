"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, X } from "lucide-react"
import { createProfileAction } from "@/app/actions/create-profile"
import { Button } from "@/components/ui/button"

interface CreateProfileModalProps {
    trigger?: "primary" | "outline"
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function CreateProfileModal({
    trigger = "primary",
}: CreateProfileModalProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    function handleOpen() {
        setOpen(true)
        setName("")
        setSlug("")
        setSlugManuallyEdited(false)
        setError(null)
    }

    function handleClose() {
        if (isPending) return
        setOpen(false)
        setError(null)
    }

    function handleNameChange(value: string) {
        setName(value)
        if (!slugManuallyEdited) {
            setSlug(generateSlug(value))
        }
    }

    function handleSlugChange(value: string) {
        setSlug(value)
        setSlugManuallyEdited(true)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData()
        formData.set("name", name)
        formData.set("slug", slug)

        startTransition(async () => {
            const result = await createProfileAction(formData)
            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                setError(result.error)
            }
        })
    }

    return (
        <>
            {/* Trigger Button */}
            {trigger === "primary" ? (
                <Button
                    onClick={handleOpen}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold"
                >
                    <Plus size={18} className="mr-2" />
                    Create New Profile
                </Button>
            ) : (
                <Button
                    onClick={handleOpen}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                    Set up your first profile
                </Button>
            )}

            {/* Modal Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby="create-profile-modal-title"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Dialog Panel */}
                    <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2
                                    id="create-profile-modal-title"
                                    className="text-xl font-bold text-white"
                                >
                                    Create New Profile
                                </h2>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Set up a new linktree profile page.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isPending}
                                className="text-slate-500 hover:text-white transition-colors rounded-lg p-1 hover:bg-slate-800"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                            {/* Profile Name */}
                            <div>
                                <label
                                    htmlFor="create-profile-name"
                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                >
                                    Profile Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="create-profile-name"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g. My Business Profile"
                                    required
                                    disabled={isPending}
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
                                />
                            </div>

                            {/* URL Slug */}
                            <div>
                                <label
                                    htmlFor="create-profile-slug"
                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                >
                                    URL Slug <span className="text-red-400">*</span>
                                </label>
                                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                                    <span className="pl-4 pr-1 text-slate-500 text-sm select-none">
                                        /
                                    </span>
                                    <input
                                        id="create-profile-slug"
                                        type="text"
                                        name="slug"
                                        value={slug}
                                        onChange={(e) => handleSlugChange(e.target.value)}
                                        placeholder="my-business-profile"
                                        required
                                        disabled={isPending}
                                        className="flex-1 px-2 py-2.5 bg-transparent text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Only lowercase letters, numbers, and hyphens.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-start gap-2 p-3 bg-red-950/50 border border-red-800/60 rounded-lg">
                                    <span className="text-red-400 text-sm">{error}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-1">
                                <Button
                                    type="submit"
                                    disabled={isPending || !name.trim() || !slug.trim()}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            Creating…
                                        </>
                                    ) : (
                                        "Create Profile"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isPending}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
