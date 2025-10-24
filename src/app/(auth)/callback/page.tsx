import {Suspense} from 'react';
import CallbackClient from '@/app/(auth)/callback/CallbackClient';

// tell Next this page is dynamic and must not be prerendered
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<p style={{padding: 24}}>Signing you in…</p>}>
            <CallbackClient/>
        </Suspense>
    );
}