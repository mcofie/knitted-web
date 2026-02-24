"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientBrowser } from "@/lib/supabase/browser";
import { CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

type Row = {
    id: string;
    file_path: string;
    caption: string | null;
    created_at: string;
};

export default function AttachmentsSection({ orderId }: { orderId: string }) {
    const sb = createClientBrowser();
    const [rows, setRows] = useState<Row[]>([]);

    const [urls, setUrls] = useState<Record<string, string>>({});
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    async function load() {
        const { data, error } = await sb
            .schema("knitted")
            .from("attachments")
            .select("id, file_path, caption, created_at")
            .eq("order_id", orderId)
            .order("created_at", { ascending: false });
        if (error) {
            toast.error("Failed to load images", { description: error.message });
            return;
        }
        setRows((data ?? []) as Row[]);
    }

    async function resolveUrls(list: Row[]) {
        const bucket = "knitted-attachments";
        const out: Record<string, string> = {};
        await Promise.all(
            list.map(async (r) => {
                try {
                    const { data } = await sb.storage
                        .from(bucket)
                        .createSignedUrl(r.file_path, 60 * 60);
                    if (data?.signedUrl) out[r.id] = data.signedUrl;
                } catch { }
            })
        );
        setUrls(out);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    useEffect(() => {
        if (rows.length > 0) resolveUrls(rows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);



    return (
        <div className="space-y-6">
            <div className="bento-card bg-card p-4">
                {rows.length === 0 && (
                    <div className="text-sm font-sans italic text-muted-foreground/40 py-12 text-center">
                        The visual portfolio is currently empty.
                    </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {rows.map((r) => {
                        const src = urls[r.id];
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setSelectedUrl(src ?? null)}
                                className="group relative aspect-square rounded-[1.5rem] border border-border overflow-hidden focus:outline-none transition-all hover:shadow-xl"
                            >
                                {src ? (
                                    <Image
                                        src={src}
                                        alt={r.caption ?? ""}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 animate-pulse">
                                        Loading…
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Modal view */}
            <Dialog open={!!selectedUrl} onOpenChange={() => setSelectedUrl(null)}>
                <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-xl border border-border rounded-[2.5rem] overflow-hidden">
                    {selectedUrl && (
                        <div className="relative w-full h-[80vh]">
                            <Image
                                src={selectedUrl}
                                alt="Preview"
                                fill
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}