// src/app/(app)/settings/page.tsx
import { createClientServer } from "@/lib/supabase/server";
import { ShieldAlert } from "lucide-react";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Settings',
};

export default async function SettingsPage() {
    const sb = await createClientServer();

    // 1. Auth Check
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <ShieldAlert className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Access Restricted</h2>
                    <p className="text-muted-foreground">Please sign in to manage your settings.</p>
                </div>
            </div>
        );
    }

    const uid = user.id;

    // 2. Get or create settings row (Logic preserved)
    const { data } = await sb
        .schema("knitted")
        .from("account_settings")
        .select("*")
        .eq("owner", uid)
        .maybeSingle();

    let settings = data;
    if (!settings) {
        const { data: inserted } = await sb
            .schema("knitted")
            .from("account_settings")
            .insert({ owner: uid })
            .select()
            .single();
        settings = inserted ?? null;
    }

    // Display version (read-only)
    const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";

    return <SettingsClient settings={settings} version={version} />;
}