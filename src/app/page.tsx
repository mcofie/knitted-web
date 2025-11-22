'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, {useEffect, useMemo, useState} from 'react';
import {usePathname} from 'next/navigation';
import {
    Play,
    Check,
    ArrowRight,
    Star,
    X,
    Menu,
    Smartphone,
    Scissors,
    Twitter,
    Instagram,
    Linkedin,
    Github
} from 'lucide-react';
import {motion, type Variants} from 'framer-motion'; // Removed AnimatePresence
import * as Dialog from '@radix-ui/react-dialog';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    // Removed CarouselNext, CarouselPrevious
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

const float: Variants = {
    initial: {y: 0},
    animate: {
        y: -20,
        transition: {
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
        }
    }
};

/* ========================= Helper Components ========================= */
const GridPattern = () => (
    <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-black/5 dark:stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
    >
        <defs>
            <pattern
                id="grid-pattern"
                width={40}
                height={40}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
            >
                <path d="M.5 40V.5H40" fill="none"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)"/>
    </svg>
);

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
    const [isAnnual, setIsAnnual] = useState(true);
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    const plugin = React.useRef(Autoplay({delay: 3000, stopOnInteraction: true}));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setMounted(true), []);

    const links = [
        {href: '/features', label: 'Features'},
        {href: '/pricing', label: 'Pricing'},
        {href: '/blog', label: 'Blog'}
    ];

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
            <MobileNav/>

            {/* ============================ Navbar ============================ */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                    scrolled
                        ? 'border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/60'
                        : 'border-transparent bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 z-50">
                        <motion.div
                            initial={false}
                            animate={scrolled ? {scale: 0.9, y: 0} : {scale: 1, y: 0}}
                            className="flex items-center gap-2"
                        >
                            <div
                                className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
                                <Image src="/knitted-logo.svg" alt="Knitted" width={20} height={20}
                                       className="brightness-0 invert"/>
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
                                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    pathname === link.href
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {pathname === link.href && (
                                    <motion.span
                                        layoutId="nav-pill"
                                        className="absolute inset-0 -z-10 rounded-full bg-muted"
                                        transition={{type: "spring", bounce: 0.2, duration: 0.6}}
                                    />
                                )}
                                {link.label}
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
                                    <IoMoonOutline className="h-4 w-4 transition-transform group-hover:-rotate-12"/>
                                ) : (
                                    <GoSun className="h-4 w-4 transition-transform group-hover:rotate-90"/>
                                )}
                            </button>
                        )}

                        {/* Desktop Auth Actions */}
                        <div className="hidden md:flex items-center gap-4 pl-2">
                            <div className="h-6 w-px bg-border/50"/>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/signup"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
                            >
                                <span className="relative z-10">Start Free Trial</span>
                                <div
                                    className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-indigo-500 to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100"/>
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
                                className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}/>
                        </button>
                    </div>
                </div>
            </header>

            {/* ============================ Hero ============================ */}
            <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
                <div className="absolute inset-0 -z-10 h-full w-full bg-background">
                    <div
                        className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[128px] opacity-50"/>
                    <div
                        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] opacity-50"/>
                    <GridPattern/>
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 md:grid-cols-2 md:px-8">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="flex flex-col justify-center space-y-8"
                    >
                        <motion.div variants={fadeUp} className="w-fit">
                            <div
                                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md transition-colors hover:bg-primary/10">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"/>
                                <span className="mr-1">v2.0 is here:</span>
                                <span className="text-muted-foreground">Client Portal &rarr;</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-[1.1]"
                        >
                            Tailoring,{' '}
                            <span className="relative whitespace-nowrap">
                                <span
                                    className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                                    beautifully organized
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/40 -z-10"
                                     viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                </svg>
                            </span>
                            .
                        </motion.h1>

                        <motion.p variants={fadeUp} className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                            Knitted is your modern atelier operating system. Manage clients, measurements, and orders
                            with quiet precision. Stop drowning in paper and spreadsheets.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                            <Link
                                href="/signup"
                                className="relative inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                            >
                                Start free <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                            <DemoDialog
                                videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                triggerClassName="group inline-flex h-12 items-center gap-2 rounded-xl border border-input bg-background/50 px-6 text-base font-semibold transition-all hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
                            >
                                <>
                                    <div
                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                        <Play className="h-3 w-3 fill-current ml-0.5"/>
                                    </div>
                                    Watch demo
                                </>
                            </DemoDialog>
                        </motion.div>

                        <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
                            Trusted by <span className="font-semibold text-foreground">500+</span> independent tailors
                            and ateliers.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="animate"
                        viewport={{once: true}}
                        className="relative flex justify-center items-center perspective-1000"
                    >
                        <motion.div variants={float} className="relative z-10 w-full max-w-[320px] md:max-w-[360px]">
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full"
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
                                        <CarouselItem key={index} className="pl-0">
                                            <div className="p-1">
                                                <div className="relative overflow-hidden">
                                                    <Image
                                                        src={url + 'light.png'}
                                                        alt="Knitted app mockup"
                                                        width={350}
                                                        height={700}
                                                        className="h-auto w-full rounded-[2.5rem] dark:hidden bg-white"
                                                        priority={index === 0}
                                                    />
                                                    <Image
                                                        src={url + 'dark.png'}
                                                        alt="Knitted app mockup"
                                                        width={350}
                                                        height={700}
                                                        className="hidden h-auto w-full rounded-[2.5rem] dark:block bg-neutral-900"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>

                            <motion.div
                                initial={{opacity: 0, x: -50}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.5, duration: 0.8}}
                                className="absolute -left-12 top-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-lg dark:bg-black/40"
                            >
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                                    <Check className="h-5 w-5"/>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Order #204</p>
                                    <p className="text-sm font-bold text-foreground">Deposit Paid</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{opacity: 0, x: 50}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.8, duration: 0.8}}
                                className="absolute -right-8 bottom-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-lg dark:bg-black/40"
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i}
                                             className="h-8 w-8 rounded-full border-2 border-background bg-muted"/>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">New Clients</p>
                                    <p className="text-sm font-bold text-foreground">+12 this week</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Features ============================ */}
            <section className="relative overflow-hidden bg-secondary/5 py-24 md:py-32">
                <div
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"/>

                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="mb-24 text-center md:mb-32"
                    >
                        <motion.h2 variants={fadeUp}
                                   className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Everything you need
                        </motion.h2>
                        <motion.p variants={fadeUp}
                                  className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            From first fitting to final stitch, Knitted provides the tools for quiet, organized, and
                            profitable work.
                        </motion.p>
                    </motion.div>

                    <div className="space-y-32">
                        {[
                            {
                                id: '01',
                                label: 'ORGANIZATION',
                                title: 'Clients & Measurements',
                                desc: 'Keep every client’s details, measurements, and preferences in one elegant profile. Never ask for the same size twice.',
                                points: ['Measure once, reuse always', 'Notes & preferences storage', 'Client history & attachments'],
                                img_light: '/iphone_mockup_two_light.png',
                                img_dark: '/iphone_mockup_two_dark.png'
                            },
                            {
                                id: '02',
                                label: 'FINANCE',
                                title: 'Orders & Invoices',
                                desc: 'Track every order from sketch to pickup. Create branded, professional PDF invoices in a single click.',
                                points: ['Order stages & due dates', 'Automated PDF invoices', 'Payments tracking & receipts'],
                                img_light: '/iphone_mockup_three_light.png',
                                img_dark: '/iphone_mockup_three_dark.png'
                            },
                            {
                                id: '03',
                                label: 'GROWTH',
                                title: 'Reminders & Reports',
                                desc: 'Stay ahead of deadlines and gain visibility into what drives your atelier’s growth. Data made beautiful and actionable.',
                                points: ['Smart due date reminders', 'Monthly revenue & trends reports', 'Top clients & best-selling items'],
                                img_light: '/iphone_mockup_one_light.png',
                                img_dark: '/iphone_mockup_one_dark.png'
                            }
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial="hidden"
                                whileInView="show"
                                viewport={{once: true, margin: "-100px"}}
                                className={`flex flex-col gap-12 md:flex-row md:items-center md:gap-24 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <motion.div variants={stagger} className="flex-1 space-y-8">
                                    <motion.div variants={fadeUp} className="flex items-center gap-4">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/5 font-mono text-sm font-bold text-primary">
                                            {f.id}
                                        </span>
                                        <span className="text-sm font-bold tracking-widest text-primary/60">
                                            {f.label}
                                        </span>
                                    </motion.div>
                                    <motion.h3 variants={fadeUp}
                                               className="text-3xl font-bold tracking-tight md:text-4xl">
                                        {f.title}
                                    </motion.h3>
                                    <motion.p variants={fadeUp}
                                              className="text-lg text-muted-foreground leading-relaxed">
                                        {f.desc}
                                    </motion.p>
                                    <motion.ul variants={stagger} className="space-y-4 pt-4">
                                        {f.points.map((p) => (
                                            <motion.li variants={fadeUp} key={p}
                                                       className="flex items-start gap-3 text-base">
                                                <div
                                                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Check className="h-3 w-3"/>
                                                </div>
                                                <span className="text-foreground/80">{p}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </motion.div>
                                <motion.div variants={fadeUp} className="flex-1 relative">
                                    <div
                                        className="relative mx-auto max-w-[350px] rounded-[3rem] border border-border/50 bg-white/50 p-4 shadow-2xl backdrop-blur-sm dark:bg-black/20">
                                        <div
                                            className="absolute -inset-4 -z-10 rounded-[3.5rem] bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-50 blur-2xl"/>
                                        <div
                                            className="relative overflow-hidden rounded-[2.5rem] bg-background border border-border/50">
                                            <Image src={f.img_light} alt={f.title} width={320} height={640}
                                                   className="h-auto w-full dark:hidden"/>
                                            <Image src={f.img_dark} alt={f.title} width={320} height={640}
                                                   className="hidden h-auto w-full dark:block"/>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <WebAppScreens/>

            {/* ============================ Pricing ============================ */}
            <section className="relative overflow-hidden border-t border-border bg-muted/30 py-24 md:py-32">
                <div
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"/>
                <div
                    className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"/>

                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.h2
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                        >
                            Simple pricing, <span className="text-primary">big value</span>
                        </motion.h2>

                        <motion.p
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{delay: 0.1}}
                            className="mt-4 text-lg text-muted-foreground max-w-xl"
                        >
                            Start for free. Upgrade as you scale your atelier.
                        </motion.p>

                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{delay: 0.2}}
                            className="mt-8 flex items-center gap-3 rounded-full border border-border bg-background p-1 shadow-sm"
                        >
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`relative rounded-full px-6 py-2 text-sm font-semibold transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {!isAnnual && (
                                    <motion.div
                                        layoutId="billing-pill"
                                        className="absolute inset-0 rounded-full bg-muted"
                                        transition={{type: "spring", bounce: 0.2, duration: 0.6}}
                                    />
                                )}
                                <span className="relative z-10">Monthly</span>
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`relative rounded-full px-6 py-2 text-sm font-semibold transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {isAnnual && (
                                    <motion.div
                                        layoutId="billing-pill"
                                        className="absolute inset-0 rounded-full bg-muted"
                                        transition={{type: "spring", bounce: 0.2, duration: 0.6}}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    Yearly <span
                                    className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Save 20%</span>
                                </span>
                            </button>
                        </motion.div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 lg:gap-12 items-start">
                        {[
                            {
                                name: 'Solo',
                                monthly: 0,
                                yearly: 0,
                                desc: 'Perfect for hobbyists.',
                                highlight: false,
                                features: ['1 user', '20 active orders', 'Client profiles', 'Basic measurements', 'Local reminders'],
                                cta: 'Start for Free'
                            },
                            {
                                name: 'Studio',
                                monthly: 19,
                                yearly: 15,
                                desc: 'For growing brands.',
                                highlight: true,
                                features: ['5 team members', 'Unlimited orders', 'Branded invoices', 'Automated reminders', 'Client Portal access', 'Priority support'],
                                cta: 'Try Studio Free'
                            },
                            {
                                name: 'Atelier',
                                monthly: 59,
                                yearly: 49,
                                desc: 'For full-scale production.',
                                highlight: false,
                                features: ['Unlimited team', 'Advanced analytics', 'Custom reports', 'Data export & API', 'Dedicated manager', 'White-glove onboarding'],
                                cta: 'Contact Sales'
                            }
                        ].map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{delay: i * 0.1}}
                                className={`relative flex flex-col rounded-[2rem] p-8 transition-all duration-300 ${
                                    plan.highlight
                                        ? 'bg-background border-2 border-primary shadow-2xl shadow-primary/10 md:-mt-8 md:mb-8 z-10'
                                        : 'bg-background/60 border border-border hover:border-primary/30 hover:bg-background'
                                }`}
                            >
                                {plan.highlight && (
                                    <div
                                        className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-4 py-1 text-sm font-bold text-white shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
                                </div>

                                <div className="mb-8 flex items-baseline">
                                    <span className="text-5xl font-extrabold tracking-tight">
                                        {plan.monthly === 0 ? 'Free' : `$${isAnnual ? plan.yearly : plan.monthly}`}
                                    </span>
                                    {plan.monthly !== 0 && (
                                        <span className="text-muted-foreground ml-1">/mo</span>
                                    )}
                                </div>

                                <ul className="flex-1 space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                <Check className="h-3 w-3"/>
                                            </div>
                                            <span className="text-sm text-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/signup"
                                    className={`inline-flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-all ${
                                        plan.highlight
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25'
                                            : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <p className="mt-12 text-center text-sm text-muted-foreground">
                        Prices in USD. VAT may apply. Cancel anytime.
                    </p>
                </div>
            </section>

            {/* ======================= App Store ======================= */}
            <section className="py-24 md:py-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.2}}
                        variants={fadeUp}
                        className="relative overflow-hidden rounded-[2.5rem] border border-border bg-primary/5 px-6 pt-16 shadow-sm md:px-16 md:pt-24"
                    >
                        <div className="absolute inset-0 -z-10 opacity-50">
                            <div
                                className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"/>
                            <GridPattern/>
                        </div>

                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                            <div className="flex flex-col justify-center pb-16 lg:pb-24">
                                <motion.div variants={stagger} className="space-y-6">
                                    <motion.div variants={fadeUp}
                                                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
                                        <Smartphone className="h-4 w-4"/>
                                        <span>iOS & Android Ready</span>
                                    </motion.div>

                                    <motion.h2 variants={fadeUp}
                                               className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                        Your entire atelier, <br/>
                                        <span className="text-primary">in your pocket.</span>
                                    </motion.h2>

                                    <motion.p variants={fadeUp} className="max-w-xl text-lg text-muted-foreground">
                                        Take measurements, update order statuses, and send invoices from the cutting
                                        table or the client&apos;s home.
                                    </motion.p>

                                    <motion.div variants={stagger} className="flex flex-wrap gap-4 pt-2">
                                        {['Offline Mode', 'Push Notifications', 'Camera Measure'].map((feat) => (
                                            <motion.div key={feat} variants={fadeUp}
                                                        className="flex items-center gap-2 rounded-lg bg-background/60 px-3 py-2 text-sm font-medium border border-border/50">
                                                <Check className="h-4 w-4 text-primary"/> {feat}
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 pt-6">
                                        <div className="flex flex-col gap-3">
                                            <Link href="https://apps.apple.com"
                                                  className="transition-transform hover:scale-105">
                                                <Image
                                                    alt="Download on the App Store"
                                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                                    width={150}
                                                    height={45}
                                                    className="h-[45px] w-auto"
                                                />
                                            </Link>
                                            <Link href="https://play.google.com"
                                                  className="transition-transform hover:scale-105">
                                                <Image
                                                    alt="Get it on Google Play"
                                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                                    width={165}
                                                    height={60}
                                                    className="h-[60px] w-auto -ml-2 -mt-2"
                                                />
                                            </Link>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-4 border-l border-border pl-6">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <div
                                                    className="h-16 w-16 bg-neutral-900 rounded-sm flex items-center justify-center text-white text-[8px] text-center leading-tight">
                                                    SCAN<br/>TO<br/>GET
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground w-20">Scan to install instantly</span>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{y: 100, opacity: 0, rotate: 10}}
                                whileInView={{y: 0, opacity: 1, rotate: 0}}
                                transition={{duration: 0.8, ease: EASE}}
                                viewport={{once: true}}
                                className="relative flex justify-center lg:justify-end"
                            >
                                <div className="relative z-10 w-[300px] md:w-[350px]">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-purple-500/40 blur-[60px] rounded-full"/>
                                    <div
                                        className="relative rotate-[-6deg] transition-transform duration-500 hover:rotate-0">
                                        <div className="">
                                            <Image src="/iphone_mockup_four_light.png" alt="Mobile App" width={350}
                                                   height={700} className="rounded-[2.5rem] dark:hidden"/>
                                            <Image src="/iphone_mockup_four_dark.png" alt="Mobile App" width={350}
                                                   height={700} className="hidden rounded-[2.5rem] dark:block"/>
                                        </div>
                                        <motion.div
                                            animate={{y: [0, -10, 0]}}
                                            transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                                            className="absolute -left-12 top-1/3 rounded-2xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                                                    <Check className="h-6 w-6"/>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Status</p>
                                                    <p className="font-bold text-sm">Order #204 Paid</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Testimonials ============================ */}
            <section className="relative border-t border-border bg-background/50 py-24 md:py-32">
                <div
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"/>
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="mb-16 text-center"
                    >
                        <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight md:text-5xl">
                            Loved by modern ateliers
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground">
                            Join 500+ studios streamlining their craft.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={fade}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true}}
                        className="mb-16 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                    >
                        {['Vogue Tailors', 'Savile Row Co.', 'Modern Stitch', 'Thread & Needle', 'Bespoke Inc.'].map((brand) => (
                            <span key={brand}
                                  className="text-xl font-serif italic font-bold text-foreground/80">{brand}</span>
                        ))}
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.2}}
                        className="grid gap-6 md:grid-cols-3 lg:gap-8"
                    >
                        {[
                            {
                                name: 'Ama T.',
                                role: 'Founder',
                                company: 'Threads & Co.',
                                avatarGradient: 'from-pink-500 to-rose-500',
                                quote: 'Knitted cut my admin time in half. Orders, invoices, clients — everything just flows.'
                            },
                            {
                                name: 'Ben K.',
                                role: 'Lead Tailor',
                                company: 'The Bespoke Shop',
                                avatarGradient: 'from-blue-500 to-indigo-500',
                                quote: 'We moved our entire operation to Knitted. The client measurement profiles are invaluable.'
                            },
                            {
                                name: 'Chloe F.',
                                role: 'Owner',
                                company: 'Custom Creations',
                                avatarGradient: 'from-amber-500 to-orange-500',
                                quote: 'The pricing is fair, the UI is beautiful, and my team actually enjoys using it.'
                            }
                        ].map((t, i) => (
                            <motion.div
                                key={t.name}
                                variants={fadeUp}
                                whileHover={{y: -5}}
                                className={`group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 ${i === 1 ? 'md:-mt-8 md:mb-8' : ''}`}
                            >
                                <div className="absolute right-8 top-8 opacity-10">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"
                                         className="text-primary">
                                        <path
                                            d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex gap-1 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-4 w-4 fill-primary text-primary"/>
                                        ))}
                                    </div>
                                    <p className="relative z-10 text-lg font-medium leading-relaxed text-foreground">
                                        &quot;{t.quote}&quot;
                                    </p>
                                </div>
                                <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                                    <div
                                        className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-inner`}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{t.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {t.role}, <span className="text-primary font-medium">{t.company}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============================ CTA Footer ============================ */}
            <section className="py-20 md:py-32">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.3}}
                        variants={fadeUp}
                        className="relative overflow-hidden rounded-[3rem] border border-neutral-800 bg-neutral-950 px-6 py-20 text-center shadow-2xl dark:bg-neutral-900/50 dark:border-white/10 md:px-16 md:py-24"
                    >
                        <div
                            className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"/>
                        <div
                            className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"/>
                        <div
                            className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]"/>
                        <Scissors
                            className="absolute -right-8 -top-12 h-72 w-72 text-white/[0.03] rotate-12 pointer-events-none select-none"/>

                        <div className="relative z-10 mx-auto max-w-2xl space-y-8">
                            <motion.div variants={stagger} className="space-y-6">
                                <motion.h2 variants={fadeUp}
                                           className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                                    Ready to simplify <br/>
                                    <span
                                        className="bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent">
                                        your atelier?
                                    </span>
                                </motion.h2>
                                <motion.p variants={fadeUp} className="mx-auto max-w-lg text-lg text-neutral-400">
                                    Join 500+ modern tailors who have stopped drowning in spreadsheets and started
                                    focusing on the craft.
                                </motion.p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <div className="relative group">
                                        <div
                                            className="absolute -inset-1 rounded-full bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-200"/>
                                        <Link href="/signup"
                                              className="relative inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-[0_0_40px_-10px_rgba(var(--primary),0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.6)]">
                                            Start Free Trial
                                        </Link>
                                    </div>
                                    <Link href="/contact"
                                          className="inline-flex h-14 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/50 px-8 text-lg font-medium text-white transition-colors hover:bg-neutral-800 hover:border-neutral-600 backdrop-blur-sm">
                                        Talk to Sales
                                    </Link>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    14-day free trial • No credit card required
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Footer ============================ */}
            <footer className="relative border-t border-dashed border-border/60 bg-background pt-16 pb-8">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid gap-12 xl:grid-cols-6 lg:gap-8">
                        <div className="col-span-2 flex flex-col space-y-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Image src="/knitted-logo.svg" alt="Knitted Logo" width={20} height={20}
                                           className="dark:invert"/>
                                </div>
                                <span className="text-xl font-bold tracking-tight">Knitted</span>
                            </Link>
                            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                                The operating system for modern ateliers. We help custom tailors manage measurements,
                                orders, and clients with precision.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    {icon: Twitter, href: '#'},
                                    {icon: Instagram, href: '#'},
                                    {icon: Linkedin, href: '#'},
                                    {icon: Github, href: '#'}
                                ].map((social, i) => (
                                    <Link key={i} href={social.href}
                                          className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                                        <social.icon className="h-4 w-4"/>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2 xl:col-span-4 grid grid-cols-2 gap-8 md:grid-cols-4">
                            {[
                                {
                                    title: 'Product',
                                    links: [{name: 'Features', href: '/features'}, {
                                        name: 'Pricing',
                                        href: '/pricing'
                                    }, {name: 'Changelog', href: '/changelog'}, {name: 'Download', href: '/download'}]
                                },
                                {
                                    title: 'Company',
                                    links: [{name: 'About Us', href: '/about'}, {
                                        name: 'Blog',
                                        href: '/blog'
                                    }, {name: 'Careers', href: '/careers'}, {name: 'Contact', href: '/contact'}]
                                },
                                {
                                    title: 'Resources',
                                    links: [{name: 'Community', href: '/community'}, {
                                        name: 'Help Center',
                                        href: '/help'
                                    }, {name: 'API Docs', href: '/api'}, {name: 'Status', href: '/status'}]
                                },
                                {
                                    title: 'Legal',
                                    links: [{name: 'Privacy', href: '/privacy'}, {
                                        name: 'Terms',
                                        href: '/terms'
                                    }, {name: 'Security', href: '/security'}, {name: 'Cookies', href: '/cookies'}]
                                }
                            ].map((group) => (
                                <div key={group.title} className="flex flex-col space-y-4">
                                    <h4 className="text-sm font-bold text-foreground">{group.title}</h4>
                                    <ul className="flex flex-col space-y-2.5">
                                        {group.links.map((link) => (
                                            <li key={link.name}>
                                                <Link href={link.href}
                                                      className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className="mt-16 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Knitted, Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="relative flex h-2 w-2">
                                    <span
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">All systems normal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}