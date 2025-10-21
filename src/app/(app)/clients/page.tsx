import Link from "next/link";
import { createClientServer } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ClientsPageActions from "./ClientsPageActions";
import ClientsPager from "@/app/(app)/clients/pager";

export const dynamic = "force-dynamic";

// In newer Next, searchParams is async in RSC. Await it before use.
type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function ClientsPage({ searchParams }: { searchParams: SearchParams }) {
    const sb = await createClientServer();

    // auth
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
        return <div className="p-6">Not signed in</div>;
    }
    const uid = user.id;

    // await the params first
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const pageSize = Math.min(100, Math.max(6, Number(sp.pageSize ?? 12)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // fetch clients with total count
    const { data: clients, error, count } = await sb
        .schema("knitted")
        .from("customers")
        .select("id, full_name, name, phone, email, city, country_code", { count: "exact" })
        .eq("owner", uid)
        .order("full_name")
        .range(from, to);

    if (error) return <div className="p-6">Error: {error.message}</div>;

    const total = count ?? 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Clients</h1>
                <ClientsPageActions />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {clients?.map((c) => (
                    <Card key={c.id} className="hover:bg-muted/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                <Link href={`/clients/${c.id}`} className="hover:underline">
                                    {c.full_name ?? c.name}
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
                            <div>{c.email ?? "—"}</div>
                            <div>{c.phone ?? "—"}</div>
                            <div>
                                {c.city ?? "—"} {c.country_code ? `• ${c.country_code}` : ""}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {clients?.length === 0 && (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            No clients yet. Add your first one.
                        </CardContent>
                    </Card>
                )}
            </div>

            <ClientsPager page={page} pageSize={pageSize} total={total} />
        </div>
    );
}