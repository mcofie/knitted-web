// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Use in Server Components (RSC) ONLY.
 * Reads session from cookies; DO NOT modify cookies here.
 */
export async function createClientServer() {
    const store = await cookies(); // <-- await it
    return createServerClient(url, key, {
        cookies: {
            get(name: string) {
                return store.get(name)?.value;
            },
            // No-ops in RSC to avoid "Cookies can only be modified..." error
            set(_name: string, _value: string, _options: CookieOptions) {},
            remove(_name: string, _options: CookieOptions) {},
        },
    });
}

/**
 * Use ONLY inside Server Actions or Route Handlers,
 * where cookie mutations are allowed.
 */
export async function createClientAction() {
    const store = await cookies(); // <-- await it
    return createServerClient(url, key, {
        cookies: {
            get(name: string) {
                return store.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                store.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
                // Next’s cookies() lacks .delete; set expired cookie instead
                store.set({ name, value: "", ...options, expires: new Date(0) });
            },
        },
    });
}