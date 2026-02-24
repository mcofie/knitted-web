// src/app/(app)/dashboard/_components/dashboard-hero.tsx
"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Sunrise, MapPin } from "lucide-react";

type Settings = {
    business_name?: string | null;
    city?: string | null;
};

export default function DashboardHero({
    settings,
    stats,
}: {
    settings?: Settings | null;
    stats?: { active?: number; pending?: number; total?: number } | null;
}) {
    const name = settings?.business_name ?? "Knitted";
    const city = settings?.city ?? "—";

    // salutation + icon based on local time
    const { greeting, Icon } = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 5 || hour >= 20) return { greeting: "Good evening", Icon: Moon };
        if (hour < 12) return { greeting: "Good morning", Icon: Sunrise };
        if (hour < 17) return { greeting: "Good afternoon", Icon: Sun };
        return { greeting: "Good evening", Icon: Moon };
    }, []);

    const quotes = [
        "Measure twice, cut once.",
        "Every stitch tells a story.",
        "Consistency turns craft into mastery.",
        "Details make the design.",
        "Small improvements, big results.",
    ];
    const quote = quotes[new Date().getDay() % quotes.length];

    return (
        <div className="relative overflow-hidden group">
            <div className="bento-card bg-secondary/50 p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border text-foreground">
                                <Icon className="h-4 w-4 stroke-[1.5]" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">{greeting}</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                            Welcome back, <br />
                            <span className="italic">{name}</span>
                        </h2>

                        <p className="text-muted-foreground font-sans italic max-w-sm">&ldquo;{quote}&rdquo;</p>

                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-foreground/40 uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{city}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[300px]">
                        <MiniStat label="Active" value={stats?.active ?? "0"} />
                        <MiniStat label="Pending" value={stats?.pending ?? "0"} />
                        <MiniStat label="Total" value={stats?.total ?? "0"} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-sm hover:border-foreground/20 transition-colors">
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {label}
            </div>
            <div className="text-2xl font-serif text-foreground tabular-nums">
                {value}
            </div>
        </div>
    );
}