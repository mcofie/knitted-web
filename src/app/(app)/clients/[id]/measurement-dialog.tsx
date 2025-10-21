"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Schema = z.object({
    name: z.string().min(2, "Name is required"),
    value: z.coerce
        .number()
        .refine((n) => Number.isFinite(n), { message: "Value must be a number" })
        .gt(0, { message: "Value must be > 0" }),
    unit: z.string().min(2).max(10).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof Schema>;

type EditRow = {
    id: string;
    name: string;
    value: number;
    unit: string | null;
};

export default function MeasurementDialog({
                                              open,
                                              onOpenChange,
                                              customerId,
                                              editRow,
                                              onSaved,
                                          }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    customerId: string;
    editRow: EditRow | null;
    onSaved: () => Promise<void> | void;
}) {
    const sb = createClientBrowser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: { name: "", value: 0, unit: "inch" },
        mode: "onBlur",
    });

    useEffect(() => {
        if (editRow) {
            reset({
                name: editRow.name ?? "",
                value: Number(editRow.value ?? 0),
                unit: editRow.unit ?? "inch",
            });
        } else {
            reset({ name: "", value: 0, unit: "inch" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editRow, open]);

    async function onSubmit(values: FormValues) {
        try {
            if (editRow) {
                const { error } = await sb
                    .schema("knitted")
                    .from("measurements")
                    .update({
                        name: values.name,
                        value: values.value,
                        unit: values.unit || null,
                    })
                    .eq("id", editRow.id);
                if (error) throw error;
                toast.success("Measurement updated");
            } else {
                const { error } = await sb
                    .schema("knitted")
                    .from("measurements")
                    .insert({
                        customer_id: customerId,
                        name: values.name,
                        value: values.value,
                        unit: values.unit || null,
                    });
                if (error) throw error;
                toast.success("Measurement added");
            }
            onOpenChange(false);
            await onSaved();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            toast.error("Save failed", { description: message });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editRow ? "Edit measurement" : "Add measurement"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="e.g., Chest, Waist, Hip" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="value">Value</Label>
                            <Input id="value" type="number" step="0.01" {...register("value", { valueAsNumber: true })} />
                            {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="unit">Unit</Label>
                            <select
                                id="unit"
                                className="w-full border rounded px-3 py-2 bg-background"
                                defaultValue="inch"
                                {...register("unit")}
                            >
                                <option value="inch">inch</option>
                                <option value="cm">cm</option>
                            </select>
                            {errors.unit && <p className="text-sm text-red-500">{errors.unit.message as string}</p>}
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}