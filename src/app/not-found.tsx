// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-[60vh] grid place-items-center p-8">
            <div className="text-center space-y-3">
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
                    >
                        Go home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}