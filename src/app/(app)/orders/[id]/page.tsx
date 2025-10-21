import {redirect} from "next/navigation";
import Link from "next/link";
import {createClientServer} from "@/lib/supabase/server";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import PaymentsSection from "./payments";
import StatusSelect from "./status-select";
import ReadyAtPicker from "./ready-at-picker";
import AttachmentsSection from "./attachments";
import ClientTime from "@/components/ClientTime";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({params}: { params: { id: string } }) {
    const sb = await createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    if (!user) redirect("/login");

    const {data: order, error} = await sb
        .schema("knitted")
        .from("orders")
        .select(`id, status, notes, order_code, created_at, ready_at, currency_code,
    customer:customers ( id, full_name, phone, email, city, country_code ),
    items:order_items ( id, description, quantity, unit_price, currency_code )
  `)
        .eq("id", params.id)
        .eq("owner", user.id) // keep if your RLS is owner-based
        // .returns<OrderRow>()
        .single();

    const newOrder = order as OrderRow | null; // no `.data`

    if (!order) {
        return (
            <div className="p-6 space-y-2">
                <div>Order not found / not visible.</div>
                {error && <pre className="text-xs opacity-70">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    // 2) Totals from the VIEW (separate request)
    const {data: totals} = await sb
        .schema("knitted")
        .from("order_totals")
        .select("order_id, items_subtotal, tax_total, discount_total, shipping_total, paid_total, computed_total")
        .eq("order_id", params.id)
        .maybeSingle();

    // Build safe numbers; prefer computed_total when present
    const currency = order.currency_code;
    const t = {
        subtotal: Number(totals?.items_subtotal ?? 0),
        tax: Number(totals?.tax_total ?? 0),
        discount: Number(totals?.discount_total ?? 0),
        shipping: Number(totals?.shipping_total ?? 0),
        total: Number(totals?.computed_total ?? totals?.items_subtotal ?? 0),
        paid: Number(totals?.paid_total ?? 0),
    };

    type OrderItem = {
        id: string;
        description: string;
        quantity: number;
        unit_price: number;
        currency_code: string;
    };

    // Types for the nested selects you’re returning

    type CustomerRow = {
        id: string;
        full_name: string;
        phone: string | null;
        email: string | null;
        city: string | null;
        country_code: string | null;
    };

    type OrderItemRow = {
        id: string;
        description: string;
        quantity: number;
        unit_price: number;
        currency_code: string;
    };

    type OrderRow = {
        id: string;
        status: string;                 // tighten to a union if you have a fixed set
        notes: string | null;
        order_code: string | null;      // make non-null if column is NOT NULL
        created_at: string;
        ready_at: string | null;
        currency_code: string;

        // Aliased relation columns from your select:
        customer: CustomerRow | null;   // null-safe in case FK missing or RLS hides it
        items: OrderItemRow[];          // empty array if no items
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">{order.order_code ?? `Order #${order.id.slice(0, 8).toUpperCase()}`}</h1>
                <div className="text-sm text-muted-foreground">
                    {/*Created {new Date(order.created_at).toLocaleString()}*/}
                    <ClientTime iso={order.created_at}/>
                </div>
            </div>

            {/* Summary */}
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div><span className="text-muted-foreground">Order ID:</span> {order.id}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            {/* change status */}
                            <StatusSelect orderId={order.id} initial={order.status}/>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Ready at:</span>
                            {/* set ready_at */}
                            <ReadyAtPicker orderId={order.id} initial={order.ready_at}/>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="text-sm">
                            <div className="text-muted-foreground">Notes</div>
                            <div className="whitespace-pre-wrap">{order.notes}</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Customer */}
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Customer</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                    <div className="text-foreground font-medium">
                        <Link href={`/clients/${newOrder?.customer?.id}`} className="hover:underline">
                            {newOrder?.customer?.full_name}
                        </Link>
                    </div>
                    <div>{newOrder?.customer?.email ?? "—"}</div>
                    <div>{newOrder?.customer?.phone ?? "—"}</div>
                    <div>
                        {newOrder?.customer?.city ?? "—"}
                        {newOrder?.customer?.country_code ? ` • ${newOrder?.customer?.country_code}` : ""}
                    </div>
                </CardContent>
            </Card>

            {/* Items */}
            <Card>
                <CardContent>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Items</CardTitle></CardHeader>
                    <CardContent className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-24 text-right">Qty</TableHead>
                                    <TableHead className="w-32 text-right">Unit Price</TableHead>
                                    <TableHead className="w-32 text-right">Line Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(order.items as OrderItem[] | undefined)?.map((it) => {
                                    const line = (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
                                    return (
                                        <TableRow key={it.id}>
                                            <TableCell className="font-medium">{it.description}</TableCell>
                                            <TableCell className="text-right">{it.quantity}</TableCell>
                                            <TableCell className="text-right">
                                                {it.currency_code} {(Number(it.unit_price) || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {it.currency_code} {line.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {(!order.items || order.items.length === 0) && (
                                    <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                        No items
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </CardContent>
            </Card>

            {/* Totals */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Totals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Main total */}
                        <div className="flex items-baseline justify-between border-b pb-2">
                            <span className="text-sm text-muted-foreground">Grand Total</span>
                            <span className="text-2xl font-semibold tracking-tight">
          {currency} {t.total.toFixed(2)}
        </span>
                        </div>

                        {/* Paid section (slightly emphasized) */}
                        <div className="flex items-baseline justify-between border-b pb-2">
                            <span className="text-sm text-muted-foreground">Paid</span>
                            <span
                                className={`text-lg font-medium ${
                                    t.paid >= t.total ? "text-green-600" : "text-yellow-600"
                                }`}
                            >
          {currency} {t.paid.toFixed(2)}
        </span>
                        </div>

                        {/* Derivative values — smaller and subdued */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{currency} {t.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>{currency} {t.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>-{currency} {t.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{currency} {t.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Balance</span>
                                <span className="font-medium text-foreground">
            {currency} {(t.total - t.paid).toFixed(2)}
          </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payments */}
            <PaymentsSection orderId={order.id} currency={currency}/>

            {/* Attachments */}
            <AttachmentsSection orderId={order.id}/>
        </div>
    );
}