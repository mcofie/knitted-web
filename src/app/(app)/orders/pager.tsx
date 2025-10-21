"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

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
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => push({ page: Math.max(1, page - 1) })}
                    disabled={page <= 1}
                >
                    Prev
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => push({ page: Math.min(totalPages, page + 1) })}
                    disabled={page >= totalPages}
                >
                    Next
                </Button>
                <div className="text-sm text-muted-foreground pl-2">
                    Page <span className="font-medium">{page}</span> of {totalPages}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Rows per page</div>
                <Select
                    value={String(pageSize)}
                    onValueChange={(v) => push({ page: 1, pageSize: Number(v) })}
                >
                    <SelectTrigger className="w-[90px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 20, 50, 100].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}