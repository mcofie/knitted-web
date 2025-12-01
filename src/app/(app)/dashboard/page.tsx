// src/app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardCharts from "../../../components/dashboard-charts";
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
    // ArrowUpRight removed (unused)
} from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: 'Dashboard',
};

type DashboardStats = {
    active_orders: number;
    total_orders: number;
    pending_pickup: number;
    overdue_orders: number;
    total_revenue: number;
};



export default async function DashboardPage() {
    const sb = await createClientServer();

    // Auth gate
    const {
        data: { user },
        error: userErr,
    } = await sb.auth.getUser();
    if (userErr || !user) {
        redirect("/login?redirectTo=/dashboard");
    }
    const uid = user!.id;

    // Settings
    const { data: settings } = await sb
        .schema("knitted")
        .from("account_settings")
        .select("business_name, currency_code, measurement_system, city")
        .eq("owner", uid)
        .maybeSingle();

    // Fetch all orders for stats calculation
    const { data: orders } = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, total, created_at, due_date, payment_status")
        .eq("owner", uid)
        .neq("status", "cancelled");

    const allOrders = orders || [];

    // Calculate Stats
    const stats: DashboardStats = {
        total_orders: allOrders.length,
        active_orders: allOrders.filter(o => ['confirmed', 'in_production', 'ready'].includes(o.status)).length,
        pending_pickup: allOrders.filter(o => o.status === 'ready').length,
        overdue_orders: allOrders.filter(o => {
            if (['delivered', 'cancelled', 'paid'].includes(o.status)) return false;
            if (!o.due_date) return false;
            return new Date(o.due_date) < new Date();
        }).length,
        total_revenue: allOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    };

    // Helper for Chart Data Aggregation
    const aggregateData = (orders: typeof allOrders, formatKey: (date: Date) => string, daysLimit?: number) => {
        const grouped = new Map<string, { orders: number, revenue: number }>();
        const now = new Date();

        orders.forEach(o => {
            const date = new Date(o.created_at);
            // Filter by time range if needed
            if (daysLimit) {
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > daysLimit) return;
            }

            const key = formatKey(date);
            const current = grouped.get(key) || { orders: 0, revenue: 0 };
            grouped.set(key, {
                orders: current.orders + 1,
                revenue: current.revenue + (Number(o.total) || 0)
            });
        });

        // Convert to array and sort
        return Array.from(grouped.entries())
            .map(([x, data]) => ({ x, ...data }))
            .sort((a, b) => a.x.localeCompare(b.x)); // Basic string sort, might need refinement for dates
    };

    // Generate Chart Data
    // Daily (Last 30 days)
    const daily = aggregateData(allOrders, (d) => d.toISOString().split('T')[0], 30);

    // Weekly (Last 12 weeks) - Key: "Week N" or Start Date
    // Using ISO week date would be better but keeping it simple: "YYYY-Www"
    const getWeekKey = (d: Date) => {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week1 = new Date(date.getFullYear(), 0, 4);
        const week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        return `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    };
    const weekly = aggregateData(allOrders, getWeekKey, 12 * 7);

    // Monthly (Last 12 months) - Key: "YYYY-MM"
    const monthly = aggregateData(allOrders, (d) => d.toISOString().slice(0, 7), 365);


    const currency = settings?.currency_code ?? "GHS";

    // Greeting Logic
    const hour = new Date().getHours();
    const greeting =
        hour < 5 || hour >= 20
            ? "Good evening"
            : hour < 12
                ? "Good morning"
                : hour < 17
                    ? "Good afternoon"
                    : "Good evening";

    const quotePool = [
        "Measure twice, cut once.",
        "Every stitch tells a story.",
        "Consistency turns craft into mastery.",
        "Details make the design.",
        "Small improvements, big results.",
    ];
    const quote = quotePool[new Date().getDay() % quotePool.length];

    return (
        <div className="space-y-8 pb-8">
            {/* Hero / Greeting Section */}
            <div className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
                <div className="relative px-6 py-10 md:px-10 md:py-12">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary/80">
                                <Sparkles className="h-4 w-4" />
                                <span>{settings?.business_name ?? "Knitted Atelier"}</span>
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
                                className="px-4 py-2 text-sm font-medium bg-background/50 backdrop-blur border-border/50 shadow-sm rounded-full"
                            >
                                <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                {settings?.city || "Location not set"}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm font-medium bg-background/50 backdrop-blur border-border/50 shadow-sm rounded-full"
                            >
                                <Wallet className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                {currency}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={money(currency, stats?.total_revenue)}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                    trend="+12% from last month"
                    trendUp={true}
                />
                <StatCard
                    title="Active Orders"
                    value={num(stats?.active_orders)}
                    icon={<Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    trend="+3 new today"
                    trendUp={true}
                />
                <StatCard
                    title="Pending Pickup"
                    value={num(stats?.pending_pickup)}
                    icon={<Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                    trend="Requires attention"
                    trendUp={false}
                    alert={stats?.pending_pickup > 0}
                />
                <StatCard
                    title="Overdue"
                    value={num(stats?.overdue_orders)}
                    icon={<AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                    trend="Action needed"
                    trendUp={false}
                    alert={stats?.overdue_orders > 0}
                />
            </div>

            {/* Main Content Area - Bento Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-border/60 h-full">
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
                </div>

                {/* Right Column: Summary/Actions */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-border/60 h-full flex flex-col">
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

                            <div className="mt-auto rounded-2xl bg-gradient-to-br from-muted/50 to-muted p-6 border border-border/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Lifetime Revenue
                                    </span>
                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">
                                        All Time
                                    </Badge>
                                </div>
                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                    {money(currency, stats?.total_revenue)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
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
}: {
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    alert?: boolean;
    className?: string;
}) {
    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md border-border/60", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                    alert ? "bg-rose-100 dark:bg-rose-900/20" : "bg-background border border-border/50"
                )}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                {trend && (
                    <p className={cn("text-xs mt-1 font-medium",
                        alert ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                    )}>
                        {trend}
                    </p>
                )}
            </CardContent>
        </Card>
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
        <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-muted/50 transition-colors -mx-2">
            <div
                className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border/50 shadow-sm group-hover:border-primary/20 group-hover:text-primary transition-all">
                    {icon}
                </div>
                {label}
            </div>
            <span className="font-semibold tabular-nums">{value}</span>
        </div>
    );
}

function num(n?: number | null) {
    return typeof n === "number" ? n.toLocaleString() : "—";
}

function money(code: string, n?: number | null) {
    if (typeof n !== "number") return "—";
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: code,
            currencyDisplay: "symbol",
            maximumFractionDigits: 0, // Cleaner look for dashboard
        }).format(n);
    } catch {
        return `${code} ${n.toFixed(2)}`;
    }
}