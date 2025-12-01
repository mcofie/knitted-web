'use server';

import { createClientAction } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export type SettingsFormValues = z.infer<typeof Schema>;

export async function updateSettings(values: SettingsFormValues) {
    const sb = await createClientAction();

    // 1. Auth Check
    const {
        data: { user },
        error: userErr,
    } = await sb.auth.getUser();

    if (userErr || !user) {
        return { error: "Not signed in" };
    }

    // 2. Validate input
    const parsed = Schema.safeParse(values);
    if (!parsed.success) {
        return { error: "Invalid data" };
    }
    const data = parsed.data;

    // 3. Update
    const { error } = await sb
        .schema("knitted")
        .from("account_settings")
        .update({
            business_name: data.business_name,
            city: data.city ?? null,
            country_code: data.country_code,
            measurement_system: data.measurement_system,
            currency_code: data.currency_code,
            theme_pref: data.theme,
        })
        .eq("owner", user.id);

    if (error) {
        console.error("Settings update error:", error);
        return { error: error.message };
    }

    revalidatePath("/settings");
    return { success: true };
}
