'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { Settings2, Sparkles, Coffee, Heart, Star, Palette, ShieldCheck, Zap, ChevronRight, UserCircle, MapPin, Scissors } from 'lucide-react';
import SettingsForm from '@/components/settings/SettingsForm';

interface SettingsClientProps {
    settings: {
        business_name?: string;
        city?: string;
        currency_code?: string;
        [key: string]: unknown;
    } | null;
    version: string;
}

export default function SettingsClient({ settings, version }: SettingsClientProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 80, damping: 20 },
        },
    };

    return (
        <motion.div
            className="max-w-5xl mx-auto space-y-12 pb-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Content */}
            <div className="flex flex-col gap-2 px-2">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.25em] leading-none">Global Config</span>
                <h1 className="text-6xl md:text-8xl font-serif text-foreground tracking-tight">Settings.</h1>
            </div>

            {/* Profile Immersive Card - PINK NOTE STYLE */}
            <motion.div
                variants={itemVariants}
                whileHover={{ rotate: 0, scale: 1.01 }}
                style={{ backgroundColor: "#FFEBFA" }}
                className="relative p-12 flex flex-col md:flex-row items-center gap-10 group overflow-hidden rounded-sm border border-border/20 shadow-sm transition-all duration-500 rotate-[-1deg]"
            >
                {/* Decoration Index */}
                <div className="absolute top-8 left-8 flex items-center gap-2 text-[#2D1B08]/20 font-medium uppercase tracking-[0.2em] text-[10px]">
                    <span>Profile</span>
                </div>

                <div className="relative pt-2">
                    <div className="relative h-32 w-32 rounded-[2rem] bg-white/50 border border-white/20 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-sm">
                        <Image
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                                settings?.business_name || 'Guest'
                            )}`}
                            alt={settings?.business_name || 'Avatar'}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4 pt-2">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#2D1B08] leading-tight">
                            {settings?.business_name || 'Your Atelier'}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-semibold uppercase tracking-widest text-[#2D1B08]/40">
                            <span className="italic">Studio Administrator</span>
                            <div className="h-1 w-1 rounded-full bg-[#2D1B08]/10" />
                            <span>v{version}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-[#2D1B08]/50 italic font-sans font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{settings?.city || 'Global Atelier'}</span>
                    </div>
                </div>

                <div className="hidden md:flex h-12 w-12 border border-[#2D1B08]/10 rounded-full items-center justify-center group-hover:bg-[#2D1B08] group-hover:text-white transition-all duration-300 shadow-sm">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </motion.div>

            {/* Configuration Bento Card - CREAM NOTE STYLE */}
            <motion.div
                variants={itemVariants}
                style={{ backgroundColor: "#FFF1E6" }}
                className="relative rounded-sm border border-border/20 shadow-sm overflow-hidden rotate-[0.5deg] hover:rotate-0 transition-all duration-500"
            >
                <div className="px-10 py-12 border-b border-[#2D1B08]/5 bg-white/10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/40 border border-white/20 shadow-sm rounded-2xl flex items-center justify-center">
                            <Palette className="w-6 h-6 text-[#2D1B08] stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-serif text-[#2D1B08]">Preferences</h3>
                            <p className="text-sm font-sans text-[#2D1B08]/60 mt-1 font-medium">Fine-tune your atelier&apos;s digital workspace.</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 lg:p-14">
                    <div className="max-w-2xl bg-white/30 p-8 rounded-2xl border border-white/20 shadow-sm">
                        <SettingsForm initial={settings ?? {}} version={version} />
                    </div>
                </div>
            </motion.div>

            {/* Footer / Support Card */}
            <motion.div variants={itemVariants} className="bento-card bg-foreground p-12 text-background flex items-center justify-between group cursor-pointer border-none">
                <div className="space-y-2">
                    <span className="text-[10px] font-medium text-background/50 uppercase tracking-[0.2em]">Next Steps</span>
                    <h4 className="text-4xl font-serif">Need expert help?</h4>
                    <p className="text-background/60 font-sans italic text-lg leading-relaxed">Chat with our creative concierge for bespoke support.</p>
                </div>
                <div className="h-16 w-16 bg-background/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-8 h-8 text-background" />
                </div>
            </motion.div>
        </motion.div>
    );
}

