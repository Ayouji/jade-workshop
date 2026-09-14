'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from './BookingModal';
import { ArrowUpRight, Calendar } from 'lucide-react';

interface HeroBookingCtaProps {
  workshops: WorkshopWithAvailability[];
  ctaLabel?: string;
  scheduleLabel?: string;
}

export function HeroBookingCta({
  workshops,
  ctaLabel = 'Book Your Spot for October',
  scheduleLabel = 'View Full Schedule',
}: HeroBookingCtaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full">
        {/* Primary Call to Action */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-12 px-7 bg-[#2D4A3E] hover:bg-[#1E342B] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#2D4A3E]/30 focus:outline-none shadow-2xs"
          aria-label={ctaLabel}
        >
          <span>{ctaLabel}</span>
          <ArrowUpRight className="w-4 h-4 shrink-0" />
        </button>

        {/* Secondary Navigation CTA */}
        <a
          href="#schedule"
          className="h-12 px-7 bg-white hover:bg-stone-100 text-[#1A1A1A] font-medium text-xs sm:text-sm uppercase tracking-wider rounded-md border border-[#E5E5E0] transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-stone-400/20 focus:outline-none"
        >
          <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
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
