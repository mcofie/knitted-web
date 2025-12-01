'use server';

import { createClientAction } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ClientSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    country_code: z.string().length(2, "2-letter ISO country code"),
    phone: z.string().max(30).optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    city: z.string().max(120).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof ClientSchema>;

export async function createClient(values: ClientFormValues) {
    const sb = await createClientAction();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) return { error: "Not signed in" };

    const payload = {
        owner: user.id,
        name: values.full_name.trim(),
        full_name: values.full_name.trim(),
        country_code: values.country_code.toUpperCase(),
        phone: values.phone?.trim() || null,
        email: values.email?.trim() || null,
        city: values.city?.trim() || null,
        address: values.address?.trim() || null,
        notes: values.notes?.trim() || null,
    };

    const { error } = await sb
        .schema("knitted")
        .from("customers")
        .insert(payload);

    if (error) return { error: error.message };

    revalidatePath("/clients");
    return { success: true };
}

export async function updateClient(id: string, values: ClientFormValues) {
    const sb = await createClientAction();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) return { error: "Not signed in" };

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

    const { error } = await sb
        .schema("knitted")
        .from("customers")
        .update(payload)
        .eq("id", id)
        .eq("owner", user.id);

    if (error) return { error: error.message };

    revalidatePath(`/clients/${id}`);
    revalidatePath("/clients");
    return { success: true };
}

export async function deleteClient(id: string) {
    const sb = await createClientAction();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) return { error: "Not signed in" };

    const { error } = await sb
        .schema("knitted")
        .from("customers")
        .delete()
        .eq("id", id)
        .eq("owner", user.id);

    if (error) return { error: error.message };

    revalidatePath("/clients");
    redirect("/clients");
}
