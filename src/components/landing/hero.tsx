"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-16 pb-12 lg:pt-20 lg:pb-20 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl mb-8"
        >
          <div className="relative">
            <Image
              src="/images/hero_knitted.png"
              alt="Knitted Hero"
              width={1600}
              height={900}
              className="relative rounded-2xl"
              priority
            />
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto mt-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl mb-6 text-foreground tracking-tight"
          >
            The software that <br />Sewn with <span className="italic">intent.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto font-sans"
          >
            Knitted helps tailors manage client measurements and history with the meticulous care their craft deserves.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/signup" className="btn-primary min-w-[180px]">
              Try for free
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Logos section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-20 border-t border-border/50 pt-10 pb-10"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-70 text-sm font-sans tracking-[0.2em] uppercase">
            <span>Savile Row Academy</span>
            <span>London Fashion Institute</span>
            <span>Atelier de Lyon</span>
            <span>Milano Sartoria</span>
            <span>Tokyo Patternists</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
