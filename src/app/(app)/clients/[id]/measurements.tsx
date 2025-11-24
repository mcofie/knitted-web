"use client";

import {useEffect, useState} from "react";
import {createClientBrowser} from "@/lib/supabase/browser";
import {toast} from "sonner";
import MeasurementDialog from "./measurement-dialog";

// UI Components
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
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
import {Ruler, Plus, MoreVertical, Pencil, Trash2, Loader2} from "lucide-react";

type Measurement = {
    id: string;
    name: string;
    value: number;
    unit: string | null;
    created_at: string;
};

export default function MeasurementsSection({customerId}: { customerId: string }) {
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
        const {data, error} = await sb
            .schema("knitted")
            .from("measurements")
            .select("id, name, value, unit, created_at")
            .eq("customer_id", customerId)
            .order("created_at", {ascending: false});

        setLoading(false);
        if (error) {
            toast.error("Load failed", {description: error.message});
            return;
        }
        setItems((data ?? []) as Measurement[]);
    }

    async function confirmDelete() {
        if (!deleteRow) return;
        const {error} = await sb.schema("knitted").from("measurements").delete().eq("id", deleteRow.id);
        if (error) {
            toast.error("Delete failed", {description: error.message});
            return;
        }
        toast.success("Measurement deleted");
        setOpenDelete(false);
        setDeleteRow(null);
        await load();
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    return (
        <Card className="p-6 border-border/60 shadow-sm">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-primary"/> Measurements
                    </h2>
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditRow(null); // create mode
                            setOpenEdit(true);
                        }}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4"/> Add Measurement
                    </Button>
                </div>

                {/* Content */}
                <div className="min-h-[100px]">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 rounded-xl bg-muted animate-pulse"/>
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 bg-muted/5 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Ruler className="h-6 w-6 text-muted-foreground/50"/>
                            </div>
                            <p className="text-sm font-medium">No measurements yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Add body measurements to speed up future orders.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {items.map((m) => (
                                <div
                                    key={m.id}
                                    className="group relative flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate pr-4">
                      {m.name}
                    </span>

                                        {/* Context Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"
                                                        className="h-6 w-6 -mr-2 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-3.5 w-3.5"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setEditRow(m);
                                                    setOpenEdit(true);
                                                }}>
                                                    <Pencil className="mr-2 h-3.5 w-3.5"/> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setDeleteRow(m);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-3.5 w-3.5"/> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="mt-2">
                                        <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight text-foreground">
                        {Number(m.value).toFixed(2)}
                      </span>
                                            <span className="text-sm font-medium text-muted-foreground">
                        {m.unit ?? "in"}
                      </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
                                            {new Date(m.created_at).toLocaleDateString(undefined, {
                                                month: "short", day: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete measurement?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently remove the <strong>{deleteRow?.name}</strong> measurement. This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteRow(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}
                                               className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
}