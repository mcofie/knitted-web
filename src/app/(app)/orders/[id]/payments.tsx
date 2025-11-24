"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import ClientTime from "@/components/ClientTime";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Icons
import {
    Plus,
    Banknote,
    CreditCard,
    Smartphone,
    FileText,
    Loader2,
    Wallet
} from "lucide-react";

type PaymentMethod = "cash" | "momo" | "card" | "bank";

type Payment = {
    id: string;
    amount: number;
    currency_code: string;
    method: PaymentMethod;
    reference: string | null;
    created_at: string;
};

export default function PaymentsSection({
                                            orderId,
                                            currency,
                                        }: {
    orderId: string;
    currency: string;
}) {
    const sb = createClientBrowser();
    const router = useRouter();
    const [rows, setRows] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [amount, setAmount] = useState<string>(""); // Using string for input handling
    const [method, setMethod] = useState<PaymentMethod>("cash");
    const [note, setNote] = useState<string>("");

    async function load() {
        setLoading(true);
        const { data, error } = await sb
            .schema("knitted")
            .from("payments")
            .select("id, amount, reference, currency_code, method, created_at")
            .eq("order_id", orderId)
            .order("created_at", { ascending: false });

        setLoading(false);

        if (error) {
            toast.error("Failed to load payments", { description: error.message });
            setRows([]);
            return;
        }
        setRows((data ?? []) as Payment[]);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    async function addPayment() {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error("Please enter a valid amount greater than 0");
            return;
        }

        setSubmitting(true);
        const { error } = await sb.schema("knitted").from("payments").insert({
            order_id: orderId,
            amount: val,
            currency_code: currency,
            method,
            reference: note?.trim() || null,
        });

        setSubmitting(false);

        if (error) {
            toast.error("Failed to add payment", { description: error.message });
            return;
        }

        toast.success("Payment recorded successfully");
        setOpen(false);
        setAmount("");
        setMethod("cash");
        setNote("");
        await load();
        router.refresh();
    }

    const getMethodIcon = (m: string) => {
        switch (m) {
            case "cash": return <Banknote className="h-4 w-4" />;
            case "card": return <CreditCard className="h-4 w-4" />;
            case "momo": return <Smartphone className="h-4 w-4" />;
            default: return <Wallet className="h-4 w-4" />;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                    {/* <h3 className="text-sm font-semibold">Payment History</h3> */}
                    {/* <p className="text-xs text-muted-foreground">Track all transactions for this order</p> */}
                </div>
                <Button size="sm" onClick={() => setOpen(true)} className="gap-2">
                    <Plus className="h-3.5 w-3.5" /> Add Payment
                </Button>
            </div>

            {/* List */}
            <div className="flex-1">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-16 rounded-lg bg-muted/40 animate-pulse" />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-xl border-muted bg-muted/5">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">No payments yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Record the first payment to update the balance.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rows.map((p) => (
                            <div
                                key={p.id}
                                className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-foreground">
                                        {getMethodIcon(p.method)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium capitalize">
                                            {p.method.replace("_", " ")}
                                        </p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <ClientTime iso={p.created_at} />
                                            {p.reference && (
                                                <>
                                                    <span>•</span>
                                                    <span className="italic max-w-[120px] truncate" title={p.reference}>
                            {p.reference}
                          </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                  <span className="text-sm font-bold tabular-nums">
                    {p.currency_code} {p.amount.toFixed(2)}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Payment Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            Enter the payment details below. This will update the order balance immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">
                                    {currency}
                                </div>
                                <Input
                                    id="amount"
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    className="pl-12 text-lg font-semibold"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Method */}
                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="momo">Mobile Money</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="bank">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reference / Note */}
                            <div className="space-y-2">
                                <Label htmlFor="note">Reference (Optional)</Label>
                                <Input
                                    id="note"
                                    placeholder="e.g. Receipt #123"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button onClick={addPayment} disabled={!amount || parseFloat(amount) <= 0 || submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}