"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientsPager({
    page,
    pageSize,
    total,
}: {
    page: number;
    pageSize: number;
    total: number;
}) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const params = useSearchParams();

    const baseQuery = useMemo(() => {
        const q = new URLSearchParams(params.toString());
        q.set("pageSize", String(pageSize));
        return q;
    }, [params, pageSize]);

    const prevHref = useMemo(() => {
        const q = new URLSearchParams(baseQuery);
        q.set("page", String(Math.max(1, page - 1)));
        return `?${q.toString()}`;
    }, [baseQuery, page]);

    const nextHref = useMemo(() => {
        const q = new URLSearchParams(baseQuery);
        q.set("page", String(Math.min(totalPages, page + 1)));
        return `?${q.toString()}`;
    }, [baseQuery, page, totalPages]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-6 w-full px-2">
            <div className="flex items-center gap-4">
                <div className="px-6 h-10 flex items-center bg-secondary/30 border border-border/50 rounded-full">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                        Total Directory: <span className="text-foreground font-serif text-sm ml-2">{total.toLocaleString()}</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    asChild
                    variant="outline"
                    disabled={page <= 1}
                    className="h-10 w-10 rounded-full border border-border p-0 hover:bg-muted transition-colors disabled:opacity-20"
                >
                    <Link href={prevHref} aria-disabled={page <= 1} className="flex items-center justify-center">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>

                <div className="px-6 h-10 flex items-center bg-background border border-border rounded-full">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                        Page <span className="text-foreground font-serif text-sm mx-1">{page}</span> of {totalPages}
                    </span>
                </div>

                <Button
                    asChild
                    variant="outline"
                    disabled={page >= totalPages}
                    className="h-10 w-10 rounded-full border border-border p-0 hover:bg-muted transition-colors disabled:opacity-20"
                >
                    <Link href={nextHref} aria-disabled={page >= totalPages} className="flex items-center justify-center">
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}