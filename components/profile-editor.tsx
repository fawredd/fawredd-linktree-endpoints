'use client';

import React, { useState } from 'react';
import { Profile, Service, SocialLink, ProfileManager } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Hourglass, Plus, Trash2, GripVertical, Save,
    ChevronDown, ChevronUp, Link as LinkIcon,
    Instagram, Twitter, Github, Linkedin, Youtube, Globe, Users, Palette, Mail, MessageCircle
} from 'lucide-react';
import { ImageUploader } from '@/components/image-uploader';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { toast } from 'sonner';

import {
    editProfileAction,
    addServiceAction,
    deleteServiceAction,
    updateServiceAction,
    addSocialLinkAction,
    updateSocialLinkAction,
    deleteSocialLinkAction,
    reorderServicesAction,
    addCollaboratorAction,
    removeCollaboratorAction
} from "@/actions/dashboardActions";

interface ProfileEditorProps {
    profile: Profile;
    services: Service[];
    socialLinks: SocialLink[];
    isOwner: boolean;
    initialCollaborators: ProfileManager[];
}

export default function ProfileEditor({
    profile,
    services: initialServices,
    socialLinks: initialSocialLinks,
    isOwner,
    initialCollaborators
}: ProfileEditorProps) {
    const [profileData, setProfileData] = useState(profile);
    const [services, setServices] = useState(initialServices);
    const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
    const [collaborators, setCollaborators] = useState(initialCollaborators);
    const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
    const [activeServiceTab, setActiveServiceTab] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const success = await editProfileAction(profile.id, {
                name: profileData.name,
                title: profileData.title,
                description: profileData.description,
                slug: profileData.slug,
                profile_image_url: profileData.profile_image_url,
                hero_image_url: profileData.hero_image_url,
                background_color: profileData.background_color || '#0f172a',
                border_color: profileData.border_color || '#6366f1',
                font_color: profileData.font_color || '#ffffff'
            });
            if (success) toast.success('Profile updated successfully');
            else toast.error('Failed to update profile');
        } catch {
            toast.error('Error saving profile');
        } finally {
            setIsSaving(false);
        }
    };

    const addService = async () => {
        const newSortOrder = services.length > 0 ? Math.max(...services.map(s => s.sortOrder)) + 1 : 0;
        const data = {
            slug: `link-${Date.now()}`,
            title: 'New Link',
            description: '',
            hero_image: null,
            sortOrder: newSortOrder,
            is_active: true
        };

        try {
            const success = await addServiceAction(profile.id, data);
            if (success) {
                toast.success('Link added');
                window.location.reload();
            }
        } catch {
            toast.error('Failed to add link');
        }
    };

    const deleteService = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            const success = await deleteServiceAction(id, profile.id);
            if (success) {
                setServices(services.filter(s => s.id !== id));
                toast.success('Link deleted');
            }
        } catch {
            toast.error('Error deleting link');
        }
    };

    const updateServiceField = async (id: number, field: string, value: string | number | boolean | null) => {
        try {
            await updateServiceAction(id, profile.id, { [field]: value });
            setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = services.findIndex((s) => s.id === active.id);
            const newIndex = services.findIndex((s) => s.id === over.id);

            const newServices = arrayMove(services, oldIndex, newIndex);
            setServices(newServices);

            const reorderItems = newServices.map((service, index) => ({
                id: service.id,
                sortOrder: index
            }));

            try {
                await reorderServicesAction(profile.id, reorderItems);
                toast.success('Order updated');
            } catch {
                toast.error('Failed to save order');
            }
        }
    };

    const addSocialLink = async () => {
        try {
            const success = await addSocialLinkAction(profile.id, 'instagram', 'https://instagram.com/');
            if (success) {
                toast.success('Social link added');
                window.location.reload();
            }
        } catch {
            toast.error('Failed to add social link');
        }
    };

    const deleteSocialLink = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            const success = await deleteSocialLinkAction(id, profile.id);
            if (success) {
                setSocialLinks(socialLinks.filter(s => s.id !== id));
                toast.success('Social link deleted');
            }
        } catch {
            toast.error('Error deleting social link');
        }
    };

    const updateSocialField = async (id: number, field: string, value: string | number | boolean | null) => {
        try {
            await updateSocialLinkAction(id, profile.id, { [field]: value });
            setSocialLinks(socialLinks.map(s => s.id === id ? { ...s, [field]: value } : s));
        } catch {
            toast.error('Failed to update');
        }
    };

    const addCollaborator = async () => {
        if (!newCollaboratorEmail || !newCollaboratorEmail.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }

        setIsAddingCollaborator(true);
        try {
            const success = await addCollaboratorAction(profile.id, newCollaboratorEmail);
            if (success) {
                toast.success('Collaborator added');
                setNewCollaboratorEmail('');
                window.location.reload();
            } else {
                toast.error('Failed to add collaborator');
            }
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error?.message || 'Error adding collaborator');
        } finally {
            setIsAddingCollaborator(false);
        }
    };

    const removeCollaborator = async (id: number) => {
        if (!confirm('Remove this collaborator?')) return;
        try {
            const success = await removeCollaboratorAction(id, profile.id);
            if (success) {
                setCollaborators(collaborators.filter(c => c.id !== id));
                toast.success('Collaborator removed');
            }
        } catch {
            toast.error('Error removing collaborator');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Column */}
            <div className="space-y-8">
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Profile Settings</h3>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-500"
                        >
                            {isSaving ? <Hourglass size={16} /> : <Save size={16} />}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Page Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={profileData.title || ''}
                                onChange={handleProfileChange}
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Bio / Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={profileData.description || ''}
                                onChange={handleProfileChange}
                                className="bg-slate-800 border-slate-700 min-h-[100px]"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Palette size={20} className="text-indigo-400" /> Appearance Settings</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Images</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Profile Image</Label>
                                    <ImageUploader
                                        label="Upload Avatar"
                                        type="profile"
                                        currentImage={profileData.profile_image_url}
                                        onUploadSuccess={(url) => setProfileData(prev => ({ ...prev, profile_image_url: url }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Hero Image</Label>
                                    <ImageUploader
                                        label="Upload Banner"
                                        type="hero"
                                        currentImage={profileData.hero_image_url}
                                        onUploadSuccess={(url) => setProfileData(prev => ({ ...prev, hero_image_url: url }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-slate-800 pt-4">
                            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Theme Colors</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Background Color</Label>
                                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-md border border-slate-700 w-full">
                                        <input
                                            type="color"
                                            name="background_color"
                                            value={profileData.background_color || '#0f172a'}
                                            onChange={handleProfileChange}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <span className="text-sm text-slate-300 font-mono">{profileData.background_color || '#0f172a'}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Border Color</Label>
                                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-md border border-slate-700 w-full">
                                        <input
                                            type="color"
                                            name="border_color"
                                            value={profileData.border_color || '#6366f1'}
                                            onChange={handleProfileChange}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <span className="text-sm text-slate-300 font-mono">{profileData.border_color || '#6366f1'}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Font Color</Label>
                                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-md border border-slate-700 w-full">
                                        <input
                                            type="color"
                                            name="font_color"
                                            value={profileData.font_color || '#ffffff'}
                                            onChange={handleProfileChange}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <span className="text-sm text-slate-300 font-mono">{profileData.font_color || '#ffffff'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {isOwner && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl shadow-indigo-500/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Collaborators</h3>
                            <Users size={20} className="text-indigo-500" />
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Collaborator Email"
                                value={newCollaboratorEmail}
                                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                                className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                            />
                            <Button
                                onClick={addCollaborator}
                                disabled={isAddingCollaborator}
                                className="bg-indigo-600 hover:bg-indigo-500 whitespace-nowrap px-6"
                            >
                                {isAddingCollaborator ? <Hourglass size={16} className="animate-spin" /> : <Plus size={16} className="mr-2" />}
                                Add
                            </Button>
                        </div>

                        <div className="space-y-3 pt-2">
                            {collaborators.map((collab) => (
                                <div key={collab.id} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl group hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:text-indigo-300 transition-colors">
                                            {collab.email.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{collab.email}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                        onClick={() => removeCollaborator(collab.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                            {collaborators.length === 0 && (
                                <p className="text-center text-slate-500 text-xs py-2 italic">No collaborators yet. Add someone by email.</p>
                            )}
                        </div>
                    </section>
                )}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <h3 className="text-xl font-bold text-white mb-4 md:mb-0">Social Links</h3>
                        <Button variant="outline" size="sm" onClick={addSocialLink} className="border-slate-700">
                            <Plus size={16} className="mr-2" /> Add Social
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {socialLinks.map((social) => (
                            <div
                                key={social.id}
                                className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-slate-800/50 border border-slate-700/50 p-4 md:p-8 rounded-xl group hover:border-indigo-500/30 transition-colors"
                            >
                                <div className="flex-1 w-full flex flex-col md:flex-row gap-1">
                                    <select
                                        value={social.platform}
                                        onChange={(e) => updateSocialField(social.id, 'platform', e.target.value)}
                                        className="w-full h-10 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="instagram">Instagram</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="github">Github</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="website">Website</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="email">Email</option>
                                        <option value="tiktok">TikTok</option>
                                    </select>
                                    <Input
                                        value={social.url}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setSocialLinks(socialLinks.map(s => s.id === social.id ? { ...s, url: newVal } : s));
                                        }}
                                        onBlur={(e) => updateSocialField(social.id, 'url', e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700"
                                        placeholder="https://..."
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-400 hover:text-red-400"
                                    onClick={() => deleteSocialLink(social.id)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                        {socialLinks.length === 0 && (
                            <p className="text-center text-slate-500 text-sm py-4">No social links added yet.</p>
                        )}
                    </div>
                </section>

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Your Links</h3>
                        <Button variant="outline" size="sm" onClick={addService} className="border-slate-700">
                            <Plus size={16} className="mr-2" /> Add Link
                        </Button>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={services.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {services.map((service) => (
                                    <SortableServiceItem
                                        key={service.id}
                                        service={service}
                                        activeServiceTab={activeServiceTab}
                                        setActiveServiceTab={setActiveServiceTab}
                                        updateServiceField={updateServiceField}
                                        deleteService={deleteService}
                                        setServices={setServices}
                                        services={services}
                                    />
                                ))}
                                {services.length === 0 && (
                                    <p className="text-center text-slate-500 text-sm py-4">No links added yet.</p>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </section>
            </div>

            {/* Preview Column */}
            <div className="hidden lg:block">
                <div className="sticky top-8">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Preview</h3>
                    <div
                        className="w-[320px] h-[640px] border-[8px] border-slate-800 rounded-[3rem] mx-auto overflow-hidden shadow-2xl relative transition-colors duration-300"
                        style={{ backgroundColor: profileData.background_color || '#0f172a' }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>

                        {profileData.hero_image_url && (
                            <div className="absolute top-0 left-0 w-full h-32 z-0">
                                <img src={profileData.hero_image_url} alt="hero preview" className="w-full h-full object-cover opacity-50" />
                            </div>
                        )}

                        <div className="h-full overflow-y-auto custom-scrollbar pt-12 px-6 pb-8 space-y-6 relative z-10" style={{ color: profileData.font_color || '#ffffff' }}>
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-indigo-500/20 mx-auto border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden">
                                    {profileData.profile_image_url ? (
                                        <img src={profileData.profile_image_url} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <span className="text-2xl font-bold text-indigo-400">{profileData.name ? profileData.name.charAt(0) : 'U'}</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold leading-tight" style={{ color: profileData.font_color || '#ffffff' }}>{profileData.title || profileData.name}</h4>
                                    <p className="text-sm opacity-80 mt-2">{profileData.description}</p>
                                </div>
                            </div>

                            {/* Social Links Preview */}
                            <div className="flex justify-center flex-wrap gap-4">
                                {socialLinks.filter(s => s.is_active).map(social => {
                                    const Icon = {
                                        instagram: Instagram,
                                        twitter: Twitter,
                                        github: Github,
                                        linkedin: Linkedin,
                                        youtube: Youtube,
                                        website: Globe,
                                        whatsapp: MessageCircle,
                                        email: Mail,
                                        tiktok: Globe
                                    }[social.platform] || Globe;
                                    return <Icon key={social.id} size={20} className="opacity-80" />;
                                })}
                            </div>

                            <div className="space-y-3">
                                {services.filter(s => s.is_active).map(service => (
                                    <div
                                        key={service.id}
                                        className="w-full py-3 px-4 bg-white/5 rounded-xl text-center text-sm font-medium hover:bg-white/10 transition-colors"
                                        style={{
                                            borderColor: profileData.border_color || '#6366f1',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            color: profileData.font_color || '#ffffff'
                                        }}
                                    >
                                        {service.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SortableServiceItemProps {
    service: Service;
    activeServiceTab: number | null;
    setActiveServiceTab: (id: number | null) => void;
    updateServiceField: (id: number, field: string, value: string | number | boolean | null) => void;
    deleteService: (id: number) => void;
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    services: Service[];
}

function SortableServiceItem({
    service,
    activeServiceTab,
    setActiveServiceTab,
    updateServiceField,
    deleteService,
    setServices,
    services
}: SortableServiceItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: service.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-colors ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500/50' : ''}`}
        >
            <div className="flex items-center gap-1 md:gap2 p-2 md:p-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-slate-600 hover:text-slate-400 p-1"
                >
                    <GripVertical size={20} />
                </div>
                <div className="flex-1 space-y-1">
                    <Input
                        value={service.title}
                        onChange={(e) => {
                            const newVal = e.target.value;
                            setServices(services.map(s => s.id === service.id ? { ...s, title: newVal } : s));
                        }}
                        onBlur={(e) => updateServiceField(service.id, 'title', e.target.value)}
                        className="bg-transparent border-none p-0 text-white font-medium h-auto focus-visible:ring-0"
                        placeholder="Link Title"
                    />
                    <div className="flex items-center gap-2 group/slug">
                        <LinkIcon size={12} className="text-slate-600" />
                        <Input
                            value={service.slug}
                            onChange={(e) => {
                                const newVal = e.target.value;
                                setServices(services.map(s => s.id === service.id ? { ...s, slug: newVal } : s));
                            }}
                            onBlur={(e) => updateServiceField(service.id, 'slug', e.target.value)}
                            className="bg-transparent border-none p-0 text-slate-500 text-sm h-auto focus-visible:ring-0 w-full"
                            placeholder="url-slug"
                        />
                    </div>
                </div>
                <div className="flex items-center md:gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white"
                        onClick={() => setActiveServiceTab(activeServiceTab === service.id ? null : service.id)}
                    >
                        {activeServiceTab === service.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => deleteService(service.id)}
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>

            {activeServiceTab === service.id && (
                <div className="p-4 pt-0 border-t border-slate-700/50 space-y-4 bg-slate-900/50">
                    <div className="space-y-2 pt-4">
                        <Label className="text-xs text-slate-500 uppercase tracking-wider">Description</Label>
                        <Textarea
                            value={service.description || ''}
                            onChange={(e) => {
                                const newVal = e.target.value;
                                setServices(services.map(s => s.id === service.id ? { ...s, description: newVal } : s));
                            }}
                            onBlur={(e) => updateServiceField(service.id, 'description', e.target.value)}
                            className="bg-slate-800 border-slate-700 text-sm"
                            placeholder="Brief description of this link..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wider">Hero Image URL</Label>
                        <Input
                            value={service.hero_image || ''}
                            onChange={(e) => {
                                const newVal = e.target.value;
                                setServices(services.map(s => s.id === service.id ? { ...s, hero_image: newVal } : s));
                            }}
                            onBlur={(e) => updateServiceField(service.id, 'hero_image', e.target.value)}
                            className="bg-slate-800 border-slate-700 text-sm"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
