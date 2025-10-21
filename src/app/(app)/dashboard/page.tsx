// src/app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardStats = {
    active_orders: number;
    total_orders: number;
    pending_pickup: number;
    overdue_orders: number;
    total_revenue: number;
};

export default async function DashboardPage() {
    const sb = await createClientServer();

    // Auth gate (prevents prerender crashes)
    const { data: { user }, error: userErr } = await sb.auth.getUser();
    if (userErr || !user) {
        redirect("/login?redirectTo=/dashboard");
    }
    const uid = user.id;

    // Settings (note: measurement_system + currency_code are your column names)
    const { data: settings } = await sb
        .schema("knitted")
        .from("account_settings")
        .select("business_name, currency_code, measurement_system")
        .eq("owner", uid)
        .maybeSingle();

    // Stats via RPC (if your RPC needs owner, pass it explicitly)
    let stats: DashboardStats | null = null;
    try {
        const { data } = await sb.rpc("knitted_dashboard_stats", { p_owner: uid });
        stats = (data ?? null) as DashboardStats | null;
    } catch {
        // swallow to avoid build/runtime crashes
    }

    // UI
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>{settings?.business_name ?? "Knitted"}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Currency: {settings?.currency_code ?? "GHS"} &middot; Unit:{" "}
                    {settings?.measurement_system ?? "metric"}
                </CardContent>
            </Card>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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
            </div>
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