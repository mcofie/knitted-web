"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/landing/navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyClient() {
    const lastUpdated = "28 Oct 2025";

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Navbar />

            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="absolute top-[10%] right-[0%] w-[50%] h-[60%] rounded-full bg-blue-500/5 blur-3xl" />
            </div>

            <main className="pt-32 pb-20 px-4 md:px-6">
                <motion.div
                    className="mx-auto max-w-4xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-8">
                        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                Legal
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Last updated: {lastUpdated}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Privacy Policy
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            We believe in transparency. Here&apos;s exactly how we collect, use, and protect your data when you use Knitted.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Sidebar Navigation */}
                        <motion.aside variants={itemVariants} className="lg:col-span-3 lg:sticky lg:top-32 h-fit hidden lg:block">
                            <nav className="space-y-1 border-l border-border/50 pl-4">
                                {[
                                    ['Information Collection', '#information-we-collect'],
                                    ['How We Use Data', '#how-we-use-information'],
                                    ['Data Sharing', '#data-sharing'],
                                    ['Your Rights', '#your-rights'],
                                    ['Security', '#security'],
                                    ['Contact Us', '#contact'],
                                ].map(([label, href]) => (
                                    <a
                                        key={href}
                                        href={href}
                                        className="block py-1.5 text-sm text-muted-foreground hover:text-primary hover:border-l-2 hover:border-primary -ml-[17px] pl-4 transition-all"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </nav>
                        </motion.aside>

                        {/* Main Content Card */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-9"
                        >
                            <div className="rounded-3xl border border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-xl shadow-sm p-8 md:p-12 space-y-12">

                                <section id="information-we-collect" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">1</span>
                                        Information We Collect
                                    </h2>
                                    <div className="prose prose-gray dark:prose-invert max-w-none">
                                        <p className="text-muted-foreground leading-relaxed">
                                            We collect information to provide and improve Knitted’s features for tailors, dressmakers, and fashion studios.
                                        </p>
                                        <ul className="grid gap-4 mt-6">
                                            {[
                                                { title: "Account & Profile", desc: "Name, email, workspace name, role, and authentication identifiers." },
                                                { title: "Studio Data", desc: "Client records, measurements, orders, notes, and attachments." },
                                                { title: "Usage & Device", desc: "App interactions, OS version, app version, crash logs, and approximate region." },
                                                { title: "Payments", desc: "Subscription billing metadata handled securely by our payment provider." }
                                            ].map((item, i) => (
                                                <li key={i} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <strong className="block text-foreground mb-1">{item.title}</strong>
                                                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="how-we-use-information" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">2</span>
                                        How We Use Information
                                    </h2>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            Provide core tailoring and studio management features.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            Sync your data securely across web and mobile devices.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            Handle subscriptions, authentication, and customer support.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            Improve performance, reliability, and app design.
                                        </li>
                                    </ul>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="data-sharing" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">3</span>
                                        Data Sharing
                                    </h2>
                                    <p className="text-muted-foreground mb-4">
                                        We only share information with trusted service providers for specific purposes:
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {['Hosting & Databases', 'Authentication (Google OAuth)', 'Payments & Billing', 'Crash & Analytics'].map((item) => (
                                            <div key={item} className="p-3 bg-muted/30 rounded-lg text-sm font-medium text-foreground border border-border/50 text-center">
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                        <strong>Note:</strong> We never sell your personal data. Data may be disclosed only if legally required.
                                    </p>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="your-rights" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">4</span>
                                        Your Rights
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {[
                                            'Access, update, or delete your data',
                                            'Request data export',
                                            'Withdraw consent',
                                            'Request account deletion'
                                        ].map((right, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="font-medium">{right}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="security" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">5</span>
                                        Security
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We use encryption, access controls, and secure data handling practices to protect your information. Your data is yours, and we treat it with the highest level of care and security.
                                    </p>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="contact" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">6</span>
                                        Contact Us
                                    </h2>
                                    <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-foreground">Have questions about your privacy?</p>
                                            <p className="text-sm text-muted-foreground">Our team is here to help clarify any concerns.</p>
                                        </div>
                                        <Button asChild>
                                            <a href="mailto:support@getknitted.app">Email Support</a>
                                        </Button>
                                    </div>
                                </section>

                            </div>

                            <div className="mt-8 text-center text-sm text-muted-foreground">
                                <p>&copy; {new Date().getFullYear()} Knitted. All rights reserved.</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
