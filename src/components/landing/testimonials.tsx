'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        content: "Knitted has completely transformed how I manage my atelier. The measurement tracking is a lifesaver.",
        author: "Sarah Jenkins",
        role: "Bespoke Tailor, London",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
    },
    {
        content: "Finally, a system that understands the nuances of custom clothing. My clients love the professional invoices.",
        author: "Marco Rossi",
        role: "Fashion Designer, Milan",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marco"
    },
    {
        content: "The best investment I've made for my business this year. It saves me hours of admin work every week.",
        author: "Elena Rodriguez",
        role: "Bridal Couturier, Madrid",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Elena"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-secondary/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
                    >
                        Loved by modern ateliers
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Join hundreds of tailors and designers who trust Knitted to run their business.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="bg-background/60 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-primary/20"
                        >
                            <div className="flex gap-1 mb-4 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg mb-6 leading-relaxed text-foreground/90">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{testimonial.author}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
