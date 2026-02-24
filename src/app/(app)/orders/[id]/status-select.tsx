"use client";

import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUSES = ["confirmed", "active", "in_production", "ready", "delivered", "cancelled"];

export default function StatusSelect({ orderId, initial }: { orderId: string; initial: string }) {
    const sb = createClientBrowser();
    const router = useRouter();

    async function onChange(status: string) {
        const { error } = await sb.schema("knitted").from("orders").update({ status }).eq("id", orderId);
        if (error) {
            toast.error("Process interrupted", { description: error.message });
            return;
        }
        toast.success("State synchronized. ✨");
        router.refresh();
    }

    return (
        <Select defaultValue={initial} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-background/10 border border-background/20 text-background font-medium h-12 rounded-full px-6 text-[10px] uppercase tracking-widest hover:bg-background/20 transition-all outline-none focus:ring-0 capitalize">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-border shadow-3xl bg-background p-1">
                {STATUSES.map(s => (
                    <SelectItem key={s} value={s} className="rounded-xl font-medium text-[10px] uppercase tracking-widest py-3 capitalize">
                        {s.replace('_', ' ')}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}