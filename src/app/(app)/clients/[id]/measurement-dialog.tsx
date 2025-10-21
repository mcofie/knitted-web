"use client";

import {useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {createClientBrowser} from "@/lib/supabase/browser";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import clsx from "clsx";

const Schema = z.object({
    name: z.string().min(2, "Name is required"),
    value: z.coerce.number().refine(Number.isFinite, {message: "Value must be a number"}).gt(0, {message: "Value must be > 0"}),
    unit: z.string().min(2).max(10).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof Schema>;

type EditRow = {
    id: string;
    name: string;
    value: number;
    unit: string | null;
};

const SUGGESTIONS = [
    "Chest", "Waist", "Hip", "Shoulder", "Sleeve",
    "Neck", "Bicep", "Wrist", "Upper Arm",
    "Inseam", "Outseam", "Thigh", "Knee", "Ankle",
    "Back", "Bust", "Underbust", "Rise",
];

export default function MeasurementDialog({
                                              open, onOpenChange, customerId, editRow, onSaved,
                                          }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    customerId: string;
    editRow: EditRow | null;
    onSaved: () => Promise<void> | void;
}) {
    const sb = createClientBrowser();

    const {
        register, handleSubmit, reset, setValue, setFocus,
        formState: {errors, isSubmitting},
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {name: "", value: 0, unit: "in"},
        mode: "onBlur",
    });

    // 🔹 Visual selection state (bound to form values)
    const selectedName = watch("name");
    const selectedUnit = (watch("unit") || "in") as "in" | "cm";

    useEffect(() => {
        if (editRow) {
            reset({
                name: editRow.name ?? "",
                value: Number(editRow.value ?? 0),
                unit: (editRow.unit ?? "in") as "in" | "cm",
            });
        } else {
            reset({name: "", value: 0, unit: "in"});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editRow, open]);

    async function onSubmit(values: FormValues) {
        try {
            if (editRow) {
                const {error} = await sb.schema("knitted").from("measurements")
                    .update({name: values.name, value: values.value, unit: values.unit || null})
                    .eq("id", editRow.id);
                if (error) throw error;
                toast.success("Measurement updated");
            } else {
                const {error} = await sb.schema("knitted").from("measurements").insert({
                    customer_id: customerId, name: values.name, value: values.value, unit: values.unit || null,
                });
                if (error) throw error;
                toast.success("Measurement added");
            }
            onOpenChange(false);
            await onSaved();
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "Something went wrong";
            toast.error("Save failed", {description: message});
        }
    }

    // Quick helpers
    function pickName(n: string) {
        setValue("name", n, {shouldValidate: true, shouldDirty: true});
        setFocus("value");
    }

    function pickUnit(u: "in" | "cm") {
        setValue("unit", u, {shouldValidate: true, shouldDirty: true});
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editRow ? "Edit measurement" : "Add measurement"}</DialogTitle>
                </DialogHeader>

                {/* Quick picks */}
                <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Quick picks</div>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((label) => {
                            const active = selectedName?.toLowerCase() === label.toLowerCase();
                            return (
                                <Button
                                    key={label}
                                    type="button"
                                    variant={active ? "default" : "secondary"}
                                    size="sm"
                                    className={clsx(
                                        "rounded-full",
                                        active && "ring-2 ring-ring"
                                    )}
                                    onClick={() => pickName(label)}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <div className="text-xs text-muted-foreground">Unit</div>
                        <div className="flex gap-2">
                            {(["in", "cm"] as const).map((u) => {
                                const active = selectedUnit === u;
                                return (
                                    <Button
                                        key={u}
                                        type="button"
                                        size="sm"
                                        variant={active ? "default" : "outline"}
                                        className={clsx(active && "ring-2 ring-ring")}
                                        onClick={() => pickUnit(u)}
                                    >
                                        {u}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="e.g., Chest, Waist, Hip" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="value">Value</Label>
                            <Input id="value" type="number" step="0.01" {...register("value", {valueAsNumber: true})} />
                            {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="unit">Unit</Label>
                            <select
                                id="unit"
                                className="w-full border rounded px-3 py-2 bg-background"
                                defaultValue="in"
                                {...register("unit")}
                                onChange={(e) => pickUnit(e.target.value as "in" | "cm")}
                            >
                                <option value="in">in</option>
                                <option value="cm">cm</option>
                            </select>
                            {errors.unit &&
                                <p className="text-sm text-red-500">{(errors.unit.message as string) ?? ""}</p>}
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