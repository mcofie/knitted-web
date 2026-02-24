import Link from "next/link";
import Image from "next/image";
import { createClientServer } from "@/lib/supabase/server";
import {
    Phone,
    Mail,
    MapPin,
    ShoppingBag,
    Edit,
    User,
    ArrowLeft,
    Sparkles,
    Star,
    Coffee,
    Heart,
    Zap,
    Scale,
    ChevronRight,
    UserCircle,
    Scissors
} from "lucide-react";

// UI Components
import { Card } from "@/components/ui/card";
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

// Sub-components
import MeasurementsSection from "./measurements";
import ClientActions from "@/app/(app)/clients/[id]/client-actions";
import OrdersListItems from "@/app/(app)/clients/[id]/order-list-items";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ id: string }>;
type OrderRow = {
    id: string;
    status: string;
    order_code: string | null;
    currency_code: string;
    created_at: string;
};
type TotalsRow = { order_id: string; computed_total: number | null };

export default async function ClientDetailPage({ params }: { params: RouteParams }) {
    const { id } = await params;
    const sb = await createClientServer();

    // Auth Guard
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-8 bg-background">
                <div className="text-center space-y-6">
                    <UserCircle className="w-20 h-20 text-muted-foreground/20 mx-auto" />
                    <h2 className="text-4xl font-serif text-foreground">Identity Check</h2>
                    <Button asChild className="btn-primary">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // 1) Fetch Client
    const { data: client, error: clientErr } = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code")
        .eq("id", id)
        .single();

    if (clientErr || !client) {
        return (
            <div className="p-20 text-center max-w-sm mx-auto space-y-8">
                <div className="w-20 h-20 bg-secondary/30 rounded-3xl flex items-center justify-center mx-auto">
                    <Scissors className="w-10 h-10 text-foreground opacity-20" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif text-foreground">Record Not Found</h2>
                    <p className="font-sans text-muted-foreground italic text-lg">The dossier you are looking for has been archived or removed.</p>
                </div>
                <Button asChild className="btn-primary">
                    <Link href="/clients">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    const displayName = client.full_name ?? client.name ?? "Master Client";

    // 2) Fetch Orders
    const { data: orders, error: ordersErr } = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, order_code, currency_code, created_at")
        .eq("customer_id", id)
        .order("created_at", { ascending: false });

    // 3) Calculate Totals & Stats
    let totalsByOrder: Record<string, number> = {};
    let lifetimeValue = 0;
    let currency = "GHS";

    if (orders?.length) {
        const orderIds = (orders as OrderRow[]).map((o) => o.id);
        currency = orders[0].currency_code || "GHS";

        const { data: totalsRows } = await sb
            .schema("knitted")
            .from("order_totals")
            .select("order_id, computed_total")
            .in("order_id", orderIds);

        if (totalsRows) {
            totalsByOrder = (totalsRows as TotalsRow[]).reduce<Record<string, number>>((acc, r) => {
                const total = Number(r.computed_total ?? 0);
                acc[r.order_id] = total;
                lifetimeValue += total;
                return acc;
            }, {});
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">

            {/* --- Header Section --- */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                <div className="space-y-6">
                    <Link href="/clients" className="inline-flex items-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.2em]">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Directory
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-6xl font-serif text-foreground leading-[1.1]">
                            {displayName}
                        </h1>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60 italic">Verified Lifetime Member</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ClientActions clientId={client.id} clientName={displayName} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- LEFT COLUMN: Profile Info --- */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bento-card bg-secondary/30 p-8 flex flex-col items-center text-center space-y-8">
                        <div className="relative">
                            <div className="h-40 w-40 rounded-[2.5rem] bg-background border border-border overflow-hidden">
                                <Image
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(client.name || "Guest")}`}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>

                        <div className="space-y-6 w-full">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif text-foreground">{client.name}</h2>
                                <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                    <MapPin className="w-3 h-3" />
                                    <span>{client.city || 'Global Atelier'}</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Button variant="outline" className="w-full rounded-full h-12 border-border bg-transparent text-foreground hover:bg-muted font-medium text-xs uppercase tracking-widest" asChild>
                                    <Link href={`tel:${client.phone}`}>Call Stakeholder</Link>
                                </Button>
                                <Button variant="outline" className="w-full rounded-full h-12 border-border bg-transparent text-foreground hover:bg-muted font-medium text-xs uppercase tracking-widest" asChild>
                                    <Link href={`mailto:${client.email}`}>Send Brief</Link>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="bento-card bg-foreground p-8 text-background space-y-6 border-none">
                        <span className="text-[10px] font-medium text-background/50 uppercase tracking-[0.2em]">Growth Statistics</span>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase opacity-40 font-medium tracking-widest">Projects</span>
                                <p className="text-3xl font-serif">{orders?.length || 0}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase opacity-40 font-medium tracking-widest">LTV</span>
                                <p className="text-3xl font-serif tabular-nums">
                                    {new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(lifetimeValue)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Button variant="ghost" className="w-full h-12 rounded-full text-xs font-medium uppercase tracking-widest text-muted-foreground/60 hover:text-foreground hover:bg-muted/50" asChild>
                        <Link href={`/clients/${client.id}/edit`}>Edit Identification</Link>
                    </Button>
                </div>

                {/* --- RIGHT COLUMN: Measurements & Orders --- */}
                <div className="lg:col-span-8 space-y-16">
                    {/* Measurements */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-4xl font-serif text-foreground">Dimensions</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <Scale className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>
                        <MeasurementsSection customerId={client.id} />
                    </div>

                    {/* Projects */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-4xl font-serif text-foreground">Projects</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>

                        <Card className="bento-card p-0 overflow-hidden bg-muted/20">
                            <OrdersListItems orders={orders} totalsByOrder={totalsByOrder} />
                            {(!orders || orders.length === 0) && (
                                <div className="p-20 text-center space-y-6 opacity-40">
                                    <Coffee className="w-12 h-12 mx-auto text-foreground stroke-[1.5]" />
                                    <p className="font-sans text-lg italic mt-4">This creator has no active projects yet.</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}