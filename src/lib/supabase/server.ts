// server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Use in Server Components (RSC) ONLY.
 * Read session from cookies; DO NOT attempt to modify cookies here.
 */
export function createClientServer() {
    const store = cookies();
    return createServerClient(url, key, {
        cookies: {
            get(name: string) {
                return store.get(name)?.value;
            },
            // No-ops to avoid "Cookies can only be modified..." error in RSC
            set(_name: string, _value: string, _options: CookieOptions) {/* noop */},
            remove(_name: string, _options: CookieOptions) {/* noop */},
        },
    });
}

/**
 * Use ONLY inside Server Actions or Route Handlers,
 * where cookie mutations are allowed.
 */
export function createClientAction() {
    const store = cookies();
    return createServerClient(url, key, {
        cookies: {
            get(name: string) {
                return store.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                store.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
                // Next’s cookies() has no .delete, so set empty value with expires in past
                store.set({ name, value: "", ...options, expires: new Date(0) });
            },
        },
    });
}