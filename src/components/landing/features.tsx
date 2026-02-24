"use client";

import { motion } from "framer-motion";
import {
  Users,
  Ruler,
  Smartphone,
  Scissors
} from "lucide-react";

const features = [
  {
    title: "Client Dossiers",
    description: "Meticulously organized client profiles with exhaustive measurement history.",
    icon: Users,
  },
  {
    title: "Precise Logic",
    description: "Built-in measurement validation to ensure every stitch is intentional.",
    icon: Ruler,
  },
  {
    title: "Motto of the Hand",
    description: "Access your atelier's data from any device, anywhere in the world.",
    icon: Smartphone,
  },
  {
    title: "Craft First",
    description: "Design tools that stay out of your way and let your talent lead.",
    icon: Scissors,
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-6xl mb-6">
            Everything you need <br />in one place.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group"
            >
              <div className="mb-8">
                <feature.icon className="w-6 h-6 text-foreground/40 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl mb-4">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pale Blue Wash Section */}
      <div className="mt-32 py-32 bg-secondary">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl mb-8">
                Built for how <br />you create.
              </h2>
              <div className="space-y-12">
                <div className="flex gap-4">
                  <span className="text-xs font-medium text-foreground/40">01</span>
                  <div>
                    <h4 className="text-xl mb-2">For independent tailors</h4>
                    <p className="text-sm text-muted-foreground max-w-sm">Consolidate measurements, notes, and fittings into a single source of truth.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-xs font-medium text-foreground/40">02</span>
                  <div>
                    <h4 className="text-xl mb-2">For scaling ateliers</h4>
                    <p className="text-sm text-muted-foreground max-w-sm">Coordinate between pattern makers and tailors with shared measurement data.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square bg-white/50 border border-white/20 rounded-2xl p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-1 w-1 bg-accent/20 mx-auto mb-8 rounded-full" />
                <p className="text-2xl italic font-serif text-foreground/60">
                  "Knitted has transformed how we handle client sittings. It's the only tool that feels as premium as our suits."
                </p>
                <p className="mt-8 text-xs font-sans tracking-widest uppercase text-foreground/40">— Luca Bianchi, Master Tailor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
