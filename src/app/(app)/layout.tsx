import {redirect} from 'next/navigation';
import {createClientServer} from '@/lib/supabase/server';
import Shell from '@/components/shell';
import {ThemeProvider} from "next-themes";


export default async function AppLayout({children}: { children: React.ReactNode }) {
    const sb = await  createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    if (!user) redirect('/login');
    return (
        <Shell>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </Shell>
    );
}