import Link from "next/link";
import { Suspense } from "react";
import { createClientServer } from "@/lib/supabase/server";
import {
    ShoppingBag,
    Package,
    Calendar,
    ChevronRight,
    Filter,
    Sparkles,
    Star,
    Clock,
    CheckCircle2,
    RotateCcw,
    AlertCircle,
    Layers,
    ArrowRight,
    Scissors
} from "lucide-react";

import Pager from "./pager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import OrderList from "@/components/orders/order-list";

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Orders | Knitted',
};

type SearchParams = Promise<{ page?: string; pageSize?: string }>;

/* --- Page Component --- */
export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
    const sb = await createClientServer();

    // 1. Auth Check
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-8 bg-background">
                <div className="text-center space-y-6">
                    <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto" />
                    <div className="space-y-4">
                        <h2 className="text-4xl font-serif text-foreground">Identity Check</h2>
                        <p className="text-muted-foreground font-sans max-w-sm mx-auto italic">Authentication is required to synchronize your workshop records.</p>
                    </div>
                    <Button asChild className="btn-primary">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // 2. Parse Params
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(9, Number(sp.pageSize ?? 9)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 3. Fetch Data
    const { data: ordersRows, error, count } = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, order_code, currency_code, created_at", { count: "exact" })
        .eq("owner", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        return (
            <div className="rounded-[2rem] bg-destructive/5 p-12 text-center space-y-4 border border-destructive/10">
                <h3 className="text-2xl font-serif text-destructive">Sync Delayed</h3>
                <p className="font-sans text-muted-foreground italic">Error retrieving project logs: {error.message}</p>
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
        const { data: totalsRows } = await sb
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
        <Suspense fallback={<OrdersLoadingSkeleton />}>
            <div className="space-y-12 pb-20 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">{total} Production Jobs</span>
                        <h1 className="text-6xl md:text-8xl font-serif text-foreground tracking-tight">Orders.</h1>
                    </div>

                    {hasOrders && (
                        <div className="flex items-center gap-4">
                            <Button variant="outline" className="h-10 px-5 rounded-full border-border bg-transparent text-foreground hover:bg-muted font-medium text-xs uppercase tracking-widest gap-3 transition-all">
                                <Filter className="h-4 w-4" /> Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                {!hasOrders ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-16">

                        {/* Immersive List View */}
                        <OrderList orders={orders} totalByOrder={totalByOrder} />

                        {/* Pagination Footer */}
                        <div className="flex flex-col items-center justify-center gap-6 pt-12 border-t border-border">
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60 italic">
                                Page <span className="text-foreground">{page}</span> of {Math.ceil(total / pageSize)}
                            </p>
                            <Pager page={page} pageSize={pageSize} total={total} />
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
        <div className="bento-card bg-secondary/30 min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-background border border-border rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Scissors className="h-8 w-8 text-foreground opacity-20" />
            </div>
            <div className="space-y-6 max-w-sm">
                <h3 className="text-4xl font-serif text-foreground leading-tight">No active production.</h3>
                <p className="text-muted-foreground font-sans text-lg leading-relaxed italic">
                    The workshop floor is waiting. Start an order from a client record to begin a new creative journey.
                </p>
            </div>

            <div className="mt-12">
                <Button className="btn-primary" asChild>
                    <Link href="/clients">Open Directory</Link>
                </Button>
            </div>
        </div>
    );
}

function OrdersLoadingSkeleton() {
    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                <div className="space-y-4">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
                    <div className="h-12 w-64 animate-pulse rounded-2xl bg-muted" />
                </div>
                <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[320px] animate-pulse rounded-[2rem] bg-muted/50" />
                ))}
            </div>
        </div>
    );
}