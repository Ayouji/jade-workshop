import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWorkshopsWithAvailability, WorkshopWithAvailability } from '@/lib/db';
import { WorkshopGrid } from '@/components/WorkshopGrid';
import { NewsletterForm } from '@/components/NewsletterForm';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  Compass,
  Star,
  Quote,
  TrendingUp,
  Globe,
  Sliders,
  ShieldCheck,
  Award,
  Video,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const DEMO_WORKSHOPS: WorkshopWithAvailability[] = [
  {
    id: 'demo-1',
    title: 'Initiation au Tournage & Grès Blanc',
    description: 'Découvrez les gestes fondamentaux du potier : centrage, perçage et montée de terre pour façonner vos premiers bols ou tasses.',
    date: '2026-10-17',
    start_time: '14:00',
    end_time: '16:30',
    capacity: 8,
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 4,
    remaining_seats: 4,
  },
  {
    id: 'demo-2',
    title: 'Modelage Intuitif & Émaux Terracotta',
    description: 'Façonnez librement à la main selon les techniques du pincé et du colombin, puis explorez nos engobes artisanaux aux nuances chaudes.',
    date: '2026-10-24',
    start_time: '10:00',
    end_time: '13:00',
    capacity: 6,
    image_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 5,
    remaining_seats: 1,
  },
  {
    id: 'demo-3',
    title: 'Vases Organiques & Fleurs Séchées',
    description: 'Créez un vase sculptural aux lignes épurées et organiques, cuit à haute température (1250°C), idéal pour accueillir vos compositions.',
    date: '2026-10-31',
    start_time: '15:00',
    end_time: '18:00',
    capacity: 8,
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    booked_seats: 2,
    remaining_seats: 6,
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
    console.warn('Chargement des ateliers de démonstration suite à une exception :', error);
    return DEMO_WORKSHOPS;
  }
}

