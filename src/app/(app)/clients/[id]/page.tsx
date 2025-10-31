import Link from "next/link";
import {createClientServer} from "@/lib/supabase/server";
import Image from "next/image";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import MeasurementsSection from "./measurements";
import ClientActions from "@/app/(app)/clients/[id]/client-actions";
import ClientTime from "@/components/ClientTime";
import OrdersTable from "@/app/(app)/clients/[id]/orders-table";
import OrdersListItems from "@/app/(app)/clients/[id]/order-list-items";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {MdPhoneEnabled} from "react-icons/md";
import {FiEdit3} from "react-icons/fi";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ id: string }>;
type OrderRow = {
    id: string;
    status: string;
    order_code: string | null;
    currency_code: string;
    created_at: string; // ISO
};
type TotalsRow = { order_id: string; computed_total: number | null };

export default async function ClientDetailPage({params}: { params: RouteParams }) {
    const {id} = await params; // ⬅️ await params

    const sb = await createClientServer();

    // (optional) auth guard if RLS depends on owner
    const {
        data: {user},
    } = await sb.auth.getUser();
    if (!user) return <div className="p-6">Not signed in</div>;

    // 1) Client
    const {data: client, error: clientErr} = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code")
        .eq("id", id)
        .single();

    if (clientErr || !client) {
        return <div className="p-6">Error: {clientErr?.message ?? "Client not found"}</div>;
    }

    const displayName = client.full_name ?? client.name ?? "Client";

    // 2) Orders
    const {data: orders, error: ordersErr} = await sb
        .schema("knitted")
        .from("orders")
        .select("id, status, order_code, currency_code, created_at")
        .eq("customer_id", id)
        .order("created_at", {ascending: false});

    if (ordersErr) {
        return <div className="p-6">Error loading orders: {ordersErr.message}</div>;
    }

    // 3) Totals for those orders
    let totalsByOrder: Record<string, number> = {};
    if (orders?.length) {
        const orderIds = (orders as OrderRow[]).map((o) => o.id);
        const {data: totalsRows, error: totalsErr} = await sb
            .schema("knitted")
            .from("order_totals")
            .select("order_id, computed_total")
            .in("order_id", orderIds);

        if (!totalsErr && totalsRows) {
            totalsByOrder = (totalsRows as TotalsRow[]).reduce<Record<string, number>>((acc, r) => {
                acc[r.order_id] = Number(r.computed_total ?? 0);
                return acc;
            }, {});
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Client detail</h1>

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
                                    <Link href="/clients">Clients</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{displayName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <ClientActions clientId={client.id} clientName={displayName}/>
            </div>

            <div className='flex items-center justify-between'>
                <div
                    className="w-1/3 group relative rounded-2xl border border-border bg-card/70 p-6 transition-all duration-300 hover:shadow-md hover:bg-card">
                    {/* Top Right Action Buttons */}
                    <div
                        className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Link
                            href={`tel:${client.phone}`}
                            className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                            title="Contact"
                        >
                            <MdPhoneEnabled/>
                        </Link>
                        <Link
                            href={`/clients/${client.id}/edit`}
                            className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                            title="Edit client"
                        >
                            <FiEdit3/>
                        </Link>
                    </div>

                    {/* Client Info */}
                    <div className="mb-4 flex items-center gap-4">
                        <Image
                            src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(client?.name || "Guest")}`}
                            alt={client?.name || "Avatar"}
                            width={78}
                            height={78}
                            unoptimized
                            className="rounded-full border border-border bg-muted ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/40"
                        />

                        <div className="flex flex-col">
                            <h1 className='text-lg font-semibold'>
                                {client.name}
                            </h1>
                            <p className="text-xs text-muted-foreground">{client.phone}</p>
                            {/*<p className="text-xs text-muted-foreground">{client.city}</p>*/}
                            <p className="text-xs text-muted-foreground">{client.city ?? "—"} {client.country_code ? `• ${client.country_code}` : ""}</p>
                        </div>
                    </div>

                    {/* Optional note or quote */}
                    {/* <blockquote className="text-sm italic text-muted-foreground">“{c.note || 'Reliable client'}”</blockquote> */}
                </div>

            </div>
            <div className="pt-2">
                <h2 className="text-base font-semibold">Orders</h2>
            </div>

            <div className="overflow-x-auto">
                <OrdersListItems orders={orders} totalsByOrder={totalsByOrder}/>
            </div>

            <MeasurementsSection customerId={client.id}/>
        </div>
    );
}