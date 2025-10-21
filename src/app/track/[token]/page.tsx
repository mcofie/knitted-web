// src/app/track/[token]/page.tsx
import { createClientServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// ---- Types that match what your RPC returns (adjust if needed)
type ItemView = {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency_code: string;
};

type RpcOrderStatus = {
    order_id: string;
    title: string | null;
    status: string;
    notes: string | null;

    currency_code: string;
    created_at: string;
    ready_at: string | null;

    // customer
    customer_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    location_city: string | null;
    location_country_code: string | null;

    // branding (from account_settings)
    business_name: string | null;
    logo_path: string | null;

    // totals
    subtotal?: number | null;
    tax?: number | null;
    discount?: number | null;
    shipping?: number | null;
    total?: number | null;
    computed_total?: number | null;
    paid?: number | null;

    items: ItemView[] | null;
};

// Final normalized view for the page
type OrderView = {
    order_id: string;
    title: string | null;
    status: string;
    notes: string | null;

    currency: string;
    created_at: string;
    ready_at: string | null;

    subtotal: number;
    tax: number;
    discount: number;
    shipping: number;
    total: number;
    paid: number;

    customer_name: string;
    contact_email: string | null;
    contact_phone: string | null;
    location_city: string | null;
    location_country_code: string | null;

    business_name: string | null;
    logo_url: string | null;

    items: ItemView[];
};

function firstRow<T>(x: unknown): T | null {
    if (x == null) return null;
    return Array.isArray(x) ? ((x[0] ?? null) as T | null) : (x as T);
}

function fmtMoney(code: string, amount: number) {
    // Keep simple: code + 2dp
    return `${code} ${amount.toFixed(2)}`;
}

function fmtDate(iso: string | null) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch {
        return iso;
    }
}

async function fetchOrder(token: string): Promise<OrderView | null> {
    const sb = createClientServer();

    // 1) Core order via RPC
    const { data, error } = await sb.rpc("order_status_by_token", { p_token: token });
    if (error) return null;

    const row = firstRow<RpcOrderStatus>(data);
    if (!row) return null;

    // 2) Resolve brand logo (optional)
    let logo_url: string | null = null;
    if (row.logo_path) {
        try {
            const { data: signed } = await sb.storage.from("knitted-brand").createSignedUrl(row.logo_path, 3600);
            logo_url = signed?.signedUrl ?? null;
        } catch {
            logo_url = null;
        }
    }

    // 3) Normalize totals & map to view
    const currency = row.currency_code;
    const subtotal = Number(row.subtotal ?? 0);
    const tax = Number(row.tax ?? 0);
    const discount = Number(row.discount ?? 0);
    const shipping = Number(row.shipping ?? 0);
    const paid = Number(row.paid ?? 0);
    const total = Number(row.computed_total ?? row.total ?? subtotal + tax + shipping - discount);

    // 4) Attachments (read-only, signed)
    // NOTE: public page shows images but does not upload.
    let signedImages: string[] = [];
    try {
        const { data: attachments } = await sb
            .schema("knitted")
            .from("attachments")
            .select("file_path")
            .eq("order_id", row.order_id)
            .order("created_at", { ascending: false });

        if (attachments && attachments.length > 0) {
            const signed = await Promise.all(
                attachments.map(async (a) => {
                    try {
                        const { data: s } = await sb.storage.from("knitted-attachments").createSignedUrl(a.file_path, 3600);
                        return s?.signedUrl ?? null;
                    } catch {
                        return null;
                    }
                })
            );
            signedImages = signed.filter(Boolean) as string[];
        }
    } catch {
        // ignore attachments block failures
    }

    const view: OrderView = {
        order_id: row.order_id,
        title: row.title ?? null,
        status: row.status,
        notes: row.notes ?? null,

        currency,
        created_at: row.created_at,
        ready_at: row.ready_at,

        subtotal,
        tax,
        discount,
        shipping,
        total,
        paid,

        customer_name: row.customer_name ?? "",
        contact_email: row.contact_email ?? null,
        contact_phone: row.contact_phone ?? null,
        location_city: row.location_city ?? null,
        location_country_code: row.location_country_code ?? null,

        business_name: row.business_name ?? null,
        logo_url,
        items: row.items ?? [],
    };

    // Include signed image URLs in a non-breaking way (optional field)
    // @ts-expect-error add-on field for this page
    view._images = signedImages;

    return view;
}

// --------- Page ----------
export default async function TrackPage({ params }: { params: { token: string } }) {
    const data = await fetchOrder(params.token);
    if (!data) notFound();

    // @ts-expect-error we added it above
    const images: string[] = data._images ?? [];

    return (
        <div className="mx-auto max-w-5xl p-6 space-y-6">
            {/* Header / Brand */}
            <div className="flex items-center gap-4">
                {data.logo_url ? (
                    // Ensure your next.config.js images.domains allows your supabase host
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                        <Image src={data.logo_url} alt="Logo" fill className="object-cover" />
                    </div>
                ) : null}
                <div>
                    <h1 className="text-xl font-semibold">
                        {data.business_name ?? "Order Tracking"}
                    </h1>
                    <div className="text-sm text-muted-foreground">Public order status</div>
                </div>
            </div>

            {/* Summary */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Order:</span> {data.title ?? `#${data.order_id.slice(0, 8).toUpperCase()}`}</div>
                    <div><span className="text-muted-foreground">Status:</span> {data.status}</div>
                    <div><span className="text-muted-foreground">Created:</span> {fmtDate(data.created_at)}</div>
                    <div><span className="text-muted-foreground">Ready by:</span> {fmtDate(data.ready_at)}</div>
                    {data.notes && <div className="text-muted-foreground mt-1">{data.notes}</div>}
                </CardContent>
            </Card>

            {/* Customer */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <div className="text-foreground font-medium">{data.customer_name}</div>
                    <div>{data.contact_email ?? "—"}</div>
                    <div>{data.contact_phone ?? "—"}</div>
                    <div>
                        {data.location_city ?? "—"}{" "}
                        {data.location_country_code ? `• ${data.location_country_code}` : ""}
                    </div>
                </CardContent>
            </Card>

            {/* Items */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Line</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((it) => {
                                    const line = (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
                                    return (
                                        <TableRow key={it.id}>
                                            <TableCell className="font-medium">{it.description}</TableCell>
                                            <TableCell className="text-right">{it.quantity}</TableCell>
                                            <TableCell className="text-right">{fmtMoney(it.currency_code, Number(it.unit_price) || 0)}</TableCell>
                                            <TableCell className="text-right">{fmtMoney(it.currency_code, line)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {data.items.length === 0 && (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No items</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Totals */}
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-2xl font-semibold">
                            <div>Total</div>
                            <div>{fmtMoney(data.currency, data.total)}</div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                                <span>Paid</span><span className="text-foreground">{fmtMoney(data.currency, data.paid)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Subtotal</span><span>{fmtMoney(data.currency, data.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Tax</span><span>{fmtMoney(data.currency, data.tax)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Shipping</span><span>{fmtMoney(data.currency, data.shipping)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Discount</span><span>{fmtMoney(data.currency, data.discount)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attachments (read-only) */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                    {images.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-8 text-center">No images</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {images.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded border overflow-hidden">
                                    <Image src={src} alt={`attachment-${i}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}