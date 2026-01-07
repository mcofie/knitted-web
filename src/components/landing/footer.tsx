"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "API", href: "/api" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Help Center", href: "/help" },
        { label: "Guidelines", href: "/guidelines" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Legal", href: "/legal" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border/50 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-8 w-8">
                <Image
                  src="/knitted-logo.svg"
                  alt=""
                  fill
                  className="object-contain dark:invert"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Knitted
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              The operating system for modern ateliers. Bring clarity to your
              craft.
            </p>
            <div className="flex gap-4 pt-2">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section) => (
            <div key={section.title} className="col-span-1 md:col-span-1?">
              <h3 className="font-bold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-8">
            <span>&copy; {currentYear} Knitted Inc.</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Systems Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
