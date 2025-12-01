"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClientBrowser } from "@/lib/supabase/browser";
import { ClientFormValues } from "@/app/(app)/clients/actions";

// We can reuse the schema from actions or define a UI specific one if needed.
// For now, let's redefine it here to match the UI validation needs (zod in actions is for server validation)
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

interface ClientFormProps {
    initialValues?: Partial<FormValues>;
    onSubmit: (values: FormValues) => Promise<void>;
    isSubmitting?: boolean;
    submitLabel?: string;
    onCancel?: () => void;
}

export default function ClientForm({
    initialValues,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Save client",
    onCancel,
}: ClientFormProps) {
    const sb = createClientBrowser();
    const [fallbackCountry, setFallbackCountry] = useState(initialValues?.country_code ?? "GH");

    // Try load default country from account_settings if not provided in initialValues
    useEffect(() => {
        if (initialValues?.country_code) return;
        (async () => {
            const { data } = await sb
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
        formState: { errors },
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            full_name: initialValues?.full_name ?? "",
            country_code: (initialValues?.country_code ?? fallbackCountry).toUpperCase(),
            phone: initialValues?.phone ?? "",
            email: initialValues?.email ?? "",
            city: initialValues?.city ?? "",
            address: initialValues?.address ?? "",
            notes: initialValues?.notes ?? "",
        },
        mode: "onBlur",
    });

    // Keep form in sync when fallbackCountry loads
    useEffect(() => {
        if (!initialValues?.country_code) {
            setValue("country_code", fallbackCountry.toUpperCase());
        }
    }, [fallbackCountry, initialValues?.country_code, setValue]);

    return (
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
                        defaultValue={(initialValues?.country_code ?? fallbackCountry).toUpperCase()}
                        onChange={(e) => setValue("country_code", e.target.value.toUpperCase())}
                    >
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
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
            </div>

            {/* City */}
            <div className="space-y-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>

            {/* Address */}
            <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" rows={2} {...register("address")} />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={3} placeholder="Optional notes" {...register("notes")} />
                {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
