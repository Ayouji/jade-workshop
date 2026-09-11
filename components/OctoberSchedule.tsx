'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { BookingModal } from './BookingModal';
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
} from 'lucide-react';

interface OctoberScheduleProps {
  workshops: WorkshopWithAvailability[];
}

export function OctoberSchedule({ workshops }: OctoberScheduleProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAvailability | null>(null);

  const formatDateShort = (dateStr: string) => {
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

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* 1. Planning Timeline des 5 Samedis d'Octobre */}
      <div className="space-y-4 sm:space-y-5">
        {workshops.map((ws, index) => {
          const isSoldOut = ws.remaining_seats <= 0;
          return (
            <div
              key={ws.id}
              className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 hover:shadow-md hover:border-[#52B788]/40 transition-all group"
            >
              {/* Date, Week Badge & Time (Vertical on mobile, aligned on desktop) */}
              <div className="space-y-1.5 md:w-1/4 shrink-0">
                <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#52B788]">
                  Week 0{index + 1} • Saturday
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1B4332] shrink-0" />
                  <span>{formatDateShort(ws.date)}</span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                  <span>{ws.start_time} – {ws.end_time}</span>
                </div>
              </div>

              {/* Title, Description & Availability Badges */}
              <div className="space-y-2 md:w-1/2 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1B4332] transition-colors leading-snug">
                  {ws.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ws.description}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      isSoldOut
                        ? 'bg-red-50 text-red-700'
                        : ws.remaining_seats <= 2
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    <Users className="w-3 h-3 shrink-0" />
                    {isSoldOut
                      ? 'Session Full'
                      : `${ws.remaining_seats} / ${ws.capacity} spots left`}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-slate-600 text-[11px] font-medium bg-slate-100/80 px-2.5 py-0.5 rounded-full sm:bg-transparent sm:p-0">
                    Free Community Admission
                  </span>
                </div>
              </div>

              {/* Call to Action Button: Full width on mobile (< md), auto on desktop */}
              <div className="md:w-1/4 flex justify-stretch md:justify-end w-full shrink-0 pt-2 md:pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedWorkshop(ws)}
                  disabled={isSoldOut}
                  aria-label={`Book spot for ${ws.title}`}
                  className={`w-full md:w-auto min-h-[44px] px-6 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isSoldOut
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white hover:shadow hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <span>{isSoldOut ? 'Session Full' : 'Book This'}</span>
                  {!isSoldOut && <ArrowRight className="w-4 h-4 shrink-0" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modale interactive de réservation */}
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
