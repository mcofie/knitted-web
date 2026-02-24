"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pager({
    page, pageSize, total,
}: { page: number; pageSize: number; total: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize]
    );

    function push(next: { page?: number; pageSize?: number }) {
        const params = new URLSearchParams(sp.toString());
        if (next.page) params.set("page", String(next.page));
        if (next.pageSize) params.set("pageSize", String(next.pageSize));
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-6 w-full">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => push({ page: Math.max(1, page - 1) })}
                    disabled={page <= 1}
                    className="h-10 w-10 rounded-full border border-border p-0 hover:bg-muted transition-colors disabled:opacity-20"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="px-6 h-10 flex items-center bg-background border border-border rounded-full">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                        Page <span className="text-foreground font-serif text-sm mx-1">{page}</span> of {totalPages}
                    </span>
                </div>

                <Button
                    variant="outline"
                    onClick={() => push({ page: Math.min(totalPages, page + 1) })}
                    disabled={page >= totalPages}
                    className="h-10 w-10 rounded-full border border-border p-0 hover:bg-muted transition-colors disabled:opacity-20"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">Scale:</span>
                <Select
                    value={String(pageSize)}
                    onValueChange={(v) => push({ page: 1, pageSize: Number(v) })}
                >
                    <SelectTrigger className="h-10 w-[110px] bg-secondary/30 border border-border/50 rounded-full px-5 text-[10px] font-medium uppercase tracking-widest outline-none focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-border shadow-2xl bg-background p-1">
                        {[9, 18, 36, 90].map((n) => (
                            <SelectItem key={n} value={String(n)} className="rounded-xl font-medium text-[10px] uppercase tracking-widest py-3">
                                {n} units
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}