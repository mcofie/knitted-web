"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/clients/ClientForm";
import { createClient, ClientFormValues } from "@/app/(app)/clients/actions";
import { Plus, Users, Sparkles, X, UserPlus } from "lucide-react";

export default function AddClientDialog({
    onCreated,
    defaultCountry,
}: {
    onCreated?: () => void;
    defaultCountry?: string;
}) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(values: ClientFormValues) {
        setIsSubmitting(true);
        try {
            const result = await createClient(values);
            if (result.error) {
                toast.error("Failed to create client", { description: result.error });
                return;
            }

            toast.success("Client Added! ✨");
            setOpen(false);
            onCreated?.();
        } catch (_e) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="btn-primary h-12 gap-3"
            >
                <UserPlus className="w-4 h-4" />
                New Client
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl rounded-[2rem] border border-border p-0 overflow-hidden shadow-2xl bg-background transition-all">
                    <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-border bg-muted/20">
                        <div className="space-y-1">
                            <DialogTitle className="text-4xl font-serif text-foreground">Add Client</DialogTitle>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Client Dossier Entry</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4 text-foreground" />
                        </button>
                    </div>

                    <div className="p-10">
                        <ClientForm
                            initialValues={{ country_code: defaultCountry }}
                            onSubmit={onSubmit}
                            isSubmitting={isSubmitting}
                            onCancel={() => setOpen(false)}
                            submitLabel="Add to Records"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}