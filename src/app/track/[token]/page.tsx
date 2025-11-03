import Image from "next/image";
import {AddToCalendarButton} from "@/components/modals/AddToCalendar";
import {createClientServer} from "@/lib/supabase/server";
import {Card} from "@/components/ui/card";
import {FileText, Mail, MapPin, Phone, User} from "lucide-react";
import Link from "next/link";

/**
 * Server-rendered, theme-aware public tracking page.
 * Requires:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * RLS must allow anonymous (role anon) select on needed tables/views with the knitted schema.
 */

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

/* ======================= Types (adjust to your schema) ======================= */
type Order = {
    id: string;
    order_code: string; // e.g., "KNT-00027"
    status: "ready" | "confirmed" | "in_production" | "delivered" | "cancelled";
    currency: string;   // fallback if totals.currency_code missing
    created_at: string;
    ready_at: string | null;
    customer_name?: string | null;
    customer_id?: string | null;
    tracking_token: string;
};

type Totals = {
    items_subtotal: number;
    computed_total: number;
    paid_total: number;
    balance: number;         // if your view provides a balance already
    currency_code: string;
} | null;

type Payment = {
    id: string;
    amount: number;
    method: string | null;
    currency_code: string;
    created_at: string;
};

// Replace your current Attachment type with these two:

type DbAttachment = {
    id: string;
    order_id: string;
    file_type: string | null;   // e.g. "image/png", "application/pdf", etc.
    file_path: string | null;   // storage path like "orders/123/invoice.pdf"
    created_at: string;
};

type Attachment = {
    id: string;
    order_id: string;
    kind: "image" | "pdf" | "file" | "other";
    file_path: string;          // required by UI
    created_at: string;
    signed_url: string | null;  // signed url to display/download
};


type Customer = {
    id: string;
    name: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null; // adjust to your schema
    city?: string | null;
    country_code?: string | null;
} | null;

/** Order items — adjust columns to your actual schema */
type OrderItem = {
    id: string;
    order_id: string;
    description: string;
    quantity: number;            // integer/decimal
    unit_price: number | null;   // per item price
    currency_code?: string | null;
    line_total?: number | null;  // if stored; else compute qty * unit_price
    created_at?: string;
};

/* ============================== Utils ============================== */
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
        // Tell PostgREST to use the 'knitted' schema
        "Accept-Profile": "knitted",
        ...(init?.headers || {}),
    };

    const res = await fetch(url, {...init, headers, cache: "no-store"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
}

function Money({amount, currency}: { amount: number; currency: string }) {
    try {
        return (
            <>
                {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 2,
                }).format(amount)}
            </>
        );
    } catch {
        return (
            <>
                {currency} {amount.toFixed(2)}
            </>
        );
    }
}

