import './globals.css';
import PageLoader from "@/components/ui/page-loader";
import {Suspense} from "react";


export const metadata = {
    title: 'Knitted',
    manifest: '/manifest.json',
    icons: {icon: '/icons/icon-192.png', apple: '/icons/icon-192.png'},
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (<html lang="en">
    <body><Suspense fallback={null}><PageLoader/></Suspense>{children}</body>
    </html>);
}