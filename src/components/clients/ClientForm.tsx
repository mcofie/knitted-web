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
import { Loader2, ChevronDown } from "lucide-react";
import { countries } from "@/lib/countries";
import { cn } from "@/lib/utils";

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

    useEffect(() => {
        if (!initialValues?.country_code) {
            setValue("country_code", fallbackCountry.toUpperCase());
        }
    }, [fallbackCountry, initialValues?.country_code, setValue]);

    const inputClasses = "h-12 bg-background border border-border rounded-full px-6 font-medium focus-visible:ring-1 focus-visible:ring-accent transition-all placeholder:text-muted-foreground/30";
    const labelClasses = "text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60";
    const textareaClasses = "bg-background border border-border rounded-[1.5rem] p-6 font-medium focus-visible:ring-1 focus-visible:ring-accent transition-all placeholder:text-muted-foreground/30 resize-none";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Full name */}
            <div className="space-y-2">
                <Label htmlFor="full_name" className={labelClasses}>Full Name</Label>
                <Input id="full_name" className={inputClasses} placeholder="e.g. Alexander McQueen" {...register("full_name")} />
                {errors.full_name && <p className="text-[10px] text-destructive ml-2 uppercase tracking-wide">{errors.full_name.message}</p>}
            </div>

            {/* Country / Phone / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label htmlFor="phone" className={labelClasses}>Phone</Label>
                    <Input id="phone" className={inputClasses} placeholder="+44..." {...register("phone")} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className={labelClasses}>Email</Label>
                    <Input id="email" type="email" className={inputClasses} placeholder="hello@studio.com" {...register("email")} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 relative">
                    <Label htmlFor="country_code" className={labelClasses}>Country</Label>
                    <div className="relative group">
                        <select
                            id="country_code"
                            className={cn(inputClasses, "w-full appearance-none cursor-pointer")}
                            {...register("country_code", {
                                setValueAs: (v) => String(v || "").toUpperCase(),
                            })}
                            defaultValue={(initialValues?.country_code ?? fallbackCountry).toUpperCase()}
                            onChange={(e) => setValue("country_code", e.target.value.toUpperCase())}
                        >
                            {countries.map(c => (
                                <option key={c.code} value={c.code.toUpperCase()}>{c.flag} {c.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-40" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city" className={labelClasses}>City</Label>
                    <Input id="city" className={inputClasses} placeholder="London" {...register("city")} />
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <Label htmlFor="notes" className={labelClasses}>Studio Notes</Label>
                <Textarea id="notes" className={textareaClasses} rows={4} placeholder="Describe their style preferences..." {...register("notes")} />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="h-12 px-8 rounded-full text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary min-w-[180px]"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isSubmitting ? "Drafting..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}

