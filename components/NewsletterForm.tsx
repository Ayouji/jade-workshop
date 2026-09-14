'use client';

import React, { useState } from 'react';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';

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
      <div className="flex items-center justify-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md text-xs sm:text-sm font-medium max-w-md mx-auto animate-in fade-in">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
        <span>Thank you. You will receive Jade&apos;s monthly planting calendar and priority booking notices.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md mx-auto">
      {/* Name Inputs */}
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
            className="w-full h-11 px-3.5 bg-white border border-stone-200 rounded-lg text-xs sm:text-sm text-[#24211D] placeholder:text-stone-400 focus:outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors"
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
            className="w-full h-11 px-3.5 bg-white border border-stone-200 rounded-lg text-xs sm:text-sm text-[#24211D] placeholder:text-stone-400 focus:outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors"
          />
        </div>
      </div>

      {/* Email Input */}
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
          className="w-full h-11 px-3.5 bg-white border border-stone-200 rounded-lg text-xs sm:text-sm text-[#24211D] placeholder:text-stone-400 focus:outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors"
        />
      </div>

      {/* Solid Dark-Green Submit Button */}
      <button
        type="submit"
        className="w-full h-12 px-6 bg-[#2D4A3E] hover:bg-[#1E342B] text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#2D4A3E]/30 focus:outline-none"
      >
        <span>Subscribe to Seasonal Notes</span>
        <ArrowUpRight className="w-4 h-4 shrink-0" />
      </button>
    </form>
  );
}
