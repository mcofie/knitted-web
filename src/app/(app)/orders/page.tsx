import Link from "next/link";
import {Suspense} from "react";
import {createClientServer} from "@/lib/supabase/server";
import {
    ShoppingBag,
    Package,
    Calendar,
    ChevronRight,
    CreditCard,
    Filter
} from "lucide-react";

import Pager from "./pager";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ page?: string; pageSize?: string }>;

/* --- Helper: Status Styles --- */
function getStatusStyles(status: string) {
    const s = status.toLowerCase().replace('_', ' ');
    switch (s) {
        case 'delivered':
        case 'completed':
        case 'ready':
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
        case 'in production':
        case 'processing':
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
        case 'confirmed':
            return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
        case 'cancelled':
            return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
        default: // pending / draft
            return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
    }
}

/* --- Page Component --- */
export default async function OrdersPage({searchParams}: { searchParams: SearchParams }) {
    const sb = await createClientServer();

    // 1. Auth Check
    const {data: {user}} = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground"/>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Access Restricted</h2>
                    <p className="text-muted-foreground">Please sign in to manage orders.</p>
                </div>
            </div>
        );
    }

    // 2. Parse Params
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(9, Number(sp.pageSize ?? 9))); // Default 9 for grid
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 3. Fetch Data
    const {data: ordersRows, error, count} = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, order_code, currency_code, created_at", {count: "exact"})
        .eq("owner", user.id)
        .order("created_at", {ascending: false})
        .range(from, to);

    if (error) {
        return (
            <div
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-destructive"/>
                Error loading orders: {error.message}
            </div>
        );
    }

    const orders = ordersRows ?? [];
    const total = count ?? 0;
    const hasOrders = orders.length > 0;

    // 4. Fetch Totals
    let totalByOrder: Record<string, number> = {};
    if (hasOrders) {
        const orderIds = orders.map((o) => o.id);
        const {data: totalsRows} = await sb
            .schema("knitted")
            .from("order_totals")
            .select("order_id, computed_total")
            .in("order_id", orderIds);

        totalByOrder = (totalsRows ?? []).reduce<Record<string, number>>((acc, r) => {
            acc[r.order_id] = Number(r.computed_total ?? 0);
            return acc;
        }, {});
    }

    return (
        <Suspense fallback={<OrdersLoadingSkeleton/>}>
            <div className="space-y-8 pb-20 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage production, track status, and view history.
                        </p>
                    </div>

                    {hasOrders && (
                        <div className="flex items-center gap-2">
                            {/* Optional Filter Button Placeholder */}
                            <Button variant="outline" size="sm"
                                    className="h-9 gap-2 text-muted-foreground hidden sm:flex">
                                <Filter className="h-3.5 w-3.5"/> Filter
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                {!hasOrders ? (
                    <EmptyState/>
                ) : (
                    <div className="space-y-6">

                        {/* Modern Grid View */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orders.map((o) => {
                                const amount = totalByOrder[o.id] ?? 0;
                                const code = o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`;
                                const statusStyle = getStatusStyles(o.status);

                                // Format Date
                                const dateStr = new Date(o.created_at).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                });

                                // Format Money
                                const moneyStr = new Intl.NumberFormat(undefined, {
                                    style: 'currency',
                                    currency: o.currency_code,
                                    maximumFractionDigits: 2
                                }).format(amount);

                                return (
                                    <Link
                                        key={o.id}
                                        href={`/orders/${o.id}`}
                                        className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Package className="h-5 w-5"/>
                                                </div>
                                                <div>
                                                    <h3 className="font-mono text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                                        {code}
                                                    </h3>
                                                    <div
                                                        className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                                        <Calendar className="h-3 w-3 opacity-70"/>
                                                        <span>{dateStr}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <ChevronRight
                                                className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all"/>
                                        </div>

                                        <div
                                            className="mt-auto pt-3 border-t border-dashed flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium border uppercase tracking-wider", statusStyle)}
                                            >
                                                {o.status.replace('_', ' ')}
                                            </Badge>

                                            <span className="text-sm font-bold tabular-nums tracking-tight">
                        {moneyStr}
                      </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination Footer */}
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row pt-4 border-t">
                            <p className="text-xs text-muted-foreground text-center sm:text-left">
                                Showing <span className="font-medium text-foreground">{from + 1}</span> to{" "}
                                <span className="font-medium text-foreground">{Math.min(to + 1, total)}</span> of{" "}
                                <span className="font-medium text-foreground">{total}</span> orders
                            </p>
                            <Pager page={page} pageSize={pageSize} total={total}/>
                        </div>
                    </div>
                )}
            </div>
        </Suspense>
    );
}

// --- Sub Components ---

function EmptyState() {
    return (
        <div
            className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-muted/5 p-8 text-center animate-in fade-in-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-sm mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground"/>
            </div>
            <h3 className="text-lg font-semibold">No orders yet</h3>
            <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
                Get started by creating your first order from a client's profile.
            </p>
            <Button variant="outline" asChild>
                <Link href="/clients">Go to Clients</Link>
            </Button>
        </div>
    );
}

function OrdersLoadingSkeleton() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-32 animate-pulse rounded-md bg-muted"/>
                    <div className="h-4 w-64 animate-pulse rounded-md bg-muted"/>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-40 animate-pulse rounded-xl border bg-muted/30"/>
                ))}
            </div>
        </div>
    );
}