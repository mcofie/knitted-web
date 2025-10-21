/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const SUPABASE_HOST = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: !isProd,
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|webp|ico)/,
            handler: 'CacheFirst',
            options: {cacheName: 'images', expiration: {maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30}},
        },
        {
            urlPattern: /^https:\/\/.*supabase\.co\/storage\/v1\/object\/sign\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {cacheName: 'supabase-signed'},
        },
    ],
});

const nextConfig = {
    images: {
        remotePatterns: [
            {protocol: "https", hostname: SUPABASE_HOST, pathname: "/storage/v1/object/**"},
        ],
    },
};


module.exports = withPWA({
    reactStrictMode: true,
    experimental: {typedRoutes: true},
});

module.exports = nextConfig;
