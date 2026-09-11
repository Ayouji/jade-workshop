'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from './BookingModal';
import { ArrowRight, Calendar } from 'lucide-react';

interface HeroBookingCtaProps {
  workshops: WorkshopWithAvailability[];
  ctaLabel?: string;
  scheduleLabel?: string;
}

export function HeroBookingCta({
  workshops,
  ctaLabel = 'Book Your Spot for October',
  scheduleLabel = 'October Schedule',
}: HeroBookingCtaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 w-full">
        {/* Primary Call to Action */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-full text-sm sm:text-base transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5"
          aria-label={ctaLabel}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>

        {/* Secondary Navigation CTA */}
        <a
          href="#schedule"
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-white/90 hover:bg-white text-slate-800 font-bold rounded-full text-sm sm:text-base border border-slate-200 transition-all hover:shadow-md flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4 text-[#1B4332] shrink-0" />
          <span>{scheduleLabel}</span>
        </a>
      </div>

      {isOpen && workshops.length > 0 && (
        <BookingModal
          workshops={workshops}
          initialWorkshopId={workshops[0]?.id}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
