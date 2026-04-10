"use client";

import React, { useState } from 'react';
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Link2, Settings, User, Menu, X } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

interface DashboardShellProps {
    children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/profiles', label: 'My Profiles', icon: User },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Link2 size={18} className="text-white" />
                    </div>
                    <span>Linktree</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(link.href)
                            ? 'bg-slate-800 text-indigo-400 font-medium'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <link.icon size={18} />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 flex items-center gap-3">
                <UserButton />
                <div className="text-sm font-medium text-slate-400">Account</div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col lg:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <aside
                        className="w-72 h-full bg-slate-900 border-r border-slate-800 flex flex-col animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end p-4 lg:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} />
                            </Button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center px-4 md:px-8 justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </Button>
                        <h1 className="font-semibold text-lg text-slate-200">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium uppercase tracking-wider">
                            Alpha
                        </div>
                        <div className="lg:hidden scale-90">
                            <UserButton />
                        </div>
                    </div>
                </header>
                <section className="flex-1 p-4 md:p-8">
                    {children}
                </section>
            </main>
        </div>
    );
}

