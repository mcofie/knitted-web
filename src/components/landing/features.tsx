"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ruler, CreditCard, Users, Sparkles, Search, Bell } from "lucide-react";

export default function Features() {
  return (
    <section className="py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-6">
            Details that matter.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            We sweat the small stuff so you don't have to.
            <br />
            Powerful tools wrapped in a delightful interface.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {/* Card 1: Measurements (Large) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-secondary border border-border p-10 hover:bg-muted transition-colors"
          >
            <div className="relative z-10 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6">
                <Ruler className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Precision Measurements
              </h3>
              <p className="text-lg text-muted-foreground">
                Save over 50 unique measurement points per client. Customizable
                templates for suits, dresses, and more.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full translate-x-12 translate-y-12">
              {/* Abstract placeholder for UI */}
              <div className="w-full h-full bg-background rounded-tl-[2rem] border border-border shadow-2xl p-6">
                <div className="space-y-4 opacity-50">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-4 bg-secondary rounded w-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Payments (Tall) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Get paid faster</h3>
              <p className="text-lg text-primary-foreground/80">
                Create professional invoices in seconds. Track deposits and
                outstanding balances automatically.
              </p>
            </div>
            {/* Solid Receipt Card - Removed Blur */}
            <div className="mt-8 relative h-60 w-full bg-white text-black rounded-2xl border border-white/10 shadow-lg p-6 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold mb-2">$1,250.00</div>
              <div className="text-sm font-medium bg-black/5 px-3 py-1 rounded-full">
                Paid
              </div>
            </div>
          </motion.div>

          {/* Card 3: Search (Small) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-secondary/30 border border-border/50 p-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Instant Search
            </h3>
            <p className="text-muted-foreground">
              Find any order, client, or fabric in milliseconds.
            </p>
          </motion.div>

          {/* Card 4: Clients (Small) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-secondary/30 border border-border/50 p-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Client Profiles
            </h3>
            <p className="text-muted-foreground">
              Detailed history for every VIP.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
