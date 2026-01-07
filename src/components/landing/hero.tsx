"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { StoreButtons } from "@/components/ui/store-buttons";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8 hover:bg-secondary cursor-default transition-colors hover:scale-105"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          >
            <Star className="w-4 h-4 text-primary fill-primary" />
          </motion.div>
          <span>The #1 OS for modern ateliers</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter text-foreground mb-8 text-balance leading-[0.9]"
        >
          Tailoring <br className="hidden md:block" />
          <span className="text-muted-foreground">made simple.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-xl md:text-2xl text-foreground/60 leading-relaxed mb-10 text-balance font-medium"
        >
          Manage clients, track measurements, and send invoices with a tool
          you'll actually love using.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <Link
            href="/signup"
            className="h-14 px-8 rounded-full bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center transition-all hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-primary/20"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/demo"
            className="h-14 px-8 rounded-full bg-secondary text-foreground text-lg font-bold flex items-center justify-center transition-all hover:bg-secondary/80 hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            Watch Video
          </Link>
        </motion.div>

        {/* App Store Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex justify-center -mt-16 mb-24"
        >
          <StoreButtons centered dark />
        </motion.div>

        {/* Hero Visual - "App-like" Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-5xl"
        >
          {/* The "Device" / Container - Floating Animation */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex justify-center items-end"
          >
            {/* Mobile Mockups Container */}
            <div className="relative w-full max-w-[300px] md:max-w-[800px] flex justify-center items-center">
              {/* Left Phone (Behind) */}
              <motion.div
                initial={{ x: 50, rotate: 5, opacity: 0 }}
                animate={{ x: -60, rotate: -6, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute z-0 w-[240px] md:w-[280px] hidden md:block" // Hidden on mobile, vibrant on desktop
              >
                <Image
                  src="/iphone_mockup_five_light.PNG"
                  alt="Mobile App Screen"
                  width={600}
                  height={1200}
                  className="w-full h-auto drop-shadow-2xl rounded-[3rem] dark:hidden"
                />
                <Image
                  src="/iphone_mockup_five_dark.PNG"
                  alt="Mobile App Screen"
                  width={600}
                  height={1200}
                  className="w-full h-auto drop-shadow-2xl rounded-[3rem] hidden dark:block"
                />
              </motion.div>

              {/* Right Phone (Behind) */}
              <motion.div
                initial={{ x: -50, rotate: -5, opacity: 0 }}
                animate={{ x: 60, rotate: 6, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute z-0 w-[240px] md:w-[280px] hidden md:block"
              >
                <Image
                  src="/iphone_mockup_three_light.PNG"
                  alt="Mobile App Screen"
                  width={600}
                  height={1200}
                  className="w-full h-auto drop-shadow-2xl rounded-[3rem] dark:hidden"
                />
                <Image
                  src="/iphone_mockup_three_dark.PNG"
                  alt="Mobile App Screen"
                  width={600}
                  height={1200}
                  className="w-full h-auto drop-shadow-2xl rounded-[3rem] hidden dark:block"
                />
              </motion.div>

              {/* Center Phone (Front) */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 w-[280px] md:w-[320px]"
              >
                <Image
                  src="/iphone_mockup_one_light.PNG"
                  alt="Knitted Mobile App"
                  width={600}
                  height={1200}
                  className="w-full h-auto drop-shadow-2xl rounded-[3.5rem] dark:hidden"
                  priority
                />
                <Image
                  src="/iphone_mockup_one_dark.PNG"
                  alt="Knitted Mobile App"
                  width={600}
                  height={1200}
                  className="w-full h-auto drop-shadow-2xl rounded-[3.5rem] hidden dark:block"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements (Playful blobs) */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400 rounded-full blur-[80px] pointer-events-none mix-blend-screen"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[100px] pointer-events-none mix-blend-screen"
          />
        </motion.div>
      </div>
    </section>
  );
}
