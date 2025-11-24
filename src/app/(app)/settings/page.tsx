// src/app/(app)/settings/page.tsx
import {createClientServer} from "@/lib/supabase/server";
import SettingsForm from "@/components/settings/SettingsForm";
import Image from "next/image";
import {Settings2, ShieldAlert} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const sb = await createClientServer();

    // 1. Auth Check
    const {data: {user}} = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <ShieldAlert className="h-8 w-8 text-muted-foreground"/>
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
        <div className="max-w-3xl mx-auto py-8 space-y-8">

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your business profile, preferences, and account configuration.
                </p>
            </div>

            {/* Business Profile Card (Visual only) */}
            <div className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                {/* Decorative background */}
                <div
                    className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"/>

                <div className="relative px-6 pt-12 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-4">
                    <div
                        className="relative h-24 w-24 rounded-full ring-4 ring-background bg-muted shadow-md overflow-hidden">
                        <Image
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(settings?.business_name || "Guest")}`}
                            alt={settings?.business_name || "Avatar"}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="text-center sm:text-left space-y-1 mb-2">
                        <h2 className="text-xl font-bold leading-none">
                            {settings?.business_name || "New Business"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Knitted Account • Version {version}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="mb-6 border-b pb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-primary"/>
                        General Configuration
                    </h3>
                </div>

                <SettingsForm
                    initial={settings ?? {}}
                    version={version}
                />
            </div>
        </div>
    );
}