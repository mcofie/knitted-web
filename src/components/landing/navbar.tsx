'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { IoMoonOutline } from 'react-icons/io5';
import { GoSun } from 'react-icons/go';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setMounted(true), []);

    const links = [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About' }
    ];

    // Helper component for mobile navigation
    const MobileNav = () => (
        <div
            className={`fixed inset-0 z-[100] md:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } bg-background/95 backdrop-blur-lg`}
        >
            <div className="flex flex-col p-6 pt-24 space-y-4">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-xl font-semibold py-2 border-b border-border/50 transition hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="w-full text-center rounded-xl border border-border bg-card py-3 text-base font-semibold transition hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Log in
                    </Link>
                    <Link
                        href="/login"
                        className="w-full text-center rounded-xl bg-primary py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Start Free Trial
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <MobileNav />
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled
                    ? 'border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5 supports-[backdrop-filter]:bg-background/80'
                    : 'border-transparent bg-transparent'
                    }`}
            >
                {/* Subtle gradient overlay when scrolled */}
                {scrolled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 opacity-50" />
                )}
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 z-50">
                        <motion.div
                            initial={false}
                            animate={scrolled ? { scale: 0.9, y: 0 } : { scale: 1, y: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div
                                className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
                                <Image src="/knitted-logo.svg" alt="Knitted" width={20} height={20}
                                    className="brightness-0 invert" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">Knitted</span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {pathname === link.href && (
                                    <motion.span
                                        layoutId="nav-pill"
                                        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-muted/80 via-muted to-muted/80"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {pathname !== link.href && (
                                    <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-all duration-300 group-hover:w-3/4" />
                                )}
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Actions Group */}
                    <div className="flex items-center gap-4">

                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                type="button"
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label="Toggle theme"
                            >
                                <span className="sr-only">Switch theme</span>
                                {theme === 'light' ? (
                                    <IoMoonOutline className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                                ) : (
                                    <GoSun className="h-4 w-4 transition-transform group-hover:rotate-90" />
                                )}
                            </button>
                        )}

                        {/* Desktop Auth Actions */}
                        <div className="hidden md:flex items-center gap-4 pl-2">
                            <div className="h-6 w-px bg-border/50" />
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/login"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-primary via-purple-600 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/50"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <span className="relative z-10">Start Free Trial</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            <Menu
                                className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
