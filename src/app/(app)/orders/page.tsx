import Link from "next/link";
import {createClientServer} from "@/lib/supabase/server";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import Pager from "./pager";
import ClientTime from "@/components/ClientTime";

type Props = { searchParams: { page?: string; pageSize?: string } };

export const dynamic = "force-dynamic";

export default async function OrdersPage({searchParams}: Props) {
    const sb =await  createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    if (!user) return <div className="p-6">You must be signed in.</div>;

    // pagination
    const page = Math.max(1, Number(searchParams.page ?? 1));
    const pageSize = Math.min(100, Math.max(5, Number(searchParams.pageSize ?? 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 1) fetch orders (without totals)
    const {data: ordersRows, error, count} = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status,order_code, currency_code, created_at", {count: "exact"})
        .eq("owner", user.id) // keep consistent with your RLS model
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

        // Explicit row type for order_totals
        type OrderTotalRow = {
            order_id: string;
            computed_total: number | null;
        };

        const {data: totalsRows} = await sb
            .schema("knitted")
            .from("order_totals")
            .select("order_id, computed_total")
            .in("order_id", orderIds);

        totalByOrder = (totalsRows ?? []).reduce(
            (acc: Record<string, number>, r: OrderTotalRow) => {
                acc[r.order_id] = Number(r.computed_total ?? 0);
                return acc;
            },
            {}
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Orders</h1>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} • {total.toLocaleString()} total
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((o) => {
                                    const total = totalByOrder[o.id] ?? 0; // ← computed_total from view
                                    return (
                                        <TableRow key={o.id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/orders/${o.id}`} className="hover:underline">
                                                    {o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`}
                                                </Link>
                                                <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                                                    <ClientTime iso={o.created_at}/>
                                                </div>
                                            </TableCell>
                                            <TableCell>{o.status}</TableCell>
                                            <TableCell className="text-right">
                                                {o.currency_code} {total.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                                            No orders yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="pt-3">
                        <Pager page={page} pageSize={pageSize} total={total}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}