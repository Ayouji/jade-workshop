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
  ArrowUpRight,
  CheckCircle,
  Award,
  Sprout,
  Check,
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
    return workshops.length > 0 ? workshops : DEMO_WORKSHOPS;
  } catch (error) {
    console.warn('Loading fallback workshops due to database exception:', error);
    return DEMO_WORKSHOPS;
  }
}

function getScheduleMetadata(workshops: WorkshopWithAvailability[]) {
  if (!workshops || workshops.length === 0) {
    return {
      monthLabel: 'Upcoming',
      cadenceText: 'New Seasonal Sessions Coming Soon',
      sectionTitle: 'Upcoming Workshop Schedule',
      heroCtaText: 'Join Waiting List',
      hasWorkshops: false,
    };
  }

  const months = Array.from(
    new Set(
      workshops.map((w) => {
        try {
          const [year, month, day] = w.date.split('-').map(Number);
          const d = new Date(year, month - 1, day);
          return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
        } catch {
          return '';
        }
      }).filter(Boolean)
    )
  );

  const allSaturdays = workshops.every((w) => {
    try {
      const [year, month, day] = w.date.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.getDay() === 6;
    } catch {
      return false;
    }
  });

  const monthLabel = months.length === 1 ? months[0] : months.join(' & ');
  const cadenceText = allSaturdays
    ? `Every Saturday morning in ${monthLabel}`
    : `Upcoming Sessions in ${monthLabel}`;

  const sectionTitle = allSaturdays
    ? `Every Saturday morning in ${monthLabel}`
    : `Upcoming Workshop Schedule`;

  const heroCtaText = months.length === 1 ? `Book Your Spot for ${months[0]}` : 'Book Your Spot';

  return {
    monthLabel,
    cadenceText,
    sectionTitle,
    heroCtaText,
    hasWorkshops: true,
  };
}

