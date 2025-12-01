// src/app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

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



    return (
        <DashboardClient
            settings={settings}
            stats={stats}
            daily={daily}
            weekly={weekly}
            monthly={monthly}
            currency={currency}
        />
    );
}
