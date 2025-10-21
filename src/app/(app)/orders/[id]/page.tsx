import { redirect } from "next/navigation";
import Link from "next/link";
import { createClientServer } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import PaymentsSection from "./payments";
import StatusSelect from "./status-select";
import ReadyAtPicker from "./ready-at-picker";
import AttachmentsSection from "./attachments";
import ClientTime from "@/components/ClientTime";

export const dynamic = "force-dynamic";

// ----- Types for the nested selects you’re returning -----
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
    status: string;
    notes: string | null;
    order_code: string | null;
    created_at: string;
    ready_at: string | null;
    currency_code: string;
    customer: CustomerRow | null;
    items: OrderItemRow[];
};

type TotalsRow = {
    order_id: string;
    items_subtotal: number | null;
    tax_total: number | null;
    discount_total: number | null;
    shipping_total: number | null;
    paid_total: number | null;
    computed_total: number | null;
};

type RouteParams = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: RouteParams }) {
    const { id } = await params; // ⬅️ await params

    const sb = await createClientServer();
    const {
        data: { user },
    } = await sb.auth.getUser();
    if (!user) redirect("/login");

    // 1) Order with nested customer + items
    const { data: order, error } = await sb
        .schema("knitted")
        .from("orders")
        .select(
            `
      id, status, notes, order_code, created_at, ready_at, currency_code,
      customer:customers ( id, full_name, phone, email, city, country_code ),
      items:order_items ( id, description, quantity, unit_price, currency_code )
    `
        )
        .eq("id", id)
        .eq("owner", user.id) // keep if your RLS is owner-based
        .single();

    if (!order) {
        return (
            <div className="p-6 space-y-2">
                <div>Order not found / not visible.</div>
                {error && <pre className="text-xs opacity-70">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    const ord = order as unknown as OrderRow;

    // 2) Totals from the VIEW (separate request)
    const { data: totals } = await sb
        .schema("knitted")
        .from("order_totals")
        .select(
            "order_id, items_subtotal, tax_total, discount_total, shipping_total, paid_total, computed_total"
        )
        .eq("order_id", id)
        .maybeSingle<TotalsRow>();

    // Build safe numbers; prefer computed_total when present
    const currency = ord.currency_code;
    const t = {
        subtotal: Number(totals?.items_subtotal ?? 0),
        tax: Number(totals?.tax_total ?? 0),
        discount: Number(totals?.discount_total ?? 0),
        shipping: Number(totals?.shipping_total ?? 0),
        total: Number(totals?.computed_total ?? totals?.items_subtotal ?? 0),
        paid: Number(totals?.paid_total ?? 0),
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">
                    {ord.order_code ?? `Order #${ord.id.slice(0, 8).toUpperCase()}`}
                </h1>
                <div className="text-sm text-muted-foreground">
                    <ClientTime iso={ord.created_at} />
                </div>
            </div>

            {/* Summary */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Order ID:</span> {ord.id}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <StatusSelect orderId={ord.id} initial={ord.status} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Ready at:</span>
                            <ReadyAtPicker orderId={ord.id} initial={ord.ready_at} />
                        </div>
                    </div>

                    {ord.notes && (
                        <div className="text-sm">
                            <div className="text-muted-foreground">Notes</div>
                            <div className="whitespace-pre-wrap">{ord.notes}</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Customer */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customer</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                    <div className="text-foreground font-medium">
                        {ord.customer ? (
                            <Link href={`/clients/${ord.customer.id}`} className="hover:underline">
                                {ord.customer.full_name}
                            </Link>
                        ) : (
                            "—"
                        )}
                    </div>
                    <div>{ord.customer?.email ?? "—"}</div>
                    <div>{ord.customer?.phone ?? "—"}</div>
                    <div>
                        {ord.customer?.city ?? "—"}
                        {ord.customer?.country_code ? ` • ${ord.customer?.country_code}` : ""}
                    </div>
                </CardContent>
            </Card>

            {/* Items */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Items</CardTitle>
                </CardHeader>
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
                            {(ord.items ?? []).map((it) => {
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
                            {(!ord.items || ord.items.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                        No items
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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

                        {/* Derivatives */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                  {currency} {t.subtotal.toFixed(2)}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>
                  {currency} {t.tax.toFixed(2)}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>
                  -{currency} {t.discount.toFixed(2)}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                  {currency} {t.shipping.toFixed(2)}
                </span>
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
            <PaymentsSection orderId={ord.id} currency={currency} />

            {/* Attachments */}
            <AttachmentsSection orderId={ord.id} />
        </div>
    );
}