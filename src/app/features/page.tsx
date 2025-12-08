import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Users,
    Scissors,
    FileText,
    CreditCard,
    BarChart3,
    Globe,
    Check,
    Sparkles,
    Smartphone
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Features | Knitted',
    description: 'Explore the complete toolkit for modern tailors: Client Management, Order Tracking, Invoicing, Analytics, and Client Portal.',
};

export default function FeaturesPage() {
    return (
        <main className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
                <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                        <span>The Complete Toolkit</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-5xl mx-auto">
                        Everything you need to run a <br className="hidden md:block" />
                        <span className="text-primary">world-class atelier</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Replace your spreadsheets, notebooks, and mental math with one cohesive operating system designed specifically for custom tailoring.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="rounded-full px-8 text-base h-12">
                                Start Your Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature 1: Client Management */}
            <section className="py-20 bg-muted/30 border-y border-border/40">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Client Management & Measurements</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Never ask for the same measurement twice. Store comprehensive profiles for every client, including body measurements, style preferences, and purchase history.
                            </p>
                            <ul className="space-y-3 mt-4">
                                {[
                                    'Detailed body profiles (Neck, Chest, Waist, etc.)',
                                    'Style preferences & fit notes',
                                    'Complete order history',
                                    'One-click contact via WhatsApp or Email'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-foreground/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10 p-8 flex items-center justify-center">
                                {/* Placeholder for UI visual */}
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-full bg-background shadow-lg mb-2">
                                        <Scissors className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-mono">Measurements stored securely</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: Orders & Tracking */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-bl from-orange-500/5 to-red-500/5 border border-orange-500/10 p-8 flex items-center justify-center">
                                {/* Placeholder for UI visual */}
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-full bg-background shadow-lg mb-2">
                                        <FileText className="h-8 w-8 text-orange-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-mono">Visual workflow stages</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Order Tracking & Workflow</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Visualize your entire production line. From &quot;Measurements Taken&quot; to &quot;Ready for Pickup,&quot; know exactly where every garment stands in the process.
                            </p>
                            <ul className="space-y-3 mt-4">
                                {[
                                    'Kanban-style status board',
                                    'Due date alerts and reminders',
                                    'Material requirements tracking',
                                    'Assign tasks to team members'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-foreground/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 3: Finance */}
            <section className="py-20 bg-muted/30 border-y border-border/40">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Invoicing & Payments</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Professional invoices generated in seconds. optimal for getting paid faster and keeping your books balanced without the headache.
                            </p>
                            <ul className="space-y-3 mt-4">
                                {[
                                    'Instant PDF invoice generation',
                                    'Deposit and balance tracking',
                                    'Send invoices directly to clients',
                                    'Support for multiple currencies'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-foreground/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 p-8 flex items-center justify-center">
                                {/* Placeholder for UI visual */}
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-full bg-background shadow-lg mb-2">
                                        <FileText className="h-8 w-8 text-green-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-mono">Professional Invoices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 4: Analytics */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-purple-500/5 to-pink-500/5 border border-purple-500/10 p-8 flex items-center justify-center">
                                {/* Placeholder for UI visual */}
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-full bg-background shadow-lg mb-2">
                                        <BarChart3 className="h-8 w-8 text-purple-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-mono">Revenue Trends</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Analytics & Growth</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Make data-driven decisions. Understand which items sell best, identify your top clients, and watch your monthly revenue grow.
                            </p>
                            <ul className="space-y-3 mt-4">
                                {[
                                    'Monthly and yearly revenue charts',
                                    'Order volume trends',
                                    'Best-selling items analysis',
                                    'Client retention metrics'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-foreground/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 5: Client Portal */}
            <section className="py-20 bg-primary/5 border-y border-primary/10">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-background px-3 py-1 text-sm font-medium text-primary mb-6">
                            <Sparkles className="w-3 h-3 mr-2" />
                            <span>New Feature</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Client Portal 2.0</h2>
                        <p className="text-lg text-muted-foreground">
                            Give your clients a premium digital experience. Allow them to log in, view their order status, see sketches, and approve measurements from their phone.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col items-center text-center">
                            <div className="mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Globe className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Status Updates</h3>
                            <p className="text-muted-foreground text-sm">Clients can check if their suit is ready without calling you.</p>
                        </div>
                        <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col items-center text-center">
                            <div className="mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <FileText className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Digital Invoices</h3>
                            <p className="text-muted-foreground text-sm">They can view and download past invoices anytime.</p>
                        </div>
                        <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col items-center text-center">
                            <div className="mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Smartphone className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Mobile Optimized</h3>
                            <p className="text-muted-foreground text-sm">Works perfectly on their iPhone or Android device.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Experience the difference today</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join hundreds of tailors who have upgraded their business with Knitted.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="rounded-full px-8 text-base h-12">
                                Get Started for Free
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12">
                                Schedule Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
