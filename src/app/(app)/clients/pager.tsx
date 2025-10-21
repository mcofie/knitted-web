"use client";

import Link from "next/link";
import {useMemo} from "react";
import {Button} from "@/components/ui/button";
import {useSearchParams} from "next/navigation";

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
        <div className="flex items-center justify-between py-2">
            <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages} • {total.toLocaleString()} total
            </div>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" disabled={page <= 1}>
                    <Link href={prevHref} aria-disabled={page <= 1}>Previous</Link>
                </Button>
                <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
                    <Link href={nextHref} aria-disabled={page >= totalPages}>Next</Link>
                </Button>
            </div>
        </div>
    );
}