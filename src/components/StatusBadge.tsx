"use client";

import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export default function StatusBadge({status}: { status: string }) {
    // Normalize status: lowercase and remove underscores for cleaner display
    const normalizedStatus = status.toLowerCase();
    const label = status.replace(/_/g, " ");

    // Define styles for each status state
    // Using specific background/text color combinations looks more premium than generic "destructive/secondary" variants
    const styles = {
        completed: "border-transparent bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25",
        delivered: "border-transparent bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25",
        ready: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25",

        in_production: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25",
        processing: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25",

        pending: "border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25",
        draft: "text-muted-foreground border-muted-foreground/30",

        cancelled: "border-transparent bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25",
        rejected: "border-transparent bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25",
    };

    // Default style if status doesn't match
    const defaultStyle = "text-muted-foreground border-border";

    const className = styles[normalizedStatus as keyof typeof styles] || defaultStyle;

    return (
        <Badge
            variant="outline" // Using outline as base allows us to override borders/bg easily
            className={cn(
                "px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                className
            )}
        >
            {label}
        </Badge>
    );
}