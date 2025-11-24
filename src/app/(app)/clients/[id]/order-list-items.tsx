import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import ClientTime from "@/components/ClientTime";
import {
    Package,
    ChevronRight,
    ShoppingBag,
    Calendar,
    CreditCard
} from "lucide-react";
import {cn} from "@/lib/utils"; // Assuming you have a utils file

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
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${code} ${amount.toFixed(2)}`;
    }
}

function getStatusStyles(status: string) {
    const s = status.toLowerCase().replace('_', ' ');
    switch (s) {
        case 'delivered':
        case 'completed':
        case 'ready':
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
        case 'in production':
        case 'processing':
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
        case 'confirmed':
            return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
        case 'cancelled':
            return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
        default: // pending / draft
            return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
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
    // Empty State
    if (!orders || orders.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground"/>
                </div>
                <h3 className="text-sm font-semibold text-foreground">No orders found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-xs mx-auto">
                    This list is empty. Start by adding a new order for this client.
                </p>
                {/* Optional: Add Link/Button here if context allows */}
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((o) => {
                const total = totalsByOrder[o.id] ?? 0;
                const code = o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`;
                const statusStyle = getStatusStyles(o.status);

                return (
                    <Link
                        key={o.id}
                        href={`/orders/${o.id}`}
                        className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-3">
                            {/* Icon & Code */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Package className="h-5 w-5"/>
                                </div>
                                <div>
                                    <h4 className="font-mono text-sm font-bold text-foreground tracking-tight">
                                        {code}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                        <Calendar className="h-3 w-3"/>
                                        <ClientTime iso={o.created_at}/>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow (Visual cue) */}
                            <ChevronRight
                                className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors"/>
                        </div>

                        <hr className="border-border/50 mb-3"/>

                        {/* Bottom Row: Status & Price */}
                        <div className="flex items-center justify-between">
                            <Badge
                                variant="outline"
                                className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium border uppercase tracking-wider", statusStyle)}
                            >
                                {o.status.replace('_', ' ')}
                            </Badge>

                            <div className="text-right">
                                <p className="text-sm font-bold text-foreground tabular-nums">
                                    {formatMoney(o.currency_code, total)}
                                </p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}