import Image from "next/image";
import { AddToCalendarButton } from "@/components/modals/AddToCalendar";
import { createClientServer } from "@/lib/supabase/server";
import {
    FileText,
    Mail,
    MapPin,
    Phone,
    User,
    CheckCircle2,
    Package,
    Scissors,
    Truck,
    AlertCircle,
    Clock,
    Download,
    CreditCard,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const revalidate = 0;
export const dynamic = "force-dynamic";

/* ======================= Types ======================= */
type Order = {
    id: string;
    order_code: string;
    status: "ready" | "confirmed" | "in_production" | "delivered" | "cancelled";
    currency: string;
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
    discount_total?: number;
    tax_total?: number;
    currency_code: string;
} | null;

type Payment = {
    id: string;
    amount: number;
    method: string | null;
    currency_code: string;
    created_at: string;
};

type DbAttachment = {
    id: string;
    order_id: string;
    file_type: string | null;
    file_path: string | null;
    created_at: string;
};

type Attachment = {
    id: string;
    order_id: string;
    kind: "image" | "pdf" | "file" | "other";
    file_path: string;
    created_at: string;
    signed_url: string | null;
};

type Customer = {
    id: string;
    name: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    country_code?: string | null;
} | null;

type OrderItem = {
    id: string;
    order_id: string;
    description: string;
    quantity: number;
    unit_price: number | null;
    currency_code?: string | null;
    line_total?: number | null;
    created_at?: string;
};

/* ============================== Utils ============================== */
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
        "Accept-Profile": "knitted",
        ...(init?.headers || {}),
    };

    const res = await fetch(url, { ...init, headers, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
}

function Money({ amount, currency, className }: { amount: number; currency: string, className?: string }) {
    try {
        return (
            <span className={cn("font-mono tracking-tight", className)}>
        {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount)}
      </span>
        );
    } catch {
        return <span className={className}>{currency} {amount.toFixed(2)}</span>;
    }
}

function normalizeKind(t: string | null | undefined): Attachment["kind"] {
    const v = (t || "").toLowerCase();
    if (v.startsWith("image/")) return "image";
    if (v.includes("pdf")) return "pdf";
    if (v.length) return "file";
    return "other";
}

/* ============================== Components ============================== */

