import {createClientServer} from '@/lib/supabase/server';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

export default async function DashboardPage() {
    const sb = createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    const uid = user!.id;

    const {data: settings} = await sb
        .schema('knitted').from('account_settings')
        .select('*').eq('owner', uid).maybeSingle();

    // Use your RPC if present
    let stats: any = null;
    try {
        const {data} = await sb.rpc('knitted_dashboard_stats');
        stats = data;
    } catch {
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>{settings?.business_name ?? 'Knitted'}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Currency: {settings?.currency_code ?? 'GHS'} · Unit: {settings?.measurement_unit ?? 'metric'}
                </CardContent>
            </Card>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Stat title="Total Orders" value={stats?.total_orders ?? '-'}/>
                <Stat title="Active" value={<><Badge variant="secondary"
                                                     className="mr-2">Active</Badge>{stats?.active_orders ?? '-'}</>}/>
                <Stat title="Overdue" value={<><Badge variant="destructive"
                                                      className="mr-2">Overdue</Badge>{stats?.overdue_orders ?? '-'}</>}/>
            </div>
        </div>
    );
}

function Stat({title, value}: { title: string; value: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="pb-2"><CardTitle
                className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">{value}</CardContent>
        </Card>
    );
}