'use client';

import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import ClientTime from "@/components/ClientTime";

type OrderRow = {
    id: string;
    order_code?: string | null;
    status: "pending" | "processing" | "completed" | "cancelled" | string;
    currency_code: string;
    created_at: string;
};

function StatusBadge({status}: { status: string }) {
    const s = status.toLowerCase();
    const variant =
        s === "completed" ? "default" :
            s === "processing" ? "secondary" :
                s === "pending" ? "outline" :
                    s === "cancelled" ? "destructive" :
                        "outline";

    return (
        <Badge variant={variant} className="capitalize">
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

export default function OrdersTable({
                                        orders,
                                        totalsByOrder,
                                    }: {
    orders: OrderRow[] | null | undefined;
    totalsByOrder: Record<string, number>;
}) {
    return (
        <div className="overflow-x-auto rounded-2xl bg-card/70">
            <Table className="w-full">
                <TableHeader
                    className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <TableRow>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Order</TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                        <TableHead
                            className="text-right text-xs uppercase tracking-wide text-muted-foreground">Total</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {(orders as OrderRow[] | null)?.map((o) => {
                        const computed = totalsByOrder[o.id] ?? 0;
                        return (
                            <TableRow
                                key={o.id}
                                className="odd:bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => (window.location.href = `/orders/${o.id}`)}
                            >
                                <TableCell className="align-top">
                                    <Link
                                        href={`/orders/${o.id}`}
                                        className="font-medium hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span
                                            className="font-mono text-sm">{o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`}</span>
                                    </Link>
                                    <div className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>
                                        <ClientTime iso={o.created_at}/>
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <StatusBadge status={o.status}/>
                                </TableCell>

                                <TableCell className="align-top text-right font-medium tabular-nums">
                                    {formatMoney(o.currency_code, computed)}
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {(!orders || orders.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={3} className="py-12 text-center">
                                <div className="mx-auto inline-flex flex-col items-center gap-2">
                                    <div className="text-sm text-muted-foreground">No orders yet</div>
                                    <Link
                                        href="/orders/new"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Create your first order
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}