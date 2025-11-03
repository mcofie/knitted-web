// src/app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

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

    // Summary stats
    let stats: DashboardStats | null = null;
    try {
        const { data } = await sb.rpc("knitted_dashboard_stats", { p_owner: uid });
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
        sb.rpc("knitted_dashboard_trend_daily", { p_owner: uid, p_days: 30 })
    );
    const weekly = await safeSeries(
        sb.rpc("knitted_dashboard_trend_weekly", { p_owner: uid, p_weeks: 12 })
    );
    const monthly = await safeSeries(
        sb.rpc("knitted_dashboard_trend_monthly", { p_owner: uid, p_months: 12 })
    );

    const currency = settings?.currency_code ?? "GHS";

    // Simple server-side greeting (no client JS needed)
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
        <div className="space-y-6">
            {/* Greeting / business hero */}
            <div className="overflow-hidden border-0 rounded-2xl">
                <div className="bg-primary px-4 py-6 text-primary-foreground md:px-6 md:py-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background/30 ring-1 ring-primary-foreground/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                    {greeting}, <span className="opacity-95">{settings?.business_name ?? "Knitted"}</span> 👋
                                </h1>
                                <p className="mt-1 text-sm/6 opacity-90">{quote}</p>
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-md bg-background/25 px-2 py-1 ring-1 ring-primary-foreground/15">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {settings?.city ?? "—"}
                    </span>
                  </span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-background/25 px-2 py-1 ring-1 ring-primary-foreground/15">
                    Currency: <span className="font-medium">{currency}</span>
                  </span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-background/25 px-2 py-1 ring-1 ring-primary-foreground/15">
                    Unit:{" "}
                                        <span className="font-medium">
                      {settings?.measurement_system ?? "metric"}
                    </span>
                  </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Kpi
                    title="Total Orders"
                    value={num(stats?.total_orders)}
                    icon={<ReceiptText className="h-4 w-4" />}
                />
                <Kpi
                    title="Active"
                    value={
                        <>
                            <Badge variant="secondary" className="mr-2">
                                Active
                            </Badge>
                            {num(stats?.active_orders)}
                        </>
                    }
                    icon={<Activity className="h-4 w-4" />}
                />
                <Kpi
                    title="Pending Pickup"
                    value={
                        <>
                            <Badge variant="outline" className="mr-2">
                                Pending
                            </Badge>
                            {num(stats?.pending_pickup)}
                        </>
                    }
                    icon={<Clock className="h-4 w-4" />}
                />
                <Kpi
                    title="Overdue"
                    value={
                        <>
                            <Badge variant="destructive" className="mr-2">
                                Overdue
                            </Badge>
                            {num(stats?.overdue_orders)}
                        </>
                    }
                    icon={<AlertTriangle className="h-4 w-4" />}
                />
                <Kpi
                    title="Total Revenue"
                    value={<span className="tabular-nums">{money(currency, stats?.total_revenue)}</span>}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
            </div>

            {/* Main content: Charts + right column (optional space for recent items) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DashboardCharts currencyCode={currency} daily={daily} weekly={weekly} monthly={monthly} />
                </div>

                <Card className="self-start">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">At a glance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Row label="Active orders" value={num(stats?.active_orders)} />
                        <Row label="Pending pickup" value={num(stats?.pending_pickup)} />
                        <Row label="Overdue" value={num(stats?.overdue_orders)} />
                        <Row label="Total orders" value={num(stats?.total_orders)} />
                        <Row label="Total revenue" value={money(currency, stats?.total_revenue)} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/* ——— UI helpers ——— */

function Kpi({
                 title,
                 value,
                 icon,
             }: {
    title: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
}) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
                {icon ? <div className="text-muted-foreground/70">{icon}</div> : null}
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{value}</CardContent>
        </Card>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between rounded-md border border-transparent px-2 py-1 hover:border-border">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
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
            currencyDisplay: "code",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(n);
    } catch {
        return `${code} ${n.toFixed(2)}`;
    }
}