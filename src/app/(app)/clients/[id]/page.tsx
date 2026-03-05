import { createClientServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientDetailContent from "./client-detail-content";

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
    if (!user) redirect("/login");

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
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif text-foreground">Record Not Found</h2>
                    <p className="font-sans text-muted-foreground italic text-lg">The dossier has been archived.</p>
                </div>
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
        <div className="max-w-7xl mx-auto pb-20">
            <ClientDetailContent
                client={client}
                displayName={displayName}
                orders={orders}
                totalsByOrder={totalsByOrder}
                lifetimeValue={lifetimeValue}
                currency={currency}
            />
        </div>
    );
}