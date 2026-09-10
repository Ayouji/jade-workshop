'use client';

import React from 'react';
import Image from 'next/image';
import { WorkshopWithAvailability } from '@/lib/db';
import { Calendar, Clock, ArrowRight, Users, Sparkles } from 'lucide-react';

interface WorkshopCardProps {
  workshop: WorkshopWithAvailability;
  onBook: (workshop: WorkshopWithAvailability) => void;
}

/**
 * Formate une date ISO 'YYYY-MM-DD' en français élégant : ex: "Samedi 14 Octobre"
 */
function formatFrenchDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);

      const formatted = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(d);

      return formatted.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function WorkshopCard({ workshop, onBook }: WorkshopCardProps) {
  const isSoldOut = workshop.remaining_seats <= 0;
  const isLastSeats = !isSoldOut && workshop.remaining_seats <= 2;
  const formattedDate = formatFrenchDate(workshop.date);

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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8F9FD] to-gray-200 text-[#121244]/40">
            <Sparkles className="w-10 h-10 opacity-60" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Badge disponibilité */}
        <div className="absolute top-4 right-4 z-10">
          {isSoldOut ? (
            <span className="px-3.5 py-1.5 bg-[#121244]/90 backdrop-blur-md text-white text-xs font-bold rounded-full tracking-wide shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Complet
            </span>
          ) : isLastSeats ? (
            <span className="px-3.5 py-1.5 bg-[#D93829] text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              {workshop.remaining_seats === 1
                ? 'Dernière place !'
                : `Dernières ${workshop.remaining_seats} places !`}
            </span>
          ) : (
            <span className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              {workshop.remaining_seats} places libres
            </span>
          )}
        </div>

        {/* Tag discret */}
        <div className="absolute bottom-3 left-4 z-10">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#121244] text-[11px] font-bold rounded-full shadow-xs">
            Atelier Artisanal
          </span>
        </div>
      </div>

      {/* 2. Contenu textuel */}
      <div className="flex flex-col flex-1 p-6 sm:p-7">
        {/* Date & Heure */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-[#64748B] mb-3">
          <div className="flex items-center gap-1.5 text-[#D93829]">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5 text-[#121244]">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{workshop.start_time} - {workshop.end_time}</span>
          </div>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-[#121244] leading-snug mb-2.5 group-hover:text-[#D93829] transition-colors line-clamp-1">
          {workshop.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2 mb-6">
          {workshop.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <Users className="w-4 h-4 text-[#121244]/70" />
            <span>Capacité : {workshop.capacity} pers.</span>
          </div>

          <button
            type="button"
            onClick={() => onBook(workshop)}
            disabled={isSoldOut}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm ${
              isSoldOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-[#121244] hover:bg-[#1B1C57] text-white hover:shadow-md hover:scale-[1.03] active:scale-[0.98]'
            }`}
          >
            <span>{isSoldOut ? 'Complet' : 'Réserver ma place'}</span>
            {!isSoldOut && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
          </button>
        </div>
      </div>
    </article>
  );
}
