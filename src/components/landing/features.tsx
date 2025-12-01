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
        <section className="relative overflow-hidden bg-secondary/5 py-16 md:py-32">
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
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
                            icon: <Sparkles className="h-6 w-6" />
                        },
                        {
                            id: '02',
                            label: 'FINANCE',
                            title: 'Orders & Invoices',
                            desc: 'Track every order from sketch to pickup. Create branded, professional PDF invoices in a single click.',
                            points: ['Order stages & due dates', 'Automated PDF invoices', 'Payments tracking & receipts'],
                            img_light: '/iphone_mockup_three_light.png',
                            img_dark: '/iphone_mockup_three_dark.png',
                            icon: <Zap className="h-6 w-6" />
                        },
                        {
                            id: '03',
                            label: 'GROWTH',
                            title: 'Reminders & Reports',
                            desc: 'Stay ahead of deadlines and gain visibility into what drives your atelier’s growth. Data made beautiful and actionable.',
                            points: ['Smart due date reminders', 'Monthly revenue & trends reports', 'Top clients & best-selling items'],
                            img_light: '/iphone_mockup_one_light.png',
                            img_dark: '/iphone_mockup_one_dark.png',
                            icon: <Shield className="h-6 w-6" />
                        }
                    ].map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
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
                                                <Check className="h-3 w-3" />
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
                                        className="absolute -inset-4 -z-10 rounded-[3.5rem] bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-50 blur-2xl" />
                                    <div
                                        className="relative overflow-hidden rounded-[2.5rem] bg-background border border-border/50">
                                        <Image src={f.img_light} alt={f.title} width={320} height={640}
                                            className="h-auto w-full dark:hidden" />
                                        <Image src={f.img_dark} alt={f.title} width={320} height={640}
                                            className="hidden h-auto w-full dark:block" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}