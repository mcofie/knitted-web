"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Scissors } from "lucide-react";

export default function LoginClient() {
    const sb = createClientBrowser();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function signInWithEmail(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const { error } = await sb.auth.signInWithPassword({ email, password: pwd });
        setLoading(false);
        if (error) {
            setErr(error.message);
            toast.error("Login failed", { description: error.message });
        } else {
            toast.success("Welcome back");
            window.location.href = "/dashboard";
        }
    }

    async function signInGoogle() {
        setErr(null);
        setLoading(true);
        try {
            await sb.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
        } catch (error: any) {
            setErr("Google login failed.");
            toast.error("Google login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-accent/20">
            <div className="w-full max-w-sm space-y-12">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-center gap-4 group">
                    <Scissors className="w-8 h-8 text-foreground stroke-[1.5]" />
                    <span className="text-2xl font-normal tracking-tight text-foreground font-serif text-center">
                        knitted
                    </span>
                </Link>

                <div className="space-y-2 text-center">
                    <h1 className="text-4xl text-foreground font-serif">Welcome back</h1>
                    <p className="text-muted-foreground font-sans">
                        Continue to your workshop.
                    </p>
                </div>

                <form onSubmit={signInWithEmail} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-medium text-foreground/60 uppercase tracking-widest ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@atelier.com"
                                className="h-12 bg-transparent border-border focus:border-foreground transition-all rounded-full px-6"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-xs font-medium text-foreground/60 uppercase tracking-widest">Password</Label>
                                <Link href="/reset" className="text-xs font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPwd ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 bg-transparent border-border focus:border-foreground transition-all rounded-full px-6 pr-12"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {err && (
                        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center font-medium">
                            {err}
                        </div>
                    )}

                    <Button
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-background px-4 text-muted-foreground font-medium">or</span></div>
                </div>

                <Button
                    onClick={signInGoogle}
                    variant="outline"
                    disabled={loading}
                    className="w-full h-12 rounded-full border-border hover:bg-muted font-medium transition-all"
                >
                    <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </Button>

                <p className="text-center text-sm text-muted-foreground font-medium">
                    Don&apos;t have an account? <Link href="/signup" className="text-foreground hover:underline">Join free</Link>
                </p>
            </div>
        </div>
    );
}