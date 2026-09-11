'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Menu, X, Calendar } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'October Schedule', href: '#schedule' },
    { label: 'Experience', href: '#experience' },
    { label: 'Instructor & Impact', href: '#instructor-impact' },
    { label: 'Contact', href: '#contact-us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-gray-200/60 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo EVENTO x JADE GARDEN */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm group-hover:bg-[#2D6A4F] transition-colors">
            <Sprout className="w-5 h-5 text-[#52B788]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-black text-2xl tracking-tight text-[#0F172A]">
                EVENT
              </span>
              <span className="font-black text-2xl tracking-tight text-[#52B788] -ml-0.5">
                O
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
              Jade Belstead
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#1B4332] transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action / Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#schedule"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold rounded-full transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Book Saturday</span>
          </a>

          {/* Mobile Hamburger Button (min 44px touch target) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#F4F7F3] hover:text-[#1B4332] transition-all min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#schedule"
                onClick={() => setIsOpen(false)}
                className="w-full min-h-[44px] px-5 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#52B788]" />
                <span>Book Your Spot for October</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
