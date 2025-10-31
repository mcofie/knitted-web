"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase/browser";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginClient() {
    const sb = createClientBrowser();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function signIn(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const { error } = await sb.auth.signInWithPassword({ email, password: pwd });
        setLoading(false);
        if (error) {
            setErr(error.message);
        } else {
            window.location.href = "/dashboard";
        }
    }

    async function signInGoogle() {
        setErr(null);
        const { error } = await sb.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo:
                    typeof window !== "undefined"
                        ? `${window.location.origin}/auth/callback`
                        : undefined,
                queryParams: { access_type: "offline", prompt: "consent" },
            },
        });
        if (error) setErr(error.message);
    }

    return (
        <main className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(ellipse_at_top,theme(colors.muted.DEFAULT)_0%,transparent_45%)]">
            <Card className="w-full max-w-md border-border/60 shadow-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Sign in to continue to Knitted</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Error banner */}
                    {err && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {err}
                        </div>
                    )}

                    <form onSubmit={signIn} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="pwd">Password</Label>
                            <div className="relative">
                                <Input
                                    id="pwd"
                                    type={showPwd ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className="absolute inset-y-0 right-0 grid place-items-center px-3 text-muted-foreground hover:text-foreground"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                    <Link href="/reset" className="hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
                        </div>
                    </div>

                    {/* Google button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={signInGoogle}
                        disabled={loading}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                            className="mr-2"
                        >
                            <path
                                fill="#FFC107"
                                d="M43.6 20.5H42V20H24v8h11.3C33.7 31.7 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.8 5.1 29.1 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.1-.4-3.5z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.3 14.7l6.6 4.8C14.8 16.6 19 13 24 13c3 0 5.7 1.1 7.7 3l5.7-5.7C33.8 5.1 29.1 3 24 3 15.3 3 7.9 8.1 6.3 14.7z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24 45c5.2 0 10-1.9 13.6-5.2l-6.3-5.3c-2 1.4-4.6 2.5-7.3 2.5-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C7.9 39.9 15.3 45 24 45z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.5-4.4 6-8.3 6-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C11.5 36.9 17.3 41 24 41c10.5 0 20-7.6 20-21 0-1.3-.1-2.1-.4-3.5z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </CardContent>

                <CardFooter className="justify-center text-xs text-muted-foreground">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="ml-1 text-primary hover:underline">
                        Create one
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}