function OrderTimeline({ status, created_at }: { status: Order['status'], created_at: string }) {
    if (status === 'cancelled') {
        return (
            <div className="rounded-lg bg-red-50 border border-red-100 p-4 flex items-center gap-3 text-red-700 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <div>
                    <p className="font-medium text-sm">Order Cancelled</p>
                    <p className="text-xs opacity-80">Please contact support for details.</p>
                </div>
            </div>
        );
    }

    const steps = [
        { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
        { id: 'in_production', label: 'Sewing', icon: Scissors },
        { id: 'ready', label: 'Ready', icon: Package },
        { id: 'delivered', label: 'Delivered', icon: Truck },
    ];

    const currentIdx = steps.findIndex(s => s.id === status);
    const safeIdx = currentIdx === -1 ? 0 : currentIdx;

    return (
        <div className="w-full py-4">
            <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10 rounded" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 rounded transition-all duration-700"
                    style={{ width: `${(safeIdx / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx <= safeIdx;
                    const isCurrent = idx === safeIdx;

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-background px-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground",
                                    isCurrent && "ring-4 ring-primary/10"
                                )}
                            >
                                <step.icon className="w-4 h-4" />
                            </div>
                            <span className={cn(
                                "mt-2 text-[10px] uppercase font-bold tracking-wider transition-colors",
                                isCompleted ? "text-foreground" : "text-muted-foreground"
                            )}>
                {step.label}
              </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                    Ordered on {new Date(created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
}

/* ============================== Page ============================== */
export default async function TrackPage({
                                            params,
                                        }: {
    params: Promise<{ token: string }>;
}) {
    const { token: rawToken } = await params;
    const token = decodeURIComponent(rawToken || "");
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    const orderUrl = new URL(`${base}/rest/v1/orders`);
    orderUrl.searchParams.set("select", "*");
    orderUrl.searchParams.set("tracking_token", `eq.${token}`);
    orderUrl.searchParams.set("limit", "1");

    let order: Order | null = null;
    try {
        const rows = await fetchJson<Order[]>(orderUrl.toString());
        order = rows?.[0] ?? null;
    } catch { order = null; }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-xl font-semibold mb-2">Order Not Found</h1>
                <p className="text-sm text-muted-foreground">The tracking link may be invalid or expired.</p>
            </div>
        );
    }

    const [totalsData, paymentsData] = await Promise.allSettled([
        fetchJson<Totals[]>(`${base}/rest/v1/order_totals?select=*&order_id=eq.${order.id}&limit=1`),
        fetchJson<Payment[]>(`${base}/rest/v1/payments?select=*&order_id=eq.${order.id}&order=created_at.desc`)
    ]);

    const totals = (totalsData.status === 'fulfilled' ? totalsData.value[0] : null);
    const payments = (paymentsData.status === 'fulfilled' ? paymentsData.value : []);
    const currency = totals?.currency_code ?? order.currency;

    const sb = await createClientServer();

    let attachments: Attachment[] = [];
    const { data: attData } = await sb.schema("knitted").from("attachments").select("id,order_id,file_type,file_path,created_at").eq("order_id", order.id).order("created_at", { ascending: false });
    if (attData) {
        const rows = attData as DbAttachment[];
        const mapped = rows.filter(r => r.file_path).map(r => ({
            id: r.id, order_id: r.order_id, kind: normalizeKind(r.file_type), file_path: r.file_path!, created_at: r.created_at, signed_url: null
        }));
        attachments = await Promise.all(mapped.map(async (a) => {
            const { data } = await sb.storage.from("knitted").createSignedUrl(a.file_path, 3600);
            return { ...a, signed_url: data?.signedUrl ?? null };
        }));
    }

    let customer: Customer | null = null;
    if (order.customer_id) {
        const { data } = await sb.schema("knitted").from("customers").select("id,name,phone,email,address,city,country_code").eq("id", order.customer_id).maybeSingle();
        customer = data;
    }

    let items: OrderItem[] = [];
    const { data: itemData } = await sb.schema("knitted").from("order_items").select("*").eq("order_id", order.id).order("created_at");
    items = itemData || [];

    const finalBalance = (totals?.computed_total ?? 0) - (totals?.paid_total ?? 0);

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090b] text-foreground flex flex-col">

            {/* Navigation / Brand */}
            <header className="bg-background border-b sticky top-0 z-20 flex-none">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image src="/knitted-logo.svg" alt="Knitted" width={24} height={24} />
                        <span className="font-bold text-sm tracking-tight">Knitted</span>
                    </div>
                    {/* Top header action - visible on larger screens */}
                    {order.ready_at && (
                        <div className="hidden sm:block text-xs font-medium text-primary hover:underline cursor-pointer">
                            <AddToCalendarButton
                                title={`Pickup Order ${order.order_code}`}
                                start={order.ready_at}
                                durationMinutes={60}
                            />
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Order Details */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Header & Progress */}
                        <div className="bg-background rounded-xl border p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Order Number</p>
                                    <h1 className="text-3xl font-bold font-mono tracking-tight">{order.order_code}</h1>
                                </div>
                                <div className="text-right">
                                    <div className={cn(
                                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                                        order.status === 'ready' ? "bg-green-50 text-green-700 border-green-200" :
                                            order.status === 'delivered' ? "bg-zinc-100 text-zinc-700 border-zinc-200" :
                                                "bg-blue-50 text-blue-700 border-blue-200"
                                    )}>
                                        {order.status.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>

                            <OrderTimeline status={order.status} created_at={order.created_at} />

                            {order.ready_at && (
                                <div className="mt-6 bg-secondary/30 rounded-lg p-4 flex items-start gap-3 border border-secondary/50">
                                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Estimated Completion</p>
                                        <p className="text-xs text-muted-foreground">
                                            This order is scheduled to be ready by <span className="font-semibold text-foreground">{new Date(order.ready_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>.
                                        </p>
                                        {/* ADDED: Add to Calendar Action */}
                                        <div className="mt-2">
                                            <div className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                                                <AddToCalendarButton
                                                    title={`Pickup: ${order.order_code}`}
                                                    start={order.ready_at}
                                                    durationMinutes={60}
                                                    description={`Pickup for order ${order.order_code} at Knitted.`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-background rounded-xl border overflow-hidden">
                            <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
                                <h2 className="font-semibold text-sm flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Items Ordered
                                </h2>
                                <span className="text-xs text-muted-foreground">{items.length} items</span>
                            </div>
                            <div className="divide-y">
                                {items.map((item) => {
                                    const lineTotal = item.line_total ?? (item.unit_price ?? 0) * item.quantity;
                                    return (
                                        <div key={item.id} className="px-6 py-4 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                                            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                <Scissors className="w-5 h-5 text-muted-foreground/50" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.description}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium"><Money amount={lineTotal} currency={item.currency_code || currency} /></p>
                                                {item.quantity > 1 && (
                                                    <p className="text-[10px] text-muted-foreground">
                                                        <Money amount={item.unit_price ?? 0} currency={item.currency_code || currency} /> ea
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Attachments */}
                        {attachments.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground px-1">Documents & Designs</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {attachments.map((att) => (
                                        <a
                                            href={att.signed_url || "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            key={att.id}
                                            className="group relative block aspect-[4/3] bg-white rounded-xl border overflow-hidden transition-all hover:border-primary/50"
                                        >
                                            {att.kind === 'image' ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={att.signed_url || ""} alt="Design" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                                                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                                                    <span className="text-[10px] font-medium uppercase">Document</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                                                <Download className="w-4 h-4" /> <span className="text-xs font-medium">View</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Receipt Block */}
                        <div className="bg-white dark:bg-card rounded-xl border p-0 overflow-hidden sticky top-24">
                            <div className="p-5 border-b border-dashed">
                                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                                    <CreditCard className="w-4 h-4" /> Summary
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <Money amount={totals?.items_subtotal ?? 0} currency={currency} />
                                    </div>
                                    {!!totals?.tax_total && (
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Tax</span>
                                            <Money amount={totals.tax_total} currency={currency} />
                                        </div>
                                    )}
                                    {!!totals?.discount_total && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Discount</span>
                                            <span>-<Money amount={totals.discount_total} currency={currency} /></span>
                                        </div>
                                    )}

                                    <div className="border-t border-dashed my-2 pt-2 flex justify-between items-center">
                                        <span className="font-medium">Total</span>
                                        <Money amount={totals?.computed_total ?? 0} currency={currency} className="text-lg font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-muted/30">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Amount Paid</span>
                                    <Money amount={totals?.paid_total ?? 0} currency={currency} className="font-medium" />
                                </div>
                                <div className={cn(
                                    "flex justify-between items-center p-3 rounded-lg border",
                                    finalBalance > 0 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                                )}>
                                    <span className="text-xs font-bold uppercase">{finalBalance > 0 ? "Due" : "Settled"}</span>
                                    <Money amount={finalBalance} currency={currency} className="font-bold" />
                                </div>
                            </div>

                            {/* Payments History */}
                            {payments.length > 0 && (
                                <div className="border-t px-5 py-4">
                                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Payment History</p>
                                    <ul className="space-y-3">
                                        {payments.map((p) => (
                                            <li key={p.id} className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                                    <span className="capitalize text-foreground">{p.method || "Payment"}</span>
                                                </div>
                                                <span className="text-muted-foreground tabular-nums">
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Customer Details Card */}
                        <div className="bg-white dark:bg-card rounded-xl border p-5 overflow-hidden">
                            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-muted-foreground">
                                <User className="w-4 h-4" /> Customer Details
                            </h3>
                            {customer ? (
                                <div className="space-y-3 text-sm">
                                    <div className="font-medium text-foreground text-base">{customer.name || order.customer_name}</div>

                                    <div className="space-y-2 text-muted-foreground">
                                        {customer.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{customer.phone}</span>
                                            </div>
                                        )}
                                        {customer.email && (
                                            <div className="flex items-center gap-2 truncate">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}
                                        {(customer.address || customer.city) && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-3.5 h-3.5 mt-0.5" />
                                                <span>{[customer.address, customer.city, customer.country_code].filter(Boolean).join(", ")}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic">
                                    {order.customer_name || "Guest Customer"}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 border-t bg-muted/20 flex-none">
                <div className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
                            <Scissors className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight">Run your own tailoring business?</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Use Knitted to track orders, manage measurements, and send professional tracking links like this one to your clients.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="https://knitted.app"
                                target="_blank"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Get Started for Free
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="border-t py-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Knitted. Made in <span className="text-foreground font-medium">Accra</span>.
                    </p>
                </div>
            </footer>
        </main>
    );
}