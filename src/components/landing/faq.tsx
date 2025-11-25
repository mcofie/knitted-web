'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Is Knitted suitable for solo tailors?",
        answer: "Absolutely! Our 'Solo' plan is specifically designed for independent tailors and hobbyists. It gives you all the essential tools to manage your clients and measurements without breaking the bank."
    },
    {
        question: "Can I export my client data?",
        answer: "Yes, you own your data. You can export your client lists, measurements, and order history to CSV or PDF formats at any time. The 'Atelier' plan also offers API access for custom integrations."
    },
    {
        question: "How secure is my data?",
        answer: "Security is our top priority. We use bank-level encryption for all data transmission and storage. Your client's sensitive information is safe with us, and we perform regular security audits."
    },
    {
        question: "Do you offer a free trial?",
        answer: "Yes! You can try the 'Studio' plan for free for 14 days. No credit card required. You can also start with the 'Solo' plan which has a free tier for up to 20 active orders."
    },
    {
        question: "Can I customize the invoices?",
        answer: "Yes, on the 'Studio' and 'Atelier' plans, you can fully customize your invoices with your own logo, brand colors, and custom terms and conditions."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-3xl px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know about Knitted.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-2xl bg-card overflow-hidden transition-all hover:border-primary/50"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex w-full items-center justify-between p-6 text-left"
                            >
                                <span className="text-lg font-semibold text-foreground">
                                    {faq.question}
                                </span>
                                <span className="ml-4 flex-shrink-0 text-primary">
                                    {openIndex === index ? (
                                        <Minus className="h-5 w-5" />
                                    ) : (
                                        <Plus className="h-5 w-5" />
                                    )}
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
