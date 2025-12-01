import React from 'react';
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import WebAppScreens from '@/components/landing/web-app-screen';
import Testimonials from '@/components/landing/testimonials';
import CTA from '@/components/landing/cta';
import Pricing from '@/components/landing/pricing';
import FAQ from '@/components/landing/faq';
import Footer from '@/components/landing/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Knitted — The OS for Tailors',
    description: 'The modern operating system for forward-thinking ateliers. Manage clients, measurements, and orders with elegance and precision.',
};

export default function LandingPage() {
    return (
        <main className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/20">
            <Navbar />
            <Hero />
            <Features />
            <WebAppScreens />
            <Testimonials />
            <Pricing />
            <FAQ />
            <CTA />
            <Footer />
        </main>
    );
}