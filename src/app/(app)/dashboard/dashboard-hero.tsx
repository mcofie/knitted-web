// src/app/(app)/dashboard/_components/dashboard-hero.tsx
"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Sunrise } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-2xl border border-border">
            {/* Solid, theme-aware primary surface */}
            <div aria-hidden className="absolute inset-0 -z-10 bg-primary" />

            <Card className="border-transparent bg-transparent">
                <CardContent className="px-4 py-8 md:px-8 md:py-10">
                    <div className="flex items-start gap-4">
                        {/* Icon chip: uses background surface for contrast over primary */}
                        <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background/40 text-primary-foreground ring-1 ring-primary-foreground/20">
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-primary-foreground">
                                    {greeting}, <span className="opacity-95">{name}</span> 👋
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-primary-foreground/80">{quote}</p>

                            {/* Business details */}
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="bg-background text-foreground hover:bg-background"
                                >
                                    City: {city}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats (theme-aware cards over primary bg) */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <MiniStat label="Active orders" value={stats?.active ?? "—"} />
                        <MiniStat label="Pending pickup" value={stats?.pending ?? "—"} />
                        <MiniStat label="Total orders" value={stats?.total ?? "—"} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 text-xl font-semibold text-card-foreground tabular-nums">
                {value}
            </div>
        </div>
    );
}