export default async function HomePage() {
  const workshops = await loadWorkshops();

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#121244] font-sans antialiased selection:bg-[#121244] selection:text-white">
      {/* ============================================================================== */}
      {/* 1. NAVBAR EXACTE STYLE EVENTO                                                  */}
      {/* ============================================================================== */}
      <header className="sticky top-0 z-50 bg-[#F8F9FD]/95 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo EVENTO */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <span className="font-black text-3xl tracking-tight text-[#121244]">
              EVENT
            </span>
            <span className="font-black text-3xl tracking-tight text-[#D93829] -ml-0.5">
              O
            </span>
          </Link>

          {/* Navigation textuelle à droite */}
          <nav className="flex items-center gap-8 md:gap-10 text-sm font-semibold text-[#121244]/85">
            <a href="/" className="hover:text-[#D93829] transition-colors">
              Home
            </a>
            <a href="#about-us" className="hover:text-[#D93829] transition-colors">
              About Us
            </a>
            <a href="#speakers" className="hover:text-[#D93829] transition-colors">
              Hôte
            </a>
            <a href="#events" className="hover:text-[#D93829] transition-colors">
              Events
            </a>
            <a href="#contact-us" className="hover:text-[#D93829] transition-colors">
              Contact Us
            </a>
          </nav>
        </div>
      </header>

      <main className="space-y-24 md:space-y-32">
        {/* ============================================================================== */}
        {/* 2. HERO SECTION (AVEC L'IMAGE ORIGINALE EXACTE SANS FOND RAJOUTÉ)             */}
        {/* ============================================================================== */}
        <section className="relative pt-10 md:pt-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : Titre Poppins & 2 Boutons Ovals */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#121244] tracking-tight leading-[1.15]">
                  Craft unforgettable events with Evento-your ultimate event planning partner
                </h1>

                <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed font-normal">
                  At Evento, we specialize in bringing your vision to life with flawless planning and execution. From weddings to corporate events, we craft experiences that leave a lasting impression.
                </p>

                {/* 2 Boutons Ovals de la Maquette */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#events"
                    className="px-8 py-3.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-sm transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Learn more
                  </a>
                  <a
                    href="#contact-us"
                    className="px-8 py-3.5 bg-transparent hover:bg-white text-[#121244] font-bold rounded-full text-sm border border-[#121244] transition-all hover:shadow-md"
                  >
                    Contact us
                  </a>
                </div>
              </div>

              {/* Colonne Droite : L'Image Originale du Template EVENTO (SANS FOND ARTIFICIEL) */}
              <div className="lg:col-span-6 relative flex justify-center items-center">
                <div className="relative w-full max-w-[520px] flex items-center justify-center">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1552.webp"
                    alt="Evento Banner Image"
                    width={523}
                    height={472}
                    priority
                    loading="eager"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. SECTION "ABOUT US" (EXACT ZOHO EVENTO ASSETS)                                */}
        {/* ============================================================================== */}
        <section id="about-us" className="py-12 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Photo avec badge flottant "100+ Events" */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl bg-white">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1553.webp"
                    alt="About Section Image"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Badge Flottant "100+ Events" */}
                <div className="absolute top-10 -right-4 sm:-right-8 bg-[#ECEFFD]/95 backdrop-blur-md p-5 rounded-[28px] shadow-xl border border-indigo-100/80 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#121244] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-[#121244] leading-tight block">
                      100+
                    </span>
                    <span className="text-xs text-gray-600 font-bold">Events</span>
                  </div>
                </div>
              </div>

              {/* Texte & 3 Bullet Points exacts */}
              <div className="lg:col-span-7 space-y-6 lg:pl-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  About us
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121244] tracking-tight leading-snug">
                  Crafting unforgettable experiences, every time.
                </h2>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  At Evento, we transform your vision into reality, ensuring every event, is a masterpiece of creativity, coordination, and unforgettable memories.
                </p>

                {/* 3 bullet points avec pastilles circulaires bleu profond */}
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#121244]">
                    <div className="w-5 h-5 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span>Results-oriented strategies</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#121244]">
                    <div className="w-5 h-5 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span>Multiplatform expertise</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#121244]">
                    <div className="w-5 h-5 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span>24/7 dedicated support</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <a
                    href="#events"
                    className="inline-block px-8 py-3 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>

            {/* Bandeau de logos partenaires officiels de la maquette */}
            <div className="pt-8 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-8 opacity-80 hover:opacity-100 transition-all">
              <div className="h-10 flex items-center">
                <Image
                  src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1569.webp"
                  alt="Logo 1"
                  width={100}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="h-10 flex items-center">
                <Image
                  src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1567.webp"
                  alt="Logo 2"
                  width={176}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="h-10 flex items-center">
                <Image
                  src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1568.webp"
                  alt="Logo 3"
                  width={174}
                  height={39}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="h-10 flex items-center">
                <Image
                  src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1566.webp"
                  alt="Logo 4"
                  width={169}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 4. SECTION "OUR STORY" (IMAGES OFFICIELLES DU TEMPLATE)                         */}
        {/* ============================================================================== */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  Our story
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#121244] leading-snug">
                  Connecting minds and shaping futures with Evento.
                </h3>
              </div>

              <div className="lg:col-span-6 space-y-4 lg:pl-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bring together innovative minds and unique ideas to create extraordinary, impactful events, We ensure every moment resonates curating extraordinary ideas to create unforgettable stories.
                </p>
                <a
                  href="#events"
                  className="inline-block px-7 py-3 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-md"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Showcase Visuel Double avec Encart Vidéo et Image Officielle */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-9 relative aspect-[16/9] rounded-[36px] overflow-hidden shadow-xl bg-white">
                <Image
                  src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1554.webp"
                  alt="Event Image"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Encart superposé */}
              <div className="lg:col-span-3 relative aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                <Image
                  src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1555.webp"
                  alt="Speaker Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 5. SECTION "SERVICES" / WHAT WE DO? (4 CARTES OFFICIELLES)                     */}
        {/* ============================================================================== */}
        <section id="services" className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : 4 Cartes Blanches avec Icônes Carrées */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#121244] text-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#121244]">Business analysis</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Transform insights into actions with strategic business analysis, tailored to elevate your event&apos;s success.
                  </p>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#121244] text-white flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#121244]">Business consulting</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Empower your event&apos;s growth through tailored business consulting, maximizing potential at every stage.
                  </p>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#121244] text-white flex items-center justify-center shadow-sm">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#121244]">Strategic planning</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Craft a vision, align your goals, and execute them with precision with strategic planning for your event&apos;s excellence.
                  </p>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#121244] text-white flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#121244]">Audit & evaluation</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Uncover insights and ensure success through comprehensive audits and evaluations for your event&apos;s continuous improvement.
                  </p>
                </div>
              </div>

              {/* Colonne Droite : Titre & CTA */}
              <div className="lg:col-span-5 space-y-5 lg:pl-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  What we do?
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#121244] tracking-tight leading-snug">
                  Discover how our events can elevate your business
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Drive engagement, boost brand visibility, and create valuable connections with your target audiences. Transform your goals into achievements with our expertly managed events.
                </p>

                <div className="pt-2">
                  <a
                    href="#events"
                    className="inline-block px-8 py-3.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Browse Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 6. SECTION "JOIN US" / 4 LIGNES HORIZONTALES D'AVANTAGES                        */}
        {/* ============================================================================== */}
        <section className="py-12 border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : 4 Lignes avec Séparateurs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Ligne 1 */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-[#121244]">Expert Insights</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                      Gain valuable knowledge from our industry. Discover tips, trends, and tactics to elevate your next event and drive success.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200/80 pt-6">
                  {/* Ligne 2 */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0 shadow-md">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-[#121244]">Networking Opportunities</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                        Unlock powerful networking opportunities, connect with industry leaders, forge meaningful relationships, and expand your business network through our expertly organized events.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/80 pt-6">
                  {/* Ligne 3 */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0 shadow-md">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-[#121244]">Interactive Workshop</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                        Engage your team with our interactive workshops&apos; hands-on learning experiences designed to inspire, educate, and drive innovation. Elevate skills and foster collaboration with dynamic, tailored sessions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/80 pt-6">
                  {/* Ligne 4 */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0 shadow-md">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-[#121244]">Stay Update</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                        Stay ahead of the curve with our latest updates. Get exclusive insights, event highlights, and trends delivered directly to you. Sign up to keep your business in the loop.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Titre & CTA */}
              <div className="lg:col-span-5 space-y-6 lg:pl-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  Join us
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#121244] tracking-tight leading-snug">
                  Unlock the benefits of attending our events
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Network with industry leaders, gain actionable insights, and discover cutting-edge trends. Experience firsthand how our expertly crafted events can propel your business forward and enhance your professional growth.
                </p>

                <div className="pt-2">
                  <a
                    href="#events"
                    className="inline-block px-8 py-3.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 7. SECTION "TOP CONFERENCES" (AVEC IMAGE OFFICIELLE ET CALENDRIER)             */}
        {/* ============================================================================== */}
        <section className="py-12 border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne Gauche : Titre, When/Where et Bouton */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  Top conferences
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#121244] tracking-tight leading-snug">
                  Stay updated with the latest event details
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Never miss a beat stay informed with real-time updates on our latest events. From schedules to special announcements, get all the essential details delivered straight to you, ensuring you&apos;re always in the loop.
                </p>

                {/* Bloc When / Where avec séparateurs */}
                <div className="border-t border-b border-gray-200/80 py-6 grid grid-cols-2 gap-6">
                  {/* When */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#121244]">
                      <Calendar className="w-4 h-4 text-[#121244]" />
                      <span>When</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Saturday & Sunday</p>
                    <p className="text-xs text-gray-600 font-medium">July 23 - 25 2024</p>
                    <p className="text-xs text-gray-600 font-medium">10:00 am to 2:00 pm</p>
                  </div>

                  {/* Where */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#121244]">
                      <Compass className="w-4 h-4 text-[#121244]" />
                      <span>Where</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Mason Center Hall</p>
                    <p className="text-xs text-gray-600 font-medium">San Francisco</p>
                    <p className="text-xs text-gray-600 font-medium">United States</p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#events"
                    className="inline-block px-8 py-3.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Book Tickets
                  </a>
                </div>
              </div>

              {/* Colonne Droite : Image Officielle de la Conférence */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-[540px] aspect-[540/529] rounded-[36px] overflow-hidden shadow-2xl bg-white">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1564.webp"
                    alt="Conference Image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 8. SECTION "OUR EXPERTS" (SPEAKERS AVEC LES 5 PHOTOS OFFICIELLES)              */}
        {/* ============================================================================== */}
        <section id="speakers" className="py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-12">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                Our experts
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#121244] tracking-tight">
                Meet Our Expert Speakers
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our team at Evento is a group of passionate, creative professionals with a shared love of turning ideas into memorable events.
              </p>
            </div>

            {/* Rangée 1 de Speakers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* John */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1556.webp"
                    alt="John"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full py-4 px-6 rounded-full bg-white shadow-sm border border-gray-100">
                  <h4 className="font-extrabold text-base text-[#121244]">John</h4>
                  <p className="text-xs text-gray-500 font-medium">Innovation Officer</p>
                </div>
              </div>

              {/* Michael */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1557.webp"
                    alt="Michael"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full py-4 px-6 rounded-full bg-white shadow-sm border border-gray-100">
                  <h4 className="font-extrabold text-base text-[#121244]">Michael</h4>
                  <p className="text-xs text-gray-500 font-medium">Product Designer</p>
                </div>
              </div>

              {/* Sarah */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1558.webp"
                    alt="Sarah"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full py-4 px-6 rounded-full bg-white shadow-sm border border-gray-100">
                  <h4 className="font-extrabold text-base text-[#121244]">Sarah</h4>
                  <p className="text-xs text-gray-500 font-medium">Marketing Strategist</p>
                </div>
              </div>
            </div>

            {/* Rangée 2 de Speakers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto pt-2">
              {/* Robert */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1559.webp"
                    alt="Robert"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full py-4 px-6 rounded-full bg-white shadow-sm border border-gray-100">
                  <h4 className="font-extrabold text-base text-[#121244]">Robert</h4>
                  <p className="text-xs text-gray-500 font-medium">UX/UI Expert</p>
                </div>
              </div>

              {/* Michelle */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1560.webp"
                    alt="Michelle"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full py-4 px-6 rounded-full bg-white shadow-sm border border-gray-100">
                  <h4 className="font-extrabold text-base text-[#121244]">Michelle</h4>
                  <p className="text-xs text-gray-500 font-medium">Technology Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 9. SECTION "EVENTS SCHEDULE" (AVEC GRILLE DYNAMIQUE DE RÉSERVATION)           */}
        {/* ============================================================================== */}
        <section id="events" className="py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            {/* Header du planning */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-gray-200/80 pb-6">
              <div className="lg:col-span-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  Our Conference Schedule 2024
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#121244] tracking-tight">
                  Discover our event schedule.
                </h3>
              </div>
              <div className="lg:col-span-7">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Explore our dynamic event schedule to find exciting opportunities for networking, learning, and growth. Stay ahead of industry trends and connect with key players—our carefully curated events are designed to deliver impactful experiences and memorable moments.
                </p>
              </div>
            </div>

            {/* 3 Lignes du Planning Conférence */}
            <div className="space-y-4">
              {/* Day One */}
              <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-1 md:w-1/4">
                  <h4 className="text-lg font-bold text-[#121244]">Day One,</h4>
                  <p className="text-xs text-gray-500">September 18th, 2024</p>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full mt-1">
                    Live Stream
                  </span>
                </div>
                <div className="space-y-1 md:w-1/2">
                  <h5 className="text-base font-bold text-[#121244]">Tech innovations expo</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Explore cutting-edge technologies and industry trends. Network with leading tech professionals and discover the groundbreaking innovations shaping the future.
                  </p>
                </div>
                <div className="md:w-1/4 flex justify-start md:justify-end">
                  <a
                    href="#workshop-booking"
                    className="px-6 py-2.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-sm"
                  >
                    Book Now
                  </a>
                </div>
              </div>

              {/* Day Two */}
              <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-1 md:w-1/4">
                  <h4 className="text-lg font-bold text-[#121244]">Day Two,</h4>
                  <p className="text-xs text-gray-500">September 19th, 2024</p>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full mt-1">
                    Live Stream
                  </span>
                </div>
                <div className="space-y-1 md:w-1/2">
                  <h5 className="text-base font-bold text-[#121244]">Leadership summit 2024</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Gain insights from top leaders and industry experts on effective leadership strategies. Engage in workshops and panel discussions to enhance your skills.
                  </p>
                </div>
                <div className="md:w-1/4 flex justify-start md:justify-end">
                  <a
                    href="#workshop-booking"
                    className="px-6 py-2.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-sm"
                  >
                    Book Now
                  </a>
                </div>
              </div>

              {/* Day Three */}
              <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-1 md:w-1/4">
                  <h4 className="text-lg font-bold text-[#121244]">Day Three,</h4>
                  <p className="text-xs text-gray-500">September 20th, 2024</p>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full mt-1">
                    Live Stream
                  </span>
                </div>
                <div className="space-y-1 md:w-1/2">
                  <h5 className="text-base font-bold text-[#121244]">Finance and Investment</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Learn from financial experts and investment professionals. Gain valuable insights into market trends, investment strategies, and financial planning.
                  </p>
                </div>
                <div className="md:w-1/4 flex justify-start md:justify-end">
                  <a
                    href="#workshop-booking"
                    className="px-6 py-2.5 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-sm"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>

            {/* GRILLE D'INSCRIPTION EN DIRECT VIA WORKSHOPGRID (BDD NEON POSTGRESQL) */}
            <div id="workshop-booking" className="pt-8 scroll-mt-20">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-[#121244]">
                    Réserver une Session en Ligne
                  </h4>
                  <p className="text-xs text-gray-500">
                    Sélectionnez votre créneau et bloquez votre place immédiatement.
                  </p>
                </div>
              </div>
              <WorkshopGrid workshops={workshops} />
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 10. SECTION "TESTIMONIALS" (AVEC LES 3 PHOTOS ET CARTES OFFICIELLES)           */}
        {/* ============================================================================== */}
        <section className="py-12 border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Colonne Gauche : Titre et Description */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                  Testimonials
                </span>

                <h3 className="text-3xl sm:text-5xl font-extrabold text-[#121244] tracking-tight leading-tight">
                  Hear from our customers
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Discover how our events have transformed businesses and created lasting memories. Read inspiring stories from satisfied clients and see how we turn visions into successful realities.
                </p>

                <div>
                  <a
                    href="#events"
                    className="inline-block px-8 py-3 bg-[#121244] hover:bg-[#1B1C57] text-white font-bold rounded-full text-xs transition-all shadow-md"
                  >
                    Read All
                  </a>
                </div>
              </div>

              {/* Colonne Droite : 3 Cartes Bleues Foncées Officielles */}
              <div className="lg:col-span-7 space-y-6">
                {/* Carte 1 : John Smith */}
                <div className="bg-[#121244] text-white rounded-[28px] p-7 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-3 max-w-sm z-10">
                    <span className="text-3xl font-serif text-white/80 block">“</span>
                    <h4 className="text-lg font-bold">Exceptional experience</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      &quot;The event exceeded all expectations. The meticulous planning and execution created an unforgettable atmosphere, making it an exceptional experience for all attendees.&quot;
                    </p>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-white">John Smith</p>
                      <p className="text-xs text-gray-400">Managing Director</p>
                    </div>
                  </div>

                  <div className="relative w-36 h-48 sm:w-44 sm:h-56 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1562.webp"
                      alt="John Smith"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Carte 2 : Jessica Wilson */}
                <div className="bg-[#121244] text-white rounded-[28px] p-7 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-3 max-w-sm z-10">
                    <span className="text-3xl font-serif text-white/80 block">“</span>
                    <h4 className="text-lg font-bold">Remarkable impact</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      &quot;Our brand visibility soared after the event. The expertly managed event left a remarkable impact, generating significant buzz and attracting new clients.&quot;
                    </p>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-white">Jessica Wilson</p>
                      <p className="text-xs text-gray-400">Marketing Strategist</p>
                    </div>
                  </div>

                  <div className="relative w-36 h-48 sm:w-44 sm:h-56 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1561.webp"
                      alt="Jessica Wilson"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Carte 3 : Ethan Carter */}
                <div className="bg-[#121244] text-white rounded-[28px] p-7 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-3 max-w-sm z-10">
                    <span className="text-3xl font-serif text-white/80 block">“</span>
                    <h4 className="text-lg font-bold">Unforgettable success</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      &quot;The event was a resounding success. Every detail was flawlessly handled, resulting in an unforgettable experience that truly showcased our brand&apos;s potential.&quot;
                    </p>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-white">Ethan Carter</p>
                      <p className="text-xs text-gray-400">Corporate Executive</p>
                    </div>
                  </div>

                  <div className="relative w-36 h-48 sm:w-44 sm:h-56 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1563.webp"
                      alt="Ethan Carter"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 11. SECTION "CONTACT US" (3 CARTES + MAP + NEWSLETTER)                         */}
        {/* ============================================================================== */}
        <section id="contact-us" className="py-12 border-t border-gray-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                Get in touch with us
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-[#121244] tracking-tight">
                Reach Out to Us Today
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect with us today to start planning your next event. Our team is ready to turn your vision into a spectacular reality. Let&apos;s make it happen!
              </p>
            </div>

            {/* 3 Cartes Visit / Call / Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visit */}
              <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#121244]">Visit</h4>
                  <p className="text-xs text-gray-500 mt-1">123 Main Street Kingston, New York 12401</p>
                </div>
              </div>

              {/* Call */}
              <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#121244]">Call</h4>
                  <p className="text-xs text-gray-500 mt-1">555-123456</p>
                  <p className="text-xs text-gray-500">555-123456</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#121244] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#121244]">Email</h4>
                  <p className="text-xs text-gray-500 mt-1">robel.dock@example.com</p>
                  <p className="text-xs text-gray-500">qsawayn@example.com</p>
                </div>
              </div>
            </div>

            {/* Rangée Google Map + Formulaire Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Carte Map */}
              <div className="bg-white rounded-[28px] overflow-hidden border border-gray-200/80 shadow-sm relative min-h-[360px]">
                <iframe
                  title="Office Google Map"
                  src="https://maps.google.com/maps?hl=en&amp;q=california&amp;ie=UTF8&amp;t=&amp;z=12&amp;iwloc=B&amp;output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Formulaire Newsletter */}
              <div className="bg-white rounded-[28px] p-8 sm:p-12 border border-gray-200/80 shadow-sm space-y-6 flex flex-col justify-center">
                <div className="text-center space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-[#121244]">
                    Subscribe to our newsletter
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Stay updated with our latest events, news, and offers.
                  </p>
                </div>

                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================================== */}
      {/* 12. FOOTER (AVEC LOGO OFFICIEL ET 4 COLONNES)                                  */}
      {/* ============================================================================== */}
      <footer className="bg-[#F0F2F8] text-[#2D3748] pt-16 pb-12 border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-200/70">
          {/* Colonne 1 : Logo & Description */}
          <div className="space-y-4">
            <div className="h-10 flex items-center">
              <Image
                src="https://static.zohocdn.com/sites/stock-images/images/zpstock-image-1565.webp"
                alt="Footer Logo"
                width={144}
                height={47}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Create unforgettable events and experiences. Connect with us to start planning your next memorable occasion.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#121244] text-white flex items-center justify-center hover:bg-[#D93829] transition-colors"
                aria-label="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#121244] text-white flex items-center justify-center hover:bg-[#D93829] transition-colors"
                aria-label="YouTube"
              >
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#121244] text-white flex items-center justify-center hover:bg-[#D93829] transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">ig</span>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Useful Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#121244]">Useful Links</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="/" className="hover:text-[#D93829] transition-colors">Home</a></li>
              <li><a href="#about-us" className="hover:text-[#D93829] transition-colors">About Us</a></li>
              <li><a href="#speakers" className="hover:text-[#D93829] transition-colors">Hôte</a></li>
              <li><a href="#events" className="hover:text-[#D93829] transition-colors">Events</a></li>
              <li><a href="#contact-us" className="hover:text-[#D93829] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Colonne 3 : Latest Events */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#121244]">Latest Events</h5>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#121244] mt-1 shrink-0" />
                <div>
                  <span className="font-bold text-[#121244] block">2024 December</span>
                  <span className="text-gray-500">New Yark City Conference</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#121244] mt-1 shrink-0" />
                <div>
                  <span className="font-bold text-[#121244] block">2024 September</span>
                  <span className="text-gray-500">California City Conference</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#121244] mt-1 shrink-0" />
                <div>
                  <span className="font-bold text-[#121244] block">2024 September</span>
                  <span className="text-gray-500">Australia Conference</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Instagram */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#121244]">Instagram</h5>
            <p className="text-xs text-gray-500 leading-relaxed">
              Follow our Instagram page for live stories, speaker moments, and upcoming session reveals.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Copyright © All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <a href="#events" className="hover:text-[#121244] transition-colors">Book Now</a>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#121244] transition-colors opacity-50 hover:opacity-100">
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
