"use client";

import { motion } from "framer-motion";
import { User, Scissors, Star, ThumbsUp, Send } from "lucide-react";

export default function AppPortalPreview() {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-0" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1] tracking-tight text-secondary uppercase italic">
                            Built for <br />
                            <span className="not-italic text-primary">Modern Ateliers</span>
                        </h2>
                        <p className="text-xl text-secondary/70 font-medium mb-10 max-w-lg leading-relaxed">
                            A beautifully simple dashboard to manage your clients.
                            No more clunky spreadsheets. Just happy tailors and perfectly
                            fitted garments.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Delightful UX", val: "Loved by master tailors", icon: ThumbsUp },
                                { title: "Simple Invoicing", val: "Get paid in seconds", icon: Star }
                            ].map((item) => (
                                <div key={item.title} className="flex gap-6 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                        <item.icon className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-black block text-secondary tracking-tight">{item.title}</span>
                                        <span className="text-secondary/50 font-medium">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative">
                        {/* The "Atelier Dashboard" style mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-border h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-ios-xl relative flex flex-col p-8"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-ios transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                                    <Scissors className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary/5" />
                                    <div className="w-8 h-8 rounded-full bg-secondary/5" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-4 mb-10">
                                <div className="w-20 h-20 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center relative shadow-ios">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">Sarah Jenkins</h3>
                                    <p className="text-secondary/50 font-bold uppercase tracking-widest text-xs">The Savile Row Atelier</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="bg-secondary/5 rounded-[2rem] p-6 border border-transparent hover:border-border transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-black text-secondary text-sm">Measurement Log</span>
                                        <span className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Updated 1h ago</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-full bg-white rounded-full flex overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "75%" }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Chest: 104cm</span>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Perfect Fit</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-border rounded-[2rem] p-5 flex items-center justify-between hover:bg-secondary/5 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Send className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-black text-sm text-secondary uppercase tracking-tight">Send Fitting Update</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-secondary/5" />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold shadow-btn hover:opacity-90 active:scale-95 transition-all">View Dossier</button>
                            </div>
                        </motion.div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-8 -left-8 px-6 py-4 bg-secondary text-white rounded-2xl shadow-ios-xl hidden xl:block z-20 transform -rotate-2 border border-white/10">
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-black tracking-tight italic uppercase">Try for free</span>
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-ios">
                                    <ThumbsUp className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
