'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function NewsletterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setFirstName('');
      setLastName('');
      setEmail('');
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold max-w-md mx-auto animate-in fade-in">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Merci ! Vous êtes inscrit pour recevoir les prochaines dates en avant-première.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md mx-auto">
      {/* Ligne 1 : Prénom et Nom côte à côte comme sur la maquette EVENTO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-[#121244] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#121244]/20 focus:border-[#121244] transition-all"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom"
          required
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-[#121244] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#121244]/20 focus:border-[#121244] transition-all"
        />
      </div>

      {/* Ligne 2 : Email pleine largeur */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Adresse email"
        required
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-[#121244] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#121244]/20 focus:border-[#121244] transition-all"
      />

      {/* Ligne 3 : Bouton S'abonner pill indigo */}
      <button
        type="submit"
        className="w-full py-3.5 bg-[#121244] hover:bg-[#1B1C57] text-white text-xs font-bold tracking-wide rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        S&apos;inscrire à la newsletter
      </button>
    </form>
  );
}
