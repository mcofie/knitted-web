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


// Icons
import {
    Plus,
    Banknote,
    CreditCard,
    Smartphone,
    Loader2,
    Wallet,
    X,
    Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [amount, setAmount] = useState<string>("");
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
            toast.error("Process delayed", { description: error.message });
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
            toast.error("Valid amount required.");
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
            toast.error("Sync failed", { description: error.message });
            return;
        }

        toast.success("Transaction verified. ✨");
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
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <Button onClick={() => setOpen(true)} variant="outline" className="rounded-full h-10 px-6 gap-2 border-border font-medium text-[10px] uppercase tracking-widest text-foreground hover:bg-muted">
                    <Plus className="h-3 w-3" /> Add Transaction
                </Button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    [...Array(2)].map((_, i) => (
                        <div key={i} className="h-24 rounded-[2rem] bg-secondary animate-pulse" />
                    ))
                ) : rows.length === 0 ? (
                    <div className="bento-card bg-secondary/30 p-16 text-center flex flex-col items-center gap-6">
                        <div className="h-20 w-20 bg-background border border-border rounded-[1.5rem] flex items-center justify-center mb-2">
                            <Receipt className="h-10 w-10 text-foreground opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-serif text-foreground">Financial Void</h4>
                            <p className="text-sm font-sans text-muted-foreground italic">No transactions recorded for this blueprint.</p>
                        </div>
                    </div>
                ) : (
                    rows.map((p) => (
                        <div
                            key={p.id}
                            className="bento-card border-border/40 bg-card p-6 flex items-center justify-between group hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-secondary border border-border/30 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                    {getMethodIcon(p.method)}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-serif text-xl leading-none text-foreground capitalize">
                                        {p.method.replace("_", " ")}
                                    </p>
                                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2 opacity-60">
                                        <ClientTime iso={p.created_at} />
                                        {p.reference && (
                                            <>
                                                <span className="opacity-30">•</span>
                                                <span className="italic truncate max-w-[120px]">{p.reference}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-serif tabular-nums text-foreground">
                                    {p.currency_code} {p.amount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Payment Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border border-border p-0 overflow-hidden shadow-3xl bg-background transition-all">
                    <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-border bg-muted/20">
                        <div>
                            <DialogTitle className="text-4xl font-serif text-foreground">Record Payment</DialogTitle>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Financial Synchronization</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                            <X className="w-4 h-4 text-foreground" />
                        </button>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Amount */}
                        <div className="space-y-4 text-center py-10 bg-secondary/20 rounded-[2rem] border border-border/50">
                            <Label htmlFor="amount" className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60">Sum to Verify</Label>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-2xl font-serif text-foreground opacity-30">{currency}</span>
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="bg-transparent text-6xl font-serif w-60 text-center outline-none tabular-nums placeholder:text-foreground/5"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 ml-2">Channel</Label>
                                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                                    <SelectTrigger className="h-12 rounded-full bg-background border border-border px-6 font-medium text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-border shadow-2xl bg-background">
                                        <SelectItem value="cash" className="rounded-xl font-medium py-3">Physical Cash</SelectItem>
                                        <SelectItem value="momo" className="rounded-xl font-medium py-3">Mobile Money</SelectItem>
                                        <SelectItem value="card" className="rounded-xl font-medium py-3">Debit Card</SelectItem>
                                        <SelectItem value="bank" className="rounded-xl font-medium py-3">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="note" className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 ml-2">Reference</Label>
                                <Input
                                    id="note"
                                    placeholder="e.g. INV-102"
                                    className="h-12 rounded-full bg-background border border-border px-6 font-medium text-xs"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 pt-0 bg-muted/20 border-t border-border flex gap-4">
                        <Button onClick={addPayment} disabled={!amount || parseFloat(amount) <= 0 || submitting} className="w-full btn-primary h-14">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Receipt className="w-5 h-5 mr-2" />}
                            Verify & Synchronize Funds
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}