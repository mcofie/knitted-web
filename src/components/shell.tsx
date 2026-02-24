'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Moon,
    Sun,
    Scissors,
    UserCircle,
    ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClientBrowser } from '@/lib/supabase/browser';

const links = [
    { href: '/dashboard', label: 'Today', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/orders', label: 'Orders', icon: ShoppingBag },
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
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent/20">
            {/* Minimal Header */}
            <header className="fixed top-0 z-50 w-full py-4 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="container mx-auto max-w-7xl px-6 h-12 flex items-center justify-between">
                    {/* Left: Brand & Nav */}
                    <div className="flex items-center gap-12">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Scissors className="w-5 h-5 text-foreground stroke-[1.5]" />
                            <span className="text-xl font-normal tracking-tight text-foreground font-serif">
                                knitted
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-2">
                            {links.map((l) => {
                                const Icon = l.icon;
                                const isActive = pathname === l.href || (l.href !== '/dashboard' && pathname.startsWith(l.href));

                                return (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                                            isActive
                                                ? "text-foreground bg-secondary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 stroke-[1.5]" />
                                        <span>{l.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex w-9 h-9 items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-4 h-4" />
                                ) : (
                                    <Moon className="w-4 h-4" />
                                )}
                            </button>
                        )}

                        <div className="flex items-center gap-2 pl-4 border-l border-border">
                            <button
                                onClick={signOut}
                                className="flex items-center gap-2 p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                            <UserCircle className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-32">
                {children}
            </main>

            {/* Minimal Footer */}
            <footer className="w-full bg-background border-t border-border py-12 mt-20">
                <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Scissors className="w-4 h-4 opacity-50" />
                        <span>&copy; {new Date().getFullYear()} Knitted Studio.</span>
                    </div>

                    <div className="flex items-center gap-8 text-xs font-medium">
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                        <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}