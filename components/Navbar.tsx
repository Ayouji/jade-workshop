'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Menu, X, ArrowUpRight } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Schedule', href: '#schedule' },
    { label: 'Curriculum', href: '#experience' },
    { label: 'Instructor', href: '#instructor-impact' },
    { label: 'Contact', href: '#contact-us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-sm border-b border-[#E5E5E0] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Typographic Swiss Wordmark */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#2D4A3E] text-white flex items-center justify-center transition-colors group-hover:bg-[#1E342B]">
            <Sprout className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#1A1A1A] uppercase">
              Jade Belstead
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-stone-500 -mt-0.5">
              Seasonal Gardening • Kingston, NY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#1A1A1A] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1A1A1A] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action / Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#schedule"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#2D4A3E] hover:bg-[#1E342B] text-white text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer focus:ring-2 focus:ring-[#2D4A3E]/30 focus:outline-none"
          >
            <span>Book Saturday</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-stone-800 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/20"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-stone-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FBFBF9] border-b border-[#E5E5E0] px-4 py-6 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider text-stone-800 hover:bg-stone-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#E5E5E0]">
              <a
                href="#schedule"
                onClick={() => setIsOpen(false)}
                className="w-full h-11 px-4 bg-[#2D4A3E] hover:bg-[#1E342B] text-white text-xs font-semibold uppercase tracking-wider rounded-md flex items-center justify-center gap-2"
              >
                <span>Reserve Your Spot</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
