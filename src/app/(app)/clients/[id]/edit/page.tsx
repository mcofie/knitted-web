import { createClientServer } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
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
        <div className="max-w-3xl mx-auto py-10 space-y-8">
            {/* --- Top Navigation --- */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" asChild>
                        <Link href={`/clients/${client.id}`}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/clients/${client.id}`}>{displayName}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Client</h1>
                <p className="text-muted-foreground">
                    Update client information or delete this client.
                </p>
            </div>

            <EditClientForm clientId={client.id} initialValues={client} />
        </div>
    );
}
