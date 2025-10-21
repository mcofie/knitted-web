import Link from "next/link"
import {createClientServer} from "@/lib/supabase/server";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import MeasurementsSection from "./measurements";
import ClientActions from "@/app/(app)/clients/[id]/client-actions";
import ClientTime from "@/components/ClientTime"; // ⬅️ import client component (no dynamic)


export default async function ClientDetailPage({params}: { params: { id: string } }) {
    const sb = await createClientServer();

    // 1) Client
    const {data: client, error: clientErr} = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name,name, phone, email, city, country_code")
        .eq("id", params.id)
        .single();

    if (clientErr || !client) {
        return <div className="p-6">Error: {clientErr?.message ?? "Client not found"}</div>;
    }

    // 2) Orders (no totals yet)
    const {data: orders, error: ordersErr} = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status,order_code, currency_code, created_at")
        .eq("customer_id", params.id)
        .order("created_at", {ascending: false});

    if (ordersErr) {
        return <div className="p-6">Error loading orders: {ordersErr.message}</div>;
    }

    // 3) Totals for those orders (from view) → map by order_id
    let totalsByOrder: Record<string, number> = {};
    if (orders && orders.length > 0) {
        const orderIds = orders.map(o => o.id);
        const {data: totalsRows, error: totalsErr} = await sb
            .schema("knitted")
            .from("order_totals")
            .select("order_id, computed_total")
            .in("order_id", orderIds);

        if (!totalsErr && totalsRows) {
            totalsByOrder = totalsRows.reduce(
                (acc: Record<string, number>, r: { order_id: string; computed_total: number | null }) => {
                    acc[r.order_id] = Number(r.computed_total ?? 0);
                    return acc;
                },
                {}
            );
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">{client.full_name}</h1>
                <ClientActions clientId={client.id} clientName={client.full_name}/>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                    <div>{client.email ?? "—"}</div>
                    <div>{client.phone ?? "—"}</div>
                    <div>
                        {client.city ?? "—"} {client.country_code ? `• ${client.country_code}` : ""}
                    </div>
                </CardContent>
            </Card>

            <div className="pt-2">
                <h2 className="text-base font-semibold">Orders</h2>
            </div>
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
                        {(orders ?? []).map((o) => {
                            const computed = totalsByOrder[o.id] ?? 0;
                            return (
                                <TableRow key={o.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/orders/${o.id}`} className="hover:underline">
                                            {o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`}
                                        </Link>
                                        <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                                            {/*{new Date(o.created_at).toISOString()}*/}
                                            <ClientTime iso={o.created_at}/>
                                        </div>
                                    </TableCell>
                                    <TableCell>{o.status}</TableCell>
                                    <TableCell className="text-right">
                                        {o.currency_code} {computed.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {(!orders || orders.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                    No orders yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody> </Table>
            </div>

            {/* NEW: Measurements under Orders */}
            <MeasurementsSection customerId={client.id}/>

        </div>
    );
}