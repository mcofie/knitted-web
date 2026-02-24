"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

export default function ReadyAtPicker({ orderId, initial }: { orderId: string; initial: string | null }) {
    const router = useRouter();
    const sb = createClientBrowser();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<Date | null>(initial ? new Date(initial) : null);

    async function save(dt: Date) {
        const iso = dt.toISOString();
        const { error } = await sb.schema("knitted").from("orders").update({ ready_at: iso }).eq("id", orderId);
        if (error) {
            toast.error("Process interrupted", { description: error.message });
            return;
        }
        setValue(dt);
        setOpen(false);
        toast.success("Timeline updated. ✨");
        router.refresh();
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="w-full bg-background/10 border border-background/20 text-background font-medium h-12 rounded-full px-6 text-[10px] uppercase tracking-widest flex items-center justify-between hover:bg-background/20 transition-all outline-none">
                    <span className="font-serif text-sm normal-case tracking-normal">
                        {value ? value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Select Target"}
                    </span>
                    <CalendarIcon className="w-3.5 h-3.5 opacity-40" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 rounded-[2rem] border border-border shadow-3xl bg-background mt-2" align="end">
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={(d) => d && save(d)}
                    className="p-0"
                />
            </PopoverContent>
        </Popover>
    );
}