'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { WorkshopCard } from './WorkshopCard';
import { BookingModal } from './BookingModal';
import {
  Calendar,
  Clock,
  MapPin,
  Sprout,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
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
    <div className="space-y-12">
      {/* 1. Planning Timeline des 5 Samedis d'Octobre (Style Evento) */}
      <div className="space-y-4">
        {workshops.map((ws, index) => {
          const isSoldOut = ws.remaining_seats <= 0;
          return (
            <div
              key={ws.id}
              className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md hover:border-[#52B788]/40 transition-all group"
            >
              {/* Date & Tag */}
              <div className="space-y-1.5 md:w-1/4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                  Week 0{index + 1} • Saturday
                </span>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1B4332]" />
                  <span>{formatDateShort(ws.date)}</span>
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>{ws.start_time} - {ws.end_time}</span>
                </div>
              </div>

              {/* Détails du programme */}
              <div className="space-y-1.5 md:w-1/2">
                <h5 className="text-base font-bold text-slate-900 group-hover:text-[#1B4332] transition-colors">
                  {ws.title}
                </h5>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ws.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] ${
                      isSoldOut
                        ? 'bg-red-50 text-red-700'
                        : ws.remaining_seats <= 2
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    {isSoldOut
                      ? 'Session Full'
                      : `${ws.remaining_seats} / ${ws.capacity} spots left`}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 text-[11px]">Free Admission</span>
                </div>
              </div>

              {/* Bouton de réservation directe */}
              <div className="md:w-1/4 flex justify-start md:justify-end w-full">
                <button
                  type="button"
                  onClick={() => setSelectedWorkshop(ws)}
                  disabled={isSoldOut}
                  aria-label={`Book spot for ${ws.title}`}
                  className={`w-full md:w-auto px-6 py-3 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isSoldOut
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white hover:shadow hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{isSoldOut ? 'Session Full' : 'Book This'}</span>
                  {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Visual Workshop Cards Grid */}
      <div className="pt-6 border-t border-gray-200/60">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
              October Workshop Catalog
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Explore All 5 Saturday Topics
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Each session focuses on a specialized aspect of cool-season gardening and herb cultivation.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F7F3] text-[#1B4332] rounded-full text-xs font-bold border border-[#52B788]/30">
            <Sprout className="w-4 h-4 text-[#52B788]" />
            <span>Community Garden • 10 Spots/Session</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onBook={(ws) => setSelectedWorkshop(ws)}
            />
          ))}
        </div>
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
