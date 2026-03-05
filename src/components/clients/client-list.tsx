"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";

type Client = {
    id: string;
    name: string;
    full_name?: string;
    city: string | null;
    [key: string]: any;
};

export default function ClientList({ clients }: { clients: Client[] }) {
    if (!clients || clients.length === 0) return null;

    return (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c, index) => {
                const rotation = [-1, 1, -1.5, 2, -0.5][index % 5];
                const color = ["#FFF9E6", "#E6F4FF", "#FFEBFA", "#FFF1E6", "#F0F0F0"][index % 5];
                const displayName = c.full_name || c.name || "Master Client";

                return (
                    <motion.div
                        key={c.id}
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
                            href={`/clients/${c.id}`}
                            style={{ backgroundColor: color }}
                            className="group relative flex flex-col justify-between h-[340px] p-10 rounded-sm border border-border/20 shadow-sm transition-shadow hover:shadow-xl overflow-hidden"
                        >
                            <div className="absolute top-8 left-8 flex items-center gap-2 text-foreground/20 font-medium uppercase tracking-[0.2em] text-[10px]">
                                <span>0{index + 1}</span>
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-white/50 border border-white/20 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                    <Image
                                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c?.name || "Guest")}`}
                                        alt={displayName}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="h-10 w-10 border border-[#2D1B08]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D1B08] group-hover:text-white transition-all duration-300">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <h3 className="text-3xl font-serif text-[#2D1B08] leading-[1.1] mb-2">
                                        {displayName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#2D1B08]/40 uppercase tracking-widest">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{c.city || 'Global Atelier'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-6 border-t border-[#2D1B08]/5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#2D1B08]/20" />
                                    <span className="text-[10px] uppercase font-semibold tracking-widest text-[#2D1B08]/30">Active Record</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
