// src/app/(app)/dashboard/page.tsx
import {redirect} from "next/navigation";
import {createClientServer} from "@/lib/supabase/server";
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
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
    ArrowUpRight
} from "lucide-react";
import {cn} from "@/lib/utils"; // Assuming you have a utils file

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardStats = {
    active_orders: number;
    total_orders: number;
    pending_pickup: number;
    overdue_orders: number;
    total_revenue: number;
};

type SeriesPoint = { x: string; orders: number; revenue: number };

export default async function DashboardPage() {
    const sb = await createClientServer();

    // Auth gate
    const {
        data: {user},
        error: userErr,
    } = await sb.auth.getUser();
    if (userErr || !user) {
        redirect("/login?redirectTo=/dashboard");
    }
    const uid = user!.id;

    // Settings
    const {data: settings} = await sb
        .schema("knitted")
        .from("account_settings")
        .select("business_name, currency_code, measurement_system, city")
        .eq("owner", uid)
        .maybeSingle();

    // Summary stats
    let stats: DashboardStats | null = null;
    try {
        const {data} = await sb.rpc("knitted_dashboard_stats", {p_owner: uid});
        stats = (data ?? null) as DashboardStats | null;
    } catch {
        stats = null;
    }

    // Helper to safely unwrap RPCs returning series arrays
    async function safeSeries(promise: ReturnType<typeof sb.rpc>): Promise<SeriesPoint[]> {
        try {
            const r = await promise;
            return (r.data as SeriesPoint[] | null) ?? [];
        } catch {
            return [];
        }
    }

    // Trends
    const daily = await safeSeries(
        sb.rpc("knitted_dashboard_trend_daily", {p_owner: uid, p_days: 30})
    );
    const weekly = await safeSeries(
        sb.rpc("knitted_dashboard_trend_weekly", {p_owner: uid, p_weeks: 12})
    );
    const monthly = await safeSeries(
        sb.rpc("knitted_dashboard_trend_monthly", {p_owner: uid, p_months: 12})
    );

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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"/>
                <div className="relative px-6 py-8 md:px-8 md:py-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <Sparkles className="h-4 w-4"/>
                                <span>{settings?.business_name ?? "Knitted Atelier"}</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                {greeting}, Tailor.
                            </h1>
                            <p className="text-muted-foreground md:text-lg max-w-lg">
                                "{quote}"
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary"
                                   className="px-3 py-1.5 text-sm font-normal bg-background/50 backdrop-blur border shadow-sm">
                                <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground"/>
                                {settings?.city || "Location not set"}
                            </Badge>
                            <Badge variant="secondary"
                                   className="px-3 py-1.5 text-sm font-normal bg-background/50 backdrop-blur border shadow-sm">
                                <Wallet className="mr-1.5 h-3.5 w-3.5 text-muted-foreground"/>
                                {currency}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={money(currency, stats?.total_revenue)}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-600"/>}
                    className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20"
                />
                <StatCard
                    title="Active Orders"
                    value={num(stats?.active_orders)}
                    icon={<Activity className="h-5 w-5 text-blue-600"/>}
                    className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20"
                />
                <StatCard
                    title="Pending Pickup"
                    value={num(stats?.pending_pickup)}
                    icon={<Clock className="h-5 w-5 text-amber-600"/>}
                    className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20"
                />
                <StatCard
                    title="Overdue"
                    value={num(stats?.overdue_orders)}
                    icon={<AlertTriangle className="h-5 w-5 text-rose-600"/>}
                    className="bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-border/60">
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
                    <Card className="shadow-sm border-border/60 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ReceiptText className="h-5 w-5 text-primary"/>
                                Business Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">

                            <div className="space-y-4">
                                <SummaryRow
                                    label="Total Orders"
                                    value={num(stats?.total_orders)}
                                    icon={<Package className="h-4 w-4"/>}
                                />
                                <SummaryRow
                                    label="Active Now"
                                    value={num(stats?.active_orders)}
                                    icon={<Activity className="h-4 w-4"/>}
                                />
                                <SummaryRow
                                    label="Pending Pickup"
                                    value={num(stats?.pending_pickup)}
                                    icon={<Clock className="h-4 w-4"/>}
                                />
                            </div>

                            <div className="rounded-xl bg-muted/50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                                    <Badge variant="outline" className="bg-background text-[10px]">Lifetime</Badge>
                                </div>
                                <div className="text-2xl font-bold tracking-tight text-foreground">
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
                      className,
                  }: {
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    className?: string;
}) {
    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className="h-8 w-8 rounded-full bg-background/80 flex items-center justify-center shadow-sm">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
            </CardContent>
        </Card>
    );
}

function SummaryRow({label, value, icon}: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between group">
            <div
                className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <div
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {icon}
                </div>
                {label}
            </div>
            <span className="font-semibold">{value}</span>
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