"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClientBrowser } from "@/lib/supabase/browser";
import {
    Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Layers, ShoppingBag } from "lucide-react";

const ItemSchema = z.object({
    description: z.string().min(2, "Description is required"),
    quantity: z.number().int().positive("Qty must be > 0"),
    unit_price: z.number().nonnegative("Unit price ≥ 0"),
});

const Schema = z.object({
    currency_code: z.string().length(3, "3-letter currency"),
    notes: z.string().max(2000).optional().or(z.literal("")),
    items: z.array(ItemSchema).min(1, "Add at least one item"),
});

type FormValues = z.infer<typeof Schema>;

function getArrayError(err: unknown): string | undefined {
    if (err && typeof err === "object" && "root" in (err as Record<string, unknown>)) {
        const root = (err as { root?: { message?: string } }).root;
        return root?.message;
    }
    return undefined;
}

export default function CreateOrderDialog({
    clientId,
    clientName,
    onCreated,
}: {
    clientId: string;
    clientName?: string;
    onCreated?: () => void;
}) {
    const sb = createClientBrowser();
    const [open, setOpen] = useState(false);
    const [defaultCurrency, setDefaultCurrency] = useState("GHS");

    useEffect(() => {
        (async () => {
            const { data, error } = await sb
                .schema("knitted")
                .from("account_settings")
                .select("currency_code")
                .maybeSingle();

            if (!error && data?.currency_code) {
                setDefaultCurrency(String(data.currency_code).toUpperCase());
            }
        })();
    }, []);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            currency_code: defaultCurrency,
            notes: "",
            items: [{ description: "", quantity: 1, unit_price: 0 }],
        },
        mode: "onBlur",
    });

    useEffect(() => {
        setValue("currency_code", defaultCurrency);
    }, [defaultCurrency, setValue]);

    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const items = watch("items");
    const currency = (watch("currency_code") || defaultCurrency).toUpperCase();

    const subtotal = useMemo(
        () =>
            (items ?? []).reduce(
                (sum, it) =>
                    sum + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0),
                0
            ),
        [items]
    );

    async function onSubmit(values: FormValues) {
        try {
            const { data: orderRow, error: orderErr } = await sb
                .schema("knitted")
                .from("orders")
                .insert({
                    customer_id: clientId,
                    currency_code: values.currency_code.toUpperCase(),
                    notes:
                        values.notes && values.notes.trim() !== ""
                            ? values.notes.trim()
                            : null,
                })
                .select("id")
                .single<{ id: string }>();

            if (orderErr || !orderRow) throw orderErr ?? new Error("Order insert failed");

            const payload = values.items.map((it) => ({
                order_id: orderRow.id,
                description: it.description.trim(),
                quantity: it.quantity,
                unit_price: it.unit_price,
                currency_code: values.currency_code.toUpperCase(),
            }));

            const { error: itemsErr } = await sb
                .schema("knitted")
                .from("order_items")
                .insert(payload);

            if (itemsErr) throw itemsErr;

            toast.success("Order created", {
                description: clientName ? `for ${clientName}` : undefined,
            });

            setOpen(false);
            reset({
                currency_code: defaultCurrency,
                notes: "",
                items: [{ description: "", quantity: 1, unit_price: 0 }],
            });
            onCreated?.();
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            toast.error("Failed to create order", { description: message });
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} className="btn-primary gap-3 shadow-none">
                <ShoppingBag className="w-4 h-4" />
                Create Project
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl rounded-[2rem] border border-border p-0 overflow-hidden shadow-2xl bg-background transition-all">
                    <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-border bg-muted/20">
                        <div className="space-y-1">
                            <DialogTitle className="text-4xl font-serif text-foreground">
                                New Project {clientName ? <span className="text-muted-foreground/50">for</span> : ""} {clientName}
                            </DialogTitle>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Crafting a new masterwork</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4 text-foreground" />
                        </button>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Currency & Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-4 space-y-3">
                                <Label htmlFor="currency_code" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Currency</Label>
                                <select
                                    id="currency_code"
                                    className="w-full border border-border rounded-full px-6 h-12 bg-background text-sm focus:ring-1 focus:ring-accent outline-none appearance-none"
                                    defaultValue={defaultCurrency}
                                    {...register("currency_code", {
                                        setValueAs: (v) => String(v || "").toUpperCase(),
                                    })}
                                >
                                    <option value="GHS">GHS</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NGN">NGN</option>
                                    <option value="GBP">GBP</option>
                                </select>
                                {errors.currency_code && (
                                    <p className="text-[10px] text-destructive uppercase tracking-wide ml-1">
                                        {errors.currency_code.message}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-8 space-y-3">
                                <Label htmlFor="notes" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Studio Notes</Label>
                                <Textarea
                                    id="notes"
                                    rows={2}
                                    className="rounded-[1.5rem] border-border bg-background focus-visible:ring-accent resize-none p-5 text-sm"
                                    placeholder="Any special instructions for this project..."
                                    {...register("notes")}
                                />
                                {errors.notes && (
                                    <p className="text-[10px] text-destructive uppercase tracking-wide ml-1">
                                        {errors.notes.message as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>Manifest</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-4 h-8 text-[10px] uppercase tracking-widest border-border"
                                    onClick={() =>
                                        append({ description: "", quantity: 1, unit_price: 0 })
                                    }
                                >
                                    <Plus className="w-3 h-3 mr-2" />
                                    Add item
                                </Button>
                            </div>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {fields.map((field, idx) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 rounded-[2rem] bg-secondary/20 border border-border/50 transition-all hover:bg-secondary/30">
                                        <div className="md:col-span-6 space-y-2">
                                            <Label htmlFor={`desc-${idx}`} className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-40 ml-1">Description</Label>
                                            <Input
                                                id={`desc-${idx}`}
                                                className="bg-background border-border rounded-full h-12 px-6"
                                                placeholder="e.g., Silk Bowtie"
                                                {...register(`items.${idx}.description` as const)}
                                            />
                                            {errors.items?.[idx]?.description && (
                                                <p className="text-[10px] text-destructive uppercase tracking-wide ml-1">
                                                    {errors.items[idx]?.description?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-3 space-y-2">
                                            <Label htmlFor={`price-${idx}`} className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-40 ml-1">Price</Label>
                                            <Input
                                                id={`price-${idx}`}
                                                type="number"
                                                step="0.01"
                                                className="bg-background border-border rounded-full h-12 px-6 tabular-nums"
                                                {...register(`items.${idx}.unit_price` as const, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                            {errors.items?.[idx]?.unit_price && (
                                                <p className="text-[10px] text-destructive uppercase tracking-wide ml-1">
                                                    {errors.items[idx]?.unit_price?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor={`qty-${idx}`} className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-40 ml-1">Qty</Label>
                                            <Input
                                                id={`qty-${idx}`}
                                                type="number"
                                                className="bg-background border-border rounded-full h-12 px-4 text-center tabular-nums"
                                                {...register(`items.${idx}.quantity` as const, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                            {errors.items?.[idx]?.quantity && (
                                                <p className="text-[10px] text-destructive uppercase tracking-wide ml-1">
                                                    {errors.items[idx]?.quantity?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-1 flex items-end justify-center">
                                            <button
                                                type="button"
                                                onClick={() => remove(idx)}
                                                className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {getArrayError(errors.items) && (
                                    <p className="text-xs text-destructive text-center italic">{getArrayError(errors.items)}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-border">
                                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Aggregate Quote</div>
                                <div className="text-4xl font-serif text-foreground">
                                    <span className="text-lg mr-2 opacity-30">{currency}</span>
                                    {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-10 py-8 bg-muted/20 border-t border-border flex items-center justify-end gap-4">
                        <Button type="button" variant="ghost" className="rounded-full px-8 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary px-10">
                            {isSubmitting ? "Drafting..." : "Finalize Order"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}