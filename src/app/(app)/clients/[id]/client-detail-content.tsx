"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ChevronRight, Scale, ShoppingBag, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import MeasurementsSection from "./measurements";
import ClientActions from "@/app/(app)/clients/[id]/client-actions";
import OrdersListItems from "@/app/(app)/clients/[id]/order-list-items";

interface ClientDetailContentProps {
    client: any;
    displayName: string;
    orders: any[] | null;
    totalsByOrder: Record<string, number>;
    lifetimeValue: number;
    currency: string;
}

export default function ClientDetailContent({
    client,
    displayName,
    orders,
    totalsByOrder,
    lifetimeValue,
    currency
}: ClientDetailContentProps) {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                <div className="space-y-6">
                    <Link href="/clients" className="inline-flex items-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.25em]">
                        <span>Directory</span>
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-serif text-foreground leading-[1.1] tracking-tight">
                            {displayName}.
                        </h1>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">Stakeholder Record Verified</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ClientActions clientId={client.id} clientName={displayName} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div
                        whileHover={{ rotate: 0, scale: 1.01 }}
                        style={{ backgroundColor: "#FFF9E6" }}
                        className="relative rounded-sm border border-border/20 shadow-sm p-10 flex flex-col items-center text-center space-y-10 rotate-[-1deg] transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-6 left-6 flex items-center gap-2 text-[#2D1B08]/20 font-medium uppercase tracking-[0.2em] text-[10px]">
                            <span>Identity</span>
                        </div>
                        <div className="relative pt-4">
                            <div className="h-44 w-44 rounded-[2.5rem] bg-white/50 border border-white/20 shadow-sm overflow-hidden">
                                <Image
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(client.name || "Guest")}`}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="space-y-8 w-full">
                            <div className="space-y-4 pt-4">
                                <h2 className="text-5xl md:text-6xl font-serif text-[#2D1B08]">{client.name}</h2>
                                <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#2D1B08]/30 uppercase tracking-[0.2em]">
                                    <MapPin className="w-4 h-4" />
                                    <span>{client.city || 'Global Atelier'}</span>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8 border-t border-[#2D1B08]/5">
                                <Link
                                    href={`tel:${client.phone}`}
                                    className="flex items-center justify-center h-14 w-full rounded-full bg-[#2D1B08] text-[#FFF9E6] font-bold text-[10px] uppercase tracking-[0.25em] hover:opacity-90 transition-all shadow-md group/btn"
                                >
                                    <span>Initiate Call</span>
                                    <Phone className="w-3 h-3 ml-3 opacity-30 group-hover/btn:opacity-100 transition-opacity" />
                                </Link>
                                <Link
                                    href={`mailto:${client.email}`}
                                    className="flex items-center justify-center h-14 w-full rounded-full bg-transparent border border-[#2D1B08]/10 text-[#2D1B08] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#2D1B08]/5 transition-all"
                                >
                                    Dispatch Brief
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Note - Premium Yellow */}
                    <motion.div
                        whileHover={{ rotate: 0, scale: 1.01 }}
                        style={{ backgroundColor: "#FFC132" }}
                        className="relative rounded-sm p-12 text-[#2D1B08] space-y-10 border border-[#2D1B08]/5 shadow-sm rotate-[1deg] transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-8 left-8 flex items-center gap-2 text-[#2D1B08]/10 font-bold uppercase tracking-[0.3em] text-[9px]">
                            <span>Atelier Ledger</span>
                        </div>
                        <div className="grid grid-cols-1 gap-10 pt-6">
                            <div className="space-y-3">
                                <span className="text-[10px] uppercase opacity-30 font-bold tracking-[0.2em]">Identified Projects</span>
                                <p className="text-5xl font-serif tracking-tighter tabular-nums">{orders?.length || 0}</p>
                            </div>
                            <div className="space-y-3 border-t border-[#2D1B08]/5 pt-8">
                                <span className="text-[10px] uppercase opacity-30 font-bold tracking-[0.2em]">Lifetime Portfolio Value</span>
                                <p className="text-5xl font-serif tabular-nums tracking-tighter">
                                    {new Intl.NumberFormat("en-US", { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(lifetimeValue)}
                                </p>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#2D1B08]/5 rounded-full blur-3xl" />
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-20">
                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight">Dimensions.</h3>
                            <div className="h-12 w-12 border border-border/50 rounded-full flex items-center justify-center shadow-sm">
                                <Scale className="w-4 h-4 text-foreground opacity-30 px-0.5" />
                            </div>
                        </div>
                        <MeasurementsSection customerId={client.id} />
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight">Commission Log.</h3>
                            <div className="h-12 w-12 border border-border/50 rounded-full flex items-center justify-center shadow-sm">
                                <ShoppingBag className="w-4 h-4 text-foreground opacity-30" />
                            </div>
                        </div>
                        <div className="bg-[#F8F8F7] rounded-sm border border-border/40 overflow-hidden shadow-inner">
                            <OrdersListItems orders={orders} totalsByOrder={totalsByOrder} />
                            {(!orders || orders.length === 0) && (
                                <div className="py-32 text-center space-y-6">
                                    <div className="h-20 w-20 bg-background border border-border/50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                                        <Coffee className="w-8 h-8 text-foreground stroke-[1.5]" />
                                    </div>
                                    <p className="font-serif text-2xl text-foreground/30 italic">No active projects identified.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
