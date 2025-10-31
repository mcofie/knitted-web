import Link from "next/link";
import {createClientServer} from "@/lib/supabase/server";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import Pager from "./pager";
import ClientTime from "@/components/ClientTime";
import {Suspense} from "react";
import OrdersListItems from "@/app/(app)/clients/[id]/order-list-items";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function OrdersPage({searchParams}: { searchParams: SearchParams }) {
    const sb = await createClientServer();
    const {
        data: {user},
    } = await sb.auth.getUser();
    if (!user) return <div className="p-6">You must be signed in.</div>;

    // await the async searchParams first
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(5, Number(sp.pageSize ?? 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 1) fetch orders (without totals)
    const {data: ordersRows, error, count} = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, order_code, currency_code, created_at", {count: "exact"})
        .eq("owner", user.id)
        .order("created_at", {ascending: false})
        .range(from, to);

    if (error) return <div className="p-6">Error: {error.message}</div>;

    const orders = ordersRows ?? [];
    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // 2) fetch totals for these orders in one shot
    let totalByOrder: Record<string, number> = {};
    if (orders.length > 0) {
        const orderIds = orders.map((o) => o.id);

        type OrderTotalRow = {
            order_id: string;
            computed_total: number | null;
        };

        const {data: totalsRows} = await sb
            .schema("knitted")
            .from("order_totals")
            .select("order_id, computed_total")
            .in("order_id", orderIds);

        totalByOrder = (totalsRows ?? []).reduce<Record<string, number>>((acc, r: OrderTotalRow) => {
            acc[r.order_id] = Number(r.computed_total ?? 0);
            return acc;
        }, {});
    }

    return (
        <Suspense fallback={null}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Orders</h1>
                    <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages} • {total.toLocaleString()} total
                    </div>
                </div>

                <div>
                    <div className="overflow-x-auto">
                        <OrdersListItems orders={orders} totalsByOrder={totalByOrder}/>
                    </div>

                    <div className="pt-3">
                        <Pager page={page} pageSize={pageSize} total={total}/>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}