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
  User,
  Mail,
  Phone,
  Ticket,
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
  // Available workshops loaded dynamically from props / database
  const availableWorkshops = React.useMemo(() => {
    if (workshopsProp && workshopsProp.length > 0) return workshopsProp;
    if (singleWorkshop) return [singleWorkshop];
    return [];
  }, [workshopsProp, singleWorkshop]);

  // Track selected workshop ID, defaulting to initialWorkshopId
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(() => {
    if (initialWorkshopId && availableWorkshops.some((w) => w.id === initialWorkshopId)) {
      return initialWorkshopId;
    }
    if (singleWorkshop && availableWorkshops.some((w) => w.id === singleWorkshop.id)) {
      return singleWorkshop.id;
    }
    return availableWorkshops[0]?.id || '';
  });

  // Re-sync when initialWorkshopId changes
  useEffect(() => {
    if (initialWorkshopId && availableWorkshops.some((w) => w.id === initialWorkshopId)) {
      setSelectedWorkshopId(initialWorkshopId);
    }
  }, [initialWorkshopId, availableWorkshops]);

  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [capacityError, setCapacityError] = useState<string | null>(null);

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

  if (!currentWorkshop) return null;

  const isSoldOut = currentWorkshop.remaining_seats <= 0;
  const maxAvailable = Math.max(0, currentWorkshop.remaining_seats);

  const handleSeatChange = (seats: number) => {
    if (seats > maxAvailable) {
      setCapacityError(
        'Not enough seats available. Please select another session or reduce the number of participants.'
      );
      return;
    }
    setCapacityError(null);
    setSelectedSeats(seats);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedSeats > maxAvailable) {
      setCapacityError(
        'Not enough seats available. Please select another session or reduce the number of participants.'
      );
      return;
    }
    setCapacityError(null);

    const formData = new FormData();
    formData.append('workshopId', selectedWorkshopId);
    formData.append('seats', selectedSeats.toString());
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    formData.append('phone', phone.trim());

    startTransition(async () => {
      const result = await createBooking(formState, formData);
      setFormState(result);
    });
  };

  /**
   * Dynamic Date Formatting:
   * Displays the actual month and day (e.g. "Sat, Oct 03" or "Sat, Nov 14")
   */
  const formatDateShort = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
      const dayFormatted = String(day).padStart(2, '0');
      return `${weekday}, ${monthName} ${dayFormatted}`;
    } catch {
      return dateStr;
    }
  };

  const formatDateFull = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#24211D]/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#F7F5F0] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-[#24211D] my-6 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-stone-200 flex items-start justify-between gap-4 bg-white/90">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#B85B3A] block">
              Jade Studio / Reservation
            </span>
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-serif text-[#24211D] tracking-tight">
              {formState?.success ? 'Booking Received' : 'Reserve Your Spot'}
            </h2>
            <p className="text-xs text-stone-500">
              {formState?.success
                ? 'Your registration is confirmed.'
                : 'Select your preferred date and enter your details.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-stone-500 hover:text-[#24211D] rounded-full hover:bg-[#EDE8DF] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {formState?.success ? (
            /* ========================================================================= */
            /* SUCCESS STATE                                                            */
            /* ========================================================================= */
            <div className="text-center py-4 space-y-6">
              <div className="w-14 h-14 rounded-full bg-[#F7EBE5] text-[#B85B3A] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7 text-[#B85B3A]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-[#24211D]">
                  Registration Confirmed
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-[#24211D]">{name}</span>. We look forward to welcoming you to <span className="font-semibold text-[#24211D]">{currentWorkshop.title}</span>.
                </p>
                <p className="text-[11px] text-stone-500">
                  Confirmation email with arrival notes sent to <strong className="text-[#24211D]">{email}</strong>.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 text-left text-xs space-y-2.5 max-w-sm mx-auto shadow-2xs">
                <div className="font-serif font-bold text-sm text-[#24211D]">
                  {currentWorkshop.title}
                </div>
                <div className="text-stone-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B85B3A]" />
                  <span>{formatDateFull(currentWorkshop.date)}</span>
                </div>
                <div className="text-stone-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B85B3A]" />
                  <span>{currentWorkshop.start_time} — {currentWorkshop.end_time}</span>
                </div>
                <div className="text-stone-500 flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5 text-[#B85B3A]" />
                  <span>{selectedSeats} attendee{selectedSeats > 1 ? 's' : ''} reserved</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 px-6 bg-[#24211D] hover:bg-[#B85B3A] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors cursor-pointer"
              >
                Return to Studio
              </button>
            </div>
          ) : (
            /* ========================================================================= */
            /* SINGLE-SCREEN FAST BOOKING FORM                                          */
            /* ========================================================================= */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Server error banner */}
              {formState && !formState.success && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="font-medium">{formState.message}</p>
                </div>
              )}

              {/* 1. Dynamic Session Date Selector (Direct Cards - No select dropdown) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#24211D]">
                    Session Date <span className="text-[#B85B3A]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {currentWorkshop.start_time} — {currentWorkshop.end_time}
                  </span>
                </div>

                {/* Direct Clickable Session Date Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableWorkshops.map((ws) => {
                    const isSelected = ws.id === selectedWorkshopId;
                    const isSoldOut = ws.remaining_seats <= 0;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => {
                          setSelectedWorkshopId(ws.id);
                          setCapacityError(null);
                        }}
                        disabled={isSoldOut}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#B85B3A] text-white border-[#B85B3A] shadow-xs'
                            : isSoldOut
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                            : 'bg-white text-[#24211D] border-stone-200 hover:border-[#B85B3A] shadow-2xs'
                        }`}
                      >
                        <div className={`font-serif text-sm font-medium leading-tight ${isSelected ? 'text-white' : 'text-[#24211D]'}`}>
                          {formatDateShort(ws.date)}
                        </div>
                        <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-stone-200' : 'text-[#B85B3A]'}`}>
                          {isSoldOut ? 'Sold out' : `${ws.remaining_seats} left`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Number of Attendees */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#24211D] mb-2 flex items-center justify-between">
                  <span>Attendees</span>
                  <span className="text-[11px] text-stone-500">
                    Max 3 per reservation
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => {
                    const isSelected = selectedSeats === num;
                    const isExceeded = num > maxAvailable;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSeatChange(num)}
                        className={`h-10 text-xs font-sans font-medium rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#B85B3A] text-white border-[#B85B3A] shadow-xs'
                            : isExceeded
                            ? 'bg-stone-100 text-stone-400 border-stone-200'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-[#B85B3A]'
                        }`}
                      >
                        {num} attendee{num > 1 ? 's' : ''}
                      </button>
                    );
                  })}
                </div>

                {capacityError && (
                  <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {capacityError}
                  </div>
                )}
              </div>

              {/* 3. Contact Inputs */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <span className="block text-xs uppercase tracking-wider font-semibold text-[#24211D]">
                  Your Details
                </span>

                <div>
                  <label htmlFor="booking-name" className="sr-only">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name *"
                      className="w-full h-11 pl-10 pr-3.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-[#24211D] placeholder:text-stone-400 focus:outline-none focus:border-[#B85B3A] focus:ring-1 focus:ring-[#B85B3A] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="booking-email" className="sr-only">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="booking-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full h-11 pl-10 pr-3.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-[#24211D] placeholder:text-stone-400 focus:outline-none focus:border-[#B85B3A] focus:ring-1 focus:ring-[#B85B3A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="sr-only">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number *"
                        className="w-full h-11 pl-10 pr-3.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-[#24211D] placeholder:text-stone-400 focus:outline-none focus:border-[#B85B3A] focus:ring-1 focus:ring-[#B85B3A] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Instant Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isPending || isSoldOut}
                  className="w-full h-12 px-6 bg-[#B85B3A] hover:bg-[#9E4B2F] disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-widest rounded-full transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Your Reservation...</span>
                    </>
                  ) : isSoldOut ? (
                    <span>This Session is Full</span>
                  ) : (
                    <>
                      <span>Confirm Booking ({selectedSeats} attendee{selectedSeats > 1 ? 's' : ''})</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-stone-500 text-center">
                  Free community workshop · Instant confirmation email dispatched
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
