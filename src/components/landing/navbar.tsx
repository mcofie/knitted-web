"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <React.Fragment>
      {/* Desktop Floating Pill Nav */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <nav className="hidden md:flex items-center gap-2 pointer-events-auto bg-background border border-border shadow-xl shadow-black/5 rounded-full p-2 pl-6 pr-2 transition-all hover:scale-[1.01]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-6 group">
            <motion.div
              className="relative h-6 w-6"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/knitted-logo.svg"
                alt=""
                fill
                className="object-contain dark:invert"
              />
            </motion.div>
            <span className="font-bold tracking-tight text-foreground">
              Knitted
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-2" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Mobile Top Bar */}
        <div className="md:hidden w-full flex justify-between items-center pointer-events-auto bg-background border border-border shadow-sm rounded-full px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-6 w-6">
              <Image
                src="/knitted-logo.svg"
                alt=""
                fill
                className="object-contain dark:invert"
              />
            </div>
            <span className="font-bold text-foreground">Knitted</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {mounted && theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
