'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
    Activity,
    Sparkles,
    Scissors,
    Users,
    ReceiptText,
    Search,
    MapPin,
    ArrowRight,
    Star,
    LassoSelect,
    Dribbble,
    Palette
} from 'lucide-react';
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
    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
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
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        },
    };

    return (
        <motion.div
            className="space-y-16 pb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* --- HERO SECTION: Split Layout from Image 1 --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
                <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] ml-1">{todayDate}</span>
                        <h1 className="text-7xl md:text-9xl font-serif text-foreground tracking-tight leading-[0.95]">
                            Built for how <br /> <span className="italic">you craft.</span>
                        </h1>
                    </div>

                    {/* Features list style from Image 1 */}
                    <div className="space-y-10 pl-2">
                        <DashboardFeature
                            icon={<Sparkles className="w-4 h-4 text-[#2D1B08]/40" />}
                            title="For Master Tailors"
                            description={`Consolidate your client dossier, measurements, and project manifests in one artisanal space.`}
                        />
                        <DashboardFeature
                            icon={<Palette className="w-4 h-4 text-[#2D1B08]/40" />}
                            title="Visualizing Growth"
                            description="Real-time patterns of your studio's revenue and project flow, distilled into elegant metrics."
                        />
                        <DashboardFeature
                            icon={<Scissors className="w-4 h-4 text-[#2D1B08]/40" />}
                            title="Studio Orchestration"
                            description="Organize every stitch from commission to delivery with automated studio intelligence."
                        />
                    </div>
                </div>

                <div className="lg:col-span-5 relative group">
                    {/* Graph Paper Quote Card from Image 1 */}
                    <motion.div
                        initial={{ rotate: -2, opacity: 0, scale: 0.95 }}
                        animate={{ rotate: -1.5, opacity: 1, scale: 1 }}
                        whileHover={{ rotate: 0, scale: 1.01 }}
                        className="relative h-[500px] w-full rounded-sm border border-border/10 shadow-sm overflow-hidden bg-[#fdfcfb] flex flex-col justify-between transition-all duration-700"
                    >
                        {/* Graph background layer */}
                        <div className="absolute inset-0 graph-paper opacity-[0.08]" />

                        <div className="p-12 relative z-10 space-y-10">
                            <div className="flex justify-center pt-8">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative"
                                >
                                    <Dribbble className="w-32 h-32 text-[#2D1B08]/5 rotate-12" />
                                    <LassoSelect className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-[#2D1B08]/20" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="p-12 pb-16 relative z-10 space-y-6">
                            <p className="text-3xl font-serif text-[#2D1B08] italic leading-relaxed">
                                &quot;Every commission is a legacy in the making. Your dashboard is the loom where they converge.&quot;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-0.5 w-6 bg-[#2D1B08]/20" />
                                <span className="text-[10px] font-bold text-[#2D1B08]/40 uppercase tracking-[0.2em]">Studio Philosophy</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Subtle floating elements */}
                    <div className="absolute -top-6 -right-6 h-24 w-24 bg-[#FFEBFA] rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-[#E6F4FF] rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>
            </div>

            {/* --- STATS GRID: Sticky Note Refined --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Revenue Growth - Cream squared paper feel */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 relative bg-[#FFF9E6] p-12 rounded-sm shadow-sm rotate-[-0.5deg] hover:rotate-0 hover:shadow-2xl transition-all duration-500 group overflow-hidden"
                >
                    <div className="absolute inset-0 graph-paper opacity-[0.03]" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12 mb-12">
                        <div className="space-y-4">
                            <span className="text-[9px] font-bold text-[#2D1B08]/20 uppercase tracking-[0.3em]">Studio Trends</span>
                            <h3 className="text-5xl font-serif text-[#2D1B08] tracking-tighter">Gross Valuation.</h3>
                            <p className="text-sm text-[#2D1B08]/50 font-medium max-w-sm">Aggregated revenue and order flow for <span className="text-[#2D1B08]">{settings?.business_name || 'your atelier'}</span>.</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-5xl font-serif text-[#2D1B08] tabular-nums tracking-tighter">{money(currency, stats?.total_revenue)}</span>
                            <span className="text-[9px] font-bold text-[#2D1B08]/20 uppercase tracking-widest mt-2">Lifetime Total</span>
                        </div>
                    </div>

                    <div className="relative z-10 bg-white/40 p-8 rounded-lg border border-[#2D1B08]/5 shadow-inner">
                        <DashboardCharts
                            currencyCode={currency}
                            daily={daily}
                            weekly={weekly}
                            monthly={monthly}
                        />
                    </div>
                </motion.div>

                {/* Status breakdown - Soft Pink Note */}
                <motion.div
                    variants={itemVariants}
                    className="relative bg-[#FFEBFA] p-12 rounded-sm shadow-sm rotate-[1deg] hover:rotate-0 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group overflow-hidden"
                >
                    <div className="absolute inset-0 graph-paper opacity-[0.03]" />
                    <div className="space-y-6 relative z-10">
                        <span className="text-[9px] font-bold text-[#2D1B08]/20 uppercase tracking-[0.3em]">Lifecycle</span>
                        <h3 className="text-5xl font-serif text-[#2D1B08] tracking-tighter">Active Loom.</h3>
                        <p className="text-[#2D1B08]/60 font-medium text-lg leading-relaxed italic">
                            {stats?.active_orders} projects currently being hand-crafted within the workshop.
                        </p>
                    </div>

                    <div className="flex items-end justify-between mt-12 relative z-10">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-14 h-14 rounded-full bg-white/60 border-2 border-[#FFEBFA] flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                                    <Activity className="w-5 h-5 text-[#2D1B08]/20" />
                                </div>
                            ))}
                        </div>
                        <Badge className="bg-[#2D1B08] text-[#FFEBFA] border-none px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-md">
                            Details
                        </Badge>
                    </div>
                </motion.div>
            </div>

            {/* --- QUICK ACCESS: Minimal Table Feel from Image 2 --- */}
            <motion.div variants={itemVariants} className="space-y-12">
                <div className="flex items-center justify-between border-b border-border/40 pb-6 px-2">
                    <h3 className="text-4xl font-serif text-foreground tracking-tight">Studio Registry.</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <span>Management Modules</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAction icon={<Users className="w-4 h-4" />} label="Dossier Directory" color="#FFF9E6" index="01" />
                    <QuickAction icon={<ReceiptText className="w-4 h-4" />} label="New Commission" color="#E6F4FF" index="02" />
                    <QuickAction icon={<Search className="w-4 h-4" />} label="Global Discovery" color="#FFF1E6" index="03" />
                    <QuickAction icon={<Activity className="w-4 h-4" />} label="Atelier Reports" color="#F0F0F0" index="04" />
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ——— UI helpers ——— */

function DashboardFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex items-start gap-6 group">
            <div className="mt-1 flex-shrink-0">
                <div className="h-6 w-6 border border-[#2D1B08]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D1B08] group-hover:text-white transition-all duration-300">
                    <Star className="w-2.5 h-2.5 fill-current" />
                </div>
            </div>
            <div className="space-y-1">
                <h4 className="text-xl font-serif text-[#2D1B08]">{title}</h4>
                <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed max-w-sm">
                    {description}
                </p>
            </div>
        </div>
    );
}

function QuickAction({ icon, label, color, index }: { icon: React.ReactNode, label: string, color?: string, index: string }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01, rotate: [0, 0.5] }}
            style={{ backgroundColor: color || 'var(--card)' }}
            className="flex items-center justify-between p-8 rounded-sm border border-border/5 shadow-sm cursor-pointer transition-all hover:shadow-xl group relative overflow-hidden"
        >
            <div className="absolute top-4 left-4 text-[8px] font-bold text-[#2D1B08]/10 uppercase tracking-widest">{index}</div>
            <div className="flex items-center gap-5 relative z-10 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-white/50 border border-white/20 flex items-center justify-center text-[#2D1B08] group-hover:bg-[#2D1B08] group-hover:text-white transition-all duration-500 shadow-sm">
                    {icon}
                </div>
                <span className="font-bold text-xs text-[#2D1B08] tracking-[0.15em] uppercase">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2D1B08]/20 group-hover:translate-x-2 transition-transform relative z-10" />
        </motion.div>
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
