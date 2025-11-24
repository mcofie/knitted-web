import Link from "next/link";
import Image from "next/image";
import {Suspense} from "react";
import {createClientServer} from "@/lib/supabase/server";
import {MapPin, Phone, Users} from "lucide-react"; // Removed unused SearchX

import ClientsPageActions from "./ClientsPageActions";
import ClientsPager from "@/app/(app)/clients/pager";
import {Button} from "@/components/ui/button";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function ClientsPage({searchParams}: { searchParams: SearchParams }) {
    const sb = await createClientServer();

    // Auth Check
    const {data: {user}} = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Access Denied</h2>
                    <p className="text-muted-foreground">Please sign in to view your clients.</p>
                </div>
            </div>
        );
    }

    const uid = user.id;

    // Parse Params
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(6, Number(sp.pageSize ?? 12))); // Adjusted default pageSize
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Data Fetching
    const {data: clients, error, count} = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code", {count: "exact"})
        .eq("owner", uid)
        .order("full_name")
        .range(from, to);

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                Error loading clients: {error.message}
            </div>
        );
    }

    const total = count ?? 0;
    const hasClients = clients && clients.length > 0;

    return (
        <Suspense fallback={<ClientsLoadingSkeleton/>}>
            <div className="space-y-8 pb-10">

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your customer directory and details.
                        </p>
                    </div>
                    <ClientsPageActions/>
                </div>

                {/* Content Section */}
                {!hasClients ? (
                    <EmptyState/>
                ) : (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {clients.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/clients/${c.id}`}
                                    className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                                >
                                    {/* Avatar & Name */}
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-background group-hover:ring-primary/20 transition-all">
                                            <Image
                                                src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c?.name || "Guest")}`}
                                                alt={c?.name || "Avatar"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {c.name || "Unknown Name"}
                                            </h3>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {c.full_name !== c.name ? c.full_name : "Customer"}
                                            </p>
                                        </div>
                                    </div>

                                    <hr className="my-4 border-border/50"/>

                                    {/* Details */}
                                    <div className="mt-auto space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5 opacity-70"/>
                                            <span className="truncate">{c.phone || "No phone number"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5 opacity-70"/>
                                            <span className="truncate">
                        {[c.city, c.country_code].filter(Boolean).join(", ") || "No location"}
                      </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="pt-4">
                            <ClientsPager page={page} pageSize={pageSize} total={total}/>
                        </div>
                    </>
                )}
            </div>
        </Suspense>
    );
}

// --- Sub Components ---

function EmptyState() {
    return (
        <div
            className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-muted/5 p-8 text-center animate-in fade-in-50">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm mb-4">
                <Users className="h-10 w-10 text-muted-foreground"/>
            </div>
            <h3 className="text-lg font-semibold">No clients found</h3>
            <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
                You haven&apos;t added any clients yet. Start building your directory to track measurements and orders.
            </p>

            <div className="opacity-50 pointer-events-none">
                <Button variant="outline">Use the &apos;Add Client&apos; button above</Button>
            </div>
        </div>
    );
}

function ClientsLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-32 animate-pulse rounded-md bg-muted"/>
                    <div className="h-4 w-64 animate-pulse rounded-md bg-muted"/>
                </div>
                <div className="h-10 w-28 animate-pulse rounded-md bg-muted"/>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-48 animate-pulse rounded-xl border bg-muted/30"/>
                ))}
            </div>
        </div>
    );
}