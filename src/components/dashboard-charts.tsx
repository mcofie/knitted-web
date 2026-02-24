"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type SeriesPoint = { x: string; orders: number; revenue: number };
type TabValue = "daily" | "weekly" | "monthly";

export default function DashboardCharts({
    currencyCode,
    daily,
    weekly,
    monthly,
}: {
    currencyCode: string;
    daily?: SeriesPoint[];
    weekly?: SeriesPoint[];
    monthly?: SeriesPoint[];
}) {
    const [tab, setTab] = useState<TabValue>("daily");

    const data = useMemo(() => {
        if (tab === "weekly") return weekly || [];
        if (tab === "monthly") return monthly || [];
        return daily || [];
    }, [tab, daily, weekly, monthly]);

    const sumRevenue = data.reduce((a, b) => a + (b.revenue || 0), 0);

    const formatX = (iso: string) => {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        if (tab === "monthly") return d.toLocaleDateString(undefined, { month: "short" });
        return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
    };

    const money = (v: number) =>
        new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(
            v || 0
        );

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length || label == null) return null;
        return (
            <div className="rounded-2xl bg-background/90 backdrop-blur-xl p-6 text-sm border border-border">
                <div className="mb-4 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{formatX(label)}</div>
                {payload.map((p: any, i: number) => {
                    const key = p.dataKey;
                    const name = key === "orders" ? "Orders" : "Revenue";
                    const val = key === "orders" ? p.value : money(p.value);
                    return (
                        <div key={i} className="flex items-center justify-between gap-8 py-1.5">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">{name}</span>
                            </div>
                            <span className="font-serif text-foreground text-base">{val}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const colOrders = "hsl(var(--accent))";
    const colRevenue = "hsl(var(--foreground))";
    const gridColor = "rgba(0,0,0,0.05)";
    const tickColor = "rgba(0,0,0,0.3)";

    if (!data.length) {
        return (
            <div className="rounded-[2rem] border border-dashed border-border p-16 text-center bg-secondary/20">
                <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">Crafting history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 block">Period Performance</span>
                    <div className="text-5xl font-serif text-foreground tabular-nums leading-none">{money(sumRevenue)}</div>
                </div>
                <Tabs
                    value={tab}
                    onValueChange={(v) => setTab(v as TabValue)}
                    className="bg-muted/50 p-1 rounded-full border border-border/50"
                >
                    <TabsList className="bg-transparent h-9 p-0 gap-1">
                        {["daily", "weekly", "monthly"].map((t) => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className="rounded-full px-6 text-[10px] font-medium uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground transition-all h-7"
                            >
                                {t}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className="h-80 w-full prose-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colRevenue} stopOpacity={0.05} />
                                <stop offset="100%" stopColor={colRevenue} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colOrders} stopOpacity={0.05} />
                                <stop offset="100%" stopColor={colOrders} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="x"
                            tickFormatter={formatX}
                            tick={{ fill: tickColor, fontSize: 10, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            dy={15}
                        />
                        <YAxis
                            tickFormatter={(v) => new Intl.NumberFormat(undefined, { notation: "compact" }).format(v as number)}
                            tick={{ fill: tickColor, fontSize: 10, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={colRevenue}
                            strokeWidth={2}
                            fill="url(#revGradient)"
                            activeDot={{ r: 4, strokeWidth: 2, stroke: 'white', className: 'shadow-sm' }}
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke={colOrders}
                            strokeWidth={2}
                            fill="url(#orderGradient)"
                            activeDot={{ r: 4, strokeWidth: 2, stroke: 'white' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}