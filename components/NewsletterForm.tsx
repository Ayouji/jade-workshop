'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-2 p-3 bg-sage-light text-sage-700 rounded-full text-xs font-semibold max-w-md mx-auto animate-in fade-in">
        <CheckCircle2 className="w-4 h-4 text-sage" />
        <span>Merci ! Vous recevrez nos prochaines dates en avant-première.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email..."
        required
        className="w-full px-5 py-3.5 bg-white border border-warm-300 rounded-full text-sm text-slate-dark placeholder:text-slate-dark/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all shadow-sm"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-7 py-3.5 bg-slate-dark hover:bg-terracotta text-white text-xs font-bold tracking-wide rounded-full transition-all shadow-md shrink-0 cursor-pointer"
      >
        S&apos;inscrire
      </button>
    </form>
  );
}
