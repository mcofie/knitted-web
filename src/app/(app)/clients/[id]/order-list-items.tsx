import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ClientTime from "@/components/ClientTime";

type OrderRow = {
    id: string;
    order_code?: string | null;
    status: string;
    currency_code: string;
    created_at: string;
};

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    const variant =
        s === "completed"
            ? "default"
            : s === "processing"
                ? "secondary"
                : s === "pending"
                    ? "outline"
                    : s === "cancelled"
                        ? "destructive"
                        : "outline";
    return (
        <Badge
            variant={variant}
            className="h-5 px-2 text-[10px] capitalize tracking-wide"
        >
            {status}
        </Badge>
    );
}

function formatMoney(code: string, amount: number) {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: code,
            currencyDisplay: "code",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${code} ${amount.toFixed(2)}`;
    }
}

export default function OrdersListFlex({
                                           orders,
                                           totalsByOrder,
                                       }: {
    orders: OrderRow[] | null | undefined;
    totalsByOrder: Record<string, number>;
}) {
    if (!orders || orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                No orders yet —{" "}
                <Link href="/orders/new" className="text-primary hover:underline">
                    create your first order
                </Link>
                .
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {orders.map((o) => {
                const total = totalsByOrder[o.id] ?? 0;
                const code = o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`;

                return (
                    <div
                        key={o.id}
                        className="
              min-w-0 flex-shrink-0 basis-full"
                    >
                        <Link
                            href={`/orders/${o.id}`}
                            className="flex h-full items-center justify-between gap-4 rounded-xl border border-border bg-card/70 p-4 transition-all duration-300 hover:bg-muted/40 hover:shadow-sm"
                        >
                            {/* Left side */}
                            <div className="flex min-w-0 items-center gap-4">
                                <Image
                                    src={`https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
                                        o?.order_code || 'Guest'
                                    )}`}
                                    alt={o?.order_code || 'Avatar'}
                                    width={58}
                                    height={58}
                                    unoptimized
                                    className="opacity-45 rounded-full border border-border bg-muted ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/40"
                                />

                                <div className="min-w-0">
                  <span className="block truncate font-mono text-md font-medium">
                    {code}
                  </span>
                                    <small className="text-xs text-gray-500">
                                        <ClientTime iso={o.created_at} />
                                    </small>
                                    <div className="mt-1">
                                        <StatusBadge status={o.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex flex-col items-end">
                <span className="text-sm font-medium tabular-nums">
                  {formatMoney(o.currency_code, total)}
                </span>
                                <span className="text-xs text-muted-foreground">Total</span>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}