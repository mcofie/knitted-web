"use client";

import {Badge} from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    const variant =
        s === "completed"
            ? "default"
            : s === "in_production"
                ? "secondary"
                : s === "pending"
                    ? "outline"
                    : s === "cancelled"
                        ? "destructive"
                        : "outline";
    return (
        <Badge
            variant={variant}
            className="h-5 px-2 py-2 text-md capitalize font-bold tracking-wide"
        >
            {status}
        </Badge>
    );
}