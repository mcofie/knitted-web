"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Scissors, Sparkles } from "lucide-react";

export default function About() {
    return (
        <section id="about" className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 uppercase tracking-widest">
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Built with Love</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl mb-8">
                        Tools for <span className="text-primary italic">humans</span>, <br />
                        not just records.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bento-card p-12 bg-primary text-white border-0 overflow-hidden relative"
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <Sparkles className="w-12 h-12 mb-8 text-secondary" />
                                <h3 className="text-4xl mb-6 text-white leading-tight">
                                    Design that feels as <br />good as it looks.
                                </h3>
                                <p className="text-xl text-white/80 leading-relaxed max-w-md">
                                    Knitted was created because we saw how clunky and complex tailoring software was.
                                    We built something better.
                                </p>
                            </div>
                            <div className="mt-20 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 border border-white/20" />
                                <p className="font-bold text-lg italic">— The Knitted Team</p>
                            </div>
                        </div>
                        {/* Abstract Shape */}
                        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" />
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bento-card p-12 bg-white"
                        >
                            <div className="flex items-start gap-8">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-3xl mb-4">Secure & Sync</h4>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Your data is encrypted and synced across all devices.
                                        Manage your workshop from the phone or your desk.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bento-card p-12 bg-secondary/30 border-secondary/20"
                        >
                            <div className="flex items-start gap-8">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Scissors className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-3xl mb-4">Made for Craft</h4>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Built based on feedback from real master tailors.
                                        We speak your language—from seam to swatch.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
