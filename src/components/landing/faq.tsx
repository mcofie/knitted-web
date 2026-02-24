"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is Knitted really free to start?",
    answer: "Absolutely. We believe every master craftsperson should have access to professional tools. Manage your first 10 sittings for free, forever.",
  },
  {
    question: "Can I import my existing client logs?",
    answer: "Yes. Our team can help you migrate measurements from spreadsheets or paper ledgers. We handle the technical work so you can focus on the needle.",
  },
  {
    question: "How secure is my atelier's data?",
    answer: "Meticulously. We use industry-standard encryption to ensure your clients' measurements and history remain confidential and private.",
  },
  {
    question: "Does it work on tablet and mobile?",
    answer: "Knitted is designed to be as versatile as your measuring tape. It works seamlessly on any browser, whether you're at your cutting table or in a fitting.",
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-background">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Common Inquiries
          </h2>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {faqs.map((faq, index) => (
            <div key={index} className="py-8">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="text-xl md:text-2xl font-serif text-foreground group-hover:opacity-70 transition-opacity">
                  {faq.question}
                </span>
                <div className="shrink-0 ml-4">
                  {openIndex === index ?
                    <Minus className="w-5 h-5 text-foreground/40 stroke-[1.5]" /> :
                    <Plus className="w-5 h-5 text-foreground/40 stroke-[1.5]" />
                  }
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 pb-2 text-base text-muted-foreground leading-relaxed font-sans max-w-2xl">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
