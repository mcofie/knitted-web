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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {MdPhoneEnabled} from "react-icons/md";
import {FiEdit3} from "react-icons/fi";
import Image from "next/image";
import StatusBadge from "@/components/StatusBadge";

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

export default async function OrderDetailPage({params}: { params: RouteParams }) {
    const {id} = await params; // ⬅️ await params

    const sb = await createClientServer();
    const {
        data: {user},
    } = await sb.auth.getUser();
    if (!user) redirect("/login");

    // 1) Order with nested customer + items
    const {data: order, error} = await sb
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
    const {data: totals} = await sb
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
                <div>
                    <h1 className="text-lg font-semibold">
                        Order details
                    </h1>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard">Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/orders">Orders</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {ord.order_code ?? `Order #${ord.id.slice(0, 8).toUpperCase()}`}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="text-sm text-muted-foreground">
                    <StatusBadge status={ord.status} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                {/* Summary */}
                <div
                    className="w-full group relative rounded-2xl border border-border bg-card/70 p-4">
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-4 text-sm justify-between items-center">
                            <div>
                                <span className="text-muted-foreground">Order ID:</span> {ord.order_code}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Status:</span>
                                <StatusSelect orderId={ord.id} initial={ord.status}/>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Ready at:</span>
                                <ReadyAtPicker orderId={ord.id} initial={ord.ready_at}/>
                            </div>
                        </div>

                        {ord.notes && (
                            <div className="flex flex-wrap gap-4 text-sm justify-between items-center">
                                <div className="text-muted-foreground">Notes:</div>
                                <div className="whitespace-pre-wrap">{ord.notes}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-between'>
                    <div
                        className="w-full group relative rounded-2xl border border-border bg-card/70 p-6 transition-all duration-300 hover:shadow-md hover:bg-card">
                        {/* Top Right Action Buttons */}
                        <div
                            className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Link
                                href={`tel:${ord.customer?.phone}`}
                                className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                                title="Contact"
                            >
                                <MdPhoneEnabled/>
                            </Link>
                            <Link
                                href={`/clients/${ord.customer?.id}/edit`}
                                className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                                title="Edit client"
                            >
                                <FiEdit3/>
                            </Link>
                        </div>

                        {/* Client Info */}
                        <div className="mb-4 flex items-center gap-4">
                            <Image
                                src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(ord.customer?.full_name || "Guest")}`}
                                alt={ord.customer?.full_name || "Avatar"}
                                width={98}
                                height={98}
                                unoptimized
                                className="rounded-full border border-border bg-muted ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/40"
                            />

                            <div className="flex flex-col">
                                <h1 className='text-lg font-semibold'>
                                    {ord.customer?.full_name}
                                </h1>
                                <p className="text-xs text-muted-foreground">{ord.customer?.phone}</p>
                                {/*<p className="text-xs text-muted-foreground">{client.city}</p>*/}
                                <p className="text-xs text-muted-foreground">{ord.customer?.city ?? "—"} {ord.customer?.country_code ? `• ${ord.customer?.country_code}` : ""}</p>
                            </div>
                        </div>

                        {/* Optional note or quote */}
                        {/* <blockquote className="text-sm italic text-muted-foreground">“{c.note || 'Reliable client'}”</blockquote> */}
                    </div>

                </div>


            </div>

            <div className="flex flex-row gap-4">
                {/* Items */}
                <div className="w-1/2">
                    <CardTitle className="text-base my-2">Items</CardTitle>
                    <div className="w-full group relative rounded-2xl border border-border bg-card/70 p-2">
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
                    </div>
                </div>
                {/* Totals */}
                <div className="w-2/3">
                    <CardTitle className="text-base my-2">Totals</CardTitle>
                    <div className="w-full group relative rounded-2xl border border-border bg-card/70 px-4 py-5">
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
                    </div>
                </div>
            </div>


            <div className="flex flex-row gap-4">
                {/* Payments */}
                <div className="w-1/2">
                    <PaymentsSection orderId={ord.id} currency={currency}/>
                </div>

                {/* Attachments */}
                <div className="w-1/2">
                    <AttachmentsSection orderId={ord.id}/>
                </div>
            </div>
        </div>
    );
}