function formatDateShort(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default async function HomePage() {
  const workshops = await loadWorkshops();
  const scheduleMeta = getScheduleMetadata(workshops);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] font-sans antialiased selection:bg-[#2D4A3E] selection:text-white">
      {/* 1. NAVBAR */}
      <Navbar />

      <main className="space-y-20 sm:space-y-28 lg:space-y-36 pb-20">
        {/* ============================================================================== */}
        {/* 2. HERO SECTION — ASYMMETRICAL 12-COLUMN SWISS GRID                            */}
        {/* ============================================================================== */}
        <section className="pt-8 sm:pt-14 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Block: col-span-7 */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                {/* Tracked Meta Tag */}
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2D4A3E]" />
                  <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-stone-600">
                    2026 Season • {scheduleMeta.cadenceText}
                  </span>
                </div>

                {/* Bold Display Headline (Swiss Stark Typography) */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-[#1A1A1A] tracking-tight leading-[1.05]">
                  Seasonal Gardening Basics.
                </h1>

                {/* Authoritative Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed">
                  Learn to plant and nurture your own herbs and vegetables. Free community gardening coaching led by local grower Jade Belstead.
                </p>

                {/* Tabular Specifications Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#E5E5E0] border border-[#E5E5E0] rounded-md overflow-hidden text-xs">
                  <div className="bg-white p-3 sm:p-4 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Schedule</span>
                    <span className="font-mono font-bold text-[#1A1A1A] block">Saturdays, 10:00 – 12:30</span>
                  </div>
                  <div className="bg-white p-3 sm:p-4 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Location</span>
                    <span className="font-mono font-bold text-[#1A1A1A] block">Kingston Greenhouse</span>
                  </div>
                  <div className="bg-white p-3 sm:p-4 space-y-0.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Admission</span>
                    <span className="font-mono font-bold text-[#2D4A3E] block">100% Free • Tools Provided</span>
                  </div>
                </div>

                {/* CTA Action */}
                <div className="pt-2">
                  <HeroBookingCta
                    workshops={workshops}
                    ctaLabel={scheduleMeta.heroCtaText}
                    scheduleLabel="View Full Schedule"
                  />
                </div>
              </div>

              {/* Right Block: col-span-5 (Authentic Hands-on Workshop Visual) */}
              <div className="lg:col-span-5 relative lg:pt-1">
                <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-lg overflow-hidden border border-[#E5E5E0] bg-white shadow-2xs">
                  <Image
                    src="/hero_gardening.jpg"
                    alt="Hands planting aromatic culinary herbs and vegetable seedlings in organic greenhouse"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 540px"
                    className="object-cover"
                  />

                  {/* Clean Inset Value Badge */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-sm p-3 rounded-md border border-[#E5E5E0] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#2D4A3E] text-white flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate leading-tight">All Supplies Provided Free</p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">Seeds, organic potting mix &amp; starter pots to take home</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. SCHEDULE SECTION (02 / SCHEDULE) — TABULAR LAYOUT                           */}
        {/* ============================================================================== */}
        <section id="schedule" className="pt-12 sm:pt-16 border-t border-[#E5E5E0] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-12">
            {/* Header: 12-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-4">
              <div className="lg:col-span-6 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                  02 / Schedule
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                  {scheduleMeta.sectionTitle}.
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg">
                  Each session holds up to 10 participants for focused, hands-on guidance. All starter pots, seeds, and organic potting mix are provided free of charge.
                </p>
              </div>
            </div>

            {/* Tabular List of Sessions */}
            <OctoberSchedule workshops={workshops} />
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 4. CURRICULUM SECTION (03 / CURRICULUM) — 6-ITEM VALUE MATRIX                  */}
        {/* ============================================================================== */}
        <section id="experience" className="pt-12 sm:pt-16 border-t border-[#E5E5E0] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10 sm:space-y-14">
            {/* Section Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-6 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                  03 / Curriculum
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                  A Foundation for Seasonal Success.
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg">
                  A coherent educational series covering the complete lifecycle from soil biology to cold-season protection. Gain practical confidence in real dirt.
                </p>
              </div>
            </div>

            {/* 6 Structured Matrix Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E0] border border-[#E5E5E0] rounded-lg overflow-hidden">
              {/* Module 01 */}
              <div className="bg-white p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-stone-400 block">01</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Soil Preparation &amp; Health
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Understand aeration, soil structure, microbial ecosystems, and organic soil amendments for containers and raised beds.
                </p>
              </div>

              {/* Module 02 */}
              <div className="bg-white p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-stone-400 block">02</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Seed Starting &amp; Propagation
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Master seed depth, germination conditions, root aeration, and potting technique. Take home fresh starter pots every session.
                </p>
              </div>

              {/* Module 03 */}
              <div className="bg-white p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-stone-400 block">03</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Organic Composting Methods
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Learn proper green-to-brown ratios, temperature monitoring, and converting food scraps into mineral-rich garden compost.
                </p>
              </div>

              {/* Module 04 */}
              <div className="bg-white p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-stone-400 block">04</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Autumn Vegetable Planting
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Plant hearty cool-weather crops: winter lettuces, kale, radishes, garlic, and overwintering culinary alliums.
                </p>
              </div>

              {/* Module 05 */}
              <div className="bg-white p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-stone-400 block">05</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Natural Pest Management
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Protect plants using companion planting, beneficial insect habitats, and non-toxic horticultural barriers.
                </p>
              </div>

              {/* Module 06 */}
              <div className="bg-white p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-stone-400 block">06</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Winter Prep &amp; Herb Drying
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Techniques for drying perennial herbs, applying insulating mulch, and sheltering soil beds for spring vitality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 5. INSTRUCTOR & COMMUNITY IMPACT (04 / INSTRUCTOR)                             */}
        {/* ============================================================================== */}
        <section id="instructor-impact" className="pt-12 sm:pt-16 border-t border-[#E5E5E0] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Photo Frame (Col-span-5) */}
              <div className="lg:col-span-5">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E5E0] bg-white shadow-2xs">
                  <Image
                    src="/jade_instructor.jpg"
                    alt="Jade Belstead in a vibrant community vegetable garden in Kingston, NY"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                    className="object-cover"
                  />

                  {/* Clean verified highlight tag */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-sm p-3 rounded-md border border-[#E5E5E0] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#2D4A3E]" />
                      <span>10+ Years Community Experience</span>
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">Kingston, NY</span>
                  </div>
                </div>
              </div>

              {/* Bio & Authority (Col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                    04 / Instructor
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                    Meet Jade Belstead.
                  </h2>
                </div>

                {/* Formal Bio Quote */}
                <blockquote className="text-base sm:text-lg text-stone-800 font-medium leading-relaxed border-l-2 border-[#2D4A3E] pl-4 py-1">
                  &ldquo;Experienced local hobby gardener with ten years of community project involvement.&rdquo;
                </blockquote>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Jade has coordinated neighborhood garden allotments, schoolyard compost initiatives, and urban greening drives across Kingston. Her coaching methodology is rooted in practical, non-intimidating dirt work—enabling complete beginners, apartment renters, and balcony growers to produce flourishing harvests.
                </p>

                {/* 3 Principles */}
                <div className="space-y-2.5 pt-2 text-xs font-medium text-stone-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-[#2D4A3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>100% Organic, pesticide-free horticultural methods</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-[#2D4A3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Direct tactile practice: seed propagation, compost aeration &amp; root pruning</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-[#2D4A3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Supportive neighborhood community with follow-up planting tips</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#schedule"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2D4A3E] hover:text-[#1E342B] border-b border-[#2D4A3E] pb-0.5"
                  >
                    <span>View Session Dates</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Testimonials (05 / VOICES) */}
            <div className="pt-8 border-t border-[#E5E5E0]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                    05 / Community
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                    Participant Feedback.
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Notes from neighbors who joined Jade&apos;s previous greenhouse sessions.
                  </p>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E0] space-y-3">
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      &ldquo;I used to kill every supermarket herb I bought. Jade showed us how to prune roots, aerate soil, and water correctly. My windowsill has never looked better.&rdquo;
                    </p>
                    <div className="pt-2 border-t border-[#E5E5E0] text-[11px] font-mono">
                      <span className="font-bold text-[#1A1A1A] block">Clara Dupuis</span>
                      <span className="text-stone-400">Balcony Gardener, Kingston</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E0] space-y-3">
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      &ldquo;Jade&apos;s 10 years of community experience clearly shows. The compost and soil biology session completely changed how I look at organic kitchen waste.&rdquo;
                    </p>
                    <div className="pt-2 border-t border-[#E5E5E0] text-[11px] font-mono">
                      <span className="font-bold text-[#1A1A1A] block">Marc Henderson</span>
                      <span className="text-stone-400">Allotment Volunteer, Kingston</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 6. CONTACT & LOCATION (06 / CONTACT)                                           */}
        {/* ============================================================================== */}
        <section id="contact-us" className="pt-12 sm:pt-16 border-t border-[#E5E5E0] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10 sm:space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                06 / Location &amp; Contact
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                Connect with Jade.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed">
                Have questions about workshop logistics, accessibility, or private group bookings? Get in touch directly.
              </p>
            </div>

            {/* 3 Contact Specification Cells */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E5E0] border border-[#E5E5E0] rounded-lg overflow-hidden text-xs">
              <div className="bg-white p-5 sm:p-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Greenhouse Location</span>
                <span className="font-bold text-[#1A1A1A] block">Kingston Community Greenhouse</span>
                <span className="text-stone-500 block">Kingston, New York 12401</span>
              </div>

              <div className="bg-white p-5 sm:p-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Telephone</span>
                <span className="font-bold text-[#1A1A1A] block">(555) 382-9102</span>
                <span className="text-stone-500 block">Tue – Sat, 9:00 AM to 5:00 PM</span>
              </div>

              <div className="bg-white p-5 sm:p-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Email Inquiry</span>
                <span className="font-bold text-[#1A1A1A] block">jade@gardeningbasics.local</span>
                <span className="text-stone-500 block">Inquiries answered within 24 hours</span>
              </div>
            </div>

            {/* Location Map & Newsletter Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Location Guide Column (Col-span-6) */}
              <div className="lg:col-span-6 bg-white rounded-lg border border-[#E5E5E0] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2D4A3E]" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                        Workshop Location
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                      Kingston, NY 12401
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                      Kingston Community Greenhouse &amp; Gardens
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                      Located in the Midtown arts &amp; garden district. All seasonal workshops meet inside the solar greenhouse and adjacent organic raised beds.
                    </p>
                  </div>

                  {/* Stylized Architectural Map Graphic */}
                  <div className="relative h-44 rounded-md border border-[#E5E5E0] bg-[#F7F7F5] overflow-hidden flex items-center justify-center">
                    {/* Grid Pattern Background */}
                    <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#E5E5E0_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E0_1px,transparent_1px)] bg-[size:24px_24px]" />

                    {/* Abstract Geographic Lines */}
                    <svg className="absolute inset-0 w-full h-full stroke-stone-300 fill-none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M-20 40 Q 120 70, 240 40 T 500 80" strokeWidth="2.5" stroke="#D4D4D0" />
                      <path d="M60 -20 Q 90 100, 110 200" strokeWidth="1.5" stroke="#E0E0DC" />
                      <path d="M260 -10 Q 230 90, 270 200" strokeWidth="2" stroke="#D4D4D0" />
                      <path d="M-10 120 Q 150 140, 450 110" strokeWidth="1.5" stroke="#E0E0DC" />
                    </svg>

                    {/* Community Greenhouse Pin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#2D4A3E] text-white shadow-md border border-emerald-900/30">
                        <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <span className="text-xs font-bold tracking-tight">Community Greenhouse</span>
                      </div>
                      <div className="w-2 h-2 rotate-45 bg-[#2D4A3E] -mt-1" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 mt-0.5" />
                    </div>

                    <span className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-500 bg-white/90 px-2 py-0.5 rounded border border-[#E5E5E0]">
                      41.9325° N, 74.0000° W
                    </span>
                  </div>

                  {/* Visitor Information Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 bg-stone-50 rounded border border-[#E5E5E0] space-y-0.5">
                      <span className="text-stone-400 uppercase text-[10px] block">Parking</span>
                      <span className="text-[#1A1A1A] font-medium block">Free on-site gravel lot + street</span>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded border border-[#E5E5E0] space-y-0.5">
                      <span className="text-stone-400 uppercase text-[10px] block">Accessibility</span>
                      <span className="text-[#1A1A1A] font-medium block">Level stone paths &amp; raised beds</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#E5E5E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="text-xs text-stone-500 font-mono">
                    Gates open at 9:30 AM on Saturdays
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Kingston+Community+Greenhouse+Kingston+NY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-[#2D4A3E] hover:bg-[#1E342B] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-2xs"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Newsletter Column (Col-span-6) */}
              <div className="lg:col-span-6 bg-white rounded-lg border border-[#E5E5E0] p-6 sm:p-8 flex flex-col justify-center space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2D4A3E]">
                    Monthly Bulletin
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
                    Seasonal Garden Tips &amp; Priority Booking
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Subscribe to receive Jade&apos;s monthly regional planting calendar and first access when new free dates are added.
                  </p>
                </div>

                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================================== */}
      {/* 7. FOOTER — MATHEMATICAL 12-COLUMN SWISS FOOTER                                */}
      {/* ============================================================================== */}
      <footer className="border-t border-[#E5E5E0] bg-[#FBFBF9] py-12 sm:py-16 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-[#E5E5E0]">
            {/* Col 1 */}
            <div className="lg:col-span-4 space-y-2.5">
              <span className="font-extrabold text-sm uppercase tracking-tight text-[#1A1A1A] block">
                Jade Belstead
              </span>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
                Seasonal Gardening Basics. Hands-on organic gardening coaching hosted at the Kingston Community Greenhouse. All materials provided free.
              </p>
            </div>

            {/* Col 2 */}
            <div className="lg:col-span-3 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Navigation
              </span>
              <ul className="space-y-1.5 font-medium">
                <li><a href="#schedule" className="hover:text-[#1A1A1A] transition-colors">Schedule</a></li>
                <li><a href="#experience" className="hover:text-[#1A1A1A] transition-colors">Curriculum</a></li>
                <li><a href="#instructor-impact" className="hover:text-[#1A1A1A] transition-colors">Instructor</a></li>
                <li><a href="#contact-us" className="hover:text-[#1A1A1A] transition-colors">Location &amp; Contact</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="lg:col-span-3 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                {scheduleMeta.monthLabel} Sessions
              </span>
              <ul className="space-y-1.5 font-mono text-[11px] text-stone-500">
                {workshops.slice(0, 5).map((ws) => (
                  <li key={ws.id} className="truncate">
                    {formatDateShort(ws.date)}: {ws.title.replace('Seasonal Gardening Basics - ', '')}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 */}
            <div className="lg:col-span-2 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Administration
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Authorized access for workshop roster management.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#2D4A3E] hover:underline"
              >
                <span>Admin Portal</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-stone-500">
            <p>© 2026 Seasonal Gardening Basics • Jade Belstead. Kingston, NY.</p>
            <p>Designed with Swiss International Typographic Principles.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
