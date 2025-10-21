// src/components/settings/SettingsForm.tsx
"use client";

import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {z} from "zod";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createClientBrowser} from "@/lib/supabase/browser";
import {countries} from "@/lib/countries";
import {currencies} from "@/lib/currencies";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";

const Schema = z.object({
    business_name: z.string().min(2, "Enter a business name"),
    city: z.string().optional().nullable(),
    country_code: z.string().length(2, "Pick a country"),
    measurement_system: z.enum(["metric", "imperial"]),
    currency_code: z.string().length(3, "Pick a currency"),
    theme_pref: z.enum(["system", "light", "dark"]),
});

type FormValues = z.infer<typeof Schema>;

export default function SettingsForm({initial, version}: { initial: any; version: string }) {
    const sb = createClientBrowser();
    const {setTheme, theme} = useTheme();
    const [saving, setSaving] = useState(false);

    // const user = sb.auth.getUserSync();
    // if (!user) throw new Error("Not signed in");

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isDirty},
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            business_name: initial?.business_name ?? "",
            city: initial?.city ?? "",
            country_code: (initial?.country_code ?? "GH").toUpperCase(),
            measurement_system: initial?.measurement_system ?? "metric",
            currency_code: (initial?.currency_code ?? "GHS").toUpperCase(),
            theme_pref: initial?.theme ?? "system",
        },
    });

    // keep UI theme in sync with stored value (on first mount)
    useEffect(() => {
        const t = initial?.theme ?? "system";
        if (t !== theme) setTheme(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (values: FormValues) => {
        try {
            setSaving(true);

            const { data: { user }, error: userErr } = await sb.auth.getUser();
            if (userErr || !user) throw new Error("Not signed in");

            const {error} = await sb
                .schema("knitted")
                .from("account_settings")
                .update({
                    business_name: values.business_name,
                    city: values.city,
                    country_code: values.country_code,
                    measurement_system: values.measurement_system,
                    currency_code: values.currency_code,
                    theme_pref: values.theme,
                })
                .eq("owner", user.id);
            if (error) throw error;

            // update theme immediately
            setTheme(values.theme);
            toast.success("Settings saved");
        } catch (e: any) {
            toast.error("Save failed", {description: e?.message ?? String(e)});
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business name */}
            <div className="space-y-1">
                <Label>Business name</Label>
                <Input placeholder="e.g., Knitted Studio" {...register("business_name")} />
                {errors.business_name && <p className="text-sm text-red-500">{errors.business_name.message}</p>}
            </div>

            {/* City */}
            <div className="space-y-1">
                <Label>City</Label>
                <Input placeholder="e.g., Accra" {...register("city")} />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message as string}</p>}
            </div>

            {/* Country picker */}
            <div className="space-y-1">
                <Label>Country</Label>
                <Controller
                    control={control}
                    name="country_code"
                    render={({field}) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select country"/>
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {countries.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                        <span className="mr-2">{c.flag}</span>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.country_code && <p className="text-sm text-red-500">{errors.country_code.message}</p>}
            </div>

            {/* Measurement unit & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Measurement unit</Label>
                    <Controller
                        control={control}
                        name="measurement_system"
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue placeholder="Select unit"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="metric">Metric (cm)</SelectItem>
                                    <SelectItem value="imperial">Imperial (in)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.measurement_system &&
                        <p className="text-sm text-red-500">{errors.measurement_system.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Currency</Label>
                    <Controller
                        control={control}
                        name="currency_code"
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue placeholder="Select currency"/></SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {currencies.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>
                                            {c.code} — {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.currency_code && <p className="text-sm text-red-500">{errors.currency_code.message}</p>}
                </div>
            </div>

            {/* Theme */}
            <div className="space-y-1">
                <Label>Theme</Label>
                <Controller
                    control={control}
                    name="theme"
                    render={({field}) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select theme"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.theme && <p className="text-sm text-red-500">{errors.theme.message}</p>}
            </div>

            {/* Version */}
            <div className="text-sm text-muted-foreground">
                <span className="font-medium">Version:</span> {version}
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={saving || !isDirty}>
                    {saving ? "Saving…" : "Save changes"}
                </Button>
            </div>
        </form>
    );
}