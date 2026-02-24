"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background py-32 border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Scissors className="w-5 h-5 text-foreground stroke-[1.5]" />
              <span className="text-xl font-normal tracking-tight text-foreground font-serif">
                knitted
              </span>
            </Link>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Atelier</h4>
            <ul className="space-y-4">
              {["Our Mission", "Pricing", "Community", "Careers", "Invite and Earn!"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-sans">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Connect</h4>
            <ul className="space-y-4">
              {["Blog", "Privacy Policy", "Terms of Usage", "Cookie Policy", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-sans">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1 flex lg:justify-end gap-6 h-fit pt-1">
            <Twitter className="w-4 h-4 text-foreground/60 hover:text-foreground cursor-pointer" />
            <Instagram className="w-4 h-4 text-foreground/60 hover:text-foreground cursor-pointer" />
            <Linkedin className="w-4 h-4 text-foreground/60 hover:text-foreground cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
