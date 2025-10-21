"use client";

import { Button } from "@/components/ui/button";
import { createClientBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

export default function ShareButton({ orderId }: { orderId: string }) {
    async function share() {
        const sb = createClientBrowser();
        try {
            // Explicit return & params types for the RPC
            const { data, error } = await sb.rpc<string, { p_order_id: string }>(
                "get_or_create_tracking_url",
                { p_order_id: orderId }
            );
            if (error || !data) throw new Error(error?.message ?? "No URL returned");

            const url = String(data);

            // Safely access Web APIs with a typed local alias
            const nav =
                typeof window !== "undefined"
                    ? (window.navigator as Navigator & {
                        share?: (d: ShareData) => Promise<void>;
                        clipboard?: { writeText: (t: string) => Promise<void> };
                    })
                    : undefined;

            if (nav?.share) {
                await nav.share({ title: "Track your order", url });
                toast.success("Link shared");
            } else if (nav?.clipboard?.writeText) {
                await nav.clipboard.writeText(url);
                toast.success("Link copied");
            } else {
                // final fallback
                window.prompt("Copy your tracking link:", url);
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            toast.error("Failed to create link", { description: message });
        }
    }

    return (
        <Button onClick={share} size="sm">
            Share tracking link
        </Button>
    );
}