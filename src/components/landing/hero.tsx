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
            {/* Ambient Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background">
                <div
                    className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] opacity-50 animate-pulse" />
                <div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] opacity-50" />
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
                    {/* Announcement Pill */}
                    <motion.div variants={fadeUp} className="w-full md:w-fit flex justify-center md:justify-start">
                        <div
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md transition-colors hover:bg-primary/10 cursor-pointer">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                            <span className="mr-1">New:</span>
                            <span className="text-muted-foreground">Client Portal 2.0 &rarr;</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="text-5xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
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
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
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
                            className="relative inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                        >
                            Start free trial <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <DemoDialog
                            videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            triggerClassName="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-input bg-background/50 px-6 text-base font-semibold transition-all hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
                        >
                            <>
                                <div
                                    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    <Play className="h-3 w-3 fill-current ml-0.5" />
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
                                        height={32} />
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

                        {/* Floating Notification Card 1 - Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -left-4 lg:-left-16 top-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 lg:p-4 shadow-xl backdrop-blur-lg dark:bg-black/40"
                        >
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                                <Check className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Order #204</p>
                                <p className="text-sm font-bold text-foreground">Deposit Paid</p>
                            </div>
                        </motion.div>

                        {/* Floating Notification Card 2 - Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute -right-4 lg:-right-12 bottom-1/4 hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 lg:p-4 shadow-xl backdrop-blur-lg dark:bg-black/40"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i}
                                        className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
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
    );
}