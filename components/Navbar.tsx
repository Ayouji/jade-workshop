import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-warm-50/85 border-b border-warm-200/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo & Marque */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-sm group-hover:bg-terracotta-600 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-charcoal group-hover:text-terracotta-600 transition-colors">
              Jade
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-sage-600 font-semibold -mt-1">
              Atelier Céramique
            </span>
          </div>
        </Link>

        {/* Navigation & Badge Localisation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-warm-100 px-3 py-1.5 rounded-full border border-warm-200/60">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Paris 11e • Métro Voltaire</span>
          </div>

          <a
            href="#workshops"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-charcoal text-white hover:bg-terracotta-600 transition-colors shadow-sm"
          >
            Voir les Ateliers
          </a>
        </div>
      </div>
    </header>
  );
}
