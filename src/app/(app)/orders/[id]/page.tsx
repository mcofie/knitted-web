import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClientServer } from "@/lib/supabase/server";

// UI Components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

// Icons
import {
    Phone,
    Edit,
    CalendarClock,
    FileText,
    CreditCard,
    Package,
    StickyNote,
    ListTodo,
    Settings2,
    ArrowLeft,
    Sparkles,
    Star,
    Zap,
    Heart,
    ChevronRight,
    MapPin,
    Layers,
    Clock,
    UserCircle,
    Scissors
} from "lucide-react";

// Custom Components
import PaymentsSection from "./payments";
import StatusSelect from "./status-select";
import ReadyAtPicker from "./ready-at-picker";
import AttachmentsSection from "./attachments";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

// ----- Types -----
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
    const { id } = await params;

    const sb = await createClientServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/login");

    // 1) Order with nested customer + items
    const { data: order, error } = await sb
        .schema("knitted")
        .from("orders")
        .select(`
      id, status, notes, order_code, created_at, ready_at, currency_code,
      customer:customers ( id, full_name, phone, email, city, country_code ),
      items:order_items ( id, description, quantity, unit_price, currency_code )
    `)
        .eq("id", id)
        .eq("owner", user.id)
        .single();

    if (!order) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-8 bg-background">
                <div className="text-center space-y-6">
                    <Package className="w-20 h-20 text-muted-foreground/20 mx-auto" />
                    <h2 className="text-4xl font-serif text-foreground">Order Archive</h2>
                    <Button asChild className="btn-primary">
                        <Link href="/orders">Back to Workshop</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const ord = order as unknown as OrderRow;

    // 2) Totals
    const { data: totals } = await sb
        .schema("knitted")
        .from("order_totals")
        .select("*")
        .eq("order_id", id)
        .maybeSingle<TotalsRow>();

    const currency = ord.currency_code;
    const t = {
        subtotal: Number(totals?.items_subtotal ?? 0),
        tax: Number(totals?.tax_total ?? 0),
        discount: Number(totals?.discount_total ?? 0),
        shipping: Number(totals?.shipping_total ?? 0),
        total: Number(totals?.computed_total ?? totals?.items_subtotal ?? 0),
        paid: Number(totals?.paid_total ?? 0),
    };
    const balance = t.total - t.paid;

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-32">

            {/* --- Header Section --- */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                <div className="space-y-6">
                    <Link href="/orders" className="inline-flex items-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.2em]">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Workshop
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 md:gap-10">
                        <h1 className="text-6xl font-serif text-foreground leading-none">
                            {ord.order_code ?? `#${ord.id.slice(0, 5).toUpperCase()}`}
                        </h1>
                        <StatusBadge status={ord.status} className="h-7 px-4 shadow-none rounded-full" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full h-12 border-border bg-transparent text-foreground hover:bg-muted font-medium text-xs uppercase tracking-widest px-8" asChild>
                        <Link href={`/orders/${ord.id}/edit`}>Edit Project</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- LEFT: Blueprints & Values --- */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Items */}
                    <Card className="bento-card p-10 space-y-10 bg-card">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-serif text-foreground">Manifest</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <Layers className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(ord.items ?? []).map((it) => (
                                <div key={it.id} className="flex items-center justify-between py-6 border-b border-border last:border-none">
                                    <div className="space-y-1">
                                        <h4 className="font-sans font-medium text-lg leading-tight text-foreground">{it.description}</h4>
                                        <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                                            {it.quantity} Unit{it.quantity > 1 ? 's' : ''} at {currency} {it.unit_price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-2xl font-serif text-foreground tabular-nums">
                                        {currency} {((it.quantity || 0) * (it.unit_price || 0)).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {(!ord.items || ord.items.length === 0) && (
                                <p className="text-sm font-sans italic text-muted-foreground/40 text-center py-12">No items specified.</p>
                            )}
                        </div>

                        <div className="pt-10 border-t border-border space-y-6">
                            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">
                                <span>Service Value</span>
                                <span className="tabular-nums font-serif text-lg">{currency} {t.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-serif text-foreground">Total</span>
                                <span className="text-5xl font-serif text-foreground tabular-nums">{currency} {t.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Transaction Log */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-3xl font-serif text-foreground">Liquid Ledger</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>
                        <PaymentsSection orderId={ord.id} currency={currency} />
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-3xl font-serif text-foreground">Digital Dossier</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>
                        <AttachmentsSection orderId={ord.id} />
                    </div>
                </div>

                {/* --- RIGHT: Logistics & Governance --- */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Stakeholder */}
                    <Card className="bento-card bg-secondary/30 p-8 flex flex-col items-center text-center space-y-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-[2rem] bg-background border border-border overflow-hidden">
                                <Image
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(ord.customer?.full_name || "Guest")}`}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="space-y-6 w-full text-center">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-foreground">{ord.customer?.full_name}</h3>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-40">Project Lead</p>
                            </div>

                            <Button variant="outline" className="w-full rounded-full h-12 border-border bg-transparent text-foreground hover:bg-muted font-medium text-xs uppercase tracking-widest" asChild>
                                <Link href={`/clients/${ord.customer?.id}`}>Dossier Directory</Link>
                            </Button>
                        </div>
                    </Card>

                    {/* Operational Hub */}
                    <Card className="bento-card bg-foreground p-8 text-background space-y-10 border-none">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-serif">Logistics</h3>
                            <Settings2 className="w-4 h-4 opacity-30" />
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-medium text-background/50 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> State Transition
                                </label>
                                <StatusSelect orderId={ord.id} initial={ord.status} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-medium text-background/50 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Goal Time
                                </label>
                                <ReadyAtPicker orderId={ord.id} initial={ord.ready_at} />
                            </div>
                        </div>

                        {ord.notes && (
                            <div className="pt-8 border-t border-background/10 space-y-3">
                                <label className="text-[10px] font-medium text-background/50 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <StickyNote className="w-3 h-3" /> Memo
                                </label>
                                <p className="text-sm font-sans italic text-background/80 leading-relaxed">{ord.notes}</p>
                            </div>
                        )}
                    </Card>

                    {/* Final Actions */}
                    <div className="flex flex-col gap-3 px-2">
                        <button className="h-12 w-full flex items-center justify-center gap-3 bg-muted/50 rounded-full font-medium text-[10px] uppercase tracking-widest hover:bg-muted transition-all border border-border/50">
                            <FileText className="w-4 h-4 text-foreground opacity-60" /> Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}