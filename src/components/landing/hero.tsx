import {Button} from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="flex flex-col items-center text-center py-24 px-6">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                Manage your tailoring business with ease.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Track clients, orders, payments, and measurements—everything in one workspace.
            </p>
            <Link href="/signup"><Button size="lg">Get Started for Free</Button></Link>
        </section>
    );
}