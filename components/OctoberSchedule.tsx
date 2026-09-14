'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from './BookingModal';
import { ArrowUpRight, Clock, ArrowRight } from 'lucide-react';

interface OctoberScheduleProps {
  workshops: WorkshopWithAvailability[];
}

export function OctoberSchedule({ workshops }: OctoberScheduleProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAvailability | null>(null);

  const formatDateLabel = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const getMonthLabel = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d).toUpperCase();
    } catch {
      return 'SESSION';
    }
  };

  if (!workshops || workshops.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white border border-stone-200 rounded-2xl max-w-xl mx-auto space-y-4">
        <span className="font-serif text-2xl text-[#24211D] block">
          Upcoming Workshops
        </span>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          Our current series is complete. New seasonal workshop dates are published regularly. Join our newsletter to receive early invitations.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#24211D] hover:bg-[#B85B3A] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors"
        >
          <span>Join Priority List</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-24">
      {workshops.map((ws, index) => {
        const isSoldOut = ws.remaining_seats <= 0;
        const isReversed = index % 2 === 1;
        const indexStr = String(index + 1).padStart(2, '0');
        const fallbackImage = index % 2 === 0
          ? '/studio_hero.jpg'
          : '/hero_gardening.jpg';
        const displayImage = ws.image_url || fallbackImage;

        return (
          <article
            key={ws.id}
            className="group pb-16 sm:pb-24 border-b border-stone-200 last:border-b-0"
          >
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
              {/* Workshop Editorial Image (Col-span-7) */}
              <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                <Link
                  href={`/workshops/${ws.id}`}
                  className="block relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#EDE8DF] border border-stone-200 shadow-2xs"
                >
                  <Image
                    src={displayImage}
                    alt={ws.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Corner Index Pill */}
                  <div className="absolute top-4 left-4 bg-[#F7F5F0]/90 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider text-[#24211D] border border-stone-200">
                    {indexStr}
                  </div>
                </Link>
              </div>

              {/* Workshop Editorial Content & Booking (Col-span-5) */}
              <div className={`lg:col-span-5 space-y-6 text-left ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                {/* Uppercase date badge & seat status */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">
                    WORKSHOP / {getMonthLabel(ws.date)} · {indexStr}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {ws.capacity} seats · {isSoldOut ? 'Sold out' : `${ws.remaining_seats} available`}
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#24211D] tracking-tight leading-snug group-hover:text-[#B85B3A] transition-colors">
                    <Link href={`/workshops/${ws.id}`}>
                      {ws.title}
                    </Link>
                  </h3>

                  {/* Date & Time */}
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-stone-500 font-medium pt-1">
                    <span>{formatDateLabel(ws.date)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#B85B3A]" />
                      {ws.start_time} — {ws.end_time}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed font-normal">
                  {ws.description}
                </p>

                {/* Status and Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  {/* Terracotta "Book Workshop" pill button */}
                  <button
                    type="button"
                    onClick={() => setSelectedWorkshop(ws)}
                    disabled={isSoldOut}
                    className={`h-12 px-7 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSoldOut
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-[#B85B3A] hover:bg-[#9E4B2F] text-white shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <span>{isSoldOut ? 'Session Full' : 'Book Workshop'}</span>
                    {!isSoldOut && <ArrowUpRight className="w-3.5 h-3.5" />}
                  </button>

                  {/* Outlined "View Details" button */}
                  <Link
                    href={`/workshops/${ws.id}`}
                    className="h-12 px-6 rounded-full text-xs uppercase tracking-widest font-semibold border border-stone-300 hover:border-[#24211D] text-[#24211D] hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {/* Interactive Booking Modal */}
      {selectedWorkshop && (
        <BookingModal
          workshops={workshops}
          initialWorkshopId={selectedWorkshop.id}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </div>
  );
}
