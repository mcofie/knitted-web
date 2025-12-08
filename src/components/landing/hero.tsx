'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import {
    Play,
    Check,
    ArrowRight,
    X,
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';

/* ========================= Animations ========================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE }
    }
};

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const float: Variants = {
    initial: { y: 0 },
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
                <path d="M.5 40V.5H40" fill="none" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />
                </Dialog.Overlay>

                <Dialog.Content asChild>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: EASE }}
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
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* 16:9 responsive wrapper */}
                        <div
                            className="relative w-full overflow-hidden rounded-xl border border-border bg-black"
                            style={{ paddingTop: '56.25%' }}
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

export default function Hero() {
    const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

    return (
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-40 md:pb-32">
            {/* Enhanced Ambient Background with Mesh Gradient */}
            {/* Ambient Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background overflow-hidden">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-40 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[128px] opacity-30" />
                {/* Additional subtle blob for complexity without noise */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
                <GridPattern />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8">
                {/* Left Content */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    className="flex flex-col justify-center space-y-8 text-center md:text-left"
                >


                    <motion.h1
                        variants={fadeUp}
                        className="text-5xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
                    >
                        Tailoring,{' '}
                        <span className="relative whitespace-nowrap block md:inline">
                            <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(124,58,237,0.3)]">
                                reimagined
                            </span>
                            {/* Enhanced scribble underline decoration */}
                            <svg className="absolute -bottom-2 left-0 w-full h-2 md:h-3 text-primary/50 -z-10 animate-pulse"
                                viewBox="0 0 100 10" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                                    </linearGradient>
                                </defs>
                                <path d="M0 5 Q 50 10 100 5" stroke="url(#underline-gradient)" strokeWidth="2.5" fill="none" />
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
                            href="/login"
                            className="group relative inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10 flex items-center gap-2">
                                Start free trial
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <DemoDialog
                            videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            triggerClassName="group relative inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-border/50 bg-background/80 px-6 text-base font-semibold transition-all hover:bg-accent/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm overflow-hidden"
                        >
                            <>
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary transition-all group-hover:from-primary group-hover:to-purple-600 group-hover:text-white group-hover:scale-110">
                                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                                </div>
                                <span className="relative z-10">Watch demo</span>
                            </>
                        </DemoDialog>
                    </motion.div>


                </motion.div>

                {/* Right Visual - Carousel */}
                <motion.div
                    initial="hidden"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="relative hidden md:flex justify-center items-center perspective-1000 mt-8 md:mt-0"
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

                        {/* Enhanced Floating Notification Card 1 - Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -left-4 lg:-left-16 top-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/20 bg-white/80 dark:bg-black/60 p-3 lg:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5" />
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 relative z-10 shadow-inner">
                                <Check className="h-5 w-5" strokeWidth={2.5} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order #204</p>
                                <p className="text-sm font-bold text-foreground">Deposit Paid</p>
                            </div>
                        </motion.div>

                        {/* Enhanced Floating Notification Card 2 - Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute -right-4 lg:-right-12 bottom-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/20 bg-white/80 dark:bg-black/60 p-3 lg:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-white/20 via-transparent to-transparent dark:from-white/5" />
                            <div className="flex -space-x-2 relative z-10">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-purple-500/30 shadow-md" />
                                ))}
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Clients</p>
                                <p className="text-sm font-bold text-foreground">+12 this week</p>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </div>
        </section >
    );
}