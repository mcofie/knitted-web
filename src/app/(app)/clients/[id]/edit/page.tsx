import { createClientServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditClientForm from "./edit-client-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default async function EditClientPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClientServer();

    const { data: client } = await supabase
        .schema("knitted")
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (!client) {
        notFound();
    }

    const displayName = client.full_name ?? client.name ?? "Client";

    return (
        <div className="max-w-3xl mx-auto py-20 space-y-12 px-6">
            {/* --- Top Navigation --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/clients/${client.id}`} className="group h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                        <ArrowLeft className="h-4 w-4 text-foreground" />
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                        <Link href="/clients" className="hover:text-foreground">Directory</Link>
                        <span className="opacity-30">/</span>
                        <Link href={`/clients/${client.id}`} className="hover:text-foreground">{displayName}</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-foreground">Editing</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-6xl font-serif text-foreground leading-tight">Edit Record</h1>
                    <p className="text-sm font-sans text-muted-foreground italic">
                        Refine the identification and details for this creator.
                    </p>
                </div>
            </div>

            <EditClientForm clientId={client.id} initialValues={client} />
        </div>
    );
}
