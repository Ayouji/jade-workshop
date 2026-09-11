import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWorkshopsWithAvailability, WorkshopWithAvailability } from '@/lib/db';
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
  Play,
  CheckCircle2,
  Users,
  Award,
  Sprout,
  Leaf,
  Sun,
  HeartHandshake,
  ShieldCheck,
  Compass,
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
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] font-sans antialiased selection:bg-[#1B4332] selection:text-white">
      {/* ============================================================================== */}
      {/* 1. NAVBAR - EVENTO STYLE AVEC IDENTITÉ ÉCO-RESPONSABLE JADE                    */}
      {/* ============================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo EVENTO x JADE GARDEN */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm group-hover:bg-[#2D6A4F] transition-colors">
              <Sprout className="w-5 h-5 text-[#52B788]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-black text-2xl tracking-tight text-[#0F172A]">
                  EVENT
                </span>
                <span className="font-black text-2xl tracking-tight text-[#52B788] -ml-0.5">
                  O
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                Jade Belstead
              </span>
            </div>
          </Link>

          {/* Navigation textuelle à droite */}
          <nav className="flex items-center gap-6 md:gap-9 text-sm font-semibold text-slate-700">
            <a href="/" className="hover:text-[#1B4332] transition-colors">
              Home
            </a>
            <a href="#about-instructor" className="hover:text-[#1B4332] transition-colors">
              About Jade
            </a>
            <a href="#schedule" className="hover:text-[#1B4332] transition-colors">
              October Schedule
            </a>
            <a href="#benefits" className="hover:text-[#1B4332] transition-colors">
              Highlights
            </a>
            <a href="#contact-us" className="hover:text-[#1B4332] transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="space-y-24 md:space-y-32">
        {/* ============================================================================== */}
        {/* 2. HERO SECTION - OFFICIEL CLIENT (JADE)                                       */}
        {/* ============================================================================== */}
        <section className="relative pt-10 md:pt-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : Copie officielle du Client */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Badge Cadence */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>Every Saturday morning in October</span>
                </div>

                {/* Titre Officiel */}
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#0F172A] tracking-tight leading-[1.12]">
                  Seasonal Gardening Basics
                </h1>

                {/* Sous-titre Officiel */}
                <p className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed font-normal">
                  Learn to plant and nurture your own herbs and vegetables.
                </p>

                {/* Détails pratiques rapides */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200/80 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-[#1B4332]" />
                    10:00 AM – 12:30 PM
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200/80 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#52B788]" />
                    Community Garden, Kingston
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Free No-Payment Booking
                  </span>
                </div>

                {/* Primary CTA Officiel: "Book Your Spot for October" + Schedule Link */}
                <div className="pt-2">
                  <HeroBookingCta workshops={workshops} />
                </div>
              </div>

              {/* Colonne Droite : Visuel Hero Végétal Naturel */}
              <div className="lg:col-span-6 relative flex justify-center items-center">
                <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-square rounded-[36px] overflow-hidden shadow-2xl bg-white border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80"
                    alt="Hands planting aromatic kitchen herbs in organic soil"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Badge flottant sur l'image */}
                  <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <Sprout className="w-5 h-5 text-[#52B788]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">All Gardening Supplies Provided</p>
                      <p className="text-[11px] text-slate-500">Seeds, organic soil, starter pots & guide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. SECTION INSTRUCTOR & ABOUT - JADE BELSTEAD                                  */}
        {/* ============================================================================== */}
        <section id="about-instructor" className="py-12 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Photo de Jade Belstead avec Highlight Tag Flottant */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] sm:aspect-square rounded-[36px] overflow-hidden shadow-xl bg-white border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=1200&q=80"
                    alt="Jade Belstead in a vibrant community vegetable garden"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Highlight Tag Requis: "10+ Years Community Experience" */}
                <div className="absolute top-8 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md p-5 rounded-[28px] shadow-2xl border border-[#52B788]/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-6 h-6 text-[#52B788]" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-[#0F172A] leading-tight block">
                      10+ Years
                    </span>
                    <span className="text-xs text-slate-600 font-bold block">
                      Community Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu Profil & Bio Officielle */}
              <div className="lg:col-span-7 space-y-6 lg:pl-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                  About Your Instructor
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  Meet Jade Belstead
                </h2>

                {/* Bio Requis */}
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
                  &quot;Experienced local hobby gardener with ten years of community project involvement.&quot;
                </p>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Jade has spearheaded neighborhood allotment gardens, school greening projects, and seasonal compost workshops across Kingston. Her teaching approach is warm, practical, and grounded in real dirt—making organic food growing approachable for complete beginners and apartment dwellers alike.
                </p>

                {/* 3 Bullet Points Chaleureux */}
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#0F172A]">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                    </div>
                    <span>100% Organic & Permaculture-Inspired Methods</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#0F172A]">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                    </div>
                    <span>Hands-On Soil, Seed Starting & Container Techniques</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#0F172A]">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                    </div>
                    <span>Inclusive Neighborhood Community & Ongoing Tips</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <a
                    href="#schedule"
                    className="inline-block px-8 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    View October Workshop Sessions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 4. SECTION "WHAT YOU WILL LEARN" - 4 CARTES ÉCO-RESPONSABLES                   */}
        {/* ============================================================================== */}
        <section id="benefits" className="py-12 border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : 4 Cartes Blanches */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                    <Sprout className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Seed Germination</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Learn proper sowing depth, moisture balance, and lighting setups for herbs like basil, rosemary, and mint.
                  </p>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                    <Leaf className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Living Soil & Compost</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nurture beneficial mycorrhizae and earthworms with homemade compost, mulch, and organic amendments.
                  </p>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                    <Sun className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Cool-Season Crops</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Discover how to cultivate sweet autumn spinach, kale, radishes, and overwintering garlic cloves with ease.
                  </p>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Natural Pest Defense</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Protect plants organically with companion planting, marigolds, beneficial insects, and gentle herbal sprays.
                  </p>
                </div>
              </div>

              {/* Colonne Droite : Titre & Introduction */}
              <div className="lg:col-span-5 space-y-5 lg:pl-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                  Curriculum Highlights
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  Grow Fresh Food in Any Space You Have
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Whether you cultivate a backyard garden bed, a suburban patio, or a sunny kitchen windowsill, these Saturday workshops give you practical confidence to grow nutritious, fresh herbs and vegetables from scratch.
                </p>

                <div className="pt-2">
                  <a
                    href="#schedule"
                    className="inline-block px-8 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Select Your Saturday Slot
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 5. SCHEDULE & AVAILABILITY SECTION - CADENCE OFFICIELLE OCTOBRE               */}
        {/* ============================================================================== */}
        <section id="schedule" className="py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            {/* Header du planning */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-gray-200/80 pb-6">
              <div className="lg:col-span-6 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>Official October Schedule</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Every Saturday morning in October
                </h3>
              </div>
              <div className="lg:col-span-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Join Jade Belstead at the community greenhouse every Saturday from <strong>10:00 AM to 12:30 PM</strong>. Each session holds up to 10 participants to ensure personal coaching and plenty of hands-on planting.
                </p>
              </div>
            </div>

            {/* Composant interactif OctoberSchedule avec les 5 samedis et la modale */}
            <OctoberSchedule workshops={workshops} />
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 6. SECTION TESTIMONIALS - AVIS DE LA COMMUNAUTÉ LOCALE                          */}
        {/* ============================================================================== */}
        <section className="py-12 border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Colonne Gauche */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                  Community Stories
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  Loved by Local Kingston Gardeners
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Read inspiring feedback from neighbors and local beginners who turned their balconies and small yards into flourishing green spaces under Jade&apos;s guidance.
                </p>

                <div>
                  <a
                    href="#schedule"
                    className="inline-block px-8 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Join a Saturday Workshop
                  </a>
                </div>
              </div>

              {/* Colonne Droite : 3 Cartes Vert Forêt Profond */}
              <div className="lg:col-span-7 space-y-6">
                {/* Carte 1 */}
                <div className="bg-[#1B4332] text-white rounded-[28px] p-7 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-3 max-w-sm z-10">
                    <span className="text-3xl font-serif text-emerald-200/70 block">“</span>
                    <h4 className="text-lg font-bold">My herbs are thriving!</h4>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      &quot;I used to kill every supermarket herb I bought. Jade showed us how to prune roots, aerate soil, and water correctly. My kitchen smells amazing!&quot;
                    </p>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-white">Clara Dupuis</p>
                      <p className="text-xs text-emerald-200/80">Balcony Gardener, Kingston</p>
                    </div>
                  </div>

                  <div className="relative w-36 h-48 sm:w-40 sm:h-48 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20">
                    <Image
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                      alt="Clara Dupuis"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Carte 2 */}
                <div className="bg-[#1B4332] text-white rounded-[28px] p-7 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-3 max-w-sm z-10">
                    <span className="text-3xl font-serif text-emerald-200/70 block">“</span>
                    <h4 className="text-lg font-bold">Invaluable soil tips</h4>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      &quot;Jade&apos;s 10 years of community experience clearly shows. The compost and soil biology session completely changed how I look at organic waste.&quot;
                    </p>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-white">Marc Henderson</p>
                      <p className="text-xs text-emerald-200/80">Allotment Volunteer</p>
                    </div>
                  </div>

                  <div className="relative w-36 h-48 sm:w-40 sm:h-48 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                      alt="Marc Henderson"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 7. CONTACT & NEWSLETTER SECTION                                                */}
        {/* ============================================================================== */}
        <section id="contact-us" className="py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52B788]">
                Get In Touch
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                Connect with Jade
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Have questions regarding the October sessions, accessibility at the garden, or private group bookings? Drop us a message anytime.
              </p>
            </div>

            {/* 3 Cartes Visit / Call / Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visit */}
              <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#52B788]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0F172A]">Location</h4>
                  <p className="text-xs text-slate-500 mt-1">Kingston Community Greenhouse & Gardens</p>
                  <p className="text-xs text-slate-500">Kingston, New York 12401</p>
                </div>
              </div>

              {/* Call */}
              <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#52B788]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0F172A]">Call / WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-1">(555) 382-9102</p>
                  <p className="text-xs text-slate-400">Tue – Sat, 9am to 5pm</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#52B788]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0F172A]">Email</h4>
                  <p className="text-xs text-slate-500 mt-1">jade@gardeningbasics.local</p>
                  <p className="text-xs text-slate-400">Direct response within 24h</p>
                </div>
              </div>
            </div>

            {/* Rangée Map + Formulaire Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Carte Map */}
              <div className="bg-white rounded-[28px] overflow-hidden border border-gray-200/80 shadow-sm relative min-h-[360px]">
                <iframe
                  title="Kingston Community Garden Location"
                  src="https://maps.google.com/maps?hl=en&amp;q=kingston+ny+community+garden&amp;ie=UTF8&amp;t=&amp;z=13&amp;iwloc=B&amp;output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Formulaire Newsletter */}
              <div className="bg-white rounded-[28px] p-8 sm:p-12 border border-gray-200/80 shadow-sm space-y-6 flex flex-col justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-[#52B788]" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                    Seasonal Garden Tips
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
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
      {/* 8. FOOTER - EVENTO ARCHITECTURE AVEC LIEN ADMIN DISCRET                         */}
      {/* ============================================================================== */}
      <footer className="bg-[#F4F7F3] text-slate-700 pt-16 pb-12 border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-200/70">
          {/* Colonne 1 : Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                <Sprout className="w-4 h-4 text-[#52B788]" />
              </div>
              <span className="font-black text-xl text-[#0F172A] tracking-tight">
                Seasonal Gardening
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Learn to plant and nurture your own herbs and vegetables. Community workshops hosted by Jade Belstead every Saturday morning in October.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">ig</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition-colors"
                aria-label="Facebook"
              >
                <span className="text-xs font-bold">fb</span>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#0F172A]">Workshop Navigation</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/" className="hover:text-[#1B4332] transition-colors">Home</a></li>
              <li><a href="#about-instructor" className="hover:text-[#1B4332] transition-colors">About Jade Belstead</a></li>
              <li><a href="#schedule" className="hover:text-[#1B4332] transition-colors">October Schedule</a></li>
              <li><a href="#benefits" className="hover:text-[#1B4332] transition-colors">What You&apos;ll Learn</a></li>
              <li><a href="#contact-us" className="hover:text-[#1B4332] transition-colors">Contact & Location</a></li>
            </ul>
          </div>

          {/* Colonne 3 : October Saturday Dates */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#0F172A]">October Sessions</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                <span>Oct 3: Herbs & Seed Starting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                <span>Oct 10: Soil Health & Compost</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                <span>Oct 17: Autumn Vegetables</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                <span>Oct 24: Pest Control & Pruning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                <span>Oct 31: Winter Prep & Harvesting</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Instructor Note */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#0F172A]">Community Project</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hosted by Jade Belstead with 10+ years of community gardening involvement. All sessions are 100% free with materials provided.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Seasonal Gardening Basics • Jade Belstead. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#schedule" className="hover:text-[#1B4332] transition-colors">Book Spot</a>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#1B4332] transition-colors opacity-50 hover:opacity-100">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
