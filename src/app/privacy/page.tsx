import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How Knitted collects, uses, and protects your data across web, iOS, and Android.',
};

export default function PrivacyPage() {
    const lastUpdated = '28 Oct 2025';

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Decorative halo background */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-blue-500/10 blur-3xl dark:from-indigo-400/25 dark:via-purple-400/20 dark:to-blue-400/15" />
            </div>

            <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
                <header className="mb-8">
                    <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                        Knitted Privacy Policy
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        This Privacy Policy explains how <strong>Knitted</strong> (“we”, “us”, “our”)
                        collects, uses, and protects your information when you use our web app and mobile
                        apps on iOS and Android.
                    </p>
                </header>

                {/* Quick navigation */}
                <nav aria-label="Table of contents" className="mb-8 rounded-lg border bg-card p-4 text-sm">
                    <ul className="grid gap-2 md:grid-cols-2">
                        {[
                            ['Information We Collect', '#information-we-collect'],
                            ['How We Use Information', '#how-we-use-information'],
                            ['Legal Bases', '#legal-bases'],
                            ['Data Sharing', '#data-sharing'],
                            ['Analytics & Tracking', '#analytics-and-tracking'],
                            ['Payments', '#payments'],
                            ['Data Retention', '#data-retention'],
                            ['Your Rights', '#your-rights'],
                            ['Security', '#security'],
                            ['Children’s Privacy', '#childrens-privacy'],
                            ['International Transfers', '#international-transfers'],
                            ['Data Deletion & Account Closure', '#data-deletion'],
                            ['Changes to This Policy', '#changes'],
                            ['Contact Us', '#contact'],
                        ].map(([label, href]) => (
                            <li key={href}>
                                <a
                                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                    href={href}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ===================== MAIN CONTENT ===================== */}
                <div className="space-y-10">
                    <section id="information-we-collect" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">1) Information We Collect</h2>
                        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                            <p>
                                We collect information to provide and improve Knitted’s features for tailors,
                                dressmakers, and fashion studios.
                            </p>
                            <ul className="list-inside list-disc space-y-2">
                                <li>
                                    <strong>Account & Profile</strong>: name, email, workspace name, role, and
                                    authentication identifiers (e.g., OAuth IDs).
                                </li>
                                <li>
                                    <strong>Studio Data</strong>: client records, measurements, orders, notes,
                                    and attachments (e.g., photos of sketches or garments).
                                </li>
                                <li>
                                    <strong>Usage & Device</strong>: app interactions, OS version, app version,
                                    crash logs, and approximate region.
                                </li>
                                <li>
                                    <strong>Payments</strong>: subscription billing metadata handled securely
                                    by our payment provider.
                                </li>
                                <li>
                                    <strong>Optional Media Access</strong>: only used when you attach or export
                                    images/PDFs; we never access your library without consent.
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section id="how-we-use-information" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">2) How We Use Information</h2>
                        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                            <li>Provide core tailoring and studio management features.</li>
                            <li>Sync your data securely across web and mobile devices.</li>
                            <li>Handle subscriptions, authentication, and customer support.</li>
                            <li>Improve performance, reliability, and app design.</li>
                            <li>Comply with legal and financial obligations.</li>
                        </ul>
                    </section>

                    <section id="legal-bases" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">3) Legal Bases</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            For users in the EEA/UK, we rely on contract, legitimate interest, consent,
                            and legal obligation as applicable.
                        </p>
                    </section>

                    <section id="data-sharing" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">4) Data Sharing</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            We only share information with trusted service providers:
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                            <li>Hosting & databases</li>
                            <li>Authentication (e.g., Google OAuth)</li>
                            <li>Payments & billing systems</li>
                            <li>Crash & analytics reporting</li>
                        </ul>
                        <p className="mt-3 text-sm text-muted-foreground">
                            We never sell your personal data. Data may be disclosed only if legally required.
                        </p>
                    </section>

                    <section id="analytics-and-tracking" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">5) Analytics & Tracking</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Knitted may use analytics to understand usage patterns and app stability. Cookies
                            are limited to essential features and performance insights.
                        </p>
                    </section>

                    <section id="payments" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">6) Payments</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Payments are processed by secure, PCI-compliant providers. Knitted never stores
                            full payment details.
                        </p>
                    </section>

                    <section id="data-retention" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">7) Data Retention</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            We retain data only as long as necessary to provide our services or as required by law.
                        </p>
                    </section>

                    <section id="your-rights" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">8) Your Rights</h2>
                        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                            <li>Access, update, or delete your data</li>
                            <li>Request data export</li>
                            <li>Withdraw consent</li>
                            <li>Request account deletion</li>
                        </ul>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Contact{' '}
                            <a
                                href="mailto:support@getknitted.app"
                                className="underline underline-offset-4 hover:text-foreground"
                            >
                                support@getknitted.app
                            </a>{' '}
                            for assistance.
                        </p>
                    </section>

                    <section id="security" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">9) Security</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            We use encryption, access controls, and secure data handling practices to protect
                            your information.
                        </p>
                    </section>

                    <section id="childrens-privacy" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">10) Children’s Privacy</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Knitted is not directed at children under 13. We do not knowingly collect data from
                            minors.
                        </p>
                    </section>

                    <section id="international-transfers" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">11) International Transfers</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Data may be processed outside your country with appropriate safeguards in place.
                        </p>
                    </section>

                    <section id="data-deletion" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">12) Data Deletion & Account Closure</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            To delete your account, email{' '}
                            <a
                                href="mailto:support@getknitted.app"
                                className="underline underline-offset-4 hover:text-foreground"
                            >
                                support@getknitted.app
                            </a>
                            . We’ll delete or anonymize your data unless legally required to retain it.
                        </p>
                    </section>

                    <section id="changes" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">13) Changes to This Policy</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            We may update this Privacy Policy. Material changes will be posted here with a
                            revised “Last updated” date.
                        </p>
                    </section>

                    <section id="contact" className="scroll-mt-24">
                        <h2 className="text-xl font-semibold">14) Contact Us</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            If you have any questions, contact us at:{' '}
                            <a
                                href="mailto:support@getknitted.app"
                                className="underline underline-offset-4 hover:text-foreground"
                            >
                                support@getknitted.app
                            </a>
                        </p>
                    </section>

                    {/* App Store notes (for reviewers) */}
                    <section className="rounded-lg border bg-card p-4 text-xs text-muted-foreground">
                        <h3 className="mb-1 font-semibold text-foreground">
                            App Store & Google Play Disclosures
                        </h3>
                        <ul className="list-inside list-disc space-y-1">
                            <li>Photo access: only when uploading attachments (optional).</li>
                            <li>Analytics: used for performance and crash diagnostics.</li>
                            <li>Payments: securely handled by PCI-compliant providers.</li>
                            <li>Data deletion: request anytime via support@getknitted.app.</li>
                        </ul>
                    </section>
                </div>
            </section>
        </main>
    );
}