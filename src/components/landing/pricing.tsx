'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section className="relative overflow-hidden border-t border-border bg-muted/30 py-24 md:py-32">
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div
                className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                    >
                        Simple pricing, <span className="text-primary">big value</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-muted-foreground max-w-xl"
                    >
                        Start for free. Upgrade as you scale your atelier.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
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
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
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
                                            <Check className="h-3 w-3" />
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
                    Prices in USD. Taxes may apply.
                </p>
            </div>
        </section>
    );
}
