'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from './BookingModal';
import {
  Clock,
  ArrowUpRight,
  Sprout,
  CheckCircle,
} from 'lucide-react';

interface OctoberScheduleProps {
  workshops: WorkshopWithAvailability[];
}

export function OctoberSchedule({ workshops }: OctoberScheduleProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAvailability | null>(null);

  const formatDateMetadata = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d).toUpperCase();
      const monthStr = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d).toUpperCase();
      const dayNum = String(day).padStart(2, '0');
      return {
        weekday,
        monthStr,
        dayNum,
        fullFormatted: `${weekday}, ${monthStr} ${dayNum}`,
      };
    } catch {
      return {
        weekday: 'SAT',
        monthStr: 'OCT',
        dayNum: '00',
        fullFormatted: dateStr,
      };
    }
  };

  // Empty state if all sessions have passed or no workshops currently in database
  if (!workshops || workshops.length === 0) {
    return (
      <div className="w-full text-center py-16 px-6 bg-white rounded-lg border border-[#E5E5E0] space-y-4">
        <div className="w-12 h-12 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center mx-auto border border-[#E5E5E0]">
          <Sprout className="w-5 h-5 text-[#2D4A3E]" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wide">
            Next Workshop Series Coming Soon
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Current seasonal sessions have completed. Sign up to receive priority notification when the next schedule is published.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="#contact-us"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D4A3E] hover:bg-[#1E342B] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
          >
            <span>Notify Me of New Dates</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Swiss Tabular List Header (Desktop Only) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-3 border-b border-[#E5E5E0] text-[11px] font-bold uppercase tracking-widest text-stone-500">
        <div className="col-span-3">Session &amp; Date</div>
        <div className="col-span-5">Workshop Syllabus &amp; Details</div>
        <div className="col-span-2 text-center">Availability</div>
        <div className="col-span-2 text-right">Registration</div>
      </div>

      {/* Rows Container with Hairline Horizontal Dividers */}
      <div className="divide-y divide-[#E5E5E0] border-y border-[#E5E5E0]">
        {workshops.map((ws, index) => {
          const isSoldOut = ws.remaining_seats <= 0;
          const dateMeta = formatDateMetadata(ws.date);
          const sessionIndex = String(index + 1).padStart(2, '0');

          return (
            <div
              key={ws.id}
              className="py-5 sm:py-6 group transition-colors hover:bg-white/60"
            >
              {/* Desktop 12-Column Grid */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                {/* Col 1: Date & Metadata */}
                <div className="col-span-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      {sessionIndex}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#1A1A1A] tracking-tight">
                      {dateMeta.fullFormatted}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{ws.start_time} – {ws.end_time}</span>
                  </div>
                </div>

                {/* Col 2: Title & Description */}
                <div className="col-span-5 space-y-1 pr-4">
                  <h3 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#2D4A3E] transition-colors leading-snug">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {ws.description}
                  </p>
                </div>

                {/* Col 3: Capacity & Pricing Status */}
                <div className="col-span-2 flex flex-col items-center justify-center space-y-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border ${
                      isSoldOut
                        ? 'bg-stone-100 text-stone-500 border-stone-300'
                        : ws.remaining_seats <= 2
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    {isSoldOut ? 'Session Full' : `${ws.remaining_seats} / ${ws.capacity} spots left`}
                  </span>
                  <span className="text-[10px] text-stone-500 tracking-tight">
                    100% Free • All Tools Provided
                  </span>
                </div>

                {/* Col 4: Action Button */}
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedWorkshop(ws)}
                    disabled={isSoldOut}
                    aria-label={`Book spot for ${ws.title}`}
                    className={`h-10 px-5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus:ring-2 focus:ring-[#2D4A3E]/30 focus:outline-none ${
                      isSoldOut
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : 'bg-[#2D4A3E] hover:bg-[#1E342B] text-white shadow-2xs'
                    }`}
                  >
                    <span>{isSoldOut ? 'Sold Out' : 'Book Spot'}</span>
                    {!isSoldOut && <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* Mobile Layout (Stacked & Clean) */}
              <div className="lg:hidden space-y-3.5">
                {/* Top: Index, Date & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      {sessionIndex}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#1A1A1A]">
                      {dateMeta.fullFormatted}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono text-xs text-stone-500">
                      {ws.start_time} – {ws.end_time}
                    </span>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                      isSoldOut
                        ? 'bg-stone-100 text-stone-500 border-stone-300'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    {isSoldOut ? 'Full' : `${ws.remaining_seats} spots`}
                  </span>
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {ws.description}
                  </p>
                </div>

                {/* Bottom: Free Notice & Full-width Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-stone-500 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>Free community coaching &amp; starter pots included</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedWorkshop(ws)}
                    disabled={isSoldOut}
                    className={`w-full sm:w-auto h-11 px-6 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                      isSoldOut
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : 'bg-[#2D4A3E] hover:bg-[#1E342B] text-white'
                    }`}
                  >
                    <span>{isSoldOut ? 'Session Full' : 'Book This Saturday'}</span>
                    {!isSoldOut && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
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
