import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWorkshopsWithAvailability, WorkshopWithAvailability } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { HeroBookingCta } from '@/components/HeroBookingCta';
import { OctoberSchedule } from '@/components/OctoberSchedule';
import { NewsletterForm } from '@/components/NewsletterForm';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Award,
  Sprout,
  Leaf,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const DEMO_WORKSHOPS: WorkshopWithAvailability[] = [
  {
    id: '12a914fa-f91e-45ae-a1e8-d3494c7bb8c2',
    title: 'Seasonal Gardening Basics - Herbs & Seed Starting',
    description: 'Learn soil preparation, seed germination, and planting kitchen herbs in containers or garden beds.',
    date: '2026-10-03',
    start_time: '10:00',
    end_time: '12:30',
    capacity: 10,
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '86d11fec-64e5-4dd3-97b9-d8223c3af6ba',
    title: 'Seasonal Gardening Basics - Soil Health & Composting',
    description: 'Master organic composting, soil microbial life, and natural amendments for thriving vegetable beds.',
    date: '2026-10-10',
    start_time: '10:00',
    end_time: '12:30',
    capacity: 10,
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '722f3178-64f4-44ef-8e06-dd40cd90d454',
    title: 'Seasonal Gardening Basics - Autumn Vegetable Planting',
    description: 'Plant cool-season vegetables: leafy greens, root crops, garlic, and winter-hardy alliums.',
    date: '2026-10-17',
    start_time: '10:00',
    end_time: '12:30',
    capacity: 10,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '8845fd5c-bf7d-4f98-90c8-87838b9d59c2',
    title: 'Seasonal Gardening Basics - Natural Pest Control & Pruning',
    description: 'Protect your crops using companion planting, beneficial pollinators, and organic pest deterrents.',
    date: '2026-10-24',
    start_time: '10:00',
    end_time: '12:30',
    capacity: 10,
    image_url: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
  {
    id: '6471374f-59e8-485b-9a53-c95df500da06',
    title: 'Seasonal Gardening Basics - Winter Prep & Herb Harvesting',
    description: 'Harvest and dry herbs, prepare protective mulch, and tuck your garden in for winter vitality.',
    date: '2026-10-31',
    start_time: '10:00',
    end_time: '12:30',
    capacity: 10,
    image_url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 0,
    remaining_seats: 10,
  },
];

async function loadWorkshops(): Promise<WorkshopWithAvailability[]> {
  try {
    if (!process.env.DATABASE_URL) {
      return DEMO_WORKSHOPS;
    }
    const workshops = await getWorkshopsWithAvailability();
    const gardeningWorkshops = workshops.filter((w) =>
      w.title.toLowerCase().includes('seasonal gardening')
    );
    if (gardeningWorkshops.length > 0) {
      return gardeningWorkshops;
    }
    return workshops.length > 0 ? workshops : DEMO_WORKSHOPS;
  } catch (error) {
    console.warn('Chargement des ateliers de démonstration suite à une exception :', error);
    return DEMO_WORKSHOPS;
  }
}

export default async function HomePage() {
  const workshops = await loadWorkshops();

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] font-sans antialiased overflow-x-hidden selection:bg-[#1B4332] selection:text-white">
      {/* ============================================================================== */}
      {/* 1. NAVBAR - RESPONSIVE MOBILE-FIRST                                            */}
      {/* ============================================================================== */}
      <Navbar />

      <main className="space-y-16 sm:space-y-24 md:space-y-32">
        {/* ============================================================================== */}
        {/* 2. HERO SECTION - MOBILE-FIRST LAYOUT                                          */}
        {/* ============================================================================== */}
        <section className="relative pt-6 sm:pt-10 md:pt-16 pb-4 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left Column: Stack vertically on mobile, left-align on lg */}
              <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
                {/* Cadence Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                  <span>Every Saturday morning in October</span>
                </div>

                {/* Title: Fluid scaling from mobile (text-3xl) to desktop (lg:text-[54px]) */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#0F172A] tracking-tight leading-[1.15]">
                  Seasonal Gardening Basics
                </h1>

                {/* Subtitle / Hero Description */}
                <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed font-normal">
                  Learn to plant and nurture your own herbs and vegetables.
                </p>

                {/* Practical Quick Info Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs text-slate-600 font-medium w-full">
                  <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-full border border-gray-200/80 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                    10:00 AM – 12:30 PM
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-full border border-gray-200/80 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                    Community Garden, Kingston
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-2 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Free No-Payment Booking
                  </span>
                </div>

                {/* Primary & Secondary Call to Actions */}
                <div className="pt-2 w-full">
                  <HeroBookingCta workshops={workshops} />
                </div>
              </div>

              {/* Right Column: Hero Visual Asset (Fluid & non-overflowing) */}
              <div className="lg:col-span-6 relative flex justify-center items-center w-full">
                <div className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl md:rounded-[36px] overflow-hidden shadow-xl sm:shadow-2xl bg-white border-2 sm:border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80"
                    alt="Hands planting aromatic kitchen herbs in organic soil"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                    className="object-cover"
                  />
                  {/* Floating Inset Badge: Safe bounds preventing mobile blowout */}
                  <div className="absolute bottom-3 sm:bottom-5 left-3 right-3 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-[#52B788]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">All Supplies Provided Free</p>
                      <p className="text-[11px] text-slate-500 truncate">Seeds, organic potting mix &amp; starter pots</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. UPPER ACTIVE LIST SCHEDULE - WHAT TO BOOK                                   */}
        {/* ============================================================================== */}
        <section id="schedule" className="py-8 sm:py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-12">
            {/* Header: Centered on mobile, split on md */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-gray-200/80 pb-6 text-left">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                  <span>Official October Schedule</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  Every Saturday morning in October
                </h2>
              </div>
              <div className="max-w-md">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Join Jade Belstead at the community greenhouse every Saturday from <strong>10:00 AM to 12:30 PM</strong>. Each session holds up to 10 participants for personalized coaching.
                </p>
              </div>
            </div>

            {/* Interactive October Schedule list with Book This full-width mobile buttons */}
            <OctoberSchedule workshops={workshops} />
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 4. NEW STATIC SECTION: "YOUR WORKSHOP EXPERIENCE & WHAT YOU GET"              */}
        {/* ============================================================================== */}
        <section id="experience" className="py-12 sm:py-16 border-t border-gray-200/60 bg-[#F4F7F3]/60 rounded-2xl sm:rounded-3xl scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text & Bullets */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
                {/* Sub-Header Requis */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider">
                  <Sprout className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                  <span>A Foundation for Seasonal Success</span>
                </div>

                {/* Titre Requis */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  Your Workshop Experience &amp; What You Get
                </h2>

                {/* Main Body Text Requis */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  Your workshop journey is a complete experience, not a series of disconnected topics. We cover the full spectrum of successful seasonal gardening—from preparing your soil and starting seeds to mastering compost, natural pest control, and preparing for winter. Every Saturday, you will receive expert, personalized coaching with plenty of hands-on planting practice, ensuring you can confidently nurture your own herbs and vegetables all season long.
                </p>

                {/* Bulleted List of Key Value Propositions with CheckCircle */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Full Lifecycle Coverage: Soil to Harvest
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Hands-On Seed Starting &amp; Container Skills
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Master Organic Composting for Thriving Soil
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Identify and Implement Natural Pest Control
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Essential Winter Prep &amp; Nurturing Advice
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Confident Herb and Vegetable Gardening
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5 relative w-full">
                <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-white border-2 sm:border-4 border-white mx-auto max-w-lg lg:max-w-none">
                  <Image
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80"
                    alt="Lush community garden bed with thriving herbs and vegetables"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 sm:bottom-5 left-3 right-3 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                        <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#52B788]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Real Dirt &amp; Practice</p>
                        <p className="text-[11px] text-slate-500 truncate">Take home starter pots from every session</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 5. BOTTOM STATIC SECTION: "INSTRUCTOR & COMMUNITY IMPACT"                      */}
        {/* ============================================================================== */}
        <section id="instructor-impact" className="py-8 sm:py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12 sm:space-y-16">
            {/* Instructor Profile Block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Photo de Jade Belstead avec Highlight Tag Flottant sécurisé contre l'overflow */}
              <div className="lg:col-span-5 relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
                <div className="relative aspect-square rounded-2xl sm:rounded-3xl md:rounded-[36px] overflow-hidden shadow-xl bg-white border-2 sm:border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=1200&q=80"
                    alt="Jade Belstead in a vibrant community vegetable garden"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 450px"
                    className="object-cover"
                  />
                </div>

                {/* Highlight Tag Requis: "10+ Years Community Experience" - Mobile Safe bounds */}
                <div className="absolute bottom-3 right-3 sm:top-8 sm:-right-4 sm:bottom-auto bg-white/95 backdrop-blur-md p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-[28px] shadow-xl border border-[#52B788]/30 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#52B788]" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight block">
                      10+ Years
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-600 font-bold block">
                      Community Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Content */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:pl-4 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                  Instructor &amp; Community Impact
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  Meet Jade Belstead
                </h2>

                {/* Bio Requis */}
                <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                  &quot;Experienced local hobby gardener with ten years of community project involvement.&quot;
                </p>

                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  Jade has spearheaded neighborhood allotment gardens, school greening projects, and seasonal compost workshops across Kingston. Her teaching approach is warm, practical, and grounded in real dirt—making organic food growing approachable for complete beginners and apartment dwellers alike.
                </p>

                {/* 3 Bullet Points Chaleureux */}
                <ul className="space-y-2.5 sm:space-y-3 pt-1 text-xs sm:text-sm font-semibold text-[#0F172A]">
                  <li className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                    </div>
                    <span>100% Organic &amp; Permaculture-Inspired Methods</span>
                  </li>
                  <li className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                    </div>
                    <span>Hands-On Soil, Seed Starting &amp; Container Techniques</span>
                  </li>
                  <li className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                    </div>
                    <span>Inclusive Neighborhood Community &amp; Ongoing Tips</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <a
                    href="#schedule"
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-8 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-full text-xs sm:text-sm transition-all shadow-md"
                  >
                    View October Workshop Sessions
                  </a>
                </div>
              </div>
            </div>

            {/* Testimonials / Community Feedback */}
            <div className="pt-8 sm:pt-10 border-t border-gray-200/60">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                <div className="lg:col-span-5 space-y-2 sm:space-y-3 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                    Voices From The Garden
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    Loved by Local Kingston Gardeners
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Neighbors and beginners who turned their balconies and backyards into flourishing green spaces through Jade&apos;s workshops.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Testimonial 1 */}
                  <div className="bg-[#1B4332] text-white rounded-2xl sm:rounded-[24px] p-5 sm:p-6 relative overflow-hidden shadow-lg space-y-3">
                    <span className="text-2xl sm:text-3xl font-serif text-emerald-200/70 block">“</span>
                    <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                      &quot;I used to kill every supermarket herb I bought. Jade showed us how to prune roots, aerate soil, and water correctly. My kitchen smells amazing!&quot;
                    </p>
                    <div className="pt-2 border-t border-white/10">
                      <p className="font-bold text-xs sm:text-sm text-white">Clara Dupuis</p>
                      <p className="text-[11px] text-emerald-200/80">Balcony Gardener, Kingston</p>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="bg-[#1B4332] text-white rounded-2xl sm:rounded-[24px] p-5 sm:p-6 relative overflow-hidden shadow-lg space-y-3">
                    <span className="text-2xl sm:text-3xl font-serif text-emerald-200/70 block">“</span>
                    <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                      &quot;Jade&apos;s 10 years of community experience clearly shows. The compost and soil biology session completely changed how I look at organic waste.&quot;
                    </p>
                    <div className="pt-2 border-t border-white/10">
                      <p className="font-bold text-xs sm:text-sm text-white">Marc Henderson</p>
                      <p className="text-[11px] text-emerald-200/80">Allotment Volunteer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 6. CONTACT & NEWSLETTER SECTION                                                */}
        {/* ============================================================================== */}
        <section id="contact-us" className="py-8 sm:py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                Get In Touch
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                Connect with Jade
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                Have questions regarding the October sessions, accessibility at the garden, or private group bookings? Drop us a message anytime.
              </p>
            </div>

            {/* 3 Contact Cards: 1 col on mobile, 3 cols on lg */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Visit */}
              <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 sm:gap-5 hover:shadow-md transition-all">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#52B788]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#0F172A]">Location</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Kingston Community Greenhouse &amp; Gardens</p>
                  <p className="text-xs text-slate-500">Kingston, New York 12401</p>
                </div>
              </div>

              {/* Call */}
              <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 sm:gap-5 hover:shadow-md transition-all">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#52B788]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#0F172A]">Call / WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-0.5">(555) 382-9102</p>
                  <p className="text-xs text-slate-400">Tue – Sat, 9am to 5pm</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 sm:gap-5 hover:shadow-md transition-all">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#52B788]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#0F172A]">Email</h4>
                  <p className="text-xs text-slate-500 mt-0.5">jade@gardeningbasics.local</p>
                  <p className="text-xs text-slate-400">Direct response within 24h</p>
                </div>
              </div>
            </div>

            {/* Map & Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {/* Map */}
              <div className="bg-white rounded-2xl sm:rounded-[28px] overflow-hidden border border-gray-200/80 shadow-sm relative min-h-[300px] sm:min-h-[360px]">
                <iframe
                  title="Kingston Community Garden Location"
                  src="https://maps.google.com/maps?hl=en&amp;q=kingston+ny+community+garden&amp;ie=UTF8&amp;t=&amp;z=13&amp;iwloc=B&amp;output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Newsletter Form Container */}
              <div className="bg-white rounded-2xl sm:rounded-[28px] p-6 sm:p-8 md:p-12 border border-gray-200/80 shadow-sm space-y-4 sm:space-y-6 flex flex-col justify-center">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
                    <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#52B788]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A]">
                    Seasonal Garden Tips
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Subscribe to receive Jade&apos;s monthly planting calendar and first access to new seasonal workshop dates.
                  </p>
                </div>

                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================================== */}
      {/* 7. FOOTER                                                                      */}
      {/* ============================================================================== */}
      <footer className="bg-[#F4F7F3] text-slate-700 pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-gray-200/70">
          {/* Col 1 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                <Sprout className="w-4 h-4 text-[#52B788]" />
              </div>
              <span className="font-black text-lg sm:text-xl text-[#0F172A] tracking-tight">
                Seasonal Gardening
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Learn to plant and nurture your own herbs and vegetables. Community workshops hosted by Jade Belstead every Saturday morning in October.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">ig</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition-colors"
                aria-label="Facebook"
              >
                <span className="text-xs font-bold">fb</span>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="font-bold text-sm text-[#0F172A]">Workshop Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/" className="hover:text-[#1B4332] transition-colors py-1 inline-block">Home</a></li>
              <li><a href="#schedule" className="hover:text-[#1B4332] transition-colors py-1 inline-block">October Schedule</a></li>
              <li><a href="#experience" className="hover:text-[#1B4332] transition-colors py-1 inline-block">Your Experience</a></li>
              <li><a href="#instructor-impact" className="hover:text-[#1B4332] transition-colors py-1 inline-block">Instructor &amp; Impact</a></li>
              <li><a href="#contact-us" className="hover:text-[#1B4332] transition-colors py-1 inline-block">Contact &amp; Location</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="font-bold text-sm text-[#0F172A]">October Sessions</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                <span>Oct 3: Herbs &amp; Seed Starting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                <span>Oct 10: Soil Health &amp; Compost</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                <span>Oct 17: Autumn Vegetables</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                <span>Oct 24: Pest Control &amp; Pruning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                <span>Oct 31: Winter Prep &amp; Harvesting</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="font-bold text-sm text-[#0F172A]">Community Project</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hosted by Jade Belstead with 10+ years of community gardening involvement. All sessions are 100% free with materials provided.
            </p>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p>© 2026 Seasonal Gardening Basics • Jade Belstead. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#schedule" className="hover:text-[#1B4332] transition-colors py-1">Book Spot</a>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#1B4332] transition-colors opacity-60 hover:opacity-100 py-1">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
