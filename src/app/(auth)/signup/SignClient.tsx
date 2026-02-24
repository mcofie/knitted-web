"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Coffee, Heart, Sparkles } from "lucide-react";

export default function SignClient() {
    const sb = createClientBrowser();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function signUpWithEmail(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const { error } = await sb.auth.signUp({
            email,
            password: pwd,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        setLoading(false);
        if (error) {
            setErr(error.message);
            toast.error("Uh oh! We couldn't create your account.", { description: error.message });
        } else {
            toast.success("Welcome aboard! Check your email to verify your atelier.");
        }
    }

    async function signInGoogle() {
        const { error } = await sb.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            setErr(error.message);
            toast.error("Google auth had a hiccup.");
        }
    }

    return (
        <div className="relative min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden transition-colors duration-500">
            {/* Playful Background Shapes */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 grid-pattern" />
            </div>

            {/* Right Side - The 'Brand Love' Panel */}
            <div className="relative hidden lg:flex flex-col p-16 z-10 border-l-8 border-muted/30 lg:order-last transition-colors">
                <Link href="/" className="flex items-center gap-2 group mb-24 justify-end">
                    <span className="text-xl font-black tracking-tight text-foreground">knitted</span>
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-btn transform group-hover:-rotate-12 transition-transform">
                        <Coffee className="w-5 h-5 text-primary-foreground fill-current" />
                    </div>
                </Link>

                <div className="mt-auto max-w-md ml-auto text-right">
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 rotate-[-6deg] ml-auto shadow-flat">
                        <Sparkles className="w-10 h-10 text-accent-foreground fill-current" />
                    </div>
                    <h2 className="text-6xl font-black text-foreground mb-8 leading-[0.95] tracking-tighter text-balance">
                        Start your <br />
                        <span className="text-primary italic text-7xl">dream atelier.</span>
                    </h2>
                    <p className="text-muted-foreground text-xl font-bold leading-relaxed mb-10">
                        Join 2,400+ creators and master tailors managing their workshops with a smile.
                    </p>
                    <div className="flex items-center gap-4 py-4 px-6 bg-card border-4 border-muted/50 rounded-[2rem] shadow-premium justify-end">
                        <span className="text-sm font-black text-foreground uppercase tracking-widest">Free for your first 10 clients</span>
                        <Heart className="w-6 h-6 text-pink-500 fill-current" />
                    </div>
                </div>
            </div>

            {/* Left Side - The Registration Portal */}
            <div className="flex items-center justify-center p-8 z-10">
                <div className="w-full max-w-[440px] space-y-12">
                    <div className="text-center lg:text-left space-y-4">
                        <div className="lg:hidden flex justify-center mb-10">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-btn border-4 border-foreground">
                                <Coffee className="w-8 h-8 text-primary-foreground fill-current" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Create your portal</h1>
                        <p className="text-lg text-muted-foreground font-bold tracking-tight text-balance">
                            It takes less than a minute. Let&apos;s build something beautiful.
                        </p>
                    </div>

                    <form onSubmit={signUpWithEmail} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-xs uppercase font-black tracking-widest text-muted-foreground ml-2">Your Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="founder@workshop.com"
                                    className="h-16 bg-card border-4 border-muted text-foreground placeholder:text-muted-foreground/30 focus:border-primary focus:ring-primary/20 rounded-[2rem] px-8 text-lg font-bold transition-all shadow-flat"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-xs uppercase font-black tracking-widest text-muted-foreground ml-2">Choose a safe password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPwd ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-16 bg-card border-4 border-muted text-foreground placeholder:text-muted-foreground/30 focus:border-primary focus:ring-primary/20 rounded-[2rem] px-8 pr-16 text-lg font-bold transition-all shadow-flat"
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPwd(!showPwd)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-colors"
                                    >
                                        {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {err && (
                            <div className="p-6 rounded-[2rem] bg-red-500/10 border-4 border-red-500/20 text-red-500 text-sm font-black text-center">
                                {err}
                            </div>
                        )}

                        <Button
                            disabled={loading}
                            className="w-full h-16 bg-primary text-primary-foreground text-xl font-black rounded-full shadow-btn hover:translate-y-[-4px] hover:shadow-[0_10px_0_rgba(0,0,0,0.1)] active:translate-y-[0px] active:shadow-none transition-all"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start my free atelier"}
                        </Button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-8 border-muted/30" /></div>
                        <div className="relative flex justify-center text-xs font-black uppercase tracking-widest transition-colors duration-500"><span className="bg-background px-6 text-muted-foreground">Quick Start</span></div>
                    </div>

                    <Button
                        onClick={signInGoogle}
                        variant="outline"
                        disabled={loading}
                        className="w-full h-16 bg-card border-4 border-muted text-foreground text-lg font-black rounded-full hover:bg-secondary transition-all shadow-flat"
                    >
                        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Join with Google
                    </Button>

                    <p className="text-center text-sm text-muted-foreground font-bold">
                        Already have an atelier? <Link href="/login" className="text-primary hover:underline decoration-4">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}