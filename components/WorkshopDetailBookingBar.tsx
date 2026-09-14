'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from '@/components/BookingModal';
import { ArrowUpRight } from 'lucide-react';

interface WorkshopDetailBookingBarProps {
  workshop: WorkshopWithAvailability;
  allWorkshops: WorkshopWithAvailability[];
}

export function WorkshopDetailBookingBar({
  workshop,
  allWorkshops,
}: WorkshopDetailBookingBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isSoldOut = workshop.remaining_seats <= 0;

  return (
    <>
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs sticky top-28">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B85B3A] block">
            Participation &amp; Admission
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#24211D]">
              Free Workshop
            </span>
            <span className="text-xs text-stone-500">· Materials included</span>
          </div>
        </div>

        {/* Live seat status */}
        <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-stone-200 flex items-center justify-between text-xs font-mono">
          <span className="text-stone-500">Available Seats</span>
          <span className={`font-bold ${isSoldOut ? 'text-red-700' : 'text-[#B85B3A]'}`}>
            {isSoldOut ? 'Sold Out' : `${workshop.remaining_seats} of ${workshop.capacity} left`}
          </span>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={isSoldOut}
          className={`w-full h-13 px-6 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isSoldOut
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#B85B3A] hover:bg-[#9E4B2F] text-white shadow-xs hover:shadow-sm'
          }`}
        >
          <span>{isSoldOut ? 'Session Full' : 'BOOK THIS WORKSHOP'}</span>
          {!isSoldOut && <ArrowUpRight className="w-4 h-4" />}
        </button>

        <p className="text-[11px] text-stone-500 text-center leading-relaxed">
          No credit card required. Intimate small-group studio atmosphere with individual attention.
        </p>
      </div>

      {isOpen && (
        <BookingModal
          workshops={allWorkshops.length > 0 ? allWorkshops : [workshop]}
          initialWorkshopId={workshop.id}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
