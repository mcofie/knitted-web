"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-6">
            Simple, transparent pricing.
          </h2>
          <div className="inline-flex bg-muted p-1 rounded-full border border-border">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isAnnual ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: 0,
              desc: "For hobbyists",
              bg: "bg-card",
              border: "border-border/60",
            },
            {
              name: "Studio",
              price: isAnnual ? 29 : 39,
              desc: "For growing brands",
              bg: "bg-primary/10",
              border: "border-primary/20 ring-1 ring-primary/20",
              popular: true,
            },
            {
              name: "Atelier",
              price: isAnnual ? 79 : 99,
              desc: "For full production",
              bg: "bg-card",
              border: "border-border/60",
            },
          ].map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border ${plan.border} ${plan.bg}`}
            >
              {plan.popular && (
                <div className="absolute top-6 right-8 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
                  Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {plan.desc}
                </p>
              </div>
              <div className="mb-8 items-baseline flex">
                <span className="text-5xl font-bold tracking-tighter">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground ml-2">/mo</span>
              </div>
              <Link
                href="/signup"
                className={`w-full py-4 rounded-2xl font-bold text-center mb-8 transition-transform hover:scale-[1.02] active:scale-[0.98] ${plan.popular ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-foreground"}`}
              >
                Get Started
              </Link>
              <ul className="space-y-4 text-sm text-foreground/80 font-medium">
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> Feature
                  one
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> Feature
                  two
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> Feature
                  three
                </li>
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
