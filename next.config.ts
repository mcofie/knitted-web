import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}
const SUPABASE_HOST = new URL(SUPABASE_URL).hostname;

const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https" as const, hostname: SUPABASE_HOST, pathname: "/storage/v1/object/**" },
            {
                protocol: "https" as const,
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https" as const,
                hostname: "i.pravatar.cc",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https" as const,
                hostname: "developer.apple.com",
                port: "",
                pathname: "/**",
            },
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    reactStrictMode: true,
    typedRoutes: false,
};

export default withPWA({
    dest: 'public',
    disable: !isProd,
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|webp|ico)/,
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } },
        },
        {
            urlPattern: /^https:\/\/.*supabase\.co\/storage\/v1\/object\/sign\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'supabase-signed' },
        },
    ],
})(nextConfig);
