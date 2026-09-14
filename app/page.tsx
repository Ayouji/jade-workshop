import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWorkshopsWithAvailability, WorkshopWithAvailability } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { OctoberSchedule } from '@/components/OctoberSchedule';
import { NewsletterForm } from '@/components/NewsletterForm';
import {
  ArrowRight,
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

async function loadWorkshops(): Promise<WorkshopWithAvailability[]> {
  try {
    if (!process.env.DATABASE_URL) {
      return CONFIRMED_WORKSHOPS;
    }
    const workshops = await getWorkshopsWithAvailability();
    return workshops.length > 0 ? workshops : CONFIRMED_WORKSHOPS;
  } catch (error) {
    console.warn('Loading fallback workshops due to database exception:', error);
    return CONFIRMED_WORKSHOPS;
  }
}

export default async function HomePage() {
  const workshops = await loadWorkshops();

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#24211D] font-sans antialiased selection:bg-[#B85B3A] selection:text-white">
      {/* ============================================================================== */}
      {/* 1. HEADER / NAVBAR                                                             */}
      {/* ============================================================================== */}
      <Navbar />

      <main className="space-y-24 sm:space-y-36 lg:space-y-40 pb-24">
        {/* ============================================================================== */}
        {/* 2. HERO BANNER — EDITORIAL KINFOLK / AESOP LAYOUT                              */}
        {/* ============================================================================== */}
        <section className="pt-12 sm:pt-18 lg:pt-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
            {/* Typographic Hero Block */}
            <div className="max-w-4xl space-y-6 text-left">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
                SEASONAL SESSIONS &amp; WORKSHOPS
              </span>

              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[88px] text-[#24211D] tracking-tight leading-[1.02]">
                Create something worth remembering.
              </h1>

              <p className="text-base sm:text-xl text-stone-600 max-w-2xl leading-relaxed font-normal">
                Discover hands-on creative workshops designed to help people slow down, experiment, connect, and create.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <a
                  href="#workshops"
                  className="h-13 px-8 bg-[#24211D] hover:bg-[#B85B3A] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors inline-flex items-center gap-2.5 shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <span>EXPLORE WORKSHOPS</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Full-width editorial photo with rounded corners */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden bg-[#EDE8DF] border border-stone-200 shadow-2xs">
              <Image
                src="/gardening_hero_studio.jpg"
                alt="Creative workshop studio with sunlit wooden communal work tables, natural materials, and craft atmosphere"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#F7F5F0]/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 text-[11px] font-mono text-[#24211D] hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B85B3A]" />
                <span>Saturday morning creative sessions · Seasonal Gardening Basics</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. ALTERNATING WORKSHOP CARDS SECTION                                          */}
        {/* ============================================================================== */}
        <section id="workshops" className="px-6 sm:px-8 lg:px-12 scroll-mt-24">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
              <div className="space-y-2 max-w-xl text-left">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
                  UPCOMING SESSIONS
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#24211D] tracking-tight">
                  Make time to create.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md leading-relaxed text-left md:text-right">
                Weekend morning sessions with hands-on guidance to plant and nurture your own culinary herbs and vegetables.
              </p>
            </div>

            {/* Alternating Z-Pattern Workshop Cards */}
            <OctoberSchedule workshops={workshops} />
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 4. ABOUT / INSTRUCTOR SECTION                                                  */}
        {/* ============================================================================== */}
        <section id="about" className="px-6 sm:px-8 lg:px-12 scroll-mt-24">
          <div className="max-w-7xl mx-auto border-t border-stone-200 pt-16 sm:pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Portrait Photograph */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-[#EDE8DF] border border-stone-200 shadow-2xs">
                  <Image
                    src="/jade_instructor.jpg"
                    alt="Jade in work apron"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="pt-3 flex items-center justify-between text-xs font-mono text-stone-500">
                  <span>Jade</span>
                  <span>Workshop Host</span>
                </div>
              </div>

              {/* Editorial Bio Block */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
                  ABOUT / JADE
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#24211D] tracking-tight leading-[1.15]">
                  Experienced local hobby gardener.
                </h2>

                <div className="space-y-4 text-base sm:text-xl text-[#24211D] leading-relaxed font-serif italic max-w-2xl border-l-2 border-[#B85B3A] pl-5 py-1">
                  <p>
                    &ldquo;I am an experienced local hobby gardener with ten years of community project involvement.&rdquo;
                  </p>
                </div>

                <div className="pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl space-y-3">
                  <p>
                    Workshops are designed as welcoming, unhurried spaces to share practical knowledge, experiment with planting, and enjoy the tactile satisfaction of growing your own produce.
                  </p>
                  <p>
                    From soil preparation and seed germination to kitchen herb potting, each session is grounded in hands-on craft and community care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 5. VALUE CARDS SECTION ("A thoughtful, hands-on space.")                       */}
        {/* ============================================================================== */}
        <section id="experience" className="px-6 sm:px-8 lg:px-12 scroll-mt-24">
          <div className="max-w-7xl mx-auto border-t border-stone-200 pt-16 sm:pt-24 space-y-12">
            <div className="max-w-3xl space-y-3 text-left">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
                STUDIO PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#24211D] tracking-tight">
                A thoughtful, hands-on space.
              </h2>
            </div>

            {/* 3-Column Light Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3.5 p-7 sm:p-8 bg-white/70 rounded-2xl border border-stone-200 shadow-2xs hover:bg-white transition-colors">
                <span className="font-serif text-3xl sm:text-4xl text-[#B85B3A] block">01</span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#24211D]">
                  LEARN
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Understand foundational planting principles, soil preparation, and practical techniques to care for kitchen herbs and vegetables.
                </p>
              </div>

              <div className="space-y-3.5 p-7 sm:p-8 bg-white/70 rounded-2xl border border-stone-200 shadow-2xs hover:bg-white transition-colors">
                <span className="font-serif text-3xl sm:text-4xl text-[#B85B3A] block">02</span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#24211D]">
                  CREATE
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Get hands-on at communal work tables, practicing potting, seed sowing, and working directly with organic growing mediums.
                </p>
              </div>

              <div className="space-y-3.5 p-7 sm:p-8 bg-white/70 rounded-2xl border border-stone-200 shadow-2xs hover:bg-white transition-colors">
                <span className="font-serif text-3xl sm:text-4xl text-[#B85B3A] block">03</span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#24211D]">
                  CONNECT
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Enjoy an unhurried, calm community setting to exchange tips, ask questions, and share the joy of tactile creation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 6. CONTACT & NEWSLETTER FOOTER SECTION                                         */}
        {/* ============================================================================== */}
        <section id="contact" className="px-6 sm:px-8 lg:px-12 scroll-mt-24">
          <div className="max-w-7xl mx-auto border-t border-stone-200 pt-16 sm:pt-24 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column: Workshop Location and Inquiry Text with Dark CTA */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
                    CONTACT &amp; VISITS
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D] tracking-tight">
                    Workshop Location &amp; Inquiries
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Workshops run on weekend mornings. For questions about sessions, private groups, or availability, get in touch below.
                  </p>
                </div>

                <div className="p-6 bg-white/70 rounded-2xl border border-stone-200 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#B85B3A] font-mono uppercase tracking-wider font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Studio Arrival Details</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Exact studio address, entrance instructions, and arrival guidelines are provided directly in your booking confirmation email.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="#workshops"
                    className="inline-flex items-center gap-2 h-12 px-7 bg-[#24211D] hover:bg-[#B85B3A] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <span>BOOK A WORKSHOP</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Clean White Newsletter Card with Solid Dark-Green Button */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-8 sm:p-12 border border-stone-200 flex flex-col justify-center space-y-6 text-left shadow-2xs">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
                    STAY INFORMED
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#24211D] tracking-tight">
                    Seasonal Notes &amp; Updates
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Receive announcements when new workshop sessions and dates open.
                  </p>
                </div>

                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================================== */}
      {/* 7. BOTTOM FOOTER (Minimalist Line Divider, Copyright, Subtle Link Directory)  */}
      {/* ============================================================================== */}
      <footer className="border-t border-stone-200 bg-[#F7F5F0] py-14 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-stone-200/80">
            {/* Brand Directory */}
            <div className="space-y-1 text-left">
              <span className="font-serif text-2xl text-[#24211D] block">
                Jade Studio / Gardening
              </span>
              <p className="text-xs text-stone-500">
                Seasonal gardening &amp; tactile creative workshops
              </p>
            </div>

            {/* Nav Directory */}
            <nav className="flex flex-wrap items-center gap-8 text-xs uppercase tracking-widest font-medium text-[#24211D]">
              <a href="#workshops" className="hover:text-[#B85B3A] transition-colors">Workshops</a>
              <a href="#about" className="hover:text-[#B85B3A] transition-colors">About</a>
              <a href="#contact" className="hover:text-[#B85B3A] transition-colors">Contact</a>
              <Link href="/admin" className="text-[#B85B3A] hover:underline">Admin Portal</Link>
            </nav>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-stone-500">
            <p>© 2026 Jade Studio. All rights reserved.</p>
            <p>Editorial Artisanal Minimalism · Inspired by Kinfolk &amp; Aesop.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
