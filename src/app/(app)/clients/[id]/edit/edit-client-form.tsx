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
        } catch (e) {
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
        } catch (e) {
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
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-md shadow-sm p-8"
            >
                <ClientForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isSubmitting={isSaving}
                    submitLabel="Save changes"
                    onCancel={() => router.back()}
                />
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8"
            >
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-destructive text-lg">Delete Client</h3>
                        <p className="text-sm text-muted-foreground">
                            Permanently remove this client and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting || isSaving}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete Client"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the client
                                    <strong> {initialValues.full_name}</strong> and remove their data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete();
                                    }}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </motion.div>
        </motion.div>
    );
}
