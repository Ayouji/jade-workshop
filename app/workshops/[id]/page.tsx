import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkshopById, getWorkshopsWithAvailability, WorkshopWithAvailability } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { WorkshopDetailBookingBar } from '@/components/WorkshopDetailBookingBar';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const CONFIRMED_WORKSHOPS: WorkshopWithAvailability[] = [
  {
    id: '12a914fa-f91e-45ae-a1e8-d3494c7bb8c2',
    title: 'Seasonal Gardening Basics',
    description: 'Learn to plant and nurture your own herbs and vegetables.',
    date: '2026-10-03',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/hero_gardening.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '86d11fec-64e5-4dd3-97b9-d8223c3af6ba',
    title: 'Seasonal Gardening Basics',
    description: 'Learn to plant and nurture your own herbs and vegetables.',
    date: '2026-10-10',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/gardening_hero_studio.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '722f3178-64f4-44ef-8e06-dd40cd90d454',
    title: 'Seasonal Gardening Basics',
    description: 'Learn to plant and nurture your own herbs and vegetables.',
    date: '2026-10-17',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/hero_gardening.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '8845fd5c-bf7d-4f98-90c8-87838b9d59c2',
    title: 'Seasonal Gardening Basics',
    description: 'Learn to plant and nurture your own herbs and vegetables.',
    date: '2026-10-24',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/gardening_hero_studio.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '6471374f-59e8-485b-9a53-c95df500da06',
    title: 'Seasonal Gardening Basics',
    description: 'Learn to plant and nurture your own herbs and vegetables.',
    date: '2026-10-31',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/hero_gardening.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '35c412e8-8d02-4d11-b0e2-7634f19b1390',
    title: 'Winter Herb Care & Soil Prep',
    description: 'Prepare your cold-season herbs, root crops, and organic garden beds.',
    date: '2026-11-07',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/gardening_hero_studio.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '49e218bf-3e91-45fa-b649-813c9e108162',
    title: 'Winter Herb Care & Soil Prep',
    description: 'Prepare your cold-season herbs, root crops, and organic garden beds.',
    date: '2026-11-14',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    capacity: 10,
    image_url: '/hero_gardening.jpg',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
];

async function loadWorkshop(id: string): Promise<{
  workshop: WorkshopWithAvailability | null;
  allWorkshops: WorkshopWithAvailability[];
}> {
  try {
    let workshop: WorkshopWithAvailability | null = null;
    let allWorkshops: WorkshopWithAvailability[] = [];

    if (process.env.DATABASE_URL) {
      workshop = await getWorkshopById(id);
      allWorkshops = await getWorkshopsWithAvailability();
    }

    if (!workshop) {
      workshop = CONFIRMED_WORKSHOPS.find((w) => w.id === id) || null;
    }

    if (allWorkshops.length === 0) {
      allWorkshops = CONFIRMED_WORKSHOPS;
    }

    return { workshop, allWorkshops };
  } catch (err) {
    console.error('Error loading workshop:', err);
    return {
      workshop: CONFIRMED_WORKSHOPS.find((w) => w.id === id) || null,
      allWorkshops: CONFIRMED_WORKSHOPS,
    };
  }
}

function formatDateFull(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { workshop, allWorkshops } = await loadWorkshop(id);

  if (!workshop) {
    notFound();
  }

  const displayImage = workshop.image_url || '/hero_gardening.jpg';

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#24211D] font-sans antialiased selection:bg-[#B85B3A] selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-12">
        {/* Navigation back link */}
        <div>
          <Link
            href="/#workshops"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-500 hover:text-[#24211D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Workshops</span>
          </Link>
        </div>

        {/* Large Editorial Workshop Image & Category */}
        <div className="space-y-8">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-[#EDE8DF] border border-stone-200 shadow-2xs">
            <Image
              src={displayImage}
              alt={workshop.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* Title & Specs */}
          <div className="space-y-4 max-w-4xl text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B85B3A] block">
              CATEGORY · CREATIVE WORKSHOP
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#24211D] tracking-tight leading-[1.08]">
              {workshop.title.toUpperCase()}
            </h1>
            <p className="text-base sm:text-xl text-stone-600 leading-relaxed">
              {workshop.description}
            </p>
          </div>
        </div>

        {/* Workshop Content Grid: Structured editorial columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pt-4">
          {/* Left Column (Col-span-7) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            {/* Quick Specs Grid: DATE / TIME / DURATION / LOCATION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-stone-200 py-6 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#B85B3A] block">
                  DATE
                </span>
                <span className="font-semibold text-[#24211D] block">
                  {formatDateFull(workshop.date)}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Every Saturday in Oct
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#B85B3A] block">
                  TIME
                </span>
                <span className="font-semibold text-[#24211D] block">
                  Morning Session
                </span>
                <span className="text-[11px] text-stone-500 block">
                  10:00 AM — 12:30 PM
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#B85B3A] block">
                  DURATION
                </span>
                <span className="font-semibold text-[#24211D] block">
                  2.5 Hours
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Unhurried pace
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#B85B3A] block">
                  LOCATION
                </span>
                <span className="font-semibold text-[#24211D] block">
                  Jade Studio
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Kingston Studio
                </span>
              </div>
            </div>

            {/* About the workshop */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#24211D] tracking-tight">
                About the Workshop
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Seasonal Gardening Basics provides a welcoming, grounded entry point into growing culinary herbs and fresh vegetables. Guided by experienced hobby gardener Jade, participants gain practical understanding of soil preparation, seed planting, and ongoing care in a relaxed studio setting.
              </p>
            </section>

            {/* What you'll learn */}
            <section className="space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl text-[#24211D] tracking-tight">
                What You&apos;ll Learn
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-600">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[#B85B3A] font-bold">01.</span>
                  <span>Practical principles of soil health, natural potting mixes, and container preparation.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[#B85B3A] font-bold">02.</span>
                  <span>Techniques for sowing, potting, and propagating seasonal culinary herbs and vegetable seeds.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[#B85B3A] font-bold">03.</span>
                  <span>Simple daily maintenance, watering schedules, and seasonal weather preparation.</span>
                </div>
              </div>
            </section>

            {/* What's included */}
            <section className="space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl text-[#24211D] tracking-tight">
                What&apos;s Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#24211D]">
                    <CheckCircle2 className="w-4 h-4 text-[#B85B3A]" />
                    <span>Hands-on Instruction</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Direct guidance and answers to your gardening questions.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#24211D]">
                    <CheckCircle2 className="w-4 h-4 text-[#B85B3A]" />
                    <span>Living Plants to Take Home</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Potted herb starts ready to flourish on your windowsill or garden.
                  </p>
                </div>
              </div>
            </section>

            {/* About the host */}
            <section className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="font-serif text-xl sm:text-2xl text-[#24211D] tracking-tight">
                About the Host
              </h3>
              <p className="font-serif italic text-base text-[#24211D]">
                &ldquo;I am an experienced local hobby gardener with ten years of community project involvement.&rdquo;
              </p>
            </section>

            {/* Location */}
            <section className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="font-serif text-xl sm:text-2xl text-[#24211D] tracking-tight">
                Studio Location
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The exact studio address, entrance instructions, and parking information are sent directly in your booking confirmation email upon reserving a place.
              </p>
            </section>
          </div>

          {/* Right Column: Sticky Booking Card (Col-span-5) */}
          <div className="lg:col-span-5">
            <WorkshopDetailBookingBar
              workshop={workshop}
              allWorkshops={allWorkshops}
            />
          </div>
        </div>
      </main>

      {/* Minimal Studio Footer */}
      <footer className="border-t border-stone-200 py-12 text-center text-xs text-stone-500">
        <p>© 2026 Jade Studio · Creative Workshops. All rights reserved.</p>
      </footer>
    </div>
  );
}