function StatusBadge({status}: { status: Order["status"] }) {
    const cls: Record<Order["status"], string> = {
        ready: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
        in_production: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
        confirmed: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
        delivered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
        cancelled: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${cls[status]}`}>
      {status}
    </span>
    );
}

/* ============================== Page (Server) ============================== */
// Accept Promise and await before using properties (Next.js App Router requirement)
export default async function TrackPage({
                                            params,
                                        }: {
    params: Promise<{ token: string }>;
}) {
    const {token: rawToken} = await params;
    const token = decodeURIComponent(rawToken || "");

    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!base || !anon) {
        return (
            <main className="bg-background text-foreground">
                <section className="mx-auto max-w-3xl px-4 py-14 text-center">
                    <h1 className="text-xl font-semibold">Configuration error</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Missing <code>NEXT_PUBLIC_SUPABASE_URL</code> or{" "}
                        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
                    </p>
                </section>
            </main>
        );
    }

    /* ============ 1) Order by tracking token ============ */
    const orderUrl = new URL(`${base}/rest/v1/orders`);
    orderUrl.searchParams.set("select", "*");
    orderUrl.searchParams.set("tracking_token", `eq.${token}`);
    orderUrl.searchParams.set("limit", "1");

    let order: Order | null = null;
    try {
        const rows = await fetchJson<Order[]>(orderUrl.toString());
        order = rows?.[0] ?? null;
    } catch {
        order = null;
    }

    if (!order) {
        return (
            <main className="bg-background text-foreground">
                <section className="mx-auto max-w-3xl px-4 py-14 text-center">
                    <h1 className="text-xl font-semibold">We couldn’t find that order</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Check the link or ask your tailor for a new tracking link.
                    </p>
                </section>
            </main>
        );
    }

    /* ============ 2) Totals ============ */
    const totalsUrl = new URL(`${base}/rest/v1/order_totals`);
    totalsUrl.searchParams.set("select", "*");
    totalsUrl.searchParams.set("order_id", `eq.${order.id}`);
    totalsUrl.searchParams.set("limit", "1");

    let totals: Totals = null;
    try {
        const rows = await fetchJson<Totals[]>(totalsUrl.toString());
        totals = rows?.[0] ?? null;
    } catch {
        totals = null;
    }

    let finalBalance = 0;
    if (totals?.computed_total != null) {
        finalBalance = totals.computed_total - (totals.paid_total ?? 0);
    }

    const currency = totals?.currency_code ?? order.currency;

    /* ============ 3) Payments ============ */
    const paymentsUrl = new URL(`${base}/rest/v1/payments`);
    paymentsUrl.searchParams.set("select", "*");
    paymentsUrl.searchParams.set("order_id", `eq.${order.id}`);
    paymentsUrl.searchParams.set("order", "created_at.desc");

    let payments: Payment[] = [];
    try {
        payments = await fetchJson<Payment[]>(paymentsUrl.toString());
    } catch {
        payments = [];
    }

    /* ============ 4) Attachments ============ */
    /* ============ 4) Attachments ============ */
    const sb = await createClientServer();

    let attachments: Attachment[] = [];
    try {
        const {data, error} = await sb
            .schema("knitted") // remove if table is in public
            .from("attachments")
            .select("id,order_id,file_type,file_path,created_at")
            .eq("order_id", order.id)
            .order("created_at", {ascending: false});

        if (error) {
            console.error("Fetch attachments failed:", error);
        }

        const rows = (data ?? []) as DbAttachment[];
        // Map DB rows to UI shape
        attachments = rows
            .filter((r) => !!r.file_path) // ensure we have a path
            .map((r) => ({
                id: r.id,
                order_id: r.order_id,
                kind: normalizeKind(r.file_type),
                file_path: r.file_path as string,
                created_at: r.created_at,
                signed_url: null, // to be populated below
            }));
    } catch (e) {
        console.error("Unexpected attachments error:", e);
        attachments = [];
    }

// Generate signed URLs (1 hour validity)
    if (attachments.length) {
        attachments = await Promise.all(
            attachments.map(async (a) => {
                try {
                    const {data, error} = await sb.storage
                        .from("knitted") // your bucket name
                        .createSignedUrl(a.file_path, 3600);
                    return {...a, signed_url: error ? null : data?.signedUrl ?? null};
                } catch {
                    return {...a, signed_url: null};
                }
            })
        );
    }

    function normalizeKind(t: string | null | undefined): Attachment["kind"] {
        const v = (t || "").toLowerCase();
        if (v.startsWith("image/")) return "image";
        if (v.includes("pdf")) return "pdf";
        if (v.length) return "file";
        return "other";
    }


    // 2) Fetch with proper nullability and schema
    // const sb = await createClientServer();

    let customer: Customer | null = null;

    if (order.customer_id) {
        const {data, error} = await sb
            .schema("knitted")               // remove this if your table is in public
            .from("customers")
            .select(
                "id,name,phone,email,address,city,country_code,created_at"
            )
            .eq("id", order.customer_id)
            .maybeSingle<Customer>();     // 👈 type the row shape here

        if (error) {
            // Optional: log server-side
            console.error("Fetch customer failed:", error);
        }
        customer = data ?? null;           // `maybeSingle` returns `null` when not found
    } else {
        customer = null;
    }


    /* ============ 6) Order Items (NEW) ============ */

    let items: OrderItem[] = [];

    try {
        const {data, error} = await sb
            .schema("knitted") // remove if the table is public
            .from("order_items")
            .select(
                "id,order_id,description,quantity,unit_price,currency_code,line_total,created_at"
            )
            .eq("order_id", order.id)
            .order("created_at", {ascending: true});

        if (error) {
            console.error("Fetch order items failed:", error);
        }

        items = data ?? [];
    } catch (e) {
        console.error("Unexpected error fetching items:", e);
        items = [];
    }


    let signed: typeof attachments = attachments ?? [];

    // Generate signed URLs (1 hour validity)
    if (signed?.length) {
        signed = await Promise.all(
            signed.map(async (a) => {
                try {
                    const {data, error} = await sb.storage
                        .from("knitted")
                        .createSignedUrl(a.file_path, 3600);
                    return {
                        ...a,
                        signed_url: !error ? data?.signedUrl ?? null : null,
                    };
                } catch {
                    return {...a, signed_url: null};
                }
            })
        );
    }

    return (
        <main className="bg-background text-foreground">
            {/* soft halo */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div
                    className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 via-indigo-500/15 to-purple-500/15 blur-3xl"/>
            </div>

            <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
                {/* header */}
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <Image src="/knitted-logo.svg" alt="Knitted" width={28} height={28}/>
                        <span className="text-sm font-semibold">Knitted</span>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="rounded-xl border bg-card/70 p-5 backdrop-blur">
                    <div className="flex flex-row justify-between gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">{order.order_code}</h1>
                            <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={order.status}/>
                        </div>
                    </div>

                    <div className={'flex flex-col lg:flex-row md:flex-row justify-between mt-5'}>
                        <div className={'flex items-center gap-3 my-2 lg:my-0 md:my-0 xl:my-0'}>
                            {!!order.ready_at && (
                                <span className="text-sm">
                                  Ready by {new Date(order.ready_at).toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className={'flex items-center gap-3'}>
                            <AddToCalendarButton
                                title={`Pickup: ${order.order_code}`}
                                start={order.ready_at!}               // ISO string, ensure not null
                                durationMinutes={30}                  // adjust as needed
                                location={"Your Atelier Address"}     // optional
                                description={`Your order ${order.order_code} will be ready for pickup.`}
                                filename={`${order.order_code}-pickup.ics`}
                            />
                        </div>
                    </div>

                    {/* ITEMS (NEW) */}
                    <div className="mt-6 rounded-md border bg-background p-4">
                        <div className="mb-2 text-sm font-semibold">Items</div>

                        {items.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No items recorded.</p>
                        ) : (
                            <>
                                {/* Mobile: stacked cards */}
                                <ul className="md:hidden space-y-3">
                                    {items.map((it) => {
                                        const lineCurrency = it.currency_code || currency;
                                        const unit = it.unit_price ?? 0;
                                        const line = it.line_total ?? unit * (it.quantity || 0);

                                        return (
                                            <li
                                                key={it.id}
                                                className="bg-card/50"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate">
                                                            {it.description || "Item"}
                                                        </div>
                                                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                            <span>Qty</span>
                                                            <span className="text-right">{it.quantity ?? 0}</span>
                                                            <span>Unit</span>
                                                            <span className="text-right">
                      <Money amount={unit} currency={lineCurrency} />
                    </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-xs text-muted-foreground">Line total</div>
                                                        <div className="font-semibold">
                                                            <Money amount={line} currency={lineCurrency} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Desktop/tablet: traditional table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium">Item</th>
                                            <th className="px-3 py-2 text-right font-medium">Qty</th>
                                            <th className="px-3 py-2 text-right font-medium">Unit</th>
                                            <th className="px-3 py-2 text-right font-medium">Line total</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                        {items.map((it) => {
                                            const lineCurrency = it.currency_code || currency;
                                            const unit = it.unit_price ?? 0;
                                            const line = it.line_total ?? unit * (it.quantity || 0);

                                            return (
                                                <tr key={it.id} className="bg-background">
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="font-medium">{it.description || "Item"}</div>
                                                    </td>
                                                    <td className="px-3 py-2 align-top text-right">{it.quantity ?? 0}</td>
                                                    <td className="px-3 py-2 align-top text-right">
                                                        <Money amount={unit} currency={lineCurrency} />
                                                    </td>
                                                    <td className="px-3 py-2 align-top text-right font-medium">
                                                        <Money amount={line} currency={lineCurrency} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>



                    {/* TOTALS */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-md border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Subtotal</div>
                            <div className="mt-1 text-base font-medium">
                                <Money amount={totals?.items_subtotal ?? 0} currency={currency}/>
                            </div>
                        </div>
                        <div className="rounded-md border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Total</div>
                            <div className="mt-1 text-base font-medium">
                                <Money amount={totals?.computed_total ?? 0} currency={currency}/>
                            </div>
                        </div>
                        <div className="rounded-md border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Paid</div>
                            <div className="mt-1 text-base font-medium">
                                <Money amount={totals?.paid_total ?? 0} currency={currency}/>
                            </div>
                        </div>
                    </div>

                    {/* BALANCE */}
                    <div className="mt-3 flex items-center justify-between rounded-md border bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span className="text-base font-semibold">
              <Money amount={finalBalance ?? 0} currency={currency}/>
            </span>
                    </div>
                </div>

                {/* CUSTOMER */}

                <div className="mt-8">
                    <Card
                        className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-3 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <User className="h-5 w-5 text-muted-foreground"/>
                            </div>
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-foreground">Customer</div>
                                <p className="text-xs text-muted-foreground">Order contact details</p>
                            </div>
                        </div>

                        {customer ? (
                            <div className="space-y-2 text-sm">
                                <div className="text-base font-medium leading-tight text-foreground">
                                    {customer.name || order.customer_name || "Customer"}
                                </div>

                                {(customer.phone || customer.email) && (
                                    <div className="flex flex-col gap-1 text-muted-foreground">
                                        {customer.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3.5 w-3.5"/>
                                                <span>{customer.phone}</span>
                                            </div>
                                        )}
                                        {customer.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5"/>
                                                <span>{customer.email}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(customer.address || customer.city || customer.country_code) && (
                                    <div className="flex items-start gap-2 text-muted-foreground mt-2">
                                        <MapPin className="h-3.5 w-3.5 mt-0.5"/>
                                        <span>
              {[customer.address, customer.city, customer.country_code]
                  .filter(Boolean)
                  .join(", ")}
            </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                <div className="text-base font-medium text-foreground">
                                    {order.customer_name || "Customer"}
                                </div>
                                <p className="mt-1 italic opacity-75">Details not available.</p>
                            </div>
                        )}
                    </Card>
                </div>
                {/* PAYMENTS */}
                <div className="mt-8 rounded-xl border bg-card/70 p-5 backdrop-blur">
                    <h2 className="text-sm font-semibold">Payments</h2>
                    {payments.length === 0 ? (
                        <p className="mt-2 text-sm text-muted-foreground">No payments recorded yet.</p>
                    ) : (
                        <ul className="mt-2 divide-y">
                            {payments.map((p) => (
                                <li key={p.id} className="py-3">
                                    <div className="text-sm font-medium">
                                        <Money amount={p.amount} currency={p.currency_code}/>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {(p.method ?? "payment")} • {new Date(p.created_at).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                {/* ATTACHMENTS */}


                {/* ATTACHMENTS */}
                <div className="mt-8 rounded-xl border bg-card/70 p-5 backdrop-blur-md transition-all hover:shadow-md">
                    <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground"/> Attachments
                    </h2>

                    {!attachments?.length ? (
                        <p className="mt-3 text-sm text-muted-foreground italic">
                            No attachments yet.
                        </p>
                    ) : (
                        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {attachments.map((a) => {
                                const isImage = a.kind === "image";
                                const url = a.signed_url ?? "#";

                                return (
                                    <li
                                        key={a.id}
                                        className="group relative overflow-hidden rounded-lg border bg-muted/30 hover:bg-muted/50 transition"
                                    >
                                        <Link href={url} target="_blank" rel="noreferrer">
                                            {isImage ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={url}
                                                    alt={a.file_path ?? "Attachment"}
                                                    className="h-40 w-full object-cover transition group-hover:opacity-90"
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-40 items-center justify-center text-muted-foreground">
                                                    <FileText className="h-8 w-8"/>
                                                </div>
                                            )}

                                            <div
                                                className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                                                <span className="truncate">{a.file_path}</span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    This page updates as your tailor records progress and payments.
                </p>

                <footer
                    className="mt-10 border-t border-border border-t-gray-200 dark:border-t-gray-600 pt-6 text-center text-xs text-muted-foreground">
  <span className="inline-block opacity-80 transition hover:opacity-100"> &copy;2025 | Knitted.
    Made in <span className="text-foreground font-medium"> Accra</span> with <span className="text-rose-500">❤️</span>
  </span>
                </footer>
            </section>
        </main>
    );
}