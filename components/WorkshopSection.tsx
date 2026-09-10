'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { WorkshopCard } from './WorkshopCard';
import { BookingModal } from './BookingModal';
import { Sparkles, Calendar } from 'lucide-react';

interface WorkshopSectionProps {
  workshops: WorkshopWithAvailability[];
}

export function WorkshopSection({ workshops }: WorkshopSectionProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAvailability | null>(null);

  return (
    <section id="ateliers" className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6">
      {/* En-tête de section style EVENTO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-terracotta-light text-terracotta text-xs font-bold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendrier des Sessions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-dark tracking-tight leading-[1.15]">
            Nos Ateliers Disponibles
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-dark/75 max-w-md leading-relaxed">
          Choisissez votre créneau et réservez votre place en 3 clics. Aucun paiement immédiat n&apos;est requis, le règlement s&apos;effectue sur place le jour de l&apos;atelier.
        </p>
      </div>

      {/* Grille d'ateliers ou message d'état vide */}
      {workshops.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white/70 rounded-3xl border border-warm-200 shadow-sm max-w-xl mx-auto">
          <Sparkles className="w-12 h-12 mx-auto text-terracotta/70 mb-3" />
          <h3 className="text-xl font-bold text-slate-dark">Toutes les sessions sont actuellement passées</h3>
          <p className="text-sm text-slate-dark/70 mt-2">
            Jade prépare actuellement les prochaines dates d&apos;ateliers. N&apos;hésitez pas à vous inscrire à notre newsletter pour être prévenu en priorité !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onBook={(ws) => setSelectedWorkshop(ws)}
            />
          ))}
        </div>
      )}

      {/* Modale de Réservation */}
      {selectedWorkshop && (
        <BookingModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </section>
  );
}
