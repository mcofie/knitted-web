import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: 'Login',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <LoginClient />
        </Suspense>
    );
}