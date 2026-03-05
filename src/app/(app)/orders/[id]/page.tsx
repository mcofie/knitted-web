import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";
import OrderDetailContent from "./order-detail-content";

export const dynamic = "force-dynamic";

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
                    <h2 className="text-4xl font-serif text-foreground">Archive Not Found</h2>
                </div>
            </div>
        );
    }

    // 2) Totals
    const { data: totals } = await sb
        .schema("knitted")
        .from("order_totals")
        .select("*")
        .eq("order_id", id)
        .maybeSingle();

    const t = {
        subtotal: Number(totals?.items_subtotal ?? 0),
        total: Number(totals?.computed_total ?? totals?.items_subtotal ?? 0),
        paid: Number(totals?.paid_total ?? 0),
    };

    return (
        <div className="max-w-7xl mx-auto pb-32">
            <OrderDetailContent
                ord={order}
                t={t}
                currency={order.currency_code}
            />
        </div>
    );
}