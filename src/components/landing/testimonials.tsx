"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The visual clarity Knitted brings to my chaotic studio is unmatched.",
    author: "Sarah Jenkins",
    role: "Bespoke Tailor, London",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
  },
  {
    quote:
      "I've tried every tool. Knitted is the only one that feels like it was made by a tailor.",
    author: "Marco Rossi",
    role: "Fashion Designer, Milan",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marco",
  },
  {
    quote:
      "It's not just software; it's peace of mind. My clients love the professional invoices.",
    author: "Elena Rodriguez",
    role: "Bridal Couturier, Madrid",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Elena",
  },
  {
    quote: "Data entry used to be a chore. Now it's satisfying.",
    author: "David Chen",
    role: "Suit Maker, Hong Kong",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
  },
  {
    quote: "The migration was effortless. I was up and running in minutes.",
    author: "Sophie Dubois",
    role: "Atelier Owner, Paris",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophie",
  },
  {
    quote: "Finally, a CRM that doesn't look like a spreadsheet from 1999.",
    author: "James Wilson",
    role: "Custom Clothier, NY",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 md:px-8 text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Friends of Knitted.
        </h2>
        <p className="text-muted-foreground text-lg">
          Join hundreds of the world's best ateliers.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto px-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col p-8 bg-background rounded-[2rem] shadow-sm border border-border/50 w-full sm:w-[350px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary">
                <Image
                  src={t.avatar}
                  alt={t.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-bold text-foreground">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
            <p className="text-lg text-foreground/80 text-left font-medium leading-relaxed">
              "{t.quote}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
