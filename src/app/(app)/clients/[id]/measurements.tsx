"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MeasurementDialog from "./measurement-dialog";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Icons
import { Ruler, Plus, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Measurement = {
    id: string;
    name: string;
    value: number;
    unit: string | null;
    created_at: string;
};

export default function MeasurementsSection({ customerId }: { customerId: string }) {
    const sb = createClientBrowser();
    const [items, setItems] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Dialog
    const [openEdit, setOpenEdit] = useState(false);
    const [editRow, setEditRow] = useState<Measurement | null>(null);

    // Delete Dialog
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteRow, setDeleteRow] = useState<Measurement | null>(null);

    async function load() {
        setLoading(true);
        const { data, error } = await sb
            .schema("knitted")
            .from("measurements")
            .select("id, name, value, unit, created_at")
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false });

        setLoading(false);
        if (error) {
            toast.error("Load failed", { description: error.message });
            return;
        }
        setItems((data ?? []) as Measurement[]);
    }

    async function confirmDelete() {
        if (!deleteRow) return;
        const { error } = await sb.schema("knitted").from("measurements").delete().eq("id", deleteRow.id);
        if (error) {
            toast.error("Delete failed", { description: error.message });
            return;
        }
        toast.success("Measurement removed ✨");
        setOpenDelete(false);
        setDeleteRow(null);
        await load();
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-44 rounded-sm bg-muted/40 animate-pulse border border-border/10" />
                    ))
                ) : items.length === 0 ? (
                    <div className="col-span-full bento-card bg-[#F0F0F0] border-none p-20 text-center flex flex-col items-center gap-6 rotate-[0.5deg]">
                        <div className="h-20 w-20 bg-white/50 border border-white/20 rounded-full flex items-center justify-center mb-2">
                            <Ruler className="h-8 w-8 text-[#2D1B08] opacity-20" />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-3xl font-serif text-[#2D1B08]">Dimensions Empty.</h4>
                            <p className="text-sm font-sans text-[#2D1B08]/40 italic max-w-xs mx-auto">Precision metrics for this creator are currently unspecified.</p>
                        </div>
                        <Button
                            onClick={() => setOpenEdit(true)}
                            className="h-11 px-10 rounded-full bg-[#2D1B08] text-white font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all mt-4"
                        >
                            Log Identity Metric
                        </Button>
                    </div>
                ) : (
                    <>
                        {items.map((m, index) => {
                            const rotation = [-1, 1, -0.5, 0.5][index % 4];
                            const color = ["#FFF9E6", "#E6F4FF", "#FFEBFA", "#F0F0F0"][index % 4];

                            return (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10, rotate: rotation }}
                                    animate={{ opacity: 1, y: 0, rotate: rotation }}
                                    whileHover={{ scale: 1.02, rotate: 0, zIndex: 10, y: -2 }}
                                    style={{ backgroundColor: color }}
                                    className="group relative flex flex-col justify-between h-48 p-8 rounded-sm border border-border/5 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                                >
                                    <div className="flex justify-between items-start relative z-10">
                                        <span className="text-[9px] font-bold text-[#2D1B08]/30 uppercase tracking-[0.2em] truncate">
                                            {m.name}
                                        </span>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="h-7 w-7 rounded-full flex items-center justify-center border border-[#2D1B08]/10 group-hover:border-[#2D1B08]/30 transition-all hover:bg-white/50">
                                                    <MoreVertical className="h-3 w-3 text-[#2D1B08]/40" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border border-border shadow-2xl bg-background p-2">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditRow(m);
                                                        setOpenEdit(true);
                                                    }}
                                                    className="rounded-lg font-bold text-[10px] py-3 uppercase tracking-widest"
                                                >
                                                    <Pencil className="mr-2 h-3 w-3" /> Edit Metric
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-lg font-bold text-[10px] py-3 text-rose-500 uppercase tracking-widest"
                                                    onClick={() => {
                                                        setDeleteRow(m);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-3 w-3" /> Archive
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-serif text-[#2D1B08] tabular-nums">
                                                {Number(m.value).toString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#2D1B08]/20 uppercase tracking-widest italic">
                                                {m.unit ?? "in"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Decorative subtle texture */}
                                    <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-[#2D1B08]/5 rounded-full blur-2xl" />
                                </motion.div>
                            );
                        })}

                        {/* Inline Add Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
                            onClick={() => {
                                setEditRow(null);
                                setOpenEdit(true);
                            }}
                            className="rounded-sm border-2 border-dashed border-[#2D1B08]/10 bg-transparent p-6 flex flex-col items-center justify-center group h-48 gap-4 hover:border-[#2D1B08]/30 transition-all text-[#2D1B08]/30 overflow-hidden"
                        >
                            <div className="h-12 w-12 rounded-full border border-dashed border-[#2D1B08]/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2D1B08]/5 transition-all">
                                <Plus className="w-5 h-5 opacity-40" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-60">Log Dimension</span>
                        </motion.button>
                    </>
                )}
            </div>

            {/* Edit / Create dialog */}
            <MeasurementDialog
                open={openEdit}
                onOpenChange={(v) => {
                    setOpenEdit(v);
                    if (!v) setEditRow(null);
                }}
                customerId={customerId}
                editRow={editRow}
                onSaved={load}
            />

            {/* Delete confirm dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="rounded-[2.5rem] border border-border p-10 shadow-3xl bg-background transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <AlertDialogTitle className="text-3xl font-serif text-foreground">Remove Metric</AlertDialogTitle>
                        <button onClick={() => setOpenDelete(false)} className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                            <X className="w-4 h-4 text-foreground" />
                        </button>
                    </div>
                    <AlertDialogDescription className="text-lg font-sans text-muted-foreground leading-relaxed italic">
                        Confirm removal of the <span className="text-foreground font-medium">{deleteRow?.name}</span> measurement record. This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter className="mt-10 gap-4">
                        <AlertDialogCancel onClick={() => setDeleteRow(null)} className="h-12 rounded-full font-medium border-border bg-transparent hover:bg-muted text-xs uppercase tracking-widest px-8">Keep Record</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}
                            className="btn-primary bg-rose-500 hover:bg-rose-600 border-none h-12 px-8">
                            Delete Metric
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}