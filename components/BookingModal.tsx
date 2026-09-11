'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { WorkshopWithAvailability } from '@/lib/db';
import { createBooking, BookingFormState } from '@/app/actions/booking';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sprout,
  User,
  Mail,
  Phone,
  Ticket,
  MapPin,
} from 'lucide-react';

interface BookingModalProps {
  workshops?: WorkshopWithAvailability[];
  workshop?: WorkshopWithAvailability | null;
  initialWorkshopId?: string | null;
  onClose: () => void;
}

export function BookingModal({
  workshops: workshopsProp,
  workshop: singleWorkshop,
  initialWorkshopId,
  onClose,
}: BookingModalProps) {
  // Déterminer la liste des ateliers disponibles
  const availableWorkshops = React.useMemo(() => {
    if (workshopsProp && workshopsProp.length > 0) return workshopsProp;
    if (singleWorkshop) return [singleWorkshop];
    return [];
  }, [workshopsProp, singleWorkshop]);

  // Sélection du workshop actif (par défaut le premier disponible ou celui cliqué)
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(() => {
    if (initialWorkshopId && availableWorkshops.some((w) => w.id === initialWorkshopId)) {
      return initialWorkshopId;
    }
    if (singleWorkshop) return singleWorkshop.id;
    return availableWorkshops[0]?.id || '';
  });

  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<BookingFormState | null>(null);

  const currentWorkshop =
    availableWorkshops.find((w) => w.id === selectedWorkshopId) || availableWorkshops[0];

  // Gestion de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPending, onClose]);

  // Réinitialiser les places si la capacité de la nouvelle date est inférieure
  useEffect(() => {
    if (currentWorkshop && selectedSeats > Math.max(1, currentWorkshop.remaining_seats)) {
      setSelectedSeats(1);
    }
  }, [currentWorkshop, selectedSeats]);

  if (!currentWorkshop) return null;

  const isSoldOut = currentWorkshop.remaining_seats <= 0;
  const maxSeatsAllowed = Math.min(3, Math.max(1, currentWorkshop.remaining_seats));
  const availableSeatOptions = Array.from({ length: maxSeatsAllowed }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createBooking(formState, formData);
      setFormState(result);
    });
  };

  /**
   * Formate une date YYYY-MM-DD en texte clair (ex: Sat, Oct 3)
   */
  const formatDateLabel = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Mois actif calculé dynamiquement
  const activeMonthLabel = React.useMemo(() => {
    if (availableWorkshops.length === 0) return 'Upcoming Dates';
    try {
      const dates = availableWorkshops.map((w) => {
        const [year, month, day] = w.date.split('-').map(Number);
        return new Date(year, month - 1, day);
      });
      const months = Array.from(
        new Set(
          dates.map((d) =>
            new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d)
          )
        )
      );
      return months.join(' / ');
    } catch {
      return 'Upcoming Dates';
    }
  }, [availableWorkshops]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-slate-900 my-auto max-h-[92vh] flex flex-col">
        {/* Header de la Modale */}
        <div className="relative bg-[#F4F7F3] p-5 sm:p-6 border-b border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider mb-2">
            <Sprout className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Seasonal Gardening Basics</span>
          </div>

          <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight pr-10">
            Book Your Spot
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Free community session hosted by Jade Belstead • Kingston, NY
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold bg-white px-3 py-1 rounded-full border border-gray-200/80 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#1B4332]" />
              {currentWorkshop.start_time} – {currentWorkshop.end_time}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold bg-white px-3 py-1 rounded-full border border-gray-200/80 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#52B788]" />
              Kingston Community Garden
            </span>
          </div>
        </div>

        {/* Corps de la Modale scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {formState?.success ? (
            /* Écran de Succès */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Your spot for <strong>Seasonal Gardening Basics</strong> has been booked. A confirmation email with all practical details has been sent to you.
                </p>
              </div>

              <div className="p-4 bg-[#F4F7F3] rounded-2xl border border-gray-100 text-left text-xs space-y-1.5 mt-4">
                <p className="font-bold text-[#0F172A]">Session Summary:</p>
                <p className="text-slate-700">• Workshop: {currentWorkshop.title}</p>
                <p className="text-slate-700">
                  • Date &amp; Time: {formatDateLabel(currentWorkshop.date)} ({currentWorkshop.start_time} – {currentWorkshop.end_time})
                </p>
                <p className="text-slate-700">
                  • Reserved Seats: {selectedSeats} ticket{selectedSeats > 1 ? 's' : ''} (Free)
                </p>
                <p className="text-slate-700">• Host: Jade Belstead (10+ Years Community Experience)</p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full min-h-[48px] py-3.5 px-5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-md text-sm cursor-pointer"
                >
                  Close &amp; Back to Workshops
                </button>
              </div>
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

              {/* Sélecteur de date dynamique */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1B4332]" />
                    Select Workshop Date Slot <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[11px] text-[#52B788] font-semibold">
                    {activeMonthLabel}
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableWorkshops.map((ws) => {
                    const isSelected = ws.id === selectedWorkshopId;
                    const wsSoldOut = ws.remaining_seats <= 0;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => setSelectedWorkshopId(ws.id)}
                        disabled={wsSoldOut}
                        aria-pressed={isSelected}
                        className={`min-h-[48px] p-2.5 text-left rounded-xl sm:rounded-2xl border transition-all relative ${
                          isSelected
                            ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                            : wsSoldOut
                            ? 'bg-gray-50 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed'
                            : 'bg-white text-slate-800 border-gray-200 hover:border-[#1B4332]/50 hover:bg-[#F4F7F3]'
                        }`}
                      >
                        <span className="block text-xs font-bold">
                          {formatDateLabel(ws.date)}
                        </span>
                        <span
                          className={`block text-[10px] mt-0.5 ${
                            isSelected
                              ? 'text-emerald-200'
                              : wsSoldOut
                              ? 'text-red-500'
                              : ws.remaining_seats <= 2
                              ? 'text-amber-600 font-bold'
                              : 'text-emerald-700 font-medium'
                          }`}
                        >
                          {wsSoldOut
                            ? 'Sold Out'
                            : `${ws.remaining_seats} spot${ws.remaining_seats > 1 ? 's' : ''} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hidden input workshopId lié à la session choisie */}
              <input type="hidden" name="workshopId" value={selectedWorkshopId} />

              {/* Champ 1 : Nom complet */}
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-xs font-bold text-slate-900 mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="booking-name"
                    type="text"
                    name="name"
                    required
                    aria-label="Full Name"
                    placeholder="e.g. Eleanor Vance"
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all"
                  />
                </div>
              </div>

              {/* Champ 2 : Email */}
              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-xs font-bold text-slate-900 mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="booking-email"
                    type="email"
                    name="email"
                    required
                    aria-label="Email Address"
                    placeholder="e.g. eleanor@example.com"
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all"
                  />
                </div>
              </div>

              {/* Champ 3 : Téléphone */}
              <div>
                <label
                  htmlFor="booking-phone"
                  className="block text-xs font-bold text-slate-900 mb-1.5"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="booking-phone"
                    type="tel"
                    name="phone"
                    required
                    aria-label="Phone Number"
                    placeholder="e.g. (555) 234-5678"
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all"
                  />
                </div>
              </div>

              {/* Champ 4 : Nombre de places */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#1B4332]" />
                    Number of Spots (Free)
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    (Max {maxSeatsAllowed} spot{maxSeatsAllowed > 1 ? 's' : ''})
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {availableSeatOptions.map((num) => {
                    const isSelected = selectedSeats === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedSeats(num)}
                        aria-pressed={isSelected}
                        className={`min-h-[44px] py-2.5 px-3 text-xs font-bold rounded-xl sm:rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm scale-[1.02]'
                            : 'bg-white text-slate-800 border-gray-200 hover:border-[#1B4332]/40'
                        }`}
                      >
                        {num} spot{num > 1 ? 's' : ''}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="seats" value={selectedSeats} />
              </div>

              {/* Notice no-payment flow */}
              <p className="text-[11px] text-slate-500 text-center pt-1">
                🌱 100% Free community workshop. No payment or credit card required.
              </p>

              {/* Bouton de soumission avec état de chargement */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending || isSoldOut}
                  className="w-full min-h-[48px] py-3.5 px-5 bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Your Spot...</span>
                    </>
                  ) : isSoldOut ? (
                    <span>This Date is Full</span>
                  ) : (
                    <span>
                      Confirm Free Booking ({selectedSeats} spot{selectedSeats > 1 ? 's' : ''})
                    </span>
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
