'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onBookClick?: () => void;
}

export function Navbar({ onBookClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Workshops', href: '#workshops' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-stone-200/70 w-full transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Minimalist Studio Brand: Jade Studio / Gardening */}
        <Link href="/" className="flex items-baseline gap-2.5 group shrink-0">
          <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#24211D] group-hover:text-[#B85B3A] transition-colors">
            Jade Studio
          </span>
          <span className="text-[11px] uppercase font-sans tracking-widest text-stone-500 font-medium">
            / Gardening
          </span>
        </Link>

        {/* Minimal Desktop Navigation: WORKSHOPS, ABOUT, CONTACT */}
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest text-stone-600 font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#24211D] transition-colors py-1 relative hover:font-semibold"
            >
              {link.label.toUpperCase()}
            </a>
          ))}
        </nav>

        {/* Distinct Dark Pill Booking CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#workshops"
            onClick={(e) => {
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-[#24211D] hover:bg-[#B85B3A] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors cursor-pointer shadow-xs hover:shadow-sm"
          >
            <span>BOOK A WORKSHOP</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#1C1B1A] hover:bg-[#EAE4DC] transition-colors"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#F7F5F0] border-b border-stone-200 px-6 py-6 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xs uppercase tracking-widest font-semibold text-[#24211D] hover:text-[#B85B3A] transition-colors py-1"
              >
                {link.label.toUpperCase()}
              </a>
            ))}
            <div className="pt-3 border-t border-stone-200">
              <a
                href="#workshops"
                onClick={() => {
                  setIsOpen(false);
                  if (onBookClick) onBookClick();
                }}
                className="w-full h-12 bg-[#24211D] hover:bg-[#B85B3A] text-white text-xs uppercase tracking-widest font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>BOOK A WORKSHOP</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
