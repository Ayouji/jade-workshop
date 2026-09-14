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
  ArrowUpRight,
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
  const availableWorkshops = React.useMemo(() => {
    if (workshopsProp && workshopsProp.length > 0) return workshopsProp;
    if (singleWorkshop) return [singleWorkshop];
    return [];
  }, [workshopsProp, singleWorkshop]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPending, onClose]);

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

  const activeMonthLabel = (() => {
    try {
      const [year, month, day] = currentWorkshop.date.split('-').map(Number);
      return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month - 1, day));
    } catch {
      return 'October';
    }
  })();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1A1A]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-[#E5E5E0] overflow-hidden text-[#1A1A1A] my-8 animate-in zoom-in-95 duration-150">
        {/* Header Modale */}
        <div className="p-5 sm:p-6 border-b border-[#E5E5E0] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-[11px] font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Free Community Workshop</span>
            </div>
            <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
              Reserve Your Workshop Spot
            </h2>
            <p className="text-xs text-stone-600">
              Personalized organic gardening coaching with Jade Belstead
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la Modale */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-4">
          {formState?.success ? (
            /* Succès */
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight">
                  Registration Confirmed
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  A confirmation summary has been registered for your session. Jade looks forward to gardening with you.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-md border border-[#E5E5E0] text-left text-xs font-mono space-y-1.5 max-w-sm mx-auto">
                <p className="text-stone-800 font-bold">• Session: {currentWorkshop.title}</p>
                <p className="text-stone-600">
                  • Schedule: {formatDateLabel(currentWorkshop.date)} ({currentWorkshop.start_time} – {currentWorkshop.end_time})
                </p>
                <p className="text-stone-600">
                  • Spots Reserved: {selectedSeats} participant{selectedSeats > 1 ? 's' : ''} (Free)
                </p>
                <p className="text-stone-600">• Location: Community Greenhouse, Kingston, NY</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-11 px-5 bg-[#2D4A3E] hover:bg-[#1E342B] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Close &amp; Return to Schedule
                </button>
              </div>
            </div>
          ) : (
            /* Formulaire */
            <form onSubmit={handleSubmit} className="space-y-4">
              {formState && !formState.success && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                  <p className="font-medium">{formState.message}</p>
                </div>
              )}

              {/* Sélecteur de date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center justify-between">
                  <span>Select Date Slot <span className="text-red-600">*</span></span>
                  <span className="font-mono text-[11px] text-stone-500">{activeMonthLabel} Series</span>
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
                        className={`p-2.5 text-left rounded-md border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D4A3E] text-white border-[#2D4A3E]'
                            : wsSoldOut
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                            : 'bg-white text-stone-800 border-[#E5E5E0] hover:bg-stone-50 hover:border-stone-400'
                        }`}
                      >
                        <span className="block text-xs font-bold font-mono">
                          {formatDateLabel(ws.date)}
                        </span>
                        <span
                          className={`block text-[10px] mt-0.5 font-mono ${
                            isSelected
                              ? 'text-emerald-200'
                              : wsSoldOut
                              ? 'text-red-500'
                              : 'text-stone-500'
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

              <input type="hidden" name="workshopId" value={selectedWorkshopId} />

              {/* Champ 1 : Nom */}
              <div>
                <label htmlFor="booking-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="booking-name"
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-[#E5E5E0] rounded-md text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors"
                  />
                </div>
              </div>

              {/* Champ 2 : Email */}
              <div>
                <label htmlFor="booking-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="booking-email"
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. eleanor@example.com"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-[#E5E5E0] rounded-md text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors"
                  />
                </div>
              </div>

              {/* Champ 3 : Téléphone */}
              <div>
                <label htmlFor="booking-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="booking-phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. (555) 234-5678"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-[#E5E5E0] rounded-md text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors"
                  />
                </div>
              </div>

              {/* Champ 4 : Nombre de places */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Number of Spots (Free)</span>
                  <span className="font-mono text-[11px] text-stone-500 font-normal">
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
                        className={`h-9 text-xs font-mono font-bold rounded-md border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D4A3E] text-white border-[#2D4A3E]'
                            : 'bg-white text-stone-800 border-[#E5E5E0] hover:bg-stone-50'
                        }`}
                      >
                        {num} spot{num > 1 ? 's' : ''}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="seats" value={selectedSeats} />
              </div>

              <p className="text-[11px] text-stone-500 text-center pt-1 font-mono">
                No payment or credit card required. 100% free community project.
              </p>

              {/* Bouton de confirmation */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending || isSoldOut}
                  className="w-full h-11 px-5 bg-[#2D4A3E] hover:bg-[#1E342B] disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : isSoldOut ? (
                    <span>This Date is Full</span>
                  ) : (
                    <>
                      <span>Confirm Free Spot ({selectedSeats} ticket{selectedSeats > 1 ? 's' : ''})</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
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
