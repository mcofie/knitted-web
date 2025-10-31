"use client";

import {useRouter} from "next/navigation";
import {createClientBrowser} from "@/lib/supabase/browser";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";

const STATUSES = ["confirmed", "active", "in_production", "ready", "delivered", "cancelled"];

export default function StatusSelect({orderId, initial}: { orderId: string; initial: string }) {
    const sb = createClientBrowser();
    const router = useRouter();

    async function onChange(status: string) {
        const {error} = await sb.schema("knitted").from("orders").update({status}).eq("id", orderId);
        if (error) {
            toast.error("Failed to update status", {description: error.message});
            return;
        }
        toast.success("Status updated");
        router.refresh();
    }

    return (
        <Select defaultValue={initial} onValueChange={onChange}>
            <SelectTrigger className="w-[170px]">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
        </Select>
    );
}