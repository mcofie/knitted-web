"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StoreButtons } from "@/components/ui/store-buttons";

export default function CTA() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-7xl relative overflow-hidden rounded-[3rem] bg-card border border-border text-foreground px-6 py-24 md:px-20 text-center">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-balance">
            Ready to organize your atelier?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the tailored operating system today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="h-14 px-8 rounded-full bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center transition-transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="flex justify-center pt-8">
            <StoreButtons centered dark={false} /> {/* Let buttons adapt or force if needed. Using default which adapts to theme usually, or we can explicit. Let's rely on theme since bg is now theme-aware */}
          </div>
        </div>
      </div>
    </section>
  );
}
