'use client';

import Image from 'next/image';
import React from 'react';
import {
    Sparkles,
    Zap,
    Shield,
    Check
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

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

export default function Features() {
    return (
        <section className="relative overflow-hidden bg-background py-24 md:py-32">
            {/* Subtle grid pattern for texture */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />

            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    className="mb-20 text-center"
                >
                    <motion.h2 variants={fadeUp}
                        className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        Everything you need to <span className="text-primary">thrive</span>
                    </motion.h2>
                    <motion.p variants={fadeUp}
                        className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        From first fitting to final stitch, Knitted provides the tools for quiet, organized, and visible work.
                    </motion.p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Feature 1: Organization */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="group relative md:col-span-2 overflow-hidden rounded-[2.5rem] border border-border/40 bg-secondary/5 p-8 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="space-y-4">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Clients & Measurements</h3>
                                <p className="text-muted-foreground leading-relaxed max-w-md">
                                    Keep every client’s details, measurements, and preferences in one elegant profile. Never ask for the same size twice.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                                {['Measure once, reuse always', 'Notes & preferences storage'].map((p) => (
                                    <div key={p} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual for Feature 1 - Abstract representation or part of UI */}
                        <div className="absolute top-1/2 -right-12 md:-right-24 w-[350px] lg:w-[450px] -translate-y-1/2 rotate-[-5deg] opacity-80 transition-transform group-hover:rotate-0 group-hover:scale-105 duration-500 hidden sm:block">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border/20 shadow-2xl bg-background/50 backdrop-blur-sm">
                                <Image
                                    src="/iphone_mockup_two_light.png"
                                    alt="Client Profile"
                                    fill
                                    className="object-cover dark:hidden"
                                />
                                <Image
                                    src="/iphone_mockup_two_dark.png"
                                    alt="Client Profile"
                                    fill
                                    className="object-cover hidden dark:block"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: Finance - Vertical Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-secondary/5 p-8 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight mb-3">Orders & Invoices</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Create branded, professional PDF invoices in a single click.
                            </p>

                            {/* Visual specific to vertical card */}
                            <div className="mt-auto relative w-full aspect-square rounded-2xl overflow-hidden border border-border/20 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="/iphone_mockup_three_light.png"
                                    alt="Invoicing"
                                    fill
                                    className="object-cover object-top dark:hidden"
                                />
                                <Image
                                    src="/iphone_mockup_three_dark.png"
                                    alt="Invoicing"
                                    fill
                                    className="object-cover object-top hidden dark:block"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 3: Growth - Full Width or Third Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="group relative md:col-span-3 overflow-hidden rounded-[2.5rem] border border-border/40 bg-secondary/5 p-8 md:p-12 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-border/20 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                                <Image
                                    src="/iphone_mockup_one_light.png" // Using existing image for now, ideally wide aspect
                                    alt="Analytics"
                                    fill
                                    className="object-cover object-center dark:hidden"
                                />
                                <Image
                                    src="/iphone_mockup_one_dark.png"
                                    alt="Analytics"
                                    fill
                                    className="object-cover object-center hidden dark:block"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                            </div>

                            <div className="order-1 md:order-2 space-y-6">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight">Reminders & Growth</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Stay ahead of deadlines and gain visibility into what drives your atelier’s growth. With smart reminders and beautiful data visualization, you&apos;ll never miss a beat.
                                </p>
                                <ul className="grid grid-cols-1 gap-3">
                                    {['Smart due date reminders', 'Monthly revenue & trends reports', 'Top clients & best-selling items'].map((p) => (
                                        <li key={p} className="flex items-center gap-3 text-base font-medium">
                                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Check className="h-3 w-3" />
                                            </div>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}