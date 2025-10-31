// src/app/(app)/settings/page.tsx
import {createClientServer} from "@/lib/supabase/server";
import SettingsForm from "@/components/settings/SettingsForm";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const sb = await createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    if (!user) return <div className="p-6">You must be signed in.</div>;
    const uid = user.id;

    // Get or create row
    const {data} = await sb
        .schema("knitted")
        .from("account_settings")
        .select("*")
        .eq("owner", uid)
        .maybeSingle();

    let settings = data;
    if (!settings) {
        const {data: inserted} = await sb
            .schema("knitted")
            .from("account_settings")
            .insert({owner: uid})
            .select()
            .single();
        settings = inserted ?? null;
    }

    // Display version (read-only)
    const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-lg font-semibold">Settings</h1>

            <div className="flex items-center gap-4 w-full justify-center">
                <Image
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(settings?.business_name || "Guest")}`}
                    alt={settings?.business_name || "Avatar"}
                    width={98}
                    height={98}
                    unoptimized
                    className="rounded-full border border-border bg-muted ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/40"
                />
            </div>
            <SettingsForm initial={settings ?? {}} version={version}/>
        </div>
    );
}