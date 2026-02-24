import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { createClientServer } from "@/lib/supabase/server";
import { MapPin, Phone, Users, Plus, Star, Search, Sparkles, Coffee, ChevronRight, UserCircle, Scissors } from "lucide-react";

import ClientsPageActions from "./ClientsPageActions";
import ClientsPager from "@/app/(app)/clients/pager";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Clients | Knitted',
};

type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function ClientsPage({ searchParams }: { searchParams: SearchParams }) {
    const sb = await createClientServer();

    // Auth Check
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-8 bg-background">
                <div className="text-center space-y-6">
                    <UserCircle className="w-20 h-20 text-muted-foreground/20 mx-auto" />
                    <div className="space-y-4">
                        <h2 className="text-4xl font-serif text-foreground">Identity Check</h2>
                        <p className="text-muted-foreground font-sans max-w-sm mx-auto italic">Please authenticate to access your studio&apos;s records.</p>
                    </div>
                    <Button asChild className="btn-primary">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const uid = user.id;

    // Parse Params
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(6, Number(sp.pageSize ?? 12)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Data Fetching
    const { data: clients, error, count } = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code", { count: "exact" })
        .eq("owner", uid)
        .order("full_name")
        .range(from, to);

    if (error) {
        return (
            <div className="rounded-[2rem] bg-destructive/5 p-12 text-center space-y-4 border border-destructive/10">
                <h3 className="text-2xl font-serif text-destructive">Sync Delayed</h3>
                <p className="font-sans text-muted-foreground italic">Error retrieving client dossier: {error.message}</p>
            </div>
        );
    }

    const total = count ?? 0;
    const hasClients = clients && clients.length > 0;

    return (
        <Suspense fallback={<ClientsLoadingSkeleton />}>
            <div className="space-y-12 pb-20 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">{total} Active Records</span>
                        <h1 className="text-6xl font-serif text-foreground">Directory</h1>
                    </div>
                    <div className="flex gap-4">
                        <ClientsPageActions />
                    </div>
                </div>

                {/* Content Section */}
                {!hasClients ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-16">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {clients.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/clients/${c.id}`}
                                    className="group bento-card p-8 flex flex-col justify-between h-[320px] bg-card"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-secondary group-hover:scale-110 transition-transform duration-500">
                                            <Image
                                                src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c?.name || "Guest")}`}
                                                alt={c?.name || "Avatar"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="h-10 w-10 border border-border rounded-full flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-serif text-foreground leading-[1.1] mb-2">
                                                {c.name || "Unknown"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">
                                                <MapPin className="w-3 h-3" />
                                                <span>{c.city || 'Global Atelier'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-accent" />
                                            <span className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground/60">verified stakeholder</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination - Minimalist */}
                        <div className="pt-8 border-t border-border">
                            <ClientsPager page={page} pageSize={pageSize} total={total} />
                        </div>
                    </div>
                )}
            </div>
        </Suspense>
    );
}

// --- Sub Components ---

function EmptyState() {
    return (
        <div className="bento-card bg-secondary/30 min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-background border border-border rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Scissors className="h-8 w-8 text-foreground opacity-20" />
            </div>
            <div className="space-y-6 max-w-sm">
                <h3 className="text-4xl font-serif text-foreground leading-tight">Your workshop is calling.</h3>
                <p className="text-muted-foreground font-sans text-lg leading-relaxed italic">
                    The studio floor is quiet. Add your first client to begin tracking their unique journey.
                </p>
            </div>

            <div className="mt-12">
                <button className="btn-primary min-w-[200px]">
                    Create record
                </button>
            </div>
        </div>
    );
}

function ClientsLoadingSkeleton() {
    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
                <div className="space-y-4">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
                    <div className="h-12 w-64 animate-pulse rounded-2xl bg-muted" />
                </div>
                <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[320px] animate-pulse rounded-[2rem] bg-muted/50" />
                ))}
            </div>
        </div>
    );
}