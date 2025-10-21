"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase/browser";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginClient() {
    const sb = createClientBrowser();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);

    async function signIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await sb.auth.signInWithPassword({ email, password: pwd });
        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            window.location.href = "/dashboard";
        }
    }

    async function signInGoogle() {
        const { error } = await sb.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
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
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pwd">Password</Label>
                            <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={signInGoogle}>
                        Continue with Google
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}