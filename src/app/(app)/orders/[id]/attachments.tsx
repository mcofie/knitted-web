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
        <div>
            <div className="pb-2 flex items-center justify-between">
                <CardTitle className="text-base">Attachments</CardTitle>
            </div>
            <div className="w-full group relative rounded-2xl border border-border bg-card/70 p-4">
                {rows.length === 0 && (
                    <div className="text-sm text-muted-foreground py-8 text-center">
                        No images yet
                    </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {rows.map((r) => {
                        const src = urls[r.id];
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setSelectedUrl(src ?? null)}
                                className="relative aspect-square rounded border overflow-hidden focus:outline-none"
                            >
                                {src ? (
                                    <Image
                                        src={src}
                                        alt={r.caption ?? ""}
                                        fill
                                        className="object-cover hover:opacity-90 transition"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
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
                <DialogContent className="max-w-3xl p-0 bg-black/90">
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