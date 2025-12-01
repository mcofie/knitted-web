'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClientBrowser } from '@/lib/supabase/browser';
import {
    LayoutDashboard,
    Users,
    ReceiptText,
    Settings,
    LogOut,
    Moon,
    Sun,
    Scissors,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure you have a utility for class merging

const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/orders', label: 'Orders', icon: ReceiptText },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const sb = createClientBrowser();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    async function signOut() {
        await sb.auth.signOut();
        window.location.href = '/login';
    }

    return (
        <div
            className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
            {/* Modern Glassmorphic Header */}
            <header
                className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div
                    className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                                <Scissors className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
                                Knitted
                            </span>
                        </Link>
                    </div>

                    {/* Navigation - Center aligned on desktop */}
                    <nav className="hidden md:flex items-center gap-1">
                        {links.map((l) => {
                            const Icon = l.icon;
                            const isActive = pathname === l.href || pathname.startsWith(`${l.href}/`);

                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={cn(
                                        "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <Icon className={cn("h-4 w-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                                    <span>{l.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right-side actions */}
                    <div className="flex items-center gap-2">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="rounded-full w-9 h-9"
                                aria-label="Toggle theme"
                            >
                                <Sun
                                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon
                                    className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </Button>
                        )}

                        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={signOut}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign out</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main
                className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-500">
                {children}
            </main>

            {/* Minimal Footer */}
            <footer className="border-t border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                <div
                    className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground/80">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground/90">Knitted</span>
                        <span className="hidden md:inline text-muted-foreground/40">•</span>
                        <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/privacy"
                            className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms"
                            className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}