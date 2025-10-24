// app/auth/callback/page.tsx
'use client';
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {createClientBrowser} from '@/lib/supabase/browser';


export default function AuthCallback() {
    const router = useRouter();
    const search = useSearchParams();
    const [msg, setMsg] = useState('Signing you in…');
    const sb = createClientBrowser();


    useEffect(() => {
        const code = search.get('code');
        const error = search.get('error_description');

        (async () => {
            if (error) {
                setMsg(error);
                return;
            }
            if (code) {
                const {error: exErr} = await sb.auth.exchangeCodeForSession(code);
                if (exErr) setMsg(exErr.message);
                else router.replace('/'); // or /onboard route if needed
            } else {
                setMsg('No auth code found.');
            }
        })();
    }, [search, router]);

    return <p style={{padding: 24}}>{msg}</p>;
}