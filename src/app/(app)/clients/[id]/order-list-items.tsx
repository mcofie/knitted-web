import Link from "next/link";
import ClientTime from "@/components/ClientTime";
import StatusBadge from "@/components/StatusBadge";
import {
    Package,
    ArrowRight,
    ShoppingBag,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

type OrderRow = {
    id: string;
    order_code?: string | null;
    status: string;
    currency_code: string;
    created_at: string;
};

/* --- Utils --- */

function formatMoney(code: string, amount: number) {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: code,
            currencyDisplay: "symbol",
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        return `${code} ${amount.toFixed(0)} `;
    }
}

/* --- Component --- */

export default function OrdersListFlex({
    orders,
    totalsByOrder,
}: {
    orders: OrderRow[] | null | undefined;
    totalsByOrder: Record<string, number>;
}) {
    // Empty State handled by parent in [id]/page.tsx now, but keeping a fallback here.
    if (!orders || orders.length === 0) {
        return null; // Parent handles empty state
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-6">
            {orders.map((o) => {
                const total = totalsByOrder[o.id] ?? 0;
                const code = o.order_code ?? `#${o.id.slice(0, 5).toUpperCase()}`;

                return (
                    <Link
                        key={o.id}
                        href={`/orders/${o.id}`}
                        className="group bento-card p-6 flex flex-col justify-between h-[280px] bg-background border border-border/50 hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground group-hover:scale-110 transition-transform">
                                    <Package className="h-4 w-4 stroke-[1.5]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-serif text-foreground leading-none group-hover:text-accent transition-colors">
                                        {code}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-40">
                                        <ClientTime iso={o.created_at} />
                                    </div>
                                </div>
                            </div>
                            <div className="h-8 w-8 border border-border rounded-full flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-serif text-foreground leading-none tabular-nums">
                                    {formatMoney(o.currency_code, total)}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <StatusBadge status={o.status} className="h-6 px-3 border border-border bg-background shadow-none rounded-full text-[9px] font-medium uppercase tracking-widest" />
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}