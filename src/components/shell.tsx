'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {createClientBrowser} from '@/lib/supabase/browser';

const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clients', label: 'Clients' },
    { href: '/orders', label: 'Orders' },
    // { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
];

export default function Shell({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const sb = createClientBrowser();

    async function signOut() {
        await sb.auth.signOut();
        window.location.href = '/login';
    }

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-40 bg-background">
                <div className="container mx-auto flex items-center justify-between h-14 px-4">
                    <Link href="/dashboard" className="font-semibold">Knitted</Link>
                    <nav className="flex gap-4">
                        {links.map(l => (
                            <Link key={l.href} href={l.href}
                                  className={`text-sm ${pathname === l.href ? 'font-semibold' : 'text-muted-foreground'}`}>
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                    <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
                </div>
                <Separator/>
            </header>
            <main className="container mx-auto p-4">{children}</main>
        </div>
    );
}