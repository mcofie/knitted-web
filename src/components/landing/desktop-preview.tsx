"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DesktopPreview() {
  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-6">
            A workspace that sparks joy.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're on your iPad in the studio or your Mac at the desk,
            Knitted keeps everything in sync.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden border border-border bg-secondary shadow-2xl shadow-black/5 p-2 md:p-4"
        >
          <div className="rounded-[2rem] overflow-hidden bg-background border border-black/5">
            <Image
              src="/MacBook_Pro_14_light.png"
              alt="Knitted Desktop Dashboard"
              width={2400}
              height={1500}
              className="w-full h-auto object-cover dark:hidden"
            />
            <Image
              src="/MacBook_Pro_14_dark.png"
              alt="Knitted Desktop Dashboard"
              width={2400}
              height={1500}
              className="w-full h-auto object-cover hidden dark:block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
