"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClientBrowser } from "@/lib/supabase/browser";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const ItemSchema = z.object({
    description: z.string().min(2, "Description is required"),
    quantity: z.coerce.number().int().positive("Qty must be > 0"),
    unit_price: z.coerce.number().nonnegative("Unit price ≥ 0"),
});

const Schema = z.object({
    currency_code: z.string().length(3, "3-letter currency"),
    notes: z.string().max(2000).optional().or(z.literal("")),
    items: z.array(ItemSchema).min(1, "Add at least one item"),
});

type FormValues = z.infer<typeof Schema>;


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

    // Load default currency from account_settings (matches mobile behavior)
    useEffect(() => {
        (async () => {
            const { data } = await sb
                .schema("knitted")
                .from("account_settings")
                .select("currency")
                .maybeSingle();
            if (data?.currency) setDefaultCurrency(String(data.currency).toUpperCase());
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // keep form currency synced with loaded default
    useEffect(() => {
        setValue("currency_code", defaultCurrency);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultCurrency]);

    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const items = watch("items");
    const currency = watch("currency_code") || defaultCurrency;

    const subtotal = useMemo(
        () =>
            (items ?? []).reduce(
                (sum, it) => sum + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0),
                0
            ),
        [items]
    );

    async function onSubmit(values: FormValues) {
        try {
            // 1) create order (mobile: currency + notes)
            const { data: order, error: orderErr } = await sb
                .schema("knitted")
                .from("orders")
                .insert({
                    customer_id: clientId,
                    currency_code: values.currency_code.toUpperCase(),
                    notes: values.notes && values.notes.trim() !== "" ? values.notes.trim() : null,
                    // title optional; backend can compute totals; we still insert items below
                })
                .select("id")
                .single();

            if (orderErr) throw orderErr;

            // 2) insert items (mobile: description, qty, unit_price, currency)
            const payload = values.items.map((it) => ({
                order_id: order!.id,
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
            // optional: you can router.refresh() from parent via a callback prop if needed
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "Something went wrong";
            toast.error("Failed to create order", { description: message });
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Create Order</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create order {clientName ? `for ${clientName}` : ""}</DialogTitle>
                    </DialogHeader>

                    {/* Currency & Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="currency_code">Currency</Label>
                            <select
                                id="currency_code"
                                className="w-full border rounded px-3 py-2 bg-background"
                                defaultValue={defaultCurrency}
                                {...register("currency_code", {
                                    setValueAs: (v) => String(v || "").toUpperCase(),
                                })}
                                onChange={(e) => setValue("currency_code", e.target.value.toUpperCase())}
                            >
                                <option value="GHS">GHS</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="NGN">NGN</option>
                                <option value="GBP">GBP</option>
                            </select>
                            {errors.currency_code && (
                                <p className="text-sm text-red-500">{errors.currency_code.message}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" rows={3} placeholder="Optional notes"
                                      {...register("notes")}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-500">{errors.notes.message as string}</p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Items list (mobile parity: description, unit_price, quantity) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="font-medium">Items</div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
                            >
                                Add item
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, idx) => (
                                <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                    <div className="sm:col-span-6 space-y-1">
                                        <Label htmlFor={`desc-${idx}`}>Description</Label>
                                        <Input
                                            id={`desc-${idx}`}
                                            placeholder="e.g., 2-piece suit"
                                            {...register(`items.${idx}.description` as const)}
                                        />
                                        {errors.items?.[idx]?.description && (
                                            <p className="text-sm text-red-500">
                                                {errors.items[idx]?.description?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-3 space-y-1">
                                        <Label htmlFor={`price-${idx}`}>Unit price</Label>
                                        <Input
                                            id={`price-${idx}`}
                                            type="number"
                                            step="0.01"
                                            {...register(`items.${idx}.unit_price` as const, { valueAsNumber: true })}
                                        />
                                        {errors.items?.[idx]?.unit_price && (
                                            <p className="text-sm text-red-500">
                                                {errors.items[idx]?.unit_price?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2 space-y-1">
                                        <Label htmlFor={`qty-${idx}`}>Qty</Label>
                                        <Input
                                            id={`qty-${idx}`}
                                            type="number"
                                            {...register(`items.${idx}.quantity` as const, { valueAsNumber: true })}
                                        />
                                        {errors.items?.[idx]?.quantity && (
                                            <p className="text-sm text-red-500">
                                                {errors.items[idx]?.quantity?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-1 flex items-end">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(idx)}
                                            className="w-full"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {errors.items?.root && (
                                <p className="text-sm text-red-500">{errors.items.root.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-6 pt-2 text-sm">
                            <div className="text-muted-foreground">Subtotal</div>
                            <div className="font-medium">
                                {currency} {subtotal.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting ? "Creating…" : "Create order"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}