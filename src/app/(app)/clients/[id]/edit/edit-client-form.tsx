"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ClientForm from "@/components/clients/ClientForm";
import { updateClient, deleteClient, ClientFormValues } from "@/app/(app)/clients/actions";

interface EditClientFormProps {
    clientId: string;
    initialValues: ClientFormValues;
}

export default function EditClientForm({ clientId, initialValues }: EditClientFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function onSubmit(values: ClientFormValues) {
        setIsSaving(true);
        try {
            const result = await updateClient(clientId, values);
            if (result.error) {
                toast.error("Failed to update client", { description: result.error });
                return;
            }
            toast.success("Client updated");
            router.push(`/clients/${clientId}`);
        } catch (_e) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    }

    async function onDelete() {
        setIsDeleting(true);
        try {
            const result = await deleteClient(clientId);
            if (result?.error) {
                toast.error("Failed to delete client", { description: result.error });
                setIsDeleting(false); // Only reset if failed, otherwise we redirect
                return;
            }
            toast.success("Client deleted");
            // Redirect handled in server action
        } catch (_e) {
            toast.error("Something went wrong");
            setIsDeleting(false);
        }
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <div className="space-y-12">
            <div className="bento-card bg-card p-10">
                <ClientForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isSubmitting={isSaving}
                    submitLabel="Save changes"
                    onCancel={() => router.back()}
                />
            </div>

            <div className="bento-card border border-destructive/20 bg-destructive/5 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-destructive leading-tight">Dissolve Record</h3>
                    <p className="text-sm font-sans text-muted-foreground italic max-w-sm">
                        Permanently remove this dossier and all associated data. This action is irreversible.
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" disabled={isDeleting || isSaving} className="h-12 px-8 rounded-full border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-medium text-xs uppercase tracking-widest">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting ? "Dissolving..." : "Delete Record"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem] border border-border p-10 shadow-3xl bg-background">
                        <div className="flex items-center justify-between mb-6">
                            <AlertDialogTitle className="text-3xl font-serif text-foreground leading-tight">Final Confirmation</AlertDialogTitle>
                            <AlertDialogCancel className="h-10 w-10 rounded-full border border-border p-0 flex items-center justify-center hover:bg-muted transition-colors">
                                <span className="sr-only">Close</span>
                                <Trash2 className="w-4 h-4 text-foreground/20" />
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogDescription className="text-lg font-sans text-muted-foreground leading-relaxed italic">
                            This will permanently purge the record of <span className="text-foreground font-medium">{initialValues.full_name}</span>. Every stitch and measurement will be lost to time.
                        </AlertDialogDescription>
                        <AlertDialogFooter className="mt-10 gap-4">
                            <AlertDialogCancel className="h-12 rounded-full font-medium border-border bg-transparent hover:bg-muted text-xs uppercase tracking-widest px-8">Keep Dossier</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete();
                                }}
                                className="btn-primary bg-rose-500 hover:bg-rose-600 border-none h-12 px-8"
                            >
                                {isDeleting ? "Purging..." : "Confirm Purge"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
