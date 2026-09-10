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
  CheckCircle2,
  Users,
  Star,
  Quote,
  Heart,
  ShieldCheck,
  Compass,
  Smile,
  Layers,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const DEMO_WORKSHOPS: WorkshopWithAvailability[] = [
  {
    id: 'demo-1',
    title: 'Initiation au Tournage & Grès Blanc',
    description: 'Découvrez les gestes fondamentaux du tournage : centrage, perçage et montée de terre pour façonner vos premiers bols ou tasses.',
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
    description: 'Façonnez librement à la main avec les techniques ancestrales du pincé et colombin, puis appliquez nos engobes chauds signature.',
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
    description: 'Créez un vase sculptural aux lignes épurées et organiques, cuit à haute température pour accueillir vos bouquets d’artisan.',
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
    <div className="min-h-screen bg-[#F8F9FD] text-[#1B1C57] font-sans antialiased selection:bg-[#1B1C57] selection:text-white">
      {/* ============================================================================== */}
      {/* 1. HEADER / NAVIGATION MODERNE                                                 */}
      {/* ============================================================================== */}
      <header className="sticky top-0 z-50 bg-[#F8F9FD]/95 backdrop-blur-md border-b border-gray-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo JADE Élégant */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="font-extrabold text-2xl tracking-tighter text-[#1B1C57]">
              JAD<span className="text-[#D93829]">E</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-[#64748B] pl-2 border-l border-gray-300">
              Studio Céramique
            </span>
          </Link>

          {/* Navigation Centrale Ancrée */}
          <nav className="hidden md:flex items-center gap-9 text-sm font-semibold text-[#1B1C57]/80">
            <a href="#ateliers" className="hover:text-[#D93829] transition-colors">
              Ateliers
            </a>
            <a href="#a-propos" className="hover:text-[#D93829] transition-colors">
              À Propos
            </a>
            <a href="#avantages" className="hover:text-[#D93829] transition-colors">
              Pourquoi Venir
            </a>
            <a href="#contact" className="hover:text-[#D93829] transition-colors">
              Contact
            </a>
          </nav>

          {/* Bouton CTA d'Action à Droite */}
          <div className="flex items-center gap-4">
            <a
              href="#ateliers"
              className="px-6 py-2.5 rounded-full text-xs font-bold tracking-wide bg-[#1B1C57] hover:bg-[#252775] text-white transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              Voir les ateliers
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ============================================================================== */}
        {/* 2. HERO SECTION IMPACTANTE (LAYOUT 2 COLONNES)                                 */}
        {/* ============================================================================== */}
        <section className="py-16 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Colonne Gauche : Accroche & Call-to-Action */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Petit badge surtitre Terracotta */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ateliers Créatifs & Artisanal</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B1C57] tracking-tight leading-[1.12]">
                  Réservez votre atelier créatif en quelques clics
                </h1>

                <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
                  Initiez-vous au tournage et au modelage du grès au cœur de Paris.
                  Des sessions intimistes pensées pour ralentir, ressentir la terre et repartir avec vos propres créations cuites et émaillées.
                </p>

                {/* 2 Boutons côte-à-côte */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#ateliers"
                    className="px-8 py-4 bg-[#1B1C57] hover:bg-[#252775] text-white font-bold rounded-full text-sm transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explorer les ateliers</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#a-propos"
                    className="px-8 py-4 bg-white hover:bg-gray-50 text-[#1B1C57] font-bold rounded-full text-sm border border-gray-300 hover:border-[#1B1C57] transition-all shadow-xs"
                  >
                    En savoir plus
                  </a>
                </div>

                {/* Mention réassurance */}
                <div className="pt-4 flex items-center gap-6 text-xs text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matériel & cuissons inclus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Débutants bienvenus</span>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Visuel structuré avec masque arrondi & badges flottants */}
              <div className="lg:col-span-6 relative flex justify-center items-center">
                {/* Aura décorative d'arrière-plan */}
                <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-indigo-100/60 to-rose-100/40 -z-10 blur-2xl" />

                <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <Image
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"
                    alt="Jade façonnant une pièce au tour de potier à Paris"
                    fill
                    priority
                    loading="eager"
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />

                  {/* Dégradé léger bas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Badge Flottant Inférieur : "Petits groupes & Matériel fourni" */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1B1C57] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1B1C57]">Petits groupes & Matériel fourni</p>
                      <p className="text-xs text-[#64748B]">6 à 8 participants max par session</p>
                    </div>
                  </div>
                </div>

                {/* Badge Flottant Haut Droite : Sessions */}
                <div className="absolute -top-3 -right-2 sm:right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2.5 animate-bounce-slow">
                  <Calendar className="w-4 h-4 text-[#D93829]" />
                  <span className="text-xs font-bold text-[#1B1C57]">Sessions chaque semaine</span>
                </div>

                {/* Badge Flottant Haut Gauche : Sparkles */}
                <div className="absolute top-12 -left-3 sm:-left-6 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-[#D93829]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. SECTION "À PROPOS" (PREUVE SOCIALE & VALEUR)                                */}
        {/* ============================================================================== */}
        <section id="a-propos" className="py-20 md:py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image d'Atelier avec Badge Flottant "500+ Participants" */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80"
                    alt="Atelier de poterie Jade à Paris"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                {/* Badge Flottant 500+ */}
                <div className="absolute -bottom-5 -right-3 sm:right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1B1C57]/10 text-[#1B1C57] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-[#1B1C57] leading-tight block">
                      500+
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">Créateurs initiés</span>
                  </div>
                </div>
              </div>

              {/* Texte de Présentation */}
              <div className="lg:col-span-7 space-y-6 lg:pl-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider">
                  <span>L&apos;expérience Jade</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B1C57] tracking-tight leading-snug">
                  L&apos;artisanat céramique accessible, chaleureux et bienveillant.
                </h2>

                <p className="text-[#64748B] text-base leading-relaxed">
                  Céramiste passionnée installée à Paris, Jade vous accueille dans un studio baigné de lumière pensé comme un havre de paix.
                  Chaque atelier est conçu pour vous déconnecter des écrans, développer votre sensibilité manuelle et ressentir la magie de voir une pièce prendre forme sous vos doigts.
                </p>

                <p className="text-[#64748B] text-sm leading-relaxed">
                  Toutes vos pièces bénéficient d&apos;un émaillage artisanal avec nos teintes minérales et d&apos;une double cuisson à haute température (1250°C), garantissant des objets étanches, alimentaires et conçus pour durer.
                </p>

                <div className="pt-2">
                  <a
                    href="#ateliers"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1B1C57] hover:bg-[#252775] text-white font-bold rounded-full text-xs transition-all shadow-sm hover:shadow"
                  >
                    <span>Découvrir les prochaines dates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Grille des 3 Avantages Clés avec Icônes Circulaires Indigo */}
            <div id="avantages" className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Avantage 1 */}
              <div className="bg-[#F8F9FD] p-8 rounded-3xl border border-gray-100/90 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B1C57] text-white flex items-center justify-center shadow-md">
                  <Smile className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1C57]">
                  Savoir-faire accessible à tous
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Aucune compétence préalable n&apos;est requise. Jade vous guide pas à pas pour dompter la terre avec douceur, du centrage aux finitions.
                </p>
              </div>

              {/* Avantage 2 */}
              <div className="bg-[#F8F9FD] p-8 rounded-3xl border border-gray-100/90 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B1C57] text-white flex items-center justify-center shadow-md">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1C57]">
                  Tout le matériel est fourni sur place
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Tours de potier professionnels, grès blanc & chamotté, tabliers, outils de modelage et cuissons haute température sont 100% inclus.
                </p>
              </div>

              {/* Avantage 3 */}
              <div className="bg-[#F8F9FD] p-8 rounded-3xl border border-gray-100/90 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B1C57] text-white flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1C57]">
                  Groupes réduits pour un suivi personnalisé
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Sessions limitées à 6 ou 8 personnes pour garantir une attention sur-mesure, des échanges chaleureux et une ambiance relaxante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 4. SECTION ATELIERS (GRILLE DYNAMIQUE WORKSHOPGRID)                             */}
        {/* ============================================================================== */}
        <section id="ateliers" className="py-20 md:py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* En-tête de Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-200/50">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Planning des Sessions</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1C57] tracking-tight">
                  Prochaines Sessions
                </h2>
                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                  Choisissez votre créneau et réservez votre place en quelques instants.
                  Le règlement s&apos;effectue sur place le jour de l&apos;atelier.
                </p>
              </div>

              <div className="text-xs text-[#64748B] font-medium shrink-0 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Disponibilités actualisées en direct</span>
              </div>
            </div>

            {/* Grille Dynamique d'Ateliers avec Modale de Réservation */}
            <WorkshopGrid workshops={workshops} />
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 5. SECTION TÉMOIGNAGES & AVIS CLIENTS                                          */}
        {/* ============================================================================== */}
        <section className="py-20 md:py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-[#D93829]" />
                <span>Avis des Participants</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B1C57] tracking-tight">
                Ils ont partagé un moment à l&apos;atelier
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Découvrez les retours bienveillants de celles et ceux qui ont poussé les portes du studio Jade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Témoignage 1 */}
              <div className="bg-[#F8F9FD] p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#1B1C57] leading-relaxed italic">
                    &quot;Une expérience magique ! Jade est d&apos;une pédagogie et d&apos;une patience incroyables. Je bois mon café chaque matin dans le mug que j&apos;ai tourné moi-même.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                  <div className="w-10 h-10 rounded-full bg-[#1B1C57] text-white font-bold text-xs flex items-center justify-center">
                    SL
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1C57]">Sophie Laurent</h4>
                    <p className="text-xs text-[#64748B]">Initiation Tournage Grès</p>
                  </div>
                </div>
              </div>

              {/* Témoignage 2 */}
              <div className="bg-[#F8F9FD] p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#1B1C57] leading-relaxed italic">
                    &quot;Une parenthèse hors du temps au cœur de Paris. L&apos;ambiance est douce, le thé est délicieux et les pièces après cuisson sont de véritables œuvres d&apos;art.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                  <div className="w-10 h-10 rounded-full bg-[#D93829] text-white font-bold text-xs flex items-center justify-center">
                    AM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1C57]">Alexandre Moreau</h4>
                    <p className="text-xs text-[#64748B]">Atelier Modelage & Émaux</p>
                  </div>
                </div>
              </div>

              {/* Témoignage 3 */}
              <div className="bg-[#F8F9FD] p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#1B1C57] leading-relaxed italic">
                    &quot;Réservé en duo pour l&apos;anniversaire de ma sœur. Nous avons adoré chaque minute. L&apos;accompagnement est très rassurant même sans jamais avoir touché d&apos;argile.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                  <div className="w-10 h-10 rounded-full bg-[#1B1C57] text-white font-bold text-xs flex items-center justify-center">
                    CD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1C57]">Chloé Deslandes</h4>
                    <p className="text-xs text-[#64748B]">Atelier Vases Organiques</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 6. SECTION CONTACT & PRATIQUE                                                  */}
        {/* ============================================================================== */}
        <section id="contact" className="py-20 md:py-24 bg-[#F8F9FD] border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Venir à l&apos;Atelier</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B1C57] tracking-tight">
                Informations Pratiques & Contact
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Une question sur un atelier, une privatisation pour un événement ou un bon cadeau ? Écrivez-nous ou rendez-nous visite.
              </p>
            </div>

            {/* 3 Cartes Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Adresse */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B1C57] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#1B1C57]">Studio Paris</h4>
                  <p className="text-xs text-[#64748B] mt-1">14 rue des Artisans</p>
                  <p className="text-xs text-[#64748B]">75011 Paris • Métro Voltaire</p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B1C57] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#1B1C57]">Nous Appeler</h4>
                  <p className="text-xs text-[#64748B] mt-1">01 42 85 90 12</p>
                  <p className="text-xs text-[#64748B]">Mardi - Samedi (10h - 19h)</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#1B1C57] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#1B1C57]">Nous Écrire</h4>
                  <p className="text-xs text-[#64748B] mt-1">bonjour@jade-ceramique.fr</p>
                  <p className="text-xs text-[#64748B]">Réponse sous 24h ouvrées</p>
                </div>
              </div>
            </div>

            {/* Rangée Plan Google Maps & Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Carte Map */}
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm relative min-h-[340px]">
                <iframe
                  title="Atelier Jade Céramique Paris"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.380065476839304!3d48.85837007133246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66df1d3e8e1ef%3A0x9d5b7a1e0b5f1a2b!2sVoltaire!5e0!3m2!1sfr!2sfr!4v1695000000000!5m2!1sfr!2sfr"
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Newsletter Block */}
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-sm flex flex-col justify-center space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D93829]">
                    Restez Informé
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1B1C57]">
                    Recevez nos prochaines dates
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Inscrivez-vous pour être averti en priorité lors de la mise en ligne des nouveaux créneaux mensuels.
                  </p>
                </div>

                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================================== */}
      {/* 7. FOOTER ÉPURÉ                                                                */}
      {/* ============================================================================== */}
      <footer className="bg-white text-[#64748B] pt-16 pb-12 border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-100">
          {/* Colonne 1 : Logo & Descriptif */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1">
              <span className="font-extrabold text-2xl tracking-tighter text-[#1B1C57]">
                JAD<span className="text-[#D93829]">E</span>
              </span>
            </Link>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
              Studio artisanal d&apos;initiation au tournage céramique et au modelage du grès à Paris.
            </p>
            <p className="text-xs text-[#64748B]">14 rue des Artisans, 75011 Paris</p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1B1C57]">Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#ateliers" className="hover:text-[#D93829] transition-colors">Nos Ateliers</a></li>
              <li><a href="#a-propos" className="hover:text-[#D93829] transition-colors">L&apos;Expérience Jade</a></li>
              <li><a href="#avantages" className="hover:text-[#D93829] transition-colors">Pourquoi Venir</a></li>
              <li><a href="#contact" className="hover:text-[#D93829] transition-colors">Contact & Accès</a></li>
            </ul>
          </div>

          {/* Colonne 3 : Horaires */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1B1C57]">Horaires Studio</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Mardi - Vendredi : 14h - 19h</li>
              <li>Samedi & Dimanche : 10h - 18h</li>
              <li>Lundi : Fermé (cuissons d&apos;atelier)</li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux & Infos */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1B1C57]">Instagram</h5>
            <p className="text-xs text-[#64748B]">
              Suivez @jade.ceramique pour découvrir les sorties de four et les créations des participants.
            </p>
          </div>
        </div>

        {/* Barre Inférieure avec lien discret vers l'administration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Jade Workshop. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="#ateliers" className="hover:text-[#1B1C57] transition-colors">Réserver une session</a>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#1B1C57] transition-colors opacity-60 hover:opacity-100">
              Espace Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
