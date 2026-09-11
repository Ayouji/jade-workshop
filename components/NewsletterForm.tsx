'use client';

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

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
      <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold max-w-md mx-auto animate-in fade-in">
        <CheckCircle2 className="w-5 h-5 text-[#52B788] shrink-0" />
        <span>Thank you! You will receive our monthly gardening guide and upcoming dates.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md mx-auto">
      {/* Ligne 1 : First & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="newsletter-first-name" className="sr-only">
            First name
          </label>
          <input
            id="newsletter-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all shadow-xs"
          />
        </div>
        <div>
          <label htmlFor="newsletter-last-name" className="sr-only">
            Last name
          </label>
          <input
            id="newsletter-last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Ligne 2 : Email */}
      <div>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all shadow-xs"
        />
      </div>

      {/* Ligne 3 : Bouton S'abonner */}
      <button
        type="submit"
        className="w-full min-h-[48px] py-3.5 px-6 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs sm:text-sm font-bold tracking-wide rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
      >
        <span>Subscribe to Garden Tips</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </form>
  );
}
