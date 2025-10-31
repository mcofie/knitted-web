"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientBrowser } from "@/lib/supabase/browser";
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
    // UI field `theme`, mapped to DB `theme_pref`
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
    const sb = createClientBrowser();
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

            const {
                data: { user },
                error: userErr,
            } = await sb.auth.getUser();
            if (userErr || !user) throw new Error("Not signed in");

            const { error } = await sb
                .schema("knitted")
                .from("account_settings")
                .update({
                    business_name: values.business_name,
                    city: values.city ?? null,
                    country_code: values.country_code,
                    measurement_system: values.measurement_system,
                    currency_code: values.currency_code,
                    theme_pref: values.theme,
                })
                .eq("owner", user.id);

            if (error) throw error;

            // Apply theme immediately & reset dirty state
            setTheme(values.theme);
            reset(values);
            toast.success("Settings saved");
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "Something went wrong";
            toast.error("Save failed", { description: message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <fieldset disabled={saving} className="space-y-6">

                {/* Business name */}
                <div className="space-y-1.5">
                    <Label htmlFor="business_name">Business name</Label>
                    <Input
                        id="business_name"
                        placeholder="e.g., Knitted Studio"
                        {...register("business_name")}
                        autoComplete="organization"
                    />
                    {errors.business_name && (
                        <p className="text-xs text-red-500">
                            {errors.business_name.message}
                        </p>
                    )}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        placeholder="e.g., Accra"
                        {...register("city")}
                        autoComplete="address-level2"
                    />
                    {errors.city && (
                        <p className="text-xs text-red-500">
                            {errors.city.message as string}
                        </p>
                    )}
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                    <Label>Country</Label>
                    <Controller
                        control={control}
                        name="country_code"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {countries.map((c) => (
                                        <SelectItem key={c.code} value={c.code.toUpperCase()}>
                                            <span className="mr-2">{c.flag}</span>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.country_code && (
                        <p className="text-xs text-red-500">
                            {errors.country_code.message}
                        </p>
                    )}
                </div>

                {/* Measurement & Currency */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label>Measurement unit</Label>
                        <Controller
                            control={control}
                            name="measurement_system"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="metric">Metric (cm)</SelectItem>
                                        <SelectItem value="imperial">Imperial (in)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.measurement_system && (
                            <p className="text-xs text-red-500">
                                {errors.measurement_system.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Currency</Label>
                        <Controller
                            control={control}
                            name="currency_code"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {currencies.map((c) => (
                                            <SelectItem
                                                key={c.code}
                                                value={c.code.toUpperCase()}
                                            >
                                                {c.code.toUpperCase()} — {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.currency_code && (
                            <p className="text-xs text-red-500">
                                {errors.currency_code.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Theme */}
                <div className="space-y-1.5">
                    <Label>Theme</Label>
                    <Controller
                        control={control}
                        name="theme"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="system">System</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.theme && (
                        <p className="text-xs text-red-500">
                            {errors.theme.message}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Version:</span> {version}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset(defaultValues)}
                            disabled={saving || !isDirty}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={saving || !isDirty}>
                            {saving ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}