import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
    ];

    return (
        <footer className="bg-background relative overflow-hidden pt-24 pb-8">
            {/* Divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-end mb-24">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <span className="text-xl font-bold">K</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Knitted</span>
                        </Link>
                        <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                            The operating system for modern ateliers. <br />
                            Weaving technology into the art of tailoring.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Big Watermark Type */}
                <div className="relative w-full border-t border-border/40 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground mb-8">
                        <p>&copy; {currentYear} Knitted Inc.</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span>All systems operational</span>
                        </div>
                    </div>

                    {/* Massive Text Anchor */}
                    <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-center text-foreground/5 select-none pointer-events-none">
                        KNITTED
                    </h1>
                </div>
            </div>
        </footer>
    );
}