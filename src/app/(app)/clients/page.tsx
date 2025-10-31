import Link from "next/link";
import {createClientServer} from "@/lib/supabase/server";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import ClientsPageActions from "./ClientsPageActions";
import ClientsPager from "@/app/(app)/clients/pager";
import {Suspense} from "react";
import Image from "next/image";



export const dynamic = "force-dynamic";

// In newer Next, searchParams is async in RSC. Await it before use.
type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function ClientsPage({searchParams}: { searchParams: SearchParams }) {
    const sb = await createClientServer();


    // auth
    const {data: {user}} = await sb.auth.getUser();
    if (!user) {
        return <div className="p-6">Not signed in</div>;
    }
    const uid = user.id;

    // await the params first
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(6, Number(sp.pageSize ?? 24)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // fetch clients with total count
    const {data: clients, error, count} = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code", {count: "exact"})
        .eq("owner", uid)
        .order("full_name")
        .range(from, to);

    if (error) return <div className="p-6">Error: {error.message}</div>;

    const total = count ?? 0;

    return (
        <Suspense fallback={null}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Clients</h1>
                    <ClientsPageActions/>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {clients?.map((c) => (

                        <div key={c.id} className="group relative rounded-2xl border border-border bg-card/70 p-6 transition-all duration-300 hover:shadow-md hover:bg-card">
                            <div className="mb-4 flex items-center gap-4">
                                <Image
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c?.name || "Guest")}`}
                                    alt={c?.name || "Avatar"}
                                    width={48}
                                    height={48}
                                    unoptimized
                                    className="rounded-full border border-border bg-muted ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/40"
                                />

                                <div className="flex flex-col">
                                    <Link
                                        href={`/clients/${c.id}`}
                                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                                    >
                                        {c.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                                    <p className="text-xs text-muted-foreground">{c.city}</p>
                                </div>
                            </div>

                            {/* Optional accent or quote */}
                            {/* <blockquote className="text-sm italic text-muted-foreground">“{c.note || 'Reliable client'}”</blockquote> */}

                            {/* Subtle hover indicator */}
                            <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <Link
                                    href={`/clients/${c.id}`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    View
                                </Link>
                            </div>
                        </div>

                    ))}
                    {clients?.length === 0 && (
                        <Card>
                            <CardContent className="py-10 text-center text-muted-foreground">
                                No clients yet. Add your first one.
                            </CardContent>
                        </Card>
                    )}
                </div>

                <ClientsPager page={page} pageSize={pageSize} total={total}/>
            </div>
        </Suspense>
    );
}