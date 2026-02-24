"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Save, RotateCcw, ChevronDown } from "lucide-react";

import { countries } from "@/lib/countries";
import { currencies } from "@/lib/currencies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateSettings } from "@/app/(app)/settings/actions";
import { cn } from "@/lib/utils";

const Schema = z.object({
    business_name: z.string().min(2, "Enter a business name").trim(),
    city: z.string().trim().optional().nullable(),
    country_code: z
        .string()
        .length(2, "Pick a country")
        .transform((v) => v.toUpperCase()),
    measurement_system: z.enum(["metric", "imperial"]),
    currency_code: z
        .string()
        .length(3, "Pick a currency")
        .transform((v) => v.toUpperCase()),
    theme: z.enum(["system", "light", "dark"]),
});

type FormValues = z.infer<typeof Schema>;

type AccountSettingsRow = {
    business_name: string;
    city: string | null;
    country_code: string;
    measurement_system: "metric" | "imperial";
    currency_code: string;
    theme_pref: "system" | "light" | "dark";
    logo_path?: string | null;
};

export default function SettingsForm({
    initial,
    version,
}: {
    initial: Partial<AccountSettingsRow>;
    version: string;
}) {
    const { setTheme, theme: currentTheme } = useTheme();
    const [saving, setSaving] = useState(false);

    const defaultValues = useMemo<FormValues>(
        () => ({
            business_name: initial?.business_name ?? "",
            city: initial?.city ?? "",
            country_code: (initial?.country_code ?? "GH").toUpperCase(),
            measurement_system: initial?.measurement_system ?? "metric",
            currency_code: (initial?.currency_code ?? "GHS").toUpperCase(),
            theme: initial?.theme_pref ?? "system",
        }),
        [initial]
    );

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues,
        mode: "onBlur",
    });

    // Sync UI theme with saved preference on mount
    useEffect(() => {
        const t = initial?.theme_pref ?? "system";
        if (t !== currentTheme) setTheme(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial?.theme_pref]);

    const onSubmit = async (values: FormValues) => {
        try {
            setSaving(true);
            const result = await updateSettings(values);

            if (result.error) {
                throw new Error(result.error);
            }

            // Apply theme immediately & reset dirty state
            setTheme(values.theme);
            reset(values);
            toast.success("Identity records synchronized. ✨");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Something went wrong";
            toast.error("Sync failed", { description: message });
        } finally {
            setSaving(false);
        }
    };

    const inputClasses = "h-12 bg-black/[0.03] dark:bg-white/[0.03] border-none rounded-xl px-4 font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30";
    const labelClasses = "text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-2 block opacity-50";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <fieldset disabled={saving} className="space-y-8">

                {/* Business name */}
                <div className="space-y-2">
                    <Label htmlFor="business_name" className={labelClasses}>Atelier Brand</Label>
                    <Input
                        id="business_name"
                        placeholder="e.g., Knitted Studio"
                        className={inputClasses}
                        {...register("business_name")}
                    />
                    {errors.business_name && (
                        <p className="text-[10px] font-bold text-rose-500 ml-1">
                            {errors.business_name.message}
                        </p>
                    )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="city" className={labelClasses}>Base City</Label>
                        <Input
                            id="city"
                            placeholder="e.g., Accra"
                            className={inputClasses}
                            {...register("city")}
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <Label className={labelClasses}>Country</Label>
                        <Controller
                            control={control}
                            name="country_code"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={cn(inputClasses, "w-full flex justify-between")}>
                                        <SelectValue placeholder="Pick Country" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-ios-xl bg-white dark:bg-[#2C2C2E] max-h-80">
                                        {countries.map((c) => (
                                            <SelectItem key={c.code} value={c.code.toUpperCase()} className="rounded-xl font-semibold py-3">
                                                <span className="mr-2">{c.flag}</span>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="h-px bg-black/[0.05] dark:bg-white/[0.05]" />

                {/* Measurement & Currency */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className={labelClasses}>Unit System</Label>
                        <Controller
                            control={control}
                            name="measurement_system"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={inputClasses}>
                                        <SelectValue placeholder="System" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-ios bg-white dark:bg-[#2C2C2E]">
                                        <SelectItem value="metric" className="rounded-xl font-semibold py-3">Metric (cm)</SelectItem>
                                        <SelectItem value="imperial" className="rounded-xl font-semibold py-3">Imperial (in)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClasses}>Studio Currency</Label>
                        <Controller
                            control={control}
                            name="currency_code"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={inputClasses}>
                                        <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-ios bg-white dark:bg-[#2C2C2E] max-h-80">
                                        {currencies.map((c) => (
                                            <SelectItem
                                                key={c.code}
                                                value={c.code.toUpperCase()}
                                                className="rounded-xl font-semibold py-3"
                                            >
                                                {c.code.toUpperCase()} — {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                {/* Theme */}
                <div className="space-y-2">
                    <Label className={labelClasses}>Appearance</Label>
                    <Controller
                        control={control}
                        name="theme"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={inputClasses}>
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-ios bg-white dark:bg-[#2C2C2E]">
                                    <SelectItem value="system" className="rounded-xl font-semibold py-3">System Adaptation</SelectItem>
                                    <SelectItem value="light" className="rounded-xl font-semibold py-3">Brilliant Light</SelectItem>
                                    <SelectItem value="dark" className="rounded-xl font-semibold py-3">Deep Obsidian (Dark)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Footer Actions */}
                <div className="pt-8 flex items-center justify-end gap-3 border-t border-black/[0.05] dark:border-white/[0.05]">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => reset(defaultValues)}
                        disabled={saving || !isDirty}
                        className="h-12 px-6 rounded-full font-bold hover:bg-black/[0.03] transition-colors disabled:opacity-30"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving || !isDirty}
                        className="btn-ios min-w-[140px] disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {saving ? "Syncing..." : "Apply Changes"}
                    </Button>
                </div>
            </fieldset>
        </form>
    );
}