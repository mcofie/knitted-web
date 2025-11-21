'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, {useEffect, useMemo, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Play, Check, ArrowRight, Star, X, Menu} from 'lucide-react';
import {motion, type Variants} from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import {IoMoonOutline} from 'react-icons/io5';
import {GoSun} from 'react-icons/go';
import {useTheme} from 'next-themes';
import WebAppScreens from '@/components/landing/web-app-screen';

/* ========================= Animations ========================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
    hidden: {opacity: 0, y: 16},
    show: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.6, ease: EASE}
    }
};

const fade: Variants = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {duration: 0.5, ease: EASE}}
};

const stagger: Variants = {
    hidden: {},
    show: {transition: {staggerChildren: 0.1, delayChildren: 0.1}}
};

/* ========================= Demo Modal ========================= */
function DemoDialog({
                        videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        triggerClassName = '',
                        children
                    }: {
    videoUrl?: string;
    triggerClassName?: string;
    children: React.ReactNode;
}) {
    const videoId = useMemo(() => {
        try {
            const u = new URL(videoUrl);
            if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
            if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
            return null;
        } catch {
            return null;
        }
    }, [videoUrl]);

    const embedSrc = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        : videoUrl;

    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button type="button" className={triggerClassName} aria-label="Watch demo video">
                    {children}
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay asChild>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />
                </Dialog.Overlay>

                <Dialog.Content asChild>
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.95}}
                        transition={{duration: 0.3, ease: EASE}}
                        className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-4 shadow-2xl"
                    >
                        <div className="flex items-center justify-between px-2 pb-3">
                            <Dialog.Title className="text-base font-semibold text-foreground">
                                Knitted — Quick Demo
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button
                                    aria-label="Close"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition hover:bg-muted/60"
                                >
                                    <X className="h-5 w-5"/>
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* 16:9 responsive wrapper */}
                        <div
                            className="relative w-full overflow-hidden rounded-xl border border-border bg-black"
                            style={{paddingTop: '56.25%'}}
                        >
                            {open && (
                                <iframe
                                    className="absolute left-0 top-0 h-full w-full"
                                    src={embedSrc}
                                    title="Knitted demo"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

/* ============================ Page ============================ */
export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        {href: '/features', label: 'Features'},
        {href: '/pricing', label: 'Pricing'},
        {href: '/blog', label: 'Blog'}
    ];

    const plugin = React.useRef(Autoplay({delay: 3000, stopOnInteraction: true}));

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Helper component for mobile navigation
    const MobileNav = () => (
        <div
            className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
                        href="/signup"
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
        <main className="bg-background text-foreground min-h-screen flex flex-col">
            {/* ============================ Mobile Nav ============================ */}
            <MobileNav/>

            {/* ============================ Navbar ============================ */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'border-b border-border bg-background/90 backdrop-blur-xl shadow-lg shadow-primary/10'
                        : 'border-transparent bg-transparent backdrop-blur-0'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div
                            animate={scrolled ? {scale: 0.95, opacity: 0.95} : {scale: 1, opacity: 1}}
                            transition={{duration: 0.25, ease: EASE}}
                            className="flex items-center gap-2"
                        >
                            <Image src="/knitted-logo.svg" alt="Knitted Logo" width={32} height={32}/>
                            <span className="text-xl font-bold tracking-tight">Knitted</span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${
                                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth + Theme Toggle */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        {mounted && (
                            <button
                                type="button"
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                aria-label="Toggle theme"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
                            >
                                {theme === 'light' ? (
                                    <IoMoonOutline className="h-5 w-5"/>
                                ) : (
                                    <GoSun className="h-5 w-5"/>
                                )}
                            </button>
                        )}

                        {/* Auth link (Desktop) */}
                        <Link
                            href="/signup"
                            className="hidden md:inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                        >
                            Start Free Trial
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted/60"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle mobile menu"
                        >
                            <Menu className="h-5 w-5"/>
                        </button>
                    </div>
                </div>
            </header>

            {/* Decorative halos */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div
                    className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 via-indigo-500/10 to-purple-500/10 blur-[120px] opacity-70"/>
                <div
                    className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-tr from-secondary/20 via-indigo-500/10 to-purple-500/10 blur-[120px] opacity-70"/>
            </div>

            {/* ============================ Hero ============================ */}
            <section className="relative overflow-hidden py-24 md:py-32">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="space-y-6"
                    >
                        <motion.h1
                            variants={fadeUp}
                            className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-tight"
                        >
                            Tailoring,{' '}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                beautifully organized
              </span>
                            .
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-4 max-w-prose text-lg text-muted-foreground">
                            Knitted is your modern atelier — manage clients, measurements, and orders with quiet
                            precision. Stop drowning in paper and spreadsheets.
                        </motion.p>
                        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ring-offset-background"
                            >
                                Start free <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                            <DemoDialog
                                videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                triggerClassName="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-7 py-3 text-base font-semibold transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background backdrop-blur-sm"
                            >
                                <>
                                    <Play className="h-4 w-4 fill-current"/> Watch demo
                                </>
                            </DemoDialog>
                        </motion.div>
                    </motion.div>

                    {/* Hero mockup carousel */}
                    <motion.div variants={fadeUp} className="relative flex justify-center items-center">
                        <Carousel
                            plugins={[plugin.current]}
                            className="w-full max-w-md mx-auto"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                        >
                            <CarouselContent>
                                {[
                                    '/iphone_mockup_one_',
                                    '/iphone_mockup_two_',
                                    '/iphone_mockup_four_',
                                    '/iphone_mockup_five_',
                                    '/iphone_mockup_three_'
                                ].map((url, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative p-2 flex justify-center">
                                            {/* Mockup wrapper – no border, no shadow */}
                                            <div
                                                className="p-0 rounded-[3rem] bg-transparent border-0 shadow-none transition-all duration-500 ease-in-out">
                                                {/* Light mode image */}
                                                <Image
                                                    src={url + 'light.png'}
                                                    alt="Knitted app mockup (light)"
                                                    width={350}
                                                    height={700}
                                                    className="h-auto w-full rounded-[2.5rem] dark:hidden"
                                                    priority
                                                />

                                                {/* Dark mode image */}
                                                <Image
                                                    src={url + 'dark.png'}
                                                    alt="Knitted app mockup (dark)"
                                                    width={350}
                                                    height={700}
                                                    className="hidden h-auto w-full rounded-[2.5rem] dark:block"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex top-1/2 left-0 h-10 w-10"/>
                            <CarouselNext className="hidden md:flex top-1/2 right-0 h-10 w-10"/>
                        </Carousel>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Features ============================ */}
            <section className="relative border-t border-border bg-muted/20 overflow-hidden py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="mb-14 text-center"
                    >
                        <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight md:text-5xl">
                            Everything you need
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            From first fitting to final stitch, Knitted provides the tools for quiet, organized,
                            and profitable work.
                        </motion.p>
                    </motion.div>

                    <div className="space-y-24">
                        {[
                            {
                                title: 'Clients & Measurements',
                                desc: 'Keep every client’s details, measurements, and preferences in one elegant profile. Never ask for the same size twice.',
                                points: [
                                    'Measure once, reuse always',
                                    'Notes & preferences storage',
                                    'Client history & attachments'
                                ],
                                img_light: '/iphone_mockup_two_light.png',
                                img_dark: '/iphone_mockup_two_dark.png'
                            },
                            {
                                title: 'Orders & Invoices',
                                desc: 'Track every order from sketch to pickup. Create branded, professional PDF invoices in a single click.',
                                points: [
                                    'Order stages & due dates',
                                    'Automated PDF invoices',
                                    'Payments tracking & receipts'
                                ],
                                img_light: '/iphone_mockup_three_light.png',
                                img_dark: '/iphone_mockup_three_dark.png'
                            },
                            {
                                title: 'Reminders & Reports',
                                desc: 'Stay ahead of deadlines and gain visibility into what drives your atelier’s growth. Data made beautiful and actionable.',
                                points: [
                                    'Smart due date reminders',
                                    'Monthly revenue & trends reports',
                                    'Top clients & best-selling items'
                                ],
                                img_light: '/iphone_mockup_one_light.png',
                                img_dark: '/iphone_mockup_one_dark.png'
                            }
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial="hidden"
                                whileInView="show"
                                viewport={{once: true, amount: 0.3}}
                                className={`grid items-center gap-12 md:grid-cols-2 ${
                                    i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                                }`}
                            >
                                <motion.div variants={stagger} className="space-y-4">
                                    <motion.h3 variants={fadeUp} className="text-3xl font-bold tracking-tight">
                                        {f.title}
                                    </motion.h3>
                                    <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
                                        {f.desc}
                                    </motion.p>
                                    <motion.ul variants={stagger} className="pt-2 space-y-3">
                                        {f.points.map((p) => (
                                            <motion.li
                                                variants={fadeUp}
                                                key={p}
                                                className="flex items-start gap-3 text-base"
                                            >
                                                <Check className="mt-0.5 h-5 w-5 text-primary flex-shrink-0"/>
                                                <span>{p}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </motion.div>

                                {/* Feature mockup – no border, no shadow around card or image */}
                                <motion.div
                                    variants={fadeUp}
                                    className="relative flex justify-center p-6 bg-transparent rounded-3xl border-0 shadow-none"
                                >
                                    {/* Light mode image */}
                                    <Image
                                        src={f.img_light}
                                        alt={f.title}
                                        width={320}
                                        height={640}
                                        className="h-auto w-full max-w-xs rounded-xl dark:hidden"
                                        priority
                                    />

                                    {/* Dark mode image */}
                                    <Image
                                        src={f.img_dark}
                                        alt={f.title}
                                        width={320}
                                        height={640}
                                        className="hidden h-auto w-full max-w-xs rounded-xl dark:block"
                                        priority
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Web app screens strip */}
            <WebAppScreens/>

            {/* ============================ Pricing ============================ */}
            <section className="relative border-t border-border overflow-hidden bg-background py-20 md:py-28">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-30">
                    <div
                        className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-primary/10 via-indigo-500/10 to-purple-500/10 blur-[150px]"/>
                </div>
                <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="space-y-4"
                    >
                        <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight md:text-5xl">
                            Simple pricing, big value
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            className="mb-10 text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            Start free. Scale your subscription as your atelier grows.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.3}}
                        className="grid gap-8 md:grid-cols-3 pt-4"
                    >
                        {[
                            {
                                name: 'Solo',
                                price: 'Free',
                                desc: 'Perfect for independent tailors and hobbyists.',
                                highlight: false,
                                features: [
                                    '1 user',
                                    'Clients & measurements',
                                    'Up to 20 active orders',
                                    'Order notes & attachments',
                                    'Local reminders (no automation)',
                                    '500 MB storage'
                                ],
                                linkText: 'Start for Free'
                            },
                            {
                                name: 'Studio',
                                price: '$15',
                                monthlyPrice: '5',
                                desc: 'Designed for growing small teams and established studios.',
                                highlight: true,
                                features: [
                                    'Up to 5 team members',
                                    'Unlimited orders',
                                    'Unlimited storage',
                                    'Branded invoices',
                                    'Automated reminders & reports',
                                    'Client web portal access',
                                    'Priority support'
                                ],
                                linkText: 'Try Studio Free'
                            },
                            {
                                name: 'Atelier',
                                price: '$49',
                                monthlyPrice: '20',
                                desc: 'For full-scale ateliers requiring maximum capacity and control.',
                                highlight: false,
                                features: [
                                    'Unlimited team members',
                                    'Unlimited everything (orders, clients, storage)',
                                    'Advanced analytics & custom reports',
                                    'Data export & backups',
                                    'Full web portal access',
                                    'Dedicated account manager'
                                ],
                                linkText: 'Contact for Enterprise'
                            }
                        ].map((t) => (
                            <motion.div
                                key={t.name}
                                variants={fadeUp}
                                className={`rounded-3xl border bg-card/70 p-8 backdrop-blur transition-all duration-300 ${
                                    t.highlight
                                        ? 'border-primary ring-4 ring-primary/50 shadow-2xl shadow-primary/20'
                                        : 'border-border hover:border-primary/50'
                                }`}
                            >
                                <h3 className="text-2xl font-bold">{t.name}</h3>
                                <p className="mb-4 mt-2 text-muted-foreground text-sm">{t.desc}</p>
                                <div
                                    className="mb-8 flex items-baseline justify-center md:justify-start lg:justify-center xl:justify-start">
                  <span
                      className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-extrabold text-transparent">
                    {t.price === 'Free' ? t.price : `$${t.monthlyPrice}`}
                  </span>
                                    <span className="ml-2 text-muted-foreground">
                    {t.price === 'Free' ? '' : '/mo'}
                  </span>
                                </div>
                                <ul className="mb-8 space-y-3 text-left">
                                    {t.features.map((f) => (
                                        <li key={f} className="flex items-start gap-3">
                                            <Check className="mt-0.5 h-5 w-5 text-primary flex-shrink-0"/>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/signup"
                                    className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold shadow-md transition ${
                                        t.highlight
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'bg-muted border border-border text-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    {t.linkText}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    <p className="mt-8 text-sm text-muted-foreground">
                        No setup fees. No long-term contracts. Cancel anytime.
                    </p>
                </div>
            </section>

            {/* ======================= App store download ======================= */}
            <section className="relative border-t border-border overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-indigo-500/10 to-purple-500/10 dark:from-primary/15 dark:via-indigo-400/15 dark:to-purple-400/15"
                />

                <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8 md:py-28">
                    <motion.h2
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        variants={fadeUp}
                        className="text-4xl font-bold tracking-tight md:text-5xl"
                    >
                        Your atelier in your pocket
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
                    >
                        Manage clients and orders on the go. Seamless sync between the mobile and web app.
                    </motion.p>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.3}}
                        className="mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="https://apps.apple.com/app/your-app" aria-label="Download on the App Store">
                            <Image
                                alt="Download on the App Store"
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                width={160}
                                height={45}
                            />
                        </Link>

                        <Link
                            href="https://play.google.com/store/apps/details?id=your.app"
                            aria-label="Get it on Google Play"
                        >
                            <Image
                                alt="Get it on Google Play"
                                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                width={180}
                                height={60}
                            />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Testimonials ============================ */}
            <section className="relative border-t border-border overflow-hidden bg-background py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="mb-14 text-center"
                    >
                        <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight md:text-5xl">
                            Loved by modern ateliers
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground">
                            Real studios. Real growth.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.3}}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        {[
                            {
                                name: 'Ama T.',
                                role: 'Founder, Threads & Co.',
                                quote:
                                    'Knitted cut my admin time in half. Orders, invoices, clients — everything just flows. The app is a game-changer for on-the-go fittings.'
                            },
                            {
                                name: 'Ben K.',
                                role: 'Lead Tailor, The Bespoke Shop',
                                quote:
                                    'We moved our entire operation to Knitted. The client measurement profiles are invaluable, and the reports help us forecast materials accurately.'
                            },
                            {
                                name: 'Chloe F.',
                                role: 'Owner, Custom Creations',
                                quote:
                                    'The pricing is fair, the UI is beautiful, and my team actually enjoys using it. It’s the perfect software solution for our growing custom business.'
                            }
                        ].map((t) => (
                            <motion.blockquote
                                key={t.name}
                                variants={fadeUp}
                                className="relative rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                            >
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mb-4"/>
                                <p className="text-lg font-medium italic text-foreground before:content-['“'] after:content-['”']">
                                    {t.quote}
                                </p>
                                <footer className="mt-6 border-t border-border pt-4">
                                    <p className="font-semibold text-foreground">{t.name}</p>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </footer>
                            </motion.blockquote>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============================ CTA Footer ============================ */}
            <section className="relative overflow-hidden bg-primary py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        variants={stagger}
                        className="space-y-4 max-w-3xl mx-auto"
                    >
                        <motion.h2
                            variants={fadeUp}
                            className="text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl"
                        >
                            Ready to simplify your atelier?
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-lg text-primary-foreground/90 pb-6">
                            Start your free trial today. No credit card required.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-xl bg-primary-foreground px-8 py-4 text-lg font-bold text-primary shadow-2xl shadow-black/20 transition hover:bg-white/90"
                            >
                                Start Free Trial Now
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-xl border border-primary-foreground px-8 py-4 text-lg font-medium text-primary-foreground transition hover:bg-primary-foreground/10"
                            >
                                Talk to Sales
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Footer ============================ */}
            <footer className="border-t border-border bg-background py-10">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2 md:col-span-1 space-y-3">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src="/knitted-logo.svg" alt="Knitted Logo" width={32} height={32}/>
                                <span className="text-xl font-bold tracking-tight">Knitted</span>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Knitted, Inc.
                            </p>
                        </div>

                        {[
                            {
                                title: 'Product',
                                links: [
                                    {name: 'Features', href: '/features'},
                                    {name: 'Pricing', href: '/pricing'},
                                    {name: 'Web App', href: '/app'},
                                    {name: 'Mobile App', href: '/mobile'}
                                ]
                            },
                            {
                                title: 'Company',
                                links: [
                                    {name: 'About Us', href: '/about'},
                                    {name: 'Blog', href: '/blog'},
                                    {name: 'Careers', href: '/careers'},
                                    {name: 'Contact', href: '/contact'}
                                ]
                            },
                            {
                                title: 'Resources',
                                links: [
                                    {name: 'Help Center', href: '/help'},
                                    {name: 'Tutorials', href: '/tutorials'},
                                    {name: 'API Docs', href: '/api'},
                                    {name: 'Status', href: '/status'}
                                ]
                            },
                            {
                                title: 'Legal',
                                links: [
                                    {name: 'Privacy Policy', href: '/privacy'},
                                    {name: 'Terms of Service', href: '/terms'},
                                    {name: 'Cookie Policy', href: '/cookies'}
                                ]
                            }
                        ].map((group) => (
                            <div key={group.title} className="space-y-4">
                                <h4 className="text-sm font-semibold text-foreground">{group.title}</h4>
                                <ul className="space-y-3">
                                    {group.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground transition hover:text-primary"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </main>
    );
}