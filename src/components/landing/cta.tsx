"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#FFC132]  overflow-hidden p-8 md:p-12 lg:p-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-5">
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#2D1B08] leading-[1.1] font-serif font-medium">
                Your craft deserves <br />better tools.
              </h2>
              <p className="text-lg md:text-xl text-[#2D1B08]/80 mb-10 font-sans max-w-md leading-relaxed text-balance">
                No matter what you're creating, Knitted is where it all comes together.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#2D1B08] text-[#FFC132] font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                Try for free
              </Link>
            </div>

            <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] w-full lg:col-span-7">
              <Image
                src="/images/kt_footer.png"
                alt="Knitted Studio Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
