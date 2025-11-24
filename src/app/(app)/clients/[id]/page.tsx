import Link from "next/link";
import Image from "next/image";
import {createClientServer} from "@/lib/supabase/server";
import {
    Phone,
    Mail,
    MapPin,
    Ruler,
    ShoppingBag,
    Edit,
    User,
    ArrowLeft,
    CreditCard
} from "lucide-react";

// UI Components
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
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
import ClientActions from "@/app/(app)/clients/[id]/client-actions"; // Keep existing actions if complex
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

export default async function ClientDetailPage({params}: { params: RouteParams }) {
    const {id} = await params;
    const sb = await createClientServer();

    // Auth Guard
    const {data: {user}} = await sb.auth.getUser();
    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                Not signed in
            </div>
        );
    }

    // 1) Fetch Client
    const {data: client, error: clientErr} = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code")
        .eq("id", id)
        .single();

    if (clientErr || !client) {
        return (
            <div className="p-8 text-center">
                <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                    <User className="h-6 w-6"/>
                </div>
                <h2 className="text-lg font-semibold">Client Not Found</h2>
                <p className="text-muted-foreground">The client you are looking for does not exist.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/clients">Back to Clients</Link>
                </Button>
            </div>
        );
    }

    const displayName = client.full_name ?? client.name ?? "Client";

    // 2) Fetch Orders
    const {data: orders, error: ordersErr} = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, order_code, currency_code, created_at")
        .eq("customer_id", id)
        .order("created_at", {ascending: false});

    if (ordersErr) {
        return <div className="p-6 text-destructive">Error loading orders: {ordersErr.message}</div>;
    }

    // 3) Calculate Totals & Stats
    let totalsByOrder: Record<string, number> = {};
    let lifetimeValue = 0;
    let currency = "GHS"; // Default

    if (orders?.length) {
        const orderIds = (orders as OrderRow[]).map((o) => o.id);
        currency = orders[0].currency_code || "GHS";

        const {data: totalsRows} = await sb
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
        <div className="max-w-6xl mx-auto space-y-8 pb-10">

            {/* --- Top Navigation --- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" asChild>
                            <Link href="/clients"><ArrowLeft className="h-4 w-4"/></Link>
                        </Button>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <ClientActions clientId={client.id} clientName={displayName}/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- LEFT COLUMN (Profile) --- */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Profile Card */}
                    <Card className="overflow-hidden border-border/60 shadow-sm">
                        <div className="bg-muted/30 p-6 flex flex-col items-center text-center border-b">
                            <div className="relative mb-4">
                                <div
                                    className="h-24 w-24 rounded-full ring-4 ring-background bg-white overflow-hidden shadow-sm">
                                    <Image
                                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(client.name || "Guest")}`}
                                        alt={displayName}
                                        fill
                                        className="object-cover rounded-full"
                                        unoptimized
                                    />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold">{displayName}</h2>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                                <MapPin className="h-3 w-3"/>
                                {client.city || "No City"} {client.country_code ? `• ${client.country_code}` : ""}
                            </p>

                            <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                <Button variant="outline" className="w-full gap-2" asChild>
                                    <Link href={`tel:${client.phone}`}>
                                        <Phone className="h-4 w-4"/> Call
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full gap-2" asChild>
                                    <Link href={`mailto:${client.email}`}>
                                        <Mail className="h-4 w-4"/> Email
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">Contact
                                Info</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between group">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 opacity-70"/> Phone
                  </span>
                                    <span className="font-medium">{client.phone || "—"}</span>
                                </div>
                                <div className="separator border-b border-dashed border-muted"/>
                                <div className="flex items-center justify-between group">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 opacity-70"/> Email
                  </span>
                                    <span className="font-medium truncate max-w-[150px]" title={client.email || ""}>
                    {client.email || "—"}
                  </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase">Orders</span>
                                        <p className="text-2xl font-bold">{orders?.length || 0}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase">Lifetime Value</span>
                                        <p className="text-2xl font-bold">
                                            {new Intl.NumberFormat(undefined, {
                                                style: 'currency',
                                                currency: currency,
                                                maximumFractionDigits: 0
                                            }).format(lifetimeValue)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions / Edit */}
                    <Card className="p-1 border-none shadow-none bg-transparent">
                        <Button variant="outline"
                                className="w-full border-dashed border-muted-foreground/30 hover:bg-muted/50" asChild>
                            <Link href={`/clients/${client.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4"/> Edit Client Profile
                            </Link>
                        </Button>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN (Data) --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Measurements */}
                    <div className="space-y-4">
                        {/*<div className="flex items-center justify-between px-1">*/}
                        {/*    <h3 className="text-lg font-semibold flex items-center gap-2">*/}
                        {/*        <Ruler className="h-5 w-5 text-primary"/> Measurements*/}
                        {/*    </h3>*/}
                        {/*</div>*/}
                        {/* MeasurementsSection handles its own card UI internally */}
                        <MeasurementsSection customerId={client.id}/>
                    </div>

                    <Separator/>

                    {/* Orders */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary"/> Order History
                            </h3>
                            {/* Optional: Add Order Button could go here */}
                        </div>

                        <Card className="overflow-hidden border-border/60 shadow-sm">
                            <div className="overflow-x-auto px-2">
                                <OrdersListItems orders={orders} totalsByOrder={totalsByOrder}/>
                            </div>
                            {(!orders || orders.length === 0) && (
                                <div className="p-12 text-center">
                                    <div
                                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                                        <ShoppingBag className="h-6 w-6 text-muted-foreground"/>
                                    </div>
                                    <h3 className="text-sm font-semibold">No orders yet</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Create a new order to start tracking history.
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}