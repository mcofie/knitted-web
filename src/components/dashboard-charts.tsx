// src/app/(app)/dashboard/_components/dashboard-charts.tsx
"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend
} from "recharts";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {useMemo, useState} from "react";

type SeriesPoint = { x: string; orders: number; revenue: number };
type TabValue = "daily" | "weekly" | "monthly";

// --- seeded RNG for stable dummy data ---
function mulberry32(seed: number) {
    return () => {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// --- dummy data creators ---
function makeDaily(days = 30, seed = 42): SeriesPoint[] {
    const r = mulberry32(seed);
    const now = new Date();
    const out: SeriesPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const wave = 20 + 10 * Math.sin(i / 3);
        const orders = Math.max(0, Math.round(wave + r() * 6 - 3));
        const revenue = Math.max(0, Math.round(orders * (25 + r() * 60)));
        out.push({x: d.toISOString(), orders, revenue});
    }
    return out;
}

function makeWeekly(weeks = 12, seed = 137): SeriesPoint[] {
    const r = mulberry32(seed);
    const now = new Date();
    const out: SeriesPoint[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i * 7);
        const wave = 120 + 30 * Math.sin(i / 2);
        const orders = Math.max(0, Math.round(wave + r() * 20 - 10));
        const revenue = Math.max(0, Math.round(orders * (28 + r() * 70)));
        out.push({x: d.toISOString(), orders, revenue});
    }
    return out;
}

function makeMonthly(months = 12, seed = 777): SeriesPoint[] {
    const r = mulberry32(seed);
    const now = new Date();
    const out: SeriesPoint[] = [];
    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i, 1);
        const wave = 500 + 120 * Math.sin(i / 1.8);
        const orders = Math.max(0, Math.round(wave + r() * 60 - 30));
        const revenue = Math.max(0, Math.round(orders * (30 + r() * 80)));
        out.push({x: d.toISOString(), orders, revenue});
    }
    return out;
}

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

    // Fallback to dummy data
    const dailyData = daily?.length ? daily : makeDaily(30);
    const weeklyData = weekly?.length ? weekly : makeWeekly(12);
    const monthlyData = monthly?.length ? monthly : makeMonthly(12);

    const {data, title} = useMemo(() => {
        if (tab === "weekly") return {data: weeklyData, title: "Weekly Trends"};
        if (tab === "monthly") return {data: monthlyData, title: "Monthly Trends"};
        return {data: dailyData, title: "Daily Trends"};
    }, [tab, dailyData, weeklyData, monthlyData]);

    const latest = data.at(-1);
    const sumOrders = data.reduce((a, b) => a + (b.orders || 0), 0);
    const sumRevenue = data.reduce((a, b) => a + (b.revenue || 0), 0);

    const formatX = (iso: string) => {
        const d = new Date(iso);
        if (tab === "monthly") return d.toLocaleDateString(undefined, {month: "short", year: "2-digit"});
        return d.toLocaleDateString(undefined, {month: "short", day: "numeric"});
    };

    const money = (v: number) =>
        new Intl.NumberFormat(undefined, {style: "currency", currency: currencyCode, maximumFractionDigits: 0}).format(
            v || 0
        );

    const Empty = !data.length;


// Local types for the custom tooltip content
    type RechartsItem<T = number, N = string> = {
        color?: string;
        dataKey?: N | number;
        name?: N;
        value?: T;
        payload?: unknown;
    };

    type CustomTooltipProps = {
        active?: boolean;
        label?: string | number;
        payload?: RechartsItem[];
    };

// Typed custom tooltip (no reliance on Recharts' TooltipProps)
    const CustomTooltip = ({active, payload, label}: CustomTooltipProps) => {
        if (!active || !payload?.length || label == null) return null;

        const labelStr = typeof label === "string" ? label : String(label);

        return (
            <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-md">
                <div className="mb-1 font-medium">{formatX(labelStr)}</div>
                {payload.map((p, i) => {
                    const key = (p.dataKey ?? "") as "orders" | "revenue" | "";
                    const name = key === "orders" ? "Orders" : "Revenue";
                    const val =
                        key === "orders"
                            ? (p.value as number)
                            : money((p.value as number) ?? 0);
                    return (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
            <span
                className="inline-block h-2 w-2 rounded-full"
                style={{backgroundColor: p.color}}
            />
                            <span className="min-w-[72px]">{name}</span>
                            <span className="font-medium text-foreground">{val}</span>
                        </div>
                    );
                })}
            </div>
        );
    };


    // theme-aware colors (from globals.css tokens)
    const colOrders = "hsl(var(--chart-1))";
    const colRevenue = "hsl(var(--chart-2))";
    const gridColor = "hsl(var(--chart-grid) / 0.25)";
    const tickColor = "hsl(var(--chart-grid))";

    if (Empty) {
        return (
            <div className="rounded-2xl border border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">
                No data yet. Your charts will appear here once orders and revenue start rolling in.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card/70 px-4 py-6 md:py-8">
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-base">{title}</CardTitle>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            Latest Orders: <span
                            className="ml-1 font-medium text-foreground">{latest?.orders ?? 0}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            Latest Revenue: <span
                            className="ml-1 font-medium text-foreground">{money(latest?.revenue ?? 0)}</span>
                        </Badge>
                        <Tabs
                            value={tab}
                            onValueChange={(v) => setTab(v as TabValue)}
                            className="ml-2"
                        >
                            <TabsList>
                                <TabsTrigger value="daily">Daily</TabsTrigger>
                                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Tiny roll-up row */}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-1">
            Period Orders: <span className="ml-1 font-medium text-foreground">{sumOrders.toLocaleString()}</span>
          </span>
                    <span className="rounded-md bg-muted px-2 py-1">
            Period Revenue: <span className="ml-1 font-medium text-foreground">{money(sumRevenue)}</span>
          </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                {/* Orders Line */}
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                            <XAxis
                                dataKey="x"
                                tickFormatter={formatX}
                                tick={{fill: tickColor, fontSize: 12}}
                                axisLine={{stroke: gridColor}}
                                tickLine={{stroke: gridColor}}
                            />
                            <YAxis
                                width={56}
                                tick={{fill: tickColor, fontSize: 12}}
                                axisLine={{stroke: gridColor}}
                                tickLine={{stroke: gridColor}}
                            />
                            <ReferenceLine y={0} stroke={gridColor}/>
                            <Tooltip content={<CustomTooltip/>}/>
                            <Legend/>
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke={colOrders}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{r: 4}}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Area */}
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={colRevenue} stopOpacity={0.28}/>
                                    <stop offset="100%" stopColor={colRevenue} stopOpacity={0.06}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                            <XAxis
                                dataKey="x"
                                tickFormatter={formatX}
                                tick={{fill: tickColor, fontSize: 12}}
                                axisLine={{stroke: gridColor}}
                                tickLine={{stroke: gridColor}}
                            />
                            <YAxis
                                width={56}
                                tickFormatter={(v) => new Intl.NumberFormat(undefined, {notation: "compact"}).format(v as number)}
                                tick={{fill: tickColor, fontSize: 12}}
                                axisLine={{stroke: gridColor}}
                                tickLine={{stroke: gridColor}}
                            />
                            <ReferenceLine y={0} stroke={gridColor}/>
                            <Tooltip content={<CustomTooltip/>}/>
                            <Legend/>
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke={colRevenue}
                                strokeWidth={2}
                                fill="url(#revGradient)"
                                activeDot={{r: 3}}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </div>
    );
}