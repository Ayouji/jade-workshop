import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-charcoal text-warm-100 py-12 px-4 sm:px-6 mt-20 border-t border-warm-300/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-terracotta-500 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white tracking-wide">Jade Workshop</h4>
            <p className="text-xs text-gray-400">Ateliers de poterie, tournage et émaillage d&apos;art</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
          Façonné avec <Heart className="w-3.5 h-3.5 text-terracotta-500 inline fill-terracotta-500" /> pour les amoureux de l&apos;artisanat et du grès.
        </p>

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Jade. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
