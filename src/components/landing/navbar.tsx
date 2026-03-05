"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Scissors className="w-5 h-5 text-foreground stroke-[1.5]" />
            <span className="text-xl font-normal tracking-tight text-foreground font-serif">
              knitted
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all">Features</Link>
            <Link href="#about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all">About</Link>
            <Link href="#faq" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all">FAQ</Link>
            <Link href="/pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/signup" className="px-5 py-2.5 rounded-full border border-border text-xs font-medium hover:bg-muted transition-all">
              Get started free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[88px] bg-background p-8 space-y-8 animate-in fade-in slide-in-from-top-4">
          <Link href="#features" className="block text-2xl font-serif" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link href="#about" className="block text-2xl font-serif" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="#faq" className="block text-2xl font-serif" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
          <hr className="border-border" />
          <Link href="/signup" className="btn-primary w-full justify-center">Get started free</Link>
        </div>
      )}
    </header>
  );
}
