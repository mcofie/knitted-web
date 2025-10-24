'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabase/browser';

export default function CallbackClient() {
    const router = useRouter();
    const search = useSearchParams();
    const [msg, setMsg] = useState('Signing you in…');

    useEffect(() => {
        const code = search.get('code');
        const error = search.get('error_description');

        (async () => {
            if (error) {
                setMsg(error);
                return;
            }
            if (!code) {
                setMsg('No auth code found.');
                return;
            }
            const sb = createClientBrowser();
            const { error: exErr } = await sb.auth.exchangeCodeForSession(code);
            if (exErr) setMsg(exErr.message);
            else router.replace('/'); // or '/onboard'
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, router]);

    return <p style={{ padding: 24 }}>{msg}</p>;
}