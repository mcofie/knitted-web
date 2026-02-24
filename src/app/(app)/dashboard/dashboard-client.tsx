'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
    Activity,
    Clock,
    AlertTriangle,
    ReceiptText,
    TrendingUp,
    MapPin,
    Sparkles,
    Wallet,
    Package,
    Coffee,
    Heart,
    Star,
    Layers,
    ChevronRight,
    Search,
    Scissors,
    Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import DashboardCharts from '@/components/dashboard-charts';

type DashboardStats = {
    active_orders: number;
    total_orders: number;
    pending_pickup: number;
    overdue_orders: number;
    total_revenue: number;
};

type SeriesPoint = { x: string; orders: number; revenue: number };

interface DashboardClientProps {
    settings: {
        business_name?: string;
        city?: string;
        currency_code?: string;
        [key: string]: unknown;
    } | null;
    stats: DashboardStats | null;
    daily: SeriesPoint[];
    weekly: SeriesPoint[];
    monthly: SeriesPoint[];
    currency: string;
}

export default function DashboardClient({
    settings,
    stats,
    daily,
    weekly,
    monthly,
    currency,
}: DashboardClientProps) {
    const [greeting, setGreeting] = useState('Welcome back');
    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(
            hour < 5 || hour >= 20 ? 'Good evening' :
                hour < 12 ? 'Good morning' :
                    hour < 17 ? 'Good afternoon' : 'Good evening'
        );

        setTodayDate(new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }));
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <motion.div
            className="space-y-12 bg-background"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Content */}
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">{todayDate}</span>
                <div className="flex items-center justify-between">
                    <h1 className="text-6xl font-serif text-foreground">Today</h1>
                </div>
            </div>

            {/* Featured Insight Card */}
            <motion.div variants={itemVariants}>
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-secondary p-12 lg:p-16">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 text-foreground/40 font-medium uppercase tracking-widest text-xs">
                            <Sparkles className="w-4 h-4" />
                            <span>Business Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1]">
                            Your studio is <span className="italic">{(stats?.active_orders ?? 0) > 5 ? 'thriving' : 'calm'}</span> today.
                        </h2>
                        <p className="text-lg text-muted-foreground font-sans max-w-md leading-relaxed">
                            You currently have {stats?.active_orders ?? 0} active projects and {stats?.pending_pickup ?? 0} ready for pick-up.
                        </p>

                        <div className="pt-4">
                            <button className="btn-primary">
                                View all orders
                            </button>
                        </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 hidden lg:block">
                        <Scissors className="w-64 h-64 rotate-12" />
                    </div>
                </div>
            </motion.div>

            {/* Grid for core sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Revenue & Growth */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <div className="bento-card p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-serif text-foreground">Growth Patterns</h3>
                                <p className="text-sm text-muted-foreground mt-1">Order and revenue insights for {settings?.business_name || 'your atelier'}.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block">Total Revenue</span>
                                <span className="text-2xl font-serif mt-1 block">{money(currency, stats?.total_revenue)}</span>
                            </div>
                        </div>
                        <DashboardCharts
                            currencyCode={currency}
                            daily={daily}
                            weekly={weekly}
                            monthly={monthly}
                        />
                    </div>
                </motion.div>

                {/* Status Breakdown */}
                <motion.div variants={itemVariants}>
                    <div className="bento-card p-10 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-serif text-foreground">Active Work</h3>
                            <p className="text-muted-foreground font-sans text-base leading-relaxed">
                                {stats?.active_orders} orders are currently in production on the loom.
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                        <Activity className="w-4 h-4 text-foreground/20" />
                                    </div>
                                ))}
                            </div>
                            <Badge variant="secondary" className="bg-secondary text-foreground hover:bg-secondary/80 border-none px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest">
                                Manage
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                {/* Studio Quote/Info */}
                <motion.div variants={itemVariants}>
                    <div className="bento-card p-10 h-full flex flex-col justify-between border-none bg-muted/30">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-serif text-foreground">{settings?.business_name || 'Atelier'}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{settings?.city || 'Location not set'}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-xl font-serif italic text-foreground/60 leading-relaxed">
                                &ldquo;Every stitch is a signature. Keep crafting with excellence.&rdquo;
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Access */}
            <motion.div variants={itemVariants} className="space-y-8 pt-8">
                <h3 className="text-2xl font-serif text-foreground">Quick Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickAction icon={<Users className="w-4 h-4" />} label="New Client" />
                    <QuickAction icon={<ReceiptText className="w-4 h-4" />} label="Create Order" />
                    <QuickAction icon={<Search className="w-4 h-4" />} label="Global Search" />
                    <QuickAction icon={<Activity className="w-4 h-4" />} label="Analytics" />
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ——— UI helpers ——— */

function QuickAction({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="bento-card p-6 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors group">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all">
                {icon}
            </div>
            <span className="font-medium text-sm text-foreground tracking-tight">{label}</span>
        </div>
    );
}

function money(code: string, n?: number | null) {
    if (typeof n !== 'number') return '—';
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: code,
            currencyDisplay: 'symbol',
            maximumFractionDigits: 0,
        }).format(n);
    } catch {
        return `${code} ${n.toFixed(2)}`;
    }
}
