"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ClientTime from "@/components/ClientTime";
import StatusBadge from "@/components/StatusBadge";
import {
    Package,
    ArrowRight
} from "lucide-react";

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
        return new Intl.NumberFormat("en-US", {
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
    if (!orders || orders.length === 0) return null;

    return (
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 p-12 bg-transparent">
            {orders.map((o, index) => {
                const total = totalsByOrder[o.id] ?? 0;
                const code = o.order_code ?? `#${o.id.slice(0, 5).toUpperCase()}`;
                const rotation = [-1, 1, -0.5, 0.8][index % 4];
                const color = ["#FFF9E6", "#E6F4FF", "#FFEBFA", "#F0F0F0"][index % 4];

                return (
                    <motion.div
                        key={o.id}
                        initial={{ opacity: 0, y: 10, rotate: rotation }}
                        animate={{ opacity: 1, y: 0, rotate: rotation }}
                        whileHover={{ scale: 1.02, rotate: 0, zIndex: 10, y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Link
                            href={`/orders/${o.id}`}
                            style={{ backgroundColor: color }}
                            className="group relative flex flex-col justify-between h-[320px] p-10 rounded-sm border border-border/10 shadow-sm hover:shadow-2xl transition-all overflow-hidden"
                        >
                            <div className="absolute top-8 left-8 flex items-center gap-2 text-[#2D1B08]/20 font-bold uppercase tracking-[0.25em] text-[10px]">
                                <span>Project {index + 1}</span>
                            </div>

                            <div className="flex justify-between items-start pt-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/50 text-[#2D1B08] group-hover:scale-110 transition-transform shadow-sm border border-white/20">
                                        <Package className="h-5 w-5 stroke-[1.5]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-2xl font-serif text-[#2D1B08] leading-none tracking-tight">
                                            {code}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#2D1B08]/30 uppercase tracking-[0.2em]">
                                            <ClientTime iso={o.created_at} />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10 w-10 border border-[#2D1B08]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D1B08] group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-serif text-[#2D1B08] leading-none tabular-nums tracking-tighter">
                                        {formatMoney(o.currency_code, total)}
                                    </span>
                                </div>

                                <div className="pt-6 border-t border-[#2D1B08]/5">
                                    <StatusBadge
                                        status={o.status}
                                        className="h-7 px-4 border border-[#2D1B08]/10 bg-white/50 shadow-none rounded-full text-[10px] font-bold uppercase tracking-[0.1em] text-[#2D1B08]"
                                    />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}