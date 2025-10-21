"use client";

import {useEffect, useState} from "react";
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
import {Textarea} from "@/components/ui/textarea";

const Schema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    country_code: z.string().length(2, "2-letter ISO country code"),
    phone: z.string().max(30).optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    city: z.string().max(120).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof Schema>;

export default function AddClientDialog({
                                            onCreated,
                                            defaultCountry,
                                        }: {
    onCreated?: () => void;
    defaultCountry?: string; // e.g. "GH"
}) {
    const sb = createClientBrowser();
    const [open, setOpen] = useState(false);
    const [fallbackCountry, setFallbackCountry] = useState(defaultCountry ?? "GH");

    // Try load default country from account_settings if not provided
    useEffect(() => {
        if (defaultCountry) return;
        (async () => {
            const {data} = await sb
                .schema("knitted")
                .from("account_settings")
                .select("country_code")
                .maybeSingle();
            if (data?.country_code) setFallbackCountry(String(data.country_code).toUpperCase());
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            full_name: "",
            country_code: (defaultCountry ?? fallbackCountry ?? "GH").toUpperCase(),
            phone: "",
            email: "",
            city: "",
            address: "",
            notes: "",
        },
        mode: "onBlur",
    });

    // Keep form in sync when fallbackCountry loads
    useEffect(() => {
        setValue("country_code", (defaultCountry ?? fallbackCountry ?? "GH").toUpperCase());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fallbackCountry, defaultCountry]);

    async function onSubmit(values: FormValues) {
        try {
            const payload = {
                name: values.full_name.trim(),
                full_name: values.full_name.trim(),
                country_code: values.country_code.toUpperCase(),
                phone: values.phone?.trim() || null,
                email: values.email?.trim() || null,
                city: values.city?.trim() || null,
                address: values.address?.trim() || null,
                notes: values.notes?.trim() || null,
            };

            const {error} = await sb
                .schema("knitted")
                .from("customers")
                .insert(payload);

            if (error) throw error;

            toast.success("Client created");
            setOpen(false);
            reset({
                full_name: "",
                country_code: (defaultCountry ?? fallbackCountry ?? "GH").toUpperCase(),
                phone: "",
                email: "",
                city: "",
                address: "",
                notes: "",
            });
            onCreated?.();
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "Something went wrong";
            toast.error("Failed to create client", {description: message});
        }
    }

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>Add client</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add client</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Full name */}
                        <div className="space-y-1">
                            <Label htmlFor="full_name">Full name</Label>
                            <Input id="full_name" {...register("full_name")} />
                            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
                        </div>

                        {/* Country / Phone / Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="country_code">Country</Label>
                                <select
                                    id="country_code"
                                    className="w-full border rounded px-3 py-2 bg-background"
                                    {...register("country_code", {
                                        setValueAs: (v) => String(v || "").toUpperCase(),
                                    })}
                                    defaultValue={(defaultCountry ?? fallbackCountry ?? "GH").toUpperCase()}
                                    onChange={(e) => setValue("country_code", e.target.value.toUpperCase())}
                                >
                                    {/* Keep list concise; expand if you like or swap for a full country picker */}
                                    <option value="GH">Ghana</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="KE">Kenya</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                </select>
                                {errors.country_code && (
                                    <p className="text-sm text-red-500">{errors.country_code.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" placeholder="+233..." {...register("phone")} />
                                {errors.phone &&
                                    <p className="text-sm text-red-500">{errors.phone.message as string}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
                                {errors.email &&
                                    <p className="text-sm text-red-500">{errors.email.message as string}</p>}
                            </div>
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...register("city")} />
                            {errors.city && <p className="text-sm text-red-500">{errors.city.message as string}</p>}
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" rows={2} {...register("address")} />
                            {errors.address &&
                                <p className="text-sm text-red-500">{errors.address.message as string}</p>}
                        </div>

                        {/* Notes */}
                        <div className="space-y-1">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" rows={3} placeholder="Optional notes" {...register("notes")} />
                            {errors.notes && <p className="text-sm text-red-500">{errors.notes.message as string}</p>}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving…" : "Save client"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}