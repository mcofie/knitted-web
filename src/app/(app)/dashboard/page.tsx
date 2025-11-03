// src/app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardCharts from "../../../components/dashboard-charts";

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

    // Summary stats (RPC should return the fields in DashboardStats)
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

    // Trends (fallbacks handled in the charts component too, but we keep this clean)
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

    return (
        <div className="space-y-6">
            {/* Header / account summary */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>{settings?.business_name ?? "Knitted"}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {/* Keep it simple; you can swap this for your theme-aware hero later */}
                    City: {settings?.city ?? "—"} &middot; Currency: {currency} &middot; Unit:{" "}
                    {settings?.measurement_system ?? "metric"}
                </CardContent>
            </Card>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Stat title="Total Orders" value={num(stats?.total_orders)} />
                <Stat
                    title="Active"
                    value={
                        <>
                            <Badge variant="secondary" className="mr-2">
                                Active
                            </Badge>
                            {num(stats?.active_orders)}
                        </>
                    }
                />
                <Stat
                    title="Pending Pickup"
                    value={
                        <>
                            <Badge variant="outline" className="mr-2">
                                Pending
                            </Badge>
                            {num(stats?.pending_pickup)}
                        </>
                    }
                />
                <Stat
                    title="Overdue"
                    value={
                        <>
                            <Badge variant="destructive" className="mr-2">
                                Overdue
                            </Badge>
                            {num(stats?.overdue_orders)}
                        </>
                    }
                />
                <Stat
                    title="Total Revenue"
                    value={<span className="tabular-nums">{money(currency, stats?.total_revenue)}</span>}
                />
            </div>

            {/* Charts (theme-aware; uses dummy data if arrays are empty) */}
            <DashboardCharts currencyCode={currency} daily={daily} weekly={weekly} monthly={monthly} />
        </div>
    );
}

function Stat({ title, value }: { title: string; value: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{value}</CardContent>
        </Card>
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