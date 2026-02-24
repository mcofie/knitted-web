"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrapsIllustration } from "@/components/ui/illustrations";

export default function CTA() {
  return (
    <section className="py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="mb-12">
            <ScrapsIllustration />
          </div>

          <h2 className="text-5xl md:text-7xl mb-12">
            Your craft deserves <br />better tools.
          </h2>

          <p className="max-w-xl text-lg text-muted-foreground mb-16 font-sans">
            Meticulously built for those who understand that every measurement matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link
              href="/signup"
              className="btn-primary min-w-[200px]"
            >
              Get started free
            </Link>
          </div>

          <p className="mt-16 text-xs text-muted-foreground font-sans tracking-widest uppercase">
            Designed in London · Used Worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
