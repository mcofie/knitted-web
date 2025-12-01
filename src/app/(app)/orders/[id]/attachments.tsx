"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    const [uploading, setUploading] = useState(false);
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
    }, [orderId]);

    useEffect(() => {
        if (rows.length > 0) resolveUrls(rows);
    }, [rows]);

    async function upload() {
        try {
            const picker = document.createElement("input");
            picker.type = "file";
            picker.accept = "image/*";
            picker.multiple = true;
            picker.click();
            picker.onchange = async () => {
                if (!picker.files || picker.files.length === 0) return;
                setUploading(true);
                const bucket = "knitted-attachments";
                for (const file of Array.from(picker.files)) {
                    const ext = file.name.split(".").pop();
                    const path = `orders/${orderId}/${Date.now()}_${Math.random()
                        .toString(36)
                        .slice(2)}.${ext}`;
                    const { error: upErr } = await sb.storage
                        .from(bucket)
                        .upload(path, file);
                    if (upErr) {
                        toast.error("Upload failed", { description: upErr.message });
                        continue;
                    }
                    const { error: dbErr } = await sb
                        .schema("knitted")
                        .from("attachments")
                        .insert({ order_id: orderId, file_path: path, caption: null });
                    if (dbErr)
                        toast.error("Save failed", { description: dbErr.message });
                }
                setUploading(false);
                toast.success("Attachments uploaded");
                await load();
            };
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "Something went wrong";
            toast.error("Upload error", { description: message });
        }
    }

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