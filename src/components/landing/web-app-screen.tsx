// src/components/sections/WebAppScreens.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"; // shadcn/ui carousel wrapper (Embla)
import { cn } from "@/lib/utils"; // optional helper

// Swap these with your actual web screenshots (no device frames)
const SCREENS = [
    {
        light: "/MacBook_Pro_14_light.png",
        dark: "/MacBook_Pro_14_dark.png",
    },
    {
        light: "/MacBook_Pro_14_light_1.png",
        dark: "/MacBook_Pro_14_dark_1.png",
    },
];

export default function WebAppScreens() {
    // Autoplay (pause on hover, resume on mouse leave)
    const autoplay = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true })
    );

    return (
        <section className="relative overflow-hidden pt-24 pb-24 bg-background">
            {/* Title container (centered, constrained) */}
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <motion.h2
                    initial={{ y: 14, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-center text-3xl font-bold tracking-tight md:text-4xl text-foreground"
                >
                    The Knitted Studio
                </motion.h2>
                <motion.p
                    initial={{ y: 12, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                    className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground text-lg"
                >
                    See how every stitch of your business comes together — clients, orders, and creativity, perfectly
                    woven online.
                </motion.p>
            </div>

            {/* Full-bleed carousel (edge-to-edge) */}
            <div
                className={cn(
                    // pull container to the edges
                    "relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen",
                    // spacing above/below carousel
                    "mt-12 md:mt-16"
                )}
            >
                <Carousel
                    opts={{ loop: true, align: "center" }}
                    plugins={[autoplay.current]}
                    className="w-full"
                    onMouseEnter={autoplay.current.stop}
                    onMouseLeave={autoplay.current.reset}
                >
                    <CarouselContent>
                        {SCREENS.map((screen, i) => (
                            <CarouselItem key={i} className="basis-full flex justify-center">
                                <figure className="w-[90%] md:w-[80%] lg:w-[80%] xl:w-[60%] mx-auto shadow-2xl rounded-xl overflow-hidden border border-border">
                                    {/* Frame for the screenshot */}
                                    <div
                                        className="relative overflow-hidden bg-muted">
                                        {/* Maintain a cinematic ratio */}
                                        <div className="relative aspect-[16/10] w-full">
                                            {/* Light screenshot */}
                                            <Image
                                                src={screen.light}
                                                alt={`Knitted web screen ${i + 1} (light)`}
                                                fill
                                                priority={i === 0}
                                                sizes="80vw"
                                                className="object-cover dark:hidden"
                                            />
                                            {/* Dark screenshot */}
                                            <Image
                                                src={screen.dark}
                                                alt={`Knitted web screen ${i + 1} (dark)`}
                                                fill
                                                priority={i === 0}
                                                sizes="80vw"
                                                className="hidden object-cover dark:block"
                                            />
                                        </div>
                                    </div>
                                </figure>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation controls */}
                    <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 md:px-8">
                        <CarouselPrevious className="pointer-events-auto border-border bg-background hover:bg-secondary" />
                        <CarouselNext className="pointer-events-auto border-border bg-background hover:bg-secondary" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}