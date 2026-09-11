'use client';

import React, { useState } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { WorkshopCard } from './WorkshopCard';
import { BookingModal } from './BookingModal';
import { Sprout, Bell } from 'lucide-react';

interface WorkshopGridProps {
  workshops: WorkshopWithAvailability[];
}

export function WorkshopGrid({ workshops }: WorkshopGridProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAvailability | null>(null);

  // Empty state élégant
  if (!workshops || workshops.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16 px-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mx-auto shadow-sm">
          <Sprout className="w-8 h-8 text-[#52B788]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#0F172A]">
            Upcoming Sessions Announced Soon
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Jade is currently scheduling upcoming Saturday gardening workshops.
            Subscribe to our newsletter below to be the first notified when spots open.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="#contact-us"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold rounded-full transition-all shadow-sm hover:shadow"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notify Me of New Dates</span>
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

      {/* Modale interactive de réservation avec sélecteur de créneaux */}
      {selectedWorkshop && (
        <BookingModal
          workshops={workshops}
          initialWorkshopId={selectedWorkshop.id}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </>
  );
}
