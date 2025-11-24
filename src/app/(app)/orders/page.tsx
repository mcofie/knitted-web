import {Suspense} from "react";
import {createClientServer} from "@/lib/supabase/server";
import {ShoppingBag, FileClock} from "lucide-react";

import OrdersListItems from "@/app/(app)/clients/[id]/order-list-items";
import Pager from "./pager";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button"; // Assuming you have this

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function OrdersPage({searchParams}: { searchParams: SearchParams }) {
    const sb = await createClientServer();

    // 1. Auth Check
    const {data: {user}} = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Access Denied</h2>
                    <p className="text-muted-foreground">Please sign in to view orders.</p>
                </div>
            </div>
        );
    }

    // 2. Parse Params
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(5, Number(sp.pageSize ?? 20)));
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
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                Error loading orders: {error.message}
            </div>
        );
    }

    const orders = ordersRows ?? [];
    const total = count ?? 0;
    const hasOrders = orders.length > 0;

    // 4. Fetch Totals (Optimization: Only if orders exist)
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
            <div className="space-y-8 pb-10">

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
                        <p className="text-sm text-muted-foreground">
                            Track production status and manage order history.
                        </p>
                    </div>
                    {/* Optional: Add "New Order" button here if needed */}
                </div>

                {/* Content Section */}
                {!hasOrders ? (
                    <EmptyState/>
                ) : (
                    <div className="space-y-4">
                        <Card className="overflow-hidden border shadow-sm">
                            {/* OrdersListItems likely contains the Table body.
                 We wrap it here to ensure it adheres to the card style.
              */}
                            <div className="overflow-x-auto">
                                <OrdersListItems orders={orders} totalsByOrder={totalByOrder}/>
                            </div>
                        </Card>

                        {/* Pagination Footer */}
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row px-2">
                            <p className="text-xs text-muted-foreground">
                                Showing <span className="font-medium">{from + 1}</span> to{" "}
                                <span className="font-medium">{Math.min(to + 1, total)}</span> of{" "}
                                <span className="font-medium">{total}</span> orders
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground"/>
            </div>
            <h3 className="text-lg font-semibold">No orders found</h3>
            <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
                You haven't created any orders yet. Start by going to a client's profile to initiate an order.
            </p>
        </div>
    );
}

function OrdersLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-32 animate-pulse rounded-md bg-muted"/>
                    <div className="h-4 w-64 animate-pulse rounded-md bg-muted"/>
                </div>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                        <div className="h-12 w-12 animate-pulse rounded bg-muted"/>
                        <div className="h-4 w-1/3 animate-pulse rounded bg-muted"/>
                        <div className="h-4 w-1/4 animate-pulse rounded bg-muted"/>
                    </div>
                ))}
            </div>
        </div>
    );
}