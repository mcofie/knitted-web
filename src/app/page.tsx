import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between px-6 py-4">
                <Link href="/" className="font-semibold text-lg">Knitted</Link>
                <div className="flex gap-3">
                    <Link href="/login"><Button variant="ghost">Login</Button></Link>
                    <Link href="/signup"><Button>Sign up</Button></Link>
                </div>
            </header>
            <Hero />
            <Separator className="my-8" />
            <Features />
            <Footer />
        </main>
    );
}