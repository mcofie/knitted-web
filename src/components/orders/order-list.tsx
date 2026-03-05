"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

type Order = {
    id: string;
    status: string;
    order_code: string | null;
    currency_code: string;
    created_at: string;
};

interface OrderListProps {
    orders: Order[];
    totalByOrder: Record<string, number>;
}

export default function OrderList({ orders, totalByOrder }: OrderListProps) {
    if (!orders || orders.length === 0) return null;

    return (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((o, index) => {
                const rotation = [-1.5, 1, -0.5, 2, -1][index % 5];
                const color = ["#FFF9E6", "#E6F4FF", "#FFEBFA", "#FFF1E6", "#F0F0F0"][index % 5];
                const amount = totalByOrder[o.id] ?? 0;
                const code = o.order_code ?? `#${o.id.slice(0, 8).toUpperCase()}`;
                const currencyCode = o.currency_code || "GHS";

                // Format Date - Use invariant locale to avoid hydration mismatch
                const dateStr = new Date(o.created_at).toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric'
                });

                // Format Money - Use invariant locale and defensive try/catch
                let moneyStr = "";
                try {
                    moneyStr = new Intl.NumberFormat("en-US", {
                        style: 'currency',
                        currency: currencyCode,
                        maximumFractionDigits: 0
                    }).format(amount);
                } catch (e) {
                    moneyStr = `${currencyCode} ${amount}`;
                }

                return (
                    <motion.div
                        key={o.id}
                        initial={{ opacity: 0, y: 20, rotate: rotation }}
                        animate={{ opacity: 1, y: 0, rotate: rotation }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                        whileHover={{
                            scale: 1.02,
                            rotate: 0,
                            zIndex: 20,
                            y: -5,
                            transition: { type: "spring", stiffness: 400, damping: 20 }
                        }}
                    >
                        <Link
                            href={`/orders/${o.id}`}
                            style={{ backgroundColor: color }}
                            className="group relative flex flex-col justify-between h-[340px] p-10 rounded-sm border border-border/20 shadow-sm transition-shadow hover:shadow-xl overflow-hidden"
                        >
                            {/* Metadata Index */}
                            <div className="absolute top-8 left-8 flex items-center gap-2 text-foreground/20 font-medium uppercase tracking-[0.2em] text-[10px]">
                                <span>No. {index + 1}</span>
                            </div>

                            <div className="flex justify-between items-start relative z-10 pt-[2px]">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/50 text-[#2D1B08] group-hover:scale-110 transition-transform shadow-sm border border-white/20">
                                        <Package className="h-5 w-5 stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-[#2D1B08] leading-none mb-1 group-hover:text-[#2D1B08]/80 transition-colors">
                                            {code}
                                        </h3>
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-[#2D1B08]/40">{dateStr}</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 border border-[#2D1B08]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D1B08] group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-serif text-[#2D1B08] leading-none tabular-nums">{moneyStr}</span>
                                    <span className="text-[10px] font-medium text-[#2D1B08]/40 uppercase tracking-widest">Total</span>
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
