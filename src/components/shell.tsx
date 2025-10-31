'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClientBrowser } from '@/lib/supabase/browser';
import { RiHomeLine } from 'react-icons/ri';
import { GoPeople, GoSun } from 'react-icons/go';
import { TbInvoice } from 'react-icons/tb';
import { CiSettings } from 'react-icons/ci';
import { LuLogOut } from 'react-icons/lu';
import { IoMoonOutline } from 'react-icons/io5';

const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clients', label: 'Clients' },
    { href: '/orders', label: 'Orders' },
    { href: '/settings', label: 'Settings' },
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

    const icons = [<RiHomeLine />, <GoPeople />, <TbInvoice />, <CiSettings />];

    return (
        <div className="min-h-screen flex flex-col transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background border-b">
                <div className="container mx-auto flex items-center justify-between h-14 px-4">
                    {/* Brand */}
                    <Link href="/dashboard" className="font-semibold text-lg">
                        Knitted
                    </Link>

                    {/* Nav */}
                    <nav className="flex items-center gap-4">
                        {links.map((l, index) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`flex items-center text-sm font-medium transition-colors mx-3 ${
                                    pathname === l.href
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {icons[index]}
                                <span className="ml-2">{l.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right-side actions */}
                    <div className="flex items-center gap-2">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setTheme(theme === 'light' ? 'dark' : 'light')
                                }
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <IoMoonOutline /> : <GoSun />}
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={signOut}>
                            <LuLogOut className="mr-1.5 h-4 w-4" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto w-full md:w-2/3 p-4 my-10 flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground">
                    <div className="text-center md:text-left">
                        <span className="font-semibold text-foreground">Knitted</span> ©{' '}
                        {new Date().getFullYear()} — All rights reserved.
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/privacy"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-foreground transition-colors"
                        >
                            Terms
                        </Link>
                        <Link
                            href="https://knitted.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            Website
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}