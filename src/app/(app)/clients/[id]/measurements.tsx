"use client";

import {useEffect, useState} from "react";
import {createClientBrowser} from "@/lib/supabase/browser";
import {Button} from "@/components/ui/button";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {toast} from "sonner";
import MeasurementDialog from "./measurement-dialog";
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
import {FiEdit3} from "react-icons/fi";
import {TbHttpDelete} from "react-icons/tb";

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
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Measurements</h2>
                <Button
                    size="sm"
                    onClick={() => {
                        setEditRow(null); // create mode
                        setOpenEdit(true);
                    }}
                >
                    Add measurement
                </Button>
            </div>

            <div className="rounded-md border overflow-x-auto p-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-40">Value</TableHead>
                            <TableHead className="w-28">Unit</TableHead>
                            <TableHead className="w-48">Added</TableHead>
                            <TableHead className="w-44"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                    No measurements yet
                                </TableCell>
                            </TableRow>
                        )}

                        {items.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell className="font-medium">{m.name}</TableCell>
                                <TableCell>{Number(m.value).toFixed(2)}</TableCell>
                                <TableCell>{m.unit ?? "—"}</TableCell>
                                <TableCell>
                                    {new Date(m.created_at).toLocaleString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                        onClick={() => {
                                            setEditRow(m);
                                            setOpenEdit(true);
                                        }}
                                    >
                                        <FiEdit3/>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setDeleteRow(m);
                                            setOpenDelete(true);
                                        }}
                                    >
                                        <TbHttpDelete />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                            This will permanently remove <strong>{deleteRow?.name}</strong>. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteRow(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}