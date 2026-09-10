'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { WorkshopCard } from './WorkshopCard';
import { BookingModal } from './BookingModal';
import { Sparkles, Bell } from 'lucide-react';

interface WorkshopGridProps {
  workshops: WorkshopWithAvailability[];
}

export function WorkshopGrid({ workshops }: WorkshopGridProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAvailability | null>(null);

  // Composant d'attente / Empty State élégant (anti-vide)
  if (!workshops || workshops.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16 px-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#D93829]/10 text-[#D93829] flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#1B1C57]">
            Prochains ateliers bientôt disponibles
          </h3>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Jade prépare actuellement la programmation des prochaines sessions de tournage et de modelage.
            Inscrivez-vous à la newsletter en bas de page pour être informé en avant-première de l&apos;ouverture des places.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B1C57] hover:bg-[#252775] text-white text-xs font-bold rounded-full transition-all shadow-sm hover:shadow"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Être prévenu des nouvelles dates</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Grille responsive 1 / 2 / 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onBook={(ws) => setSelectedWorkshop(ws)}
          />
        ))}
      </div>

      {/* Modale interactive de réservation */}
      {selectedWorkshop && (
        <BookingModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </>
  );
}
