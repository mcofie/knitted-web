"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/landing/navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsClient() {
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
                            Terms of Service
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            By using Knitted, you agree to these terms. They’re designed to ensure a fair and safe experience for all our tailors and ateliers.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Sidebar Navigation */}
                        <motion.aside variants={itemVariants} className="lg:col-span-3 lg:sticky lg:top-32 h-fit hidden lg:block">
                            <nav className="space-y-1 border-l border-border/50 pl-4">
                                {[
                                    ['Introduction', '#introduction'],
                                    ['Account Terms', '#account-terms'],
                                    ['Payment & Subscription', '#payment'],
                                    ['Cancellation', '#cancellation'],
                                    ['Intellectual Property', '#intellectual-property'],
                                    ['Limitation of Liability', '#liability'],
                                    ['Contact', '#contact'],
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

                                <section id="introduction" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">1</span>
                                        Introduction
                                    </h2>
                                    <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                        <p>
                                            Knitted (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides a platform for tailors, dressmakers, and fashion studios to manage their operations (&quot;Service&quot;).
                                            By accessing or using our Service, you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                                        </p>
                                    </div>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="account-terms" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">2</span>
                                        Account Terms
                                    </h2>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            You must provide accurate and complete information when creating an account.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            You are responsible for maintaining the security of your account and password.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            You may not use the Service for any illegal or unauthorized purpose.
                                        </li>
                                    </ul>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="payment" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">3</span>
                                        Payment & Subscription
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { title: "Billing Cycle", desc: "Subscriptions are billed on a monthly or yearly basis." },
                                            { title: "Changes", desc: "You can upgrade or downgrade your plan at any time." },
                                            { title: "Refunds", desc: "We offer a 14-day money-back guarantee for new subscriptions." },
                                            { title: "Taxes", desc: "Prices exclude taxes like VAT or GST, which may be added." }
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                                <strong className="block text-foreground mb-1">{item.title}</strong>
                                                <span className="text-sm text-muted-foreground">{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="cancellation" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">4</span>
                                        Cancellation & Termination
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        You are free to stop using our Service at any time. We also reserve the right to suspend or terminate your account if you violate these Terms, specifically for:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                        <li>Fraudulent or illegal activity.</li>
                                        <li>Abuse of the Service or other users.</li>
                                        <li>Non-payment of fees.</li>
                                    </ul>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="intellectual-property" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">5</span>
                                        Intellectual Property
                                    </h2>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            <strong>Your Data:</strong> You retain all rights to your data (client lists, measurements, etc.). We claim no intellectual property rights over the material you provide to the Service.
                                        </p>
                                        <div className="h-px bg-blue-200/50 dark:bg-blue-800/50 my-3" />
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            <strong>Our Rights:</strong> The Service itself, including its design & code, is copyright © Knitted. You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements.
                                        </p>
                                    </div>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="liability" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">6</span>
                                        Limitation of Liability
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The Service is provided &quot;as is&quot; and &quot;as available&quot;. In no event shall Knitted be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                                    </p>
                                </section>

                                <div className="h-px bg-border/50" />

                                <section id="contact" className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">7</span>
                                        Contact Us
                                    </h2>
                                    <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-foreground">Questions about the Terms?</p>
                                            <p className="text-sm text-muted-foreground">We&apos;re happy to answer them.</p>
                                        </div>
                                        <Button asChild>
                                            <a href="mailto:legal@getknitted.app">Email Legal</a>
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
