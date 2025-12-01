import './globals.css';
import PageLoader from "@/components/ui/page-loader";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";


export const metadata = {
    title: {
        template: '%s | Knitted',
        default: 'Knitted — The OS for Tailors',
    },
    description: 'The modern operating system for forward-thinking ateliers. Manage clients, measurements, and orders with elegance and precision.',
    manifest: '/manifest.json',
    icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://getknitted.app',
        siteName: 'Knitted',
        title: 'Knitted — The OS for Tailors',
        description: 'Manage clients, measurements, and orders with elegance and precision.',
        images: [
            {
                url: '/og-image.png', // Ensure this exists or use a placeholder
                width: 1200,
                height: 630,
                alt: 'Knitted Dashboard',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Knitted — The OS for Tailors',
        description: 'Manage clients, measurements, and orders with elegance and precision.',
        images: ['/og-image.png'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (<html lang="en">
        <body>
            <Suspense fallback={null}><PageLoader /></Suspense>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </body>

    </html>);
}