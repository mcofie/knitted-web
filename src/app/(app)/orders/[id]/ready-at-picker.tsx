"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // if you have shadcn calendar
import { toast } from "sonner";

export default function ReadyAtPicker({ orderId, initial }: { orderId: string; initial: string | null }) {
    const router = useRouter();
    const sb = createClientBrowser();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<Date | null>(initial ? new Date(initial) : null);

    async function save(dt: Date) {
        const iso = dt.toISOString();
        const { error } = await sb.schema("knitted").from("orders").update({ ready_at: iso }).eq("id", orderId);
        if (error) {
            toast.error("Failed to set ready date", { description: error.message });
            return;
        }
        setValue(dt);
        setOpen(false);
        router.refresh();
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    {value ? value.toLocaleString() : "Set date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={(d) => d && save(d)}
                />
            </PopoverContent>
        </Popover>
    );
}