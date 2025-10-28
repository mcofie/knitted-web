'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Play, Check, ArrowRight, Star, X} from 'lucide-react';
import {motion, type Variants} from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';

/* ========================= Animations ========================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
    hidden: {opacity: 0, y: 24},
    show: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.5, ease: EASE},
    },
};

const fade: Variants = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {duration: 0.5, ease: EASE}},
};

const stagger: Variants = {
    hidden: {},
    show: {transition: {staggerChildren: 0.08, delayChildren: 0.1}},
};

/* ========================= Demo Modal ========================= */
function DemoDialog({
                        videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // ← replace with your real demo URL
                        triggerClassName = '',
                        children,
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

    const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : videoUrl;
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
                        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                    />
                </Dialog.Overlay>

                <Dialog.Content asChild>
                    <motion.div
                        initial={{opacity: 0, scale: 0.98, y: 10}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.98, y: 10}}
                        transition={{duration: 0.2, ease: EASE}}
                        className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border bg-card p-3 shadow-xl"
                    >
                        <div className="flex items-center justify-between px-2 pb-2">
                            <Dialog.Title className="text-sm font-semibold">Knitted — Quick Demo</Dialog.Title>
                            <Dialog.Close asChild>
                                <button
                                    aria-label="Close"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                                >
                                    <X className="h-4 w-4"/>
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* 16:9 responsive wrapper */}
                        <div className="relative w-full overflow-hidden rounded-md border bg-black"
                             style={{paddingTop: '56.25%'}}>
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

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        {href: '/', label: 'Home'},
        {href: '/features', label: 'Features'},
        {href: '/pricing', label: 'Pricing'},
    ];

    return (
        <main className="bg-background text-foreground min-h-screen flex flex-col">
            {/* ============================ Navbar ============================ */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    scrolled ? 'border-b bg-background/95 backdrop-blur-md shadow-sm' : 'border-transparent bg-transparent backdrop-blur-0'
                }`}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            animate={scrolled ? {scale: 0.9, opacity: 0.9} : {scale: 1, opacity: 1}}
                            transition={{duration: 0.25, ease: EASE}}
                            className="flex items-center gap-2"
                        >
                            <Image src="/knitted-logo.svg" alt="Knitted Logo" width={32} height={32}/>
                            <span className="text-lg font-semibold">Knitted</span>
                        </motion.div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden items-center gap-6 md:flex">
                        {links.map((l) => {
                            const active = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
                            return (
                                <Link key={l.href} href={l.href}
                                      className="relative text-sm font-medium text-muted-foreground hover:text-foreground">
                  <span className="relative inline-block">
                    {l.label}
                      {active && (
                          <motion.span
                              layoutId="nav-underline"
                              className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-primary"
                          />
                      )}
                  </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth + App Buttons */}
                    <div className="flex items-center gap-3">
                        {/* App Store button */}
                        <Link
                            href="https://apps.apple.com/app/knitted-your-modern-atelier/id1234567890"
                            aria-label="Download on the App Store"
                            className="hidden md:inline-flex"
                        >
                            <Image
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="Download on the App Store"
                                width={110}
                                height={36}
                                priority
                            />
                        </Link>

                        {/* Play Store button */}
                        <Link
                            href="https://play.google.com/store/apps/details?id=app.getknitted.knitted"
                            aria-label="Get it on Google Play"
                            className="hidden md:inline-flex"
                        >
                            <Image
                                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                alt="Get it on Google Play"
                                width={120}
                                height={38}
                                priority
                            />
                        </Link>

                        {/* Auth links */}
                        <Link
                            href="/login"
                            className="text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                            Sign in
                        </Link>

                        <Link
                            href="/signup"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Decorative halos */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div
                    className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 via-indigo-500/20 to-purple-500/20 blur-3xl"/>
                <div
                    className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-secondary/25 via-indigo-500/20 to-purple-500/20 blur-3xl"/>
            </div>

            {/* ============================ Hero ============================ */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-indigo-500/10 to-purple-500/10 dark:from-primary/25 dark:via-indigo-400/15 dark:to-purple-400/15"/>
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-6 md:py-24">
                    <motion.div variants={stagger} initial="hidden" whileInView="show"
                                viewport={{once: true, amount: 0.4}}>
                        <motion.h1 variants={fadeUp}
                                   className="text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
                            Tailoring,{' '}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">beautifully organized</span>.
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-4 max-w-prose text-muted-foreground">
                            Knitted is your modern atelier — manage clients, measurements, and orders with quiet
                            precision.
                        </motion.p>
                        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
                            >
                                Start free <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                            <DemoDialog
                                videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // replace with your real link
                                triggerClassName="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card/40 px-5 py-3 text-sm font-semibold transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
                            >
                                <>
                                    <Play className="h-4 w-4"/> Watch demo
                                </>
                            </DemoDialog>
                        </motion.div>
                    </motion.div>
                    <div className="">
                        <motion.div
                            variants={fadeUp}
                            className="rounded-[var(--radius-lg)] p-2"
                        >
                            <Image
                                src={'/iphone_mockup_four.png'}
                                alt={'Hero image'}
                                width={300}
                                height={100}
                                className="h-auto mx-auto rounded-[calc(var(--radius-lg)-0.5rem)]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================ Features ============================ */}
            <section className="relative border-t overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10 dark:from-primary/20 dark:via-indigo-400/10 dark:to-purple-400/10"
                />
                <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
                    <motion.div initial="hidden" whileInView="show" viewport={{once: true, amount: 0.4}}
                                className="mb-10 text-center">
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight md:text-4xl">
                            Core features
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
                            Everything you need — from first fitting to final stitch.
                        </motion.p>
                    </motion.div>

                    <div className="space-y-16">
                        {[
                            {
                                title: 'Clients & Measurements',
                                desc: 'Keep every client’s details, measurements, and preferences in one elegant profile.',
                                points: ['Measure once, reuse always', 'Notes & preferences', 'Attachments'],
                                img: '/iphone_mockup_two.png',
                            },
                            {
                                title: 'Orders & Invoices',
                                desc: 'Track every order from sketch to pickup. Create branded invoices in a click.',
                                points: ['Order stages & due dates', 'PDF invoices', 'Payments & receipts'],
                                img: '/iphone_mockup_three.png',
                            },
                            {
                                title: 'Reminders & Reports',
                                desc: 'Stay ahead of deadlines and understand what drives your atelier’s growth.',
                                points: ['Smart reminders', 'Monthly revenue & trends', 'Top clients & items'],
                                img: '/iphone_mockup_one.png',
                            },
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial="hidden"
                                whileInView="show"
                                viewport={{once: true, amount: 0.3}}
                                className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
                            >
                                <motion.div variants={stagger}>
                                    <motion.h3 variants={fadeUp} className="text-2xl font-semibold tracking-tight">
                                        {f.title}
                                    </motion.h3>
                                    <motion.p variants={fadeUp} className="mt-2 text-muted-foreground">
                                        {f.desc}
                                    </motion.p>
                                    <motion.ul variants={fade} className="mt-4 space-y-2">
                                        {f.points.map((p) => (
                                            <motion.li variants={fade} key={p} className="flex items-start gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-primary"/>
                                                <span>{p}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </motion.div>
                                <motion.div
                                    variants={fadeUp}
                                    className="rounded-[var(--radius-lg)] p-2"
                                >
                                    <Image
                                        src={f.img}
                                        alt={f.title}
                                        width={300}
                                        height={100}
                                        className="h-auto mx-auto rounded-[calc(var(--radius-lg)-0.5rem)]"
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================ Pricing ============================ */}
            <section className="relative border-t overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,theme(colors.indigo.500)/12%,transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.indigo.400)/16%,transparent)] blur-2xl"/>
                </div>
                <div className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6 md:py-20">
                    <motion.div initial="hidden" whileInView="show" viewport={{once: true, amount: 0.4}}>
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight md:text-4xl">
                            Simple pricing
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mb-10 mt-3 text-muted-foreground">
                            Start free. Scale as you grow.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.3}}
                        className="grid gap-6 md:grid-cols-3"
                    >
                        {[
                            {
                                name: 'Solo',
                                price: 'Free',
                                desc: 'Independent tailors',
                                highlight: false,
                                features: ['Clients & measurements', 'Up to 50 orders', 'Basic invoices (PDF)', 'Email support'],
                            },
                            {
                                name: 'Studio',
                                price: '$5/mo',
                                desc: 'Growing teams',
                                highlight: true,
                                features: ['Unlimited orders', 'Branded invoices', 'Reminders & reports', 'Priority support'],
                            },
                            {
                                name: 'Atelier',
                                price: '$20/mo',
                                desc: 'Full-scale ateliers',
                                highlight: false,
                                features: ['Team roles & permissions', 'Advanced analytics', 'Export & backups', 'SLA support'],
                            },
                        ].map((t) => (
                            <motion.div
                                key={t.name}
                                variants={fadeUp}
                                className={`rounded-[var(--radius-lg)] border bg-card/70 p-6 backdrop-blur ${t.highlight ? 'ring-2 ring-primary' : ''}`}
                            >
                                <h3 className="text-lg font-semibold">{t.name}</h3>
                                <p className="mb-4 text-muted-foreground">{t.desc}</p>
                                <div
                                    className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
                                    {t.price}
                                </div>
                                <ul className="mb-6 space-y-2">
                                    {t.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-left">
                                            <Check className="mt-0.5 h-4 w-4 text-primary"/>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/signup"
                                    className="inline-flex w-full items-center justify-center rounded-[var(--radius)] bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
                                >
                                    {t.highlight ? 'Try Studio' : 'Start free'}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    <p className="mt-4 text-center text-xs text-muted-foreground">No setup fees. Cancel anytime.</p>
                </div>
            </section>

            {/* ======================= App store download ======================= */}
            <section className="relative border-t overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-400/15 dark:via-indigo-400/15 dark:to-purple-400/15"
                />
                <div className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6 md:py-20">
                    <motion.h2
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.4}}
                        variants={fadeUp}
                        className="text-3xl font-bold tracking-tight md:text-4xl"
                    >
                        Get Knitted on your phone
                    </motion.h2>
                    <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
                        Manage clients and orders on the go. Seamless sync with the web app.
                    </motion.p>
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.3}}
                        className="mt-6 flex flex-wrap items-center justify-center gap-3"
                    >
                        <Link
                            href="https://apps.apple.com/app/your-app"
                            className="inline-flex items-center gap-3 rounded-[var(--radius)] px-4 py-3 text-sm font-semibold transition hover:bg-card/80"
                        >
                            <Image alt="Download on the App Store"
                                   src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                   width={140}
                                   height={40}/>
                        </Link>
                        <Link
                            href="https://play.google.com/store/apps/details?id=your.app"
                            className="inline-flex items-center gap-3 rounded-[var(--radius)] px-4 py-3 text-sm font-semibold transition hover:bg-card/80"
                        >
                            <Image alt="Get it on Google Play"
                                   src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                   width={150}
                                   height={56}/>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ============================ Testimonials ============================ */}
            <section className="relative border-t overflow-hidden">
                <div aria-hidden className="absolute inset-0 -z-10">
                    <div
                        className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-purple-500/10 via-indigo-500/10 to-transparent dark:from-purple-400/15 dark:via-indigo-400/15"/>
                </div>
                <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
                    <motion.div initial="hidden" whileInView="show" viewport={{once: true, amount: 0.4}}
                                className="mb-10 text-center">
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight md:text-4xl">
                            Loved by modern ateliers
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
                            Real studios. Real growth.
                        </motion.p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                name: 'Ama T.',
                                role: 'Founder, Threads & Co.',
                                quote: 'Knitted cut my admin time in half. Orders, invoices, clients — everything just flows.',
                            },
                            {
                                name: 'Kwesi M.',
                                role: 'Master Tailor',
                                quote: 'It feels crafted for tailors. Clean, fast, and the invoices look premium.',
                            },
                            {
                                name: 'Amina S.',
                                role: 'Bridal Atelier',
                                quote: 'From first fitting to final stitch — it keeps my studio on schedule.',
                            },
                        ].map((t) => (
                            <motion.figure
                                key={t.name}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{once: true, amount: 0.3}}
                                className="rounded-[var(--radius-lg)] border bg-card p-6"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40"/>
                                    <div>
                                        <figcaption className="text-sm font-semibold">{t.name}</figcaption>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-0.5 text-primary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current"/>
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="text-sm">“{t.quote}”</blockquote>
                            </motion.figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================ Footer ============================ */}
            <footer className="mt-auto border-t bg-card/50">
                <div className="mx-auto max-w-6xl px-4 py-10 text-center md:px-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col items-center md:items-start">
                            <Image src="/knitted-logo.svg" alt="Knitted Logo" width={32} height={32}/>
                            <p className="mt-2 text-sm text-muted-foreground">© {new Date().getFullYear()} Knitted. All
                                rights reserved.</p>
                        </div>

                        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                            <Link href="/privacy" className="hover:text-primary">
                                Privacy Policy
                            </Link>
                            <Link href="/privacy" className="hover:text-primary">
                                Terms of Service
                            </Link>
                            <Link href="/contact" className="hover:text-primary">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}