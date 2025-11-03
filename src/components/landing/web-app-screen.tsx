// src/components/sections/WebAppScreens.tsx
"use client";

import Image from "next/image";
import {useRef} from "react";
import Autoplay from "embla-carousel-autoplay";
import {motion} from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"; // shadcn/ui carousel wrapper (Embla)
import {cn} from "@/lib/utils"; // optional helper

// Swap these with your actual web screenshots (no device frames)
const SCREENS: string[] = [
    "/MacBook_Pro_14_dark.png",
    "/MacBook_Pro_14_dark_1.png",
    "/MacBook_Pro_14_light.png",
    "/MacBook_Pro_14_light_1.png",
];

export default function WebAppScreens() {
    // Autoplay (pause on hover, resume on mouse leave)
    const autoplay = useRef(
        Autoplay({delay: 3500, stopOnInteraction: true})
    );

    return (
        <section className="relative overflow-hidden">
            {/* Gentle background wash */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10 dark:from-primary/20 dark:via-indigo-400/15 dark:to-purple-400/15"
            />

            {/* Title container (centered, constrained) */}
            <div className="mx-auto max-w-6xl px-4 pt-16 md:px-6">
                <motion.h2
                    initial={{y: 14, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    viewport={{once: true, amount: 0.5}}
                    transition={{duration: 0.35, ease: "easeOut"}}
                    className="text-center text-3xl font-bold tracking-tight md:text-4xl"
                >
                    The Knitted Studio
                </motion.h2>
                <motion.p
                    initial={{y: 12, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    viewport={{once: true, amount: 0.5}}
                    transition={{duration: 0.35, ease: "easeOut", delay: 0.05}}
                    className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground"
                >
                    See how every stitch of your business comes together — clients, orders, and creativity, perfectly
                    woven online.
                </motion.p>
            </div>

            {/* Full-bleed carousel (edge-to-edge) */}
            <div
                className={cn(
                    // pull container to the edges
                    "mx-[calc(50%-50vw)] w-screen",
                    // spacing above/below carousel
                    "mt-8 md:mt-10"
                )}
            >
                <Carousel
                    opts={{loop: true, align: "center"}}
                    plugins={[autoplay.current]}
                    className="w-full py-10"
                    onMouseEnter={autoplay.current.stop}
                    onMouseLeave={autoplay.current.reset}
                >
                    <CarouselContent>
                        {SCREENS.map((base, i) => (
                            <CarouselItem key={i} className="basis-full flex justify-center">
                                <figure className="w-[90%] md:w-[80%] lg:w-[80%] xl:w-[50%] mx-auto">
                                    {/* Frame for the screenshot */}
                                    <div
                                        className="relative overflow-hidden border-border">
                                        {/* Maintain a cinematic ratio */}
                                        <div className="relative aspect-[16/9] w-full">
                                            {/* Light screenshot */}
                                            <Image
                                                src={`${base}`}
                                                alt={`Knitted web screen ${i + 1} (light)`}
                                                fill
                                                priority={i === 0}
                                                sizes="80vw"
                                                className="object-contain dark:hidden"
                                            />
                                            {/* Dark screenshot */}
                                            <Image
                                                src={`${base}`}
                                                alt={`Knitted web screen ${i + 1} (dark)`}
                                                fill
                                                priority={i === 0}
                                                sizes="80vw"
                                                className="hidden object-contain dark:block"
                                            />
                                        </div>
                                    </div>
                                </figure>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation controls */}
                    <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-4">
                        <CarouselPrevious className="pointer-events-auto border bg-background/80 backdrop-blur"/>
                        <CarouselNext className="pointer-events-auto border bg-background/80 backdrop-blur"/>
                    </div>
                </Carousel>
            </div>
        </section>
    );
}