"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/clients/ClientForm";
import { createClient, ClientFormValues } from "@/app/(app)/clients/actions";

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

            toast.success("Client created");
            setOpen(false);
            onCreated?.();
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>Add client</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add client</DialogTitle>
                    </DialogHeader>

                    <ClientForm
                        initialValues={{ country_code: defaultCountry }}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        onCancel={() => setOpen(false)}
                        submitLabel="Create client"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}