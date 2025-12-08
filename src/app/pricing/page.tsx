import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import Pricing from '@/components/landing/pricing';
import FAQ from '@/components/landing/faq';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing | Knitted',
    description: 'Simple, transparent pricing for ateliers of all sizes. Start for free and upgrade as you grow.',
};

export default function PricingPage() {
    return (
        <main className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/20">
            <Navbar />
            <div className="pt-20">
                <Pricing />
                <FAQ />
            </div>
            <Footer />
        </main>
    );
}
