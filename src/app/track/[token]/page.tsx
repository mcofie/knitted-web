import Image from "next/image";

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
    status: "READY" | "CONFIRMED" | "IN PRODUCTION" | "DELIVERED" | "CANCELLED";
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

type Attachment = {
    id: string;
    kind: "photo" | "file";
    file_path: string;       // Supabase Storage relative path
    created_at: string;
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
    name: string | null;         // e.g. "2-piece Suit"
    notes?: string | null;       // optional description/notes
    quantity: number;            // integer/decimal
    unit_price: number | null;   // per item price
    currency_code?: string | null;
    line_total?: number | null;  // if stored; else compute qty * unit_price
    position?: number | null;    // for ordering lines
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

    const res = await fetch(url, { ...init, headers, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
}

function Money({ amount, currency }: { amount: number; currency: string }) {
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

function StatusBadge({ status }: { status: Order["status"] }) {
    const cls: Record<Order["status"], string> = {
        READY: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
        "IN PRODUCTION": "bg-amber-500/15 text-amber-600 dark:text-amber-300",
        CONFIRMED: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
        DELIVERED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
        CANCELLED: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls[status]}`}>
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
    const { token: rawToken } = await params;
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
    const attachmentsUrl = new URL(`${base}/rest/v1/attachments`);
    attachmentsUrl.searchParams.set("select", "*");
    attachmentsUrl.searchParams.set("order_id", `eq.${order.id}`);
    attachmentsUrl.searchParams.set("order", "created_at.desc");

    let attachments: Attachment[] = [];
    try {
        attachments = await fetchJson<Attachment[]>(attachmentsUrl.toString());
    } catch {
        attachments = [];
    }

    /* ============ 5) Customer (optional) ============ */
    let customer: Customer = null;
    if (order.customer_id) {
        const customerUrl = new URL(`${base}/rest/v1/customers`);
        customerUrl.searchParams.set("select", "id,name,phone,email,address,city,country_code,created_at");
        customerUrl.searchParams.set("id", `eq.${order.customer_id}`);
        customerUrl.searchParams.set("limit", "1");
        try {
            const rows = await fetchJson<Customer[]>(customerUrl.toString());
            customer = rows?.[0] ?? null;
        } catch {
            customer = null;
        }
    }

    /* ============ 6) Order Items (NEW) ============ */
    const itemsUrl = new URL(`${base}/rest/v1/order_items`);
    // Select the columns you actually have
    itemsUrl.searchParams.set(
        "select",
        "id,order_id,name,notes,quantity,unit_price,currency_code,line_total,position,created_at"
    );
    itemsUrl.searchParams.set("order_id", `eq.${order.id}`);
    // Order lines by explicit position if you have it, then by created_at
    itemsUrl.searchParams.append("order", "position.asc");
    itemsUrl.searchParams.append("order", "created_at.asc");

    let items: OrderItem[] = [];
    try {
        items = await fetchJson<OrderItem[]>(itemsUrl.toString());
    } catch {
        items = [];
    }

    return (
        <main className="bg-background text-foreground">
            {/* soft halo */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 via-indigo-500/15 to-purple-500/15 blur-3xl" />
            </div>

            <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
                {/* header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/knitted-logo.svg" alt="Knitted" width={28} height={28} />
                        <span className="text-sm font-semibold">Knitted</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Public tracking</span>
                </div>

                {/* SUMMARY */}
                <div className="rounded-xl border bg-card/70 p-5 backdrop-blur">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">{order.order_code}</h1>
                            <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={order.status} />
                            {!!order.ready_at && (
                                <span className="text-xs text-muted-foreground">
                  Ready by {new Date(order.ready_at).toLocaleString()}
                </span>
                            )}
                        </div>
                    </div>

                    {/* ITEMS (NEW) */}
                    <div className="mt-6 rounded-lg border bg-background p-4">
                        <div className="mb-2 text-sm font-semibold">Items</div>
                        {items.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No items recorded.</p>
                        ) : (
                            <div className="overflow-hidden rounded-lg border">
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
                                        const line = it.line_total ?? (unit * (it.quantity || 0));
                                        return (
                                            <tr key={it.id} className="bg-background">
                                                <td className="px-3 py-2 align-top">
                                                    <div className="font-medium">{it.name || "Item"}</div>
                                                    {it.notes && (
                                                        <div className="mt-0.5 text-xs text-muted-foreground">{it.notes}</div>
                                                    )}
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
                        )}
                    </div>

                    {/* TOTALS */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Subtotal</div>
                            <div className="mt-1 text-base font-medium">
                                <Money amount={totals?.items_subtotal ?? 0} currency={currency} />
                            </div>
                        </div>
                        <div className="rounded-lg border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Total</div>
                            <div className="mt-1 text-base font-medium">
                                <Money amount={totals?.computed_total ?? 0} currency={currency} />
                            </div>
                        </div>
                        <div className="rounded-lg border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Paid</div>
                            <div className="mt-1 text-base font-medium">
                                <Money amount={totals?.paid_total ?? 0} currency={currency} />
                            </div>
                        </div>
                    </div>

                    {/* BALANCE */}
                    <div className="mt-3 flex items-center justify-between rounded-lg border bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span className="text-base font-semibold">
              <Money amount={finalBalance ?? 0} currency={currency} />
            </span>
                    </div>

                    <p className="mt-8 text-center text-xs text-muted-foreground">
                        This page updates as your tailor records progress and payments.
                    </p>
                </div>

                {/* CUSTOMER */}
                <div className="mt-8 rounded-xl border bg-card/70 backdrop-blur p-4">
                    <div className="mb-2 text-sm font-semibold">Customer</div>
                    {customer ? (
                        <div className="text-sm">
                            <div className="font-medium">
                                {customer.name || order.customer_name || "Customer"}
                            </div>
                            <div className="mt-1 text-muted-foreground">
                                {[customer.phone, customer.email].filter(Boolean).join(" • ") || "—"}
                            </div>
                            {(customer.address || customer.city || customer.country_code) && (
                                <div className="mt-1 text-muted-foreground">
                                    {[customer.address, customer.city, customer.country_code].filter(Boolean).join(", ")}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm">
                            <div className="font-medium">{order.customer_name || "Customer"}</div>
                            <div className="mt-1 text-muted-foreground">Details not available.</div>
                        </div>
                    )}
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
                                        <Money amount={p.amount} currency={p.currency_code} />
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
                <div className="mt-8 rounded-xl border bg-card/70 p-5 backdrop-blur">
                    <h2 className="text-sm font-semibold">Attachments</h2>
                    {attachments.length === 0 ? (
                        <p className="mt-2 text-sm text-muted-foreground">No attachments yet.</p>
                    ) : (
                        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {attachments.map((a) => {
                                const url = `${base}/storage/v1/object/public/knitted/${a.file_path}`;
                                return (
                                    <li key={a.id} className="group overflow-hidden rounded-lg border">
                                        <a href={url} target="_blank" rel="noreferrer" className="block">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={"Attachment"}
                                                className="h-36 w-full object-cover transition group-hover:opacity-90"
                                            />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
}