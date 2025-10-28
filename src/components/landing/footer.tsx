import Link from 'next/link';

export function Footer() {
    return (
        <footer className="mt-auto py-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Knitted. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
                <Link href="/terms">Terms</Link>
                <Link href="/privacy/Page">Privacy</Link>
            </div>
        </footer>
    );
}