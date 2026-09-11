'use client';

import React from 'react';
import Image from 'next/image';
import { WorkshopWithAvailability } from '@/lib/db';
import { Calendar, Clock, ArrowRight, Users, Sprout } from 'lucide-react';

interface WorkshopCardProps {
  workshop: WorkshopWithAvailability;
  onBook: (workshop: WorkshopWithAvailability) => void;
}

/**
 * Formate une date ISO 'YYYY-MM-DD' en format clair : ex: "Saturday, Oct 3"
 */
function formatSessionDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);

      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(d);
    }

    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function WorkshopCard({ workshop, onBook }: WorkshopCardProps) {
  const isSoldOut = workshop.remaining_seats <= 0;
  const isLastSeats = !isSoldOut && workshop.remaining_seats <= 2;
  const formattedDate = formatSessionDate(workshop.date);

  return (
    <article className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      {/* 1. Image de couverture */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        {workshop.image_url ? (
          <Image
            src={workshop.image_url}
            alt={workshop.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F4F7F3] to-gray-200 text-[#1B4332]/40">
            <Sprout className="w-10 h-10 opacity-60" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Badge disponibilité */}
        <div className="absolute top-4 right-4 z-10">
          {isSoldOut ? (
            <span className="px-3.5 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold rounded-full tracking-wide shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Sold Out
            </span>
          ) : isLastSeats ? (
            <span className="px-3.5 py-1.5 bg-[#D93829] text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              {workshop.remaining_seats === 1
                ? 'Last Spot!'
                : `Only ${workshop.remaining_seats} spots left!`}
            </span>
          ) : (
            <span className="px-3.5 py-1.5 bg-[#1B4332] text-white text-xs font-bold rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#52B788]" />
              {workshop.remaining_seats} spots available
            </span>
          )}
        </div>

        {/* Tag discret */}
        <div className="absolute bottom-3 left-4 z-10">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#0F172A] text-[11px] font-bold rounded-full shadow-xs">
            Saturday Session
          </span>
        </div>
      </div>

      {/* 2. Contenu textuel */}
      <div className="flex flex-col flex-1 p-6 sm:p-7">
        {/* Date & Heure */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 text-[#1B4332]">
            <Calendar className="w-4 h-4 shrink-0 text-[#52B788]" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-4 h-4 shrink-0 text-[#1B4332]" />
            <span>{workshop.start_time} - {workshop.end_time}</span>
          </div>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-[#0F172A] leading-snug mb-2.5 group-hover:text-[#1B4332] transition-colors line-clamp-1">
          {workshop.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-6">
          {workshop.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-4 h-4 text-[#1B4332]/70" />
            <span>Capacity: {workshop.capacity}</span>
          </div>

          <button
            type="button"
            onClick={() => onBook(workshop)}
            disabled={isSoldOut}
            aria-label={`Book spot for ${workshop.title} on ${formattedDate}`}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm ${
              isSoldOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white hover:shadow-md hover:scale-[1.03] active:scale-[0.98]'
            }`}
          >
            <span>{isSoldOut ? 'Sold Out' : 'Book My Spot'}</span>
            {!isSoldOut && (
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
