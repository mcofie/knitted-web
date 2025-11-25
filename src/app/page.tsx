'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, {useEffect, useMemo, useState} from 'react';
import {usePathname} from 'next/navigation';
import {
    Play,
    Check,
    ArrowRight,
    X,
    Menu,
    Sparkles,
    Zap,
    Shield,
    Globe
} from 'lucide-react';
import {motion, type Variants} from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import {IoMoonOutline} from 'react-icons/io5';
import {GoSun} from 'react-icons/go';
import {useTheme} from 'next-themes';
import WebAppScreens from '@/components/landing/web-app-screen';
import FAQ from '@/components/landing/faq';
import Footer from '@/components/landing/footer';

/* ========================= Animations ========================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
    hidden: {opacity: 0, y: 20},
    show: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.6, ease: EASE}
    }
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
            className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
        <main className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/20">
            <MobileNav/>

            {/* ============================ Navbar ============================ */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled
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
                                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === link.href
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
                {/* Ambient Background */}
                <div className="absolute inset-0 -z-10 h-full w-full bg-background">
                    <div
                        className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-40 animate-pulse"/>
                    <div
                        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[128px] opacity-40"/>
                    <GridPattern/>
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8">
                    {/* Left Content */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        className="flex flex-col justify-center space-y-8 text-center md:text-left"
                    >
                        {/* Announcement Pill */}
                        <motion.div variants={fadeUp} className="w-full md:w-fit flex justify-center md:justify-start">
                            <div
                                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md transition-colors hover:bg-primary/10 cursor-pointer">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"/>
                                <span className="mr-1">New:</span>
                                <span className="text-muted-foreground">Client Portal 2.0 &rarr;</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
                        >
                            Tailoring,{' '}
                            <span className="relative whitespace-nowrap block md:inline">
                                <span
                                    className="text-gradient-primary">
                                    reimagined
                                </span>
                                {/* Scribble underline decoration */}
                                <svg className="absolute -bottom-2 left-0 w-full h-2 md:h-3 text-primary/40 -z-10"
                                     viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                </svg>
                            </span>
                            .
                        </motion.h1>

                        <motion.p variants={fadeUp}
                                  className="max-w-xl mx-auto md:mx-0 text-lg text-muted-foreground leading-relaxed">
                            The modern operating system for forward-thinking ateliers. Manage clients, measurements, and
                            orders
                            with elegance and precision.
                        </motion.p>

                        <motion.div variants={fadeUp}
                                    className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
                            <Link
                                href="/signup"
                                className="relative inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                            >
                                Start free trial <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                            <DemoDialog
                                videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                triggerClassName="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-input bg-background/50 px-6 text-base font-semibold transition-all hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
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

                        <motion.div variants={fadeUp}
                                    className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i}
                                         className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={32}
                                               height={32}/>
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by <span className="font-semibold text-foreground">500+</span> ateliers</p>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual - Carousel */}
                    <motion.div
                        initial="hidden"
                        whileInView="animate"
                        viewport={{once: true}}
                        className="relative flex justify-center items-center perspective-1000 mt-8 md:mt-0"
                    >
                        {/* Levitating Container */}
                        <motion.div variants={float}
                                    className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">

                            {/* Carousel */}
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
                                            <div className="p-6"> {/* Added padding to prevent shadow clipping */}
                                                <div
                                                    className="relative transform transition-transform hover:scale-[1.02] duration-500">
                                                    {/* Light mode image */}
                                                    <Image
                                                        src={url + 'light.png'}
                                                        alt="Knitted app mockup"
                                                        width={350}
                                                        height={700}
                                                        className="h-auto w-full rounded-[2.5rem] dark:hidden bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 border border-black/5"
                                                        priority={index === 0}
                                                    />
                                                    {/* Dark mode image */}
                                                    <Image
                                                        src={url + 'dark.png'}
                                                        alt="Knitted app mockup"
                                                        width={350}
                                                        height={700}
                                                        className="hidden h-auto w-full rounded-[2.5rem] dark:block bg-neutral-900 shadow-[0_25px_50px_-12px_rgba(124,58,237,0.15)] ring-1 ring-white/10 border border-white/5"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>

                            {/* Floating Notification Card 1 - Left */}
                            <motion.div
                                initial={{opacity: 0, x: -50}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.5, duration: 0.8}}
                                className="absolute -left-4 lg:-left-16 top-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 lg:p-4 shadow-xl backdrop-blur-lg dark:bg-black/40"
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

                            {/* Floating Notification Card 2 - Right */}
                            <motion.div
                                initial={{opacity: 0, x: 50}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.8, duration: 0.8}}
                                className="absolute -right-4 lg:-right-12 bottom-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 lg:p-4 shadow-xl backdrop-blur-lg dark:bg-black/40"
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
                            Everything you need to <span className="text-primary">thrive</span>
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
                                img_dark: '/iphone_mockup_two_dark.png',
                                icon: <Sparkles className="h-6 w-6"/>
                            },
                            {
                                id: '02',
                                label: 'FINANCE',
                                title: 'Orders & Invoices',
                                desc: 'Track every order from sketch to pickup. Create branded, professional PDF invoices in a single click.',
                                points: ['Order stages & due dates', 'Automated PDF invoices', 'Payments tracking & receipts'],
                                img_light: '/iphone_mockup_three_light.png',
                                img_dark: '/iphone_mockup_three_dark.png',
                                icon: <Zap className="h-6 w-6"/>
                            },
                            {
                                id: '03',
                                label: 'GROWTH',
                                title: 'Reminders & Reports',
                                desc: 'Stay ahead of deadlines and gain visibility into what drives your atelier’s growth. Data made beautiful and actionable.',
                                points: ['Smart due date reminders', 'Monthly revenue & trends reports', 'Top clients & best-selling items'],
                                img_light: '/iphone_mockup_one_light.png',
                                img_dark: '/iphone_mockup_one_dark.png',
                                icon: <Shield className="h-6 w-6"/>
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
                                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary shadow-sm">
                                            {f.icon}
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
                                className={`relative flex flex-col rounded-[2rem] p-8 transition-all duration-300 ${plan.highlight
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
                                    className={`inline-flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-all ${plan.highlight
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

            <FAQ/>
            <Footer/>
        </main>
    );
}