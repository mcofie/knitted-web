"use client";

import {useState} from "react";
import {createClientBrowser} from "@/lib/supabase/browser";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function LoginClient() {
    const sb = createClientBrowser();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);

    async function signIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const {error} = await sb.auth.signInWithPassword({email, password: pwd});
        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            window.location.href = "/dashboard";
        }
    }

    async function signInGoogle() {
        const {error} = await sb.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
                queryParams: {access_type: 'offline', prompt: 'consent'},
            },
        });
        if (error) alert(error.message);
    }

    return (
        <main className="min-h-screen grid place-items-center p-6">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={signIn} className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pwd">Password</Label>
                            <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}/>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    {/*<Button variant="outline" className="w-full" onClick={signInGoogle}>*/}
                    {/*    Continue with Google*/}
                    {/*</Button>*/}

                    <button
                        onClick={signInGoogle}
                        className="w-full max-w-sm text-center mx-auto"
                        style={{
                            display: 'flex', gap: 10, alignItems: 'center',
                            border: '1px solid rgba(0,0,0,.12)', borderRadius: 8,
                            padding: '10px 14px', background: '#fff'
                        }}
                    >
                        {/* Google "G" SVG */}
                        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                            <path fill="#FFC107"
                                  d="M43.6 20.5H42V20H24v8h11.3C33.7 31.7 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.8 5.1 29.1 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.1-.4-3.5z"/>
                            <path fill="#FF3D00"
                                  d="M6.3 14.7l6.6 4.8C14.8 16.6 19 13 24 13c3 0 5.7 1.1 7.7 3l5.7-5.7C33.8 5.1 29.1 3 24 3 15.3 3 7.9 8.1 6.3 14.7z"/>
                            <path fill="#4CAF50"
                                  d="M24 45c5.2 0 10-1.9 13.6-5.2l-6.3-5.3c-2 1.4-4.6 2.5-7.3 2.5-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C7.9 39.9 15.3 45 24 45z"/>
                            <path fill="#1976D2"
                                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.5-4.4 6-8.3 6-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C11.5 36.9 17.3 41 24 41c10.5 0 20-7.6 20-21 0-1.3-.1-2.1-.4-3.5z"/>
                        </svg>
                        <span style={{fontWeight: 600}}>Continue with Google</span>
                    </button>
                </CardFooter>
            </Card>
        </main>
    );
}