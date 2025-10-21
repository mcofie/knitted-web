import {createClientServer} from '@/lib/supabase/server';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';

type Row = { d: string; revenue: number; orders: number; overdue: number };

export default async function ReportsPage() {
    const sb = createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    const uid = user!.id;

    let data: Row[] | null = null;
    // let error: any = null;

    // Simple server-side aggregation (last 90 days)
    try {
        const res = await sb.rpc('knitted_report_overview', {
            p_owner: uid,
            p_days: 90,
        });
        data = res.data;
        // error = res.error;
    } catch (err) {
        console.error('RPC failed:', err);
        // error = err;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-lg font-semibold">Reports</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card><CardHeader className="pb-2"><CardTitle>Revenue (last 90d)</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {sum(data, 'revenue').toFixed(2)}
                    </CardContent></Card>

                <Card><CardHeader className="pb-2"><CardTitle>Orders</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {sum(data, 'orders')}
                    </CardContent></Card>

                <Card><CardHeader className="pb-2"><CardTitle>Overdue</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {sum(data, 'overdue')}
                    </CardContent></Card>
            </div>

            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Daily breakdown</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        {data ? data.map((r) => (
                            <div key={r.d} className="flex justify-between">
                                <span>{r.d}</span>
                                <span>Revenue: {r.revenue.toFixed(2)} · Orders: {r.orders} · Overdue: {r.overdue}</span>
                            </div>
                        )) : 'No data'}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function sum(data: Row[] | null, key: keyof Row) {
    if (!data) return 0;
    return data.reduce((s, r) => s + Number(r[key] ?? 0), 0);
}