import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Scissors, Ruler, Users, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | Knitted',
    description: 'Learn about the mission, values, and team behind Knitted - the operating system for modern tailors.',
};

export default function AboutPage() {
    return (
        <main className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                        <span>Our Story</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
                        We&apos;re stitching together the future of <span className="text-primary">custom tailoring</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Knitted is more than just software. It&apos;s a movement to empower artisans, streamline ateliers, and preserve the art of bespoke craftsmanship in a digital age.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Grid */}
            <section className="py-20 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl blur-2xl opacity-70" />
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card aspect-[4/3]">
                                {/* Using a placeholder for now, would be a real image of a tailor or the team */}
                                <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                                    <Scissors className="w-24 h-24 text-primary/40" />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    To provide tailors and fashion designers with the same caliber of tools that big tech companies use. We believe that organization and efficiency shouldn&apos;t come at the cost of creativity.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Ruler className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Precision First</h3>
                                        <p className="text-muted-foreground">Every millimeter counts in tailoring. Our software reflects that obsession with accuracy.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Client Centric</h3>
                                        <p className="text-muted-foreground">It&apos;s all about the relationship between the tailor and the client. We make that bond stronger.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Built with Love</h3>
                                        <p className="text-muted-foreground">We understand the hustle. Knitted is built by people who admire the craft.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* CTA Section */}
            <section className="py-20 border-t border-border/50">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to modernize your atelier?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join the community of forward-thinking tailors who are scaling their business with Knitted.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="rounded-full px-8 text-base h-12">
                                Get Started for Free
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
