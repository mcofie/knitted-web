"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Star, Clock, AlertCircle, RotateCcw } from "lucide-react";

export default function StatusBadge({ status, className: extraClass }: { status: string, className?: string }) {
    const normalizedStatus = status.toLowerCase();
    const label = status.replace(/_/g, " ");

    const styles = {
        completed: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/10",
        delivered: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/10",
        ready: "bg-accent/5 text-accent border-accent/10",
        in_production: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/10",
        processing: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/10",
        pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/5 dark:text-amber-400 dark:border-amber-500/10",
        draft: "bg-muted/30 text-muted-foreground border-border",
        cancelled: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/5 dark:text-rose-400 dark:border-rose-500/10",
        rejected: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/5 dark:text-rose-400 dark:border-rose-500/10",
    };

    const icons = {
        completed: <CheckCircle2 className="w-3 h-3 stroke-[1.5]" />,
        delivered: <CheckCircle2 className="w-3 h-3 stroke-[1.5]" />,
        ready: <Star className="w-3 h-3 fill-current stroke-[1.5]" />,
        in_production: <RotateCcw className="w-3 h-3 animate-spin-slow stroke-[1.5]" />,
        processing: <RotateCcw className="w-3 h-3 animate-spin-slow stroke-[1.5]" />,
        pending: <Clock className="w-3 h-3 stroke-[1.5]" />,
        cancelled: <AlertCircle className="w-3 h-3 stroke-[1.5]" />,
        rejected: <AlertCircle className="w-3 h-3 stroke-[1.5]" />,
    };

    const baseStyle = styles[normalizedStatus as keyof typeof styles] || "text-muted-foreground border-border";
    const Icon = icons[normalizedStatus as keyof typeof icons] || <Clock className="w-3 h-3 stroke-[1.5]" />;

    return (
        <Badge
            variant="outline"
            className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] border transition-all",
                baseStyle,
                extraClass
            )}
        >
            {Icon}
            {label}
        </Badge>
    );
}