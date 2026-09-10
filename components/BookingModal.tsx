'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { createBooking, BookingFormState } from '@/app/actions/booking';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Loader2, Sparkles, User, Mail, Phone, Ticket } from 'lucide-react';

interface BookingModalProps {
  workshop: WorkshopWithAvailability | null;
  onClose: () => void;
}

export function BookingModal({ workshop, onClose }: BookingModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<BookingFormState | null>(null);

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPending, onClose]);

  if (!workshop) return null;

  const isSoldOut = workshop.remaining_seats <= 0;
  // Maximum de places réservables : limité à 3 ou aux places restantes
  const maxSeatsAllowed = Math.min(3, Math.max(1, workshop.remaining_seats));
  const availableOptions = Array.from({ length: maxSeatsAllowed }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createBooking(formState, formData);
      setFormState(result);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1B1C57]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-[#1B1C57]">
        {/* Header de la Modale */}
        <div className="relative bg-[#F8F9FD] p-6 sm:p-8 border-b border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="absolute top-5 right-5 text-[#64748B] hover:text-[#1B1C57] p-2 rounded-full hover:bg-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Réservation en 3 clics</span>
          </div>

          <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-bold text-[#1B1C57] leading-tight pr-8">
            {workshop.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2.5 mt-3.5 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 font-semibold bg-white px-3 py-1 rounded-full border border-gray-200/80 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-[#D93829]" />
              {workshop.date}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold bg-white px-3 py-1 rounded-full border border-gray-200/80 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#1B1C57]" />
              {workshop.start_time} - {workshop.end_time}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-bold px-3 py-1 rounded-full ${
                workshop.remaining_seats <= 2
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {workshop.remaining_seats} place{workshop.remaining_seats > 1 ? 's' : ''} restante{workshop.remaining_seats > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Corps de la Modale */}
        <div className="p-6 sm:p-8">
          {formState?.success ? (
            /* Écran de Succès Chaleureux */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#1B1C57]">
                  Réservation confirmée !
                </h3>
                <p className="text-sm text-[#64748B] mt-2 max-w-sm mx-auto leading-relaxed">
                  Un email vous a été envoyé avec tous les détails pratiques de votre atelier. Nous avons hâte de vous accueillir !
                </p>
              </div>

              <div className="p-4 bg-[#F8F9FD] rounded-2xl border border-gray-100 text-left text-xs space-y-1.5 mt-4">
                <p className="font-bold text-[#1B1C57]">Rappel de votre session :</p>
                <p className="text-[#64748B]">• Atelier : {workshop.title}</p>
                <p className="text-[#64748B]">• Date & Heure : {workshop.date} ({workshop.start_time} - {workshop.end_time})</p>
                <p className="text-[#64748B]">• Places réservées : {selectedSeats} place{selectedSeats > 1 ? 's' : ''}</p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 px-5 bg-[#1B1C57] hover:bg-[#252775] text-white font-bold rounded-2xl transition-all shadow-md text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : isSoldOut ? (
            /* Cas où l'atelier est complet */
            <div className="py-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
              <h3 className="text-lg font-bold text-[#1B1C57]">Cet atelier est complet</h3>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                Toutes les places pour ce créneau ont été réservées. Veuillez choisir une autre date ou nous contacter.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1B1C57] font-semibold rounded-full text-xs transition-colors"
              >
                Retour aux ateliers
              </button>
            </div>
          ) : (
            /* Formulaire de réservation */
            <form onSubmit={handleSubmit} className="space-y-4">
              {formState && !formState.success && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="font-medium">{formState.message}</p>
                </div>
              )}

              <input type="hidden" name="workshopId" value={workshop.id} />

              {/* Champ 1 : Nom complet */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C57] mb-1.5">
                  Nom complet <span className="text-[#D93829]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex : Camille Martin"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-[#1B1C57] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#1B1C57]/20 focus:border-[#1B1C57] transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Champ 2 : Email */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C57] mb-1.5">
                  Adresse email <span className="text-[#D93829]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Ex : camille.martin@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-[#1B1C57] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#1B1C57]/20 focus:border-[#1B1C57] transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Champ 3 : Téléphone */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C57] mb-1.5">
                  Numéro de téléphone <span className="text-[#D93829]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Ex : 06 12 34 56 78"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-[#1B1C57] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#1B1C57]/20 focus:border-[#1B1C57] transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Champ 4 : Nombre de places (Select / Choix limité) */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C57] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#D93829]" />
                    Nombre de places
                  </span>
                  <span className="text-[11px] text-[#64748B] font-normal">
                    (Max {maxSeatsAllowed} place{maxSeatsAllowed > 1 ? 's' : ''})
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {availableOptions.map((num) => {
                    const isSelected = selectedSeats === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedSeats(num)}
                        className={`py-2.5 px-3 text-xs font-bold rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-[#1B1C57] text-white border-[#1B1C57] shadow-sm scale-[1.02]'
                            : 'bg-white text-[#1B1C57] border-gray-200 hover:border-[#1B1C57]/40'
                        }`}
                      >
                        {num} place{num > 1 ? 's' : ''}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="seats" value={selectedSeats} />
              </div>

              {/* Bouton de soumission avec état de chargement */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 px-5 bg-[#1B1C57] hover:bg-[#252775] disabled:opacity-60 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirmation en cours...</span>
                    </>
                  ) : (
                    <span>Confirmer ma réservation ({selectedSeats} place{selectedSeats > 1 ? 's' : ''})</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
