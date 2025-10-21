// src/app/(app)/orders/[id]/payments.tsx
"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {createClientBrowser} from "@/lib/supabase/browser";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";

type PaymentMethod = "cash" | "momo" | "card";

type Payment = {
    id: string;
    amount: number;
    currency_code: string;
    method: PaymentMethod;
    reference: string | null;
    // make note optional if your table doesn't have it (or include it in SELECT)
    note?: string | null;
    created_at: string;
};


export default function PaymentsSection({orderId, currency}: { orderId: string; currency: string }) {
    const sb = createClientBrowser();
    const router = useRouter();
    const [rows, setRows] = useState<Payment[]>([]);
    const [open, setOpen] = useState(false);

    // form state
    const [amount, setAmount] = useState<number>(0);
    const [method, setMethod] = useState<"cash" | "momo" | "card">("cash");
    const [note, setNote] = useState<string>("");

    async function load() {
        const {data, error} = await sb
            .schema("knitted")
            .from("payments")
            .select("id, amount, reference,currency_code, method, created_at")
            .eq("order_id", orderId)
            .order("created_at", {ascending: false});
        if (error) {
            toast.error("Failed to load payments", {description: error.message});
            setRows([]);
            return;
        }
        setRows((data ?? []) as Payment[]);
    }



    useEffect(() => {
        load(); /* eslint-disable-next-line */
    }, [orderId]);

    async function addPayment() {
        // validate whole number
        if (!Number.isInteger(amount) || amount <= 0) {
            toast.error("Enter a valid whole number amount (> 0)");
            return;
        }
        const {error} = await sb
            .schema("knitted")
            .from("payments")
            .insert({
                order_id: orderId,
                amount,                         // integer
                currency_code: currency,
                method,                         // "cash" | "momo" | "card"
                reference: note?.trim() || null,
            });

        if (error) {
            toast.error("Failed to add payment", {description: error.message});
            return;
        }
        toast.success("Payment added");

        // reset & refresh
        setOpen(false);
        setAmount(0);
        setMethod("cash");
        setNote("");
        await load();
        router.refresh(); // refresh server-rendered totals
    }

    return (
        <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle className="text-base">Payments</CardTitle>
                <Button size="sm" onClick={() => setOpen(true)}>Add payment</Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>When</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="text-sm">{new Date(p.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-sm">{p.method ?? "—"}</TableCell>
                                    <TableCell className="text-sm">{p.reference ?? "—"}</TableCell>
                                    <TableCell
                                        className="text-right">{p.currency_code} {(Number(p.amount) || 0).toFixed(0)}</TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No
                                        payments yet</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Add payment dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add payment</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        {/* Amount (whole number stepper) */}
                        <div className="space-y-1">
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                inputMode="numeric"
                                pattern="\d*"
                                step={1}
                                min={1}
                                value={Number.isFinite(amount) ? amount : 0}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">Whole numbers only</p>
                        </div>

                        {/* Method select */}
                        <div className="space-y-1">
                            <Label>Method</Label>
                            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                                <SelectTrigger><SelectValue placeholder="Select method"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="momo">MoMo</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Note */}
                        <div className="space-y-1">
                            <Label>Note</Label>
                            <Input
                                placeholder="optional"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={addPayment} disabled={!Number.isInteger(amount) || amount <= 0}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}