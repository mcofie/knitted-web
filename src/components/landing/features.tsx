"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "The Living Archive",
    description: "Every client, every measurement, and history preserved with monastic detail.",
    image: "/images/kt_user_profile.png",
    color: "#FFF9E6", // Cream
    rotate: -1,
  },
  {
    title: "Atelier’s Ledger",
    description: "Master the flow of garments through your workshop with effortless precision.",
    image: "/images/kt_order.png",
    color: "#E6F4FF", // Light Blue
    rotate: 2,
  },
  {
    title: "Storefront",
    description: "Extend your craft. Allow clients to book consultations and track progress.",
    image: "/images/kt_storefront.png",
    color: "#FFEBFA", // Light Pink
    rotate: -2,
  },
  {
    title: "Teamwork",
    description: "Connect pattern makers, cutters, and finishers through real-time updates.",
    image: "/images/kt_team.png",
    color: "#FFF1E6", // Light Orange
    rotate: 1.5,
  },
  {
    title: "Lineage",
    description: "Provide clients with an open window into their commission’s journey.",
    image: "/images/kt_invoice.png",
    color: "#F0F0F0", // Light Grey
    rotate: -1.5,
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl mb-6 font-serif tracking-tight text-foreground">
            Everything you need <br />in one place.
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9, rotate: 0 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: feature.rotate,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }
                }
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                zIndex: 20,
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
              style={{
                backgroundColor: feature.color,
              }}
              className="group relative aspect-[4/5] p-6 md:p-8 flex flex-col justify-between rounded-sm cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Illustration Area with float animation */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
                className="relative flex-1 flex items-center justify-center p-2"
              >
                <div className="relative w-full h-full max-h-[280px] lg:max-h-[320px]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </motion.div>

              {/* Text Area */}
              <div className="mt-6 md:mt-8">
                <h3 className="text-2xl md:text-3xl lg:text-3xl mb-3 md:mb-4 font-serif text-[#2D1B08]">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-[#2D1B08]/70 leading-relaxed font-sans font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
