"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-40 rounded-[2rem] bg-secondary animate-pulse border border-border/50" />
                    ))
                ) : items.length === 0 ? (
                    <div className="col-span-full bento-card bg-secondary/30 p-16 text-center flex flex-col items-center gap-6">
                        <div className="h-20 w-20 bg-background border border-border rounded-[1.5rem] flex items-center justify-center mb-2">
                            <Ruler className="h-10 w-10 text-foreground opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-serif text-foreground">Dimensions Empty</h4>
                            <p className="text-sm font-sans text-muted-foreground italic">Add precision metrics to this creator&apos;s dossier.</p>
                        </div>
                        <Button onClick={() => setOpenEdit(true)} className="btn-primary mt-4 h-11 px-8">Add Metric</Button>
                    </div>
                ) : (
                    <>
                        {items.map((m) => (
                            <div
                                key={m.id}
                                className="group bento-card bg-card p-8 flex flex-col justify-between hover:shadow-xl transition-all h-44 border-border/40"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-40 truncate">
                                        {m.name}
                                    </span>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-8 w-8 rounded-full flex items-center justify-center border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
                                                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border border-border shadow-2xl bg-background p-2">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditRow(m);
                                                    setOpenEdit(true);
                                                }}
                                                className="rounded-xl font-medium text-xs py-3"
                                            >
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="rounded-xl font-medium text-xs py-3 text-rose-500"
                                                onClick={() => {
                                                    setDeleteRow(m);
                                                    setOpenDelete(true);
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-serif text-foreground tabular-nums">
                                            {Number(m.value).toString()}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground italic lowercase opacity-40">
                                            {m.unit ?? "in"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Inline Add Button */}
                        <button
                            onClick={() => {
                                setEditRow(null);
                                setOpenEdit(true);
                            }}
                            className="bento-card border-2 border-dashed border-border bg-transparent p-6 flex flex-col items-center justify-center group h-44 gap-3 hover:bg-secondary/20 hover:border-transparent transition-all text-muted-foreground opacity-30 hover:opacity-100"
                        >
                            <Plus className="w-10 h-10 opacity-20 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Add Dimension</span>
                        </button>
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