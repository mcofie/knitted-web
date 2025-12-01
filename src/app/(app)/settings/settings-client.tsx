'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { Settings2 } from 'lucide-react';
import SettingsForm from '@/components/settings/SettingsForm';
import { cn } from '@/lib/utils';

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
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto py-8 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your business profile, preferences, and account configuration.
                </p>
            </motion.div>

            {/* Business Profile Card */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-sm"
            >
                {/* Decorative background */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

                <div className="relative px-8 pt-12 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="relative h-28 w-28 rounded-full ring-4 ring-white/50 dark:ring-white/10 bg-muted shadow-lg overflow-hidden">
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
                    <div className="text-center sm:text-left space-y-2 mb-2">
                        <h2 className="text-2xl font-bold leading-none tracking-tight">
                            {settings?.business_name || 'New Business'}
                        </h2>
                        <p className="text-sm font-medium text-muted-foreground">
                            Knitted Account • Version {version}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Form Section */}
            <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-md shadow-sm p-8"
            >
                <div className="mb-8 border-b border-white/10 pb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        General Configuration
                    </h3>
                </div>

                <SettingsForm initial={settings ?? {}} version={version} />
            </motion.div>
        </motion.div>
    );
}
