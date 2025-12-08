'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Enhanced gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background -z-20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-purple-500/20 rounded-full blur-[120px] opacity-40 animate-pulse -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-500/30 to-primary/20 rounded-full blur-[120px] opacity-40 -z-10" style={{ animationDelay: '1s' }} />

            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-indigo-600 p-12 md:p-20 text-white shadow-2xl shadow-primary/30"
                >
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                    {/* Enhanced floating shapes with animation */}
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                    />
                    <motion.div
                        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"
                    />

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90">
                            <Sparkles className="w-4 h-4" />
                            <span>Start your 14-day free trial</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Ready to modernize your atelier?
                        </h2>

                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Join the new generation of tailors who are saving time and delighting clients with Knitted.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link
                                href="/login"
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-white text-primary px-8 text-base font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-transparent border border-white/30 text-white px-8 text-base font-semibold hover:bg-white/10 transition-colors"
                            >
                                View Demo
                            </Link>
                        </div>

                        <p className="text-sm text-white/60 pt-4">
                            No credit card required • Cancel anytime
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
