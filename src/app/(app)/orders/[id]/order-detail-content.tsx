"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Layers,
    CreditCard,
    FileText,
    Zap,
    Clock,
    StickyNote,
    Settings2
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PaymentsSection from "./payments";
import StatusSelect from "./status-select";
import ReadyAtPicker from "./ready-at-picker";
import AttachmentsSection from "./attachments";
import { Button } from "@/components/ui/button";

interface OrderDetailContentProps {
    ord: any;
    t: {
        subtotal: number;
        total: number;
        paid: number;
    };
    currency: string;
}

export default function OrderDetailContent({ ord, t, currency }: OrderDetailContentProps) {
    const code = ord.order_code ?? `#${ord.id.slice(0, 5).toUpperCase()}`;

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                <div className="space-y-6">
                    <Link href="/orders" className="inline-flex items-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.25em]">
                        <ArrowLeft className="h-3 w-3" />
                        Workshop
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 md:gap-10">
                        <h1 className="text-6xl md:text-8xl font-serif text-foreground leading-none tracking-tight">
                            {code}.
                        </h1>
                        <StatusBadge status={ord.status} className="h-8 px-5 border border-border/20 shadow-none rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/50" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full h-12 border-border bg-transparent text-foreground hover:bg-muted font-bold text-[10px] uppercase tracking-[0.2em] px-8 shadow-sm transition-all" asChild>
                        <Link href={`/orders/${ord.id}/edit`}>Edit Project</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Manifest - Blue Note style */}
                    <motion.div
                        whileHover={{ rotate: 0, scale: 1.005 }}
                        style={{ backgroundColor: "#E6F4FF" }}
                        className="relative rounded-sm border border-border/10 shadow-sm p-14 space-y-12 rotate-[0.5deg] transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-8 left-8 flex items-center gap-2 text-[#2D1B08]/20 font-bold uppercase tracking-[0.3em] text-[9px]">
                            <span>Identity Manifest</span>
                        </div>

                        <div className="space-y-10 pt-6 relative z-10">
                            {(ord.items ?? []).map((it: any) => (
                                <div key={it.id} className="flex items-center justify-between py-8 border-b border-[#2D1B08]/5 last:border-none">
                                    <div className="space-y-2">
                                        <h4 className="font-serif text-[#2D1B08] text-3xl leading-[1.1]">{it.description}</h4>
                                        <p className="text-[10px] font-bold text-[#2D1B08]/30 uppercase tracking-[0.2em]">
                                            {it.quantity} Unit{it.quantity > 1 ? 's' : ''} at {new Intl.NumberFormat("en-US", { style: 'currency', currency }).format(it.unit_price)}
                                        </p>
                                    </div>
                                    <div className="text-3xl font-serif text-[#2D1B08] tabular-nums tracking-tighter">
                                        {new Intl.NumberFormat("en-US", { style: 'currency', currency }).format((it.quantity || 0) * (it.unit_price || 0))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-12 border-t border-[#2D1B08]/10 space-y-8 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-bold text-[#2D1B08]/30 uppercase tracking-[0.25em]">
                                <span>Gross Service Value</span>
                                <span className="tabular-nums font-serif text-2xl tracking-tighter">{new Intl.NumberFormat("en-US", { style: 'currency', currency }).format(t.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[#2D1B08]">
                                <span className="text-4xl font-serif">Total.</span>
                                <span className="text-6xl md:text-8xl font-serif tabular-nums tracking-tightest">
                                    {new Intl.NumberFormat("en-US", { style: 'currency', currency, maximumFractionDigits: 0 }).format(t.total)}
                                </span>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-[#2D1B08]/5 rounded-full blur-3xl" />
                    </motion.div>

                    {/* Ledger */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-4xl font-serif text-foreground tracking-tight">Ledger.</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>
                        <PaymentsSection orderId={ord.id} currency={currency} />
                    </div>

                    {/* Dossier */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-4xl font-serif text-foreground tracking-tight">Dossier.</h3>
                            <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-foreground opacity-40" />
                            </div>
                        </div>
                        <AttachmentsSection orderId={ord.id} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Stakeholder Note - Yellow */}
                    <motion.div
                        whileHover={{ rotate: 0, scale: 1.01 }}
                        style={{ backgroundColor: "#FFF9E6" }}
                        className="relative rounded-sm border border-border/10 shadow-sm p-10 flex flex-col items-center text-center space-y-10 rotate-[-1deg] transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-8 left-8 flex items-center gap-2 text-[#2D1B08]/20 font-medium uppercase tracking-[0.2em] text-[10px]">
                            <span>Stakeholder</span>
                        </div>
                        <div className="relative pt-4">
                            <div className="h-32 w-32 rounded-[2rem] bg-white/50 border border-white/20 shadow-sm overflow-hidden">
                                <Image
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(ord.customer?.full_name || "Guest")}`}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="space-y-6 w-full text-center">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-serif text-[#2D1B08]">{ord.customer?.full_name}</h3>
                                <p className="text-[10px] font-bold text-[#2D1B08]/30 uppercase tracking-widest">Project Lead</p>
                            </div>

                            <Link
                                href={`/clients/${ord.customer?.id}`}
                                className="flex items-center justify-center h-12 w-full rounded-xl bg-[#2D1B08] text-[#FFF9E6] font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
                            >
                                Dossier Directory
                            </Link>
                        </div>
                    </motion.div>

                    {/* Logistics Hub - Yellow accent */}
                    <motion.div
                        style={{ backgroundColor: "#FFC132" }}
                        className="relative rounded-sm p-10 text-[#2D1B08] space-y-10 border border-[#2D1B08]/5 shadow-sm rotate-[1deg] transition-all duration-500 overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-serif">Logistics</h3>
                            <Settings2 className="w-5 h-5 opacity-30" />
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-[#2D1B08]/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5" /> State Transition
                                </label>
                                <StatusSelect orderId={ord.id} initial={ord.status} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-[#2D1B08]/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" /> Goal Time
                                </label>
                                <ReadyAtPicker orderId={ord.id} initial={ord.ready_at} />
                            </div>
                        </div>

                        {ord.notes && (
                            <div className="pt-8 border-t border-[#2D1B08]/10 space-y-3">
                                <label className="text-[10px] font-bold text-[#2D1B08]/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <StickyNote className="w-3.5 h-3.5" /> Memo
                                </label>
                                <p className="text-sm font-sans italic text-[#2D1B08]/80 leading-relaxed font-medium">{ord.notes}</p>
                            </div>
                        )}
                    </motion.div>

                    <div className="flex flex-col gap-3 px-2">
                        <button className="h-12 w-full flex items-center justify-center gap-3 bg-muted/30 hover:bg-muted rounded-full font-bold text-[10px] uppercase tracking-widest transition-all border border-border/30">
                            <FileText className="w-4 h-4 text-foreground opacity-40" /> Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
