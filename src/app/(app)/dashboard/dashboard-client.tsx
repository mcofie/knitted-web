'use client';

import React from 'react';
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
    // Greeting Logic
    const hour = new Date().getHours();
    const greeting =
        hour < 5 || hour >= 20
            ? 'Good evening'
            : hour < 12
                ? 'Good morning'
                : hour < 17
                    ? 'Good afternoon'
                    : 'Good evening';

    const quotePool = [
        'Measure twice, cut once.',
        'Every stitch tells a story.',
        'Consistency turns craft into mastery.',
        'Details make the design.',
        'Small improvements, big results.',
    ];
    const quote = quotePool[new Date().getDay() % quotePool.length];

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
            className="space-y-8 pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero / Greeting Section */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-sm"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <div className="relative px-6 py-10 md:px-10 md:py-12">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary/80">
                                <Sparkles className="h-4 w-4" />
                                <span>{settings?.business_name ?? 'Knitted Atelier'}</span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {greeting}, Tailor.
                            </h1>
                            <p className="text-muted-foreground md:text-lg max-w-lg font-light leading-relaxed">
                                &quot;{quote}&quot;
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm font-medium bg-white/50 dark:bg-black/20 backdrop-blur border-white/20 dark:border-white/10 shadow-sm rounded-full"
                            >
                                <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                {settings?.city || 'Location not set'}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm font-medium bg-white/50 dark:bg-black/20 backdrop-blur border-white/20 dark:border-white/10 shadow-sm rounded-full"
                            >
                                <Wallet className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                {currency}
                            </Badge>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    variants={itemVariants}
                    title="Total Revenue"
                    value={money(currency, stats?.total_revenue)}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                    trend="+12% from last month"
                    trendUp={true}
                />
                <StatCard
                    variants={itemVariants}
                    title="Active Orders"
                    value={num(stats?.active_orders)}
                    icon={<Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    trend="+3 new today"
                    trendUp={true}
                />
                <StatCard
                    variants={itemVariants}
                    title="Pending Pickup"
                    value={num(stats?.pending_pickup)}
                    icon={<Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                    trend="Requires attention"
                    trendUp={false}
                    alert={(stats?.pending_pickup ?? 0) > 0}
                />
                <StatCard
                    variants={itemVariants}
                    title="Overdue"
                    value={num(stats?.overdue_orders)}
                    icon={<AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                    trend="Action needed"
                    trendUp={false}
                    alert={(stats?.overdue_orders ?? 0) > 0}
                />
            </div>

            {/* Main Content Area - Bento Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Charts */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-md h-full">
                        <CardHeader>
                            <CardTitle>Performance</CardTitle>
                            <CardDescription>Revenue and order trends over time</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <DashboardCharts
                                currencyCode={currency}
                                daily={daily}
                                weekly={weekly}
                                monthly={monthly}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Summary/Actions */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <Card className="shadow-sm border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-md h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ReceiptText className="h-5 w-5 text-primary" />
                                Business Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 flex-1">
                            <div className="space-y-6">
                                <SummaryRow
                                    label="Total Orders"
                                    value={num(stats?.total_orders)}
                                    icon={<Package className="h-4 w-4" />}
                                />
                                <SummaryRow
                                    label="Active Now"
                                    value={num(stats?.active_orders)}
                                    icon={<Activity className="h-4 w-4" />}
                                />
                                <SummaryRow
                                    label="Pending Pickup"
                                    value={num(stats?.pending_pickup)}
                                    icon={<Clock className="h-4 w-4" />}
                                />
                            </div>

                            <div className="mt-auto rounded-2xl bg-gradient-to-br from-muted/50 to-muted p-6 border border-white/10 dark:border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Lifetime Revenue
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px] uppercase tracking-wider font-semibold"
                                    >
                                        All Time
                                    </Badge>
                                </div>
                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                    {money(currency, stats?.total_revenue)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ——— UI helpers ——— */

function StatCard({
    title,
    value,
    icon,
    trend,
    trendUp,
    alert,
    className,
    variants,
}: {
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    alert?: boolean;
    className?: string;
    variants?: Variants;
}) {
    return (
        <motion.div variants={variants}>
            <Card
                className={cn(
                    'overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-md',
                    className
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    <div
                        className={cn(
                            'h-9 w-9 rounded-xl flex items-center justify-center shadow-sm transition-colors',
                            alert
                                ? 'bg-rose-100 dark:bg-rose-900/20'
                                : 'bg-white/50 dark:bg-white/10 border border-white/20'
                        )}
                    >
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    {trend && (
                        <p
                            className={cn(
                                'text-xs mt-1 font-medium',
                                alert
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : trendUp
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-muted-foreground'
                            )}
                        >
                            {trend}
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function SummaryRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors -mx-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 shadow-sm group-hover:border-primary/20 group-hover:text-primary transition-all">
                    {icon}
                </div>
                {label}
            </div>
            <span className="font-semibold tabular-nums">{value}</span>
        </div>
    );
}

function num(n?: number | null) {
    return typeof n === 'number' ? n.toLocaleString() : '—';
}

function money(code: string, n?: number | null) {
    if (typeof n !== 'number') return '—';
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: code,
            currencyDisplay: 'symbol',
            maximumFractionDigits: 0, // Cleaner look for dashboard
        }).format(n);
    } catch {
        return `${code} ${n.toFixed(2)}`;
    }
}
