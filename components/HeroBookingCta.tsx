'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from './BookingModal';
import { ArrowRight, Calendar } from 'lucide-react';

interface HeroBookingCtaProps {
  workshops: WorkshopWithAvailability[];
}

export function HeroBookingCta({ workshops }: HeroBookingCtaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-full text-sm sm:text-base transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5"
          aria-label="Book Your Spot for October"
        >
          <span>Book Your Spot for October</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <a
          href="#schedule"
          className="px-8 py-4 bg-white/80 hover:bg-white text-slate-800 font-bold rounded-full text-sm sm:text-base border border-slate-200 transition-all hover:shadow-md flex items-center gap-2"
        >
          <Calendar className="w-4 h-4 text-[#1B4332]" />
          <span>October Schedule</span>
        </a>
      </div>

      {isOpen && (
        <BookingModal
          workshops={workshops}
          initialWorkshopId={workshops[0]?.id}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
