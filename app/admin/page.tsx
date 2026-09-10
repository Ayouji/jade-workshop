'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  loginAdmin,
  verifyAdminSession,
  getDashboardStats,
  getAdminWorkshops,
  createWorkshop,
  deleteWorkshop,
  deleteBooking,
  DashboardStats,
  AdminWorkshopItem,
} from '@/app/actions/admin';
import {
  Lock,
  Mail,
  Sparkles,
  LayoutDashboard,
  Calendar,
  Plus,
  Users,
  LogOut,
  ExternalLink,
  Trash2,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Menu,
  X,
  User,
  ShieldCheck,
  Flame,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'workshops';

const PRESET_IMAGES = [
  {
    title: 'Tournage Céramique',
    url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Poterie Terracotta',
    url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Émaillage Vert Sauge',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Atelier Façonnage',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AdminPage() {
  // Auth state
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('ayoujilhassan183@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation state (2 distinct tabs)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // UI modal & accordions
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  const [workshopFilter, setWorkshopFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workshops, setWorkshops] = useState<AdminWorkshopItem[]>([]);

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string>(PRESET_IMAGES[0].url);
  const [imageMode, setImageMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isPending, startTransition] = useTransition();
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('jade_admin_token');
    if (savedToken) {
      verifyAdminSession(savedToken).then((valid) => {
        if (valid) {
          setSessionToken(savedToken);
          loadData(savedToken);
        } else {
          localStorage.removeItem('jade_admin_token');
        }
      });
    }
  }, []);

  const loadData = async (token: string) => {
    startTransition(async () => {
      const [statsRes, workshopsRes] = await Promise.all([
        getDashboardStats(token),
        getAdminWorkshops(token),
      ]);
      if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      if (workshopsRes.success && workshopsRes.workshops) setWorkshops(workshopsRes.workshops);
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await loginAdmin(emailInput, passwordInput);
      if (res.success && res.token) {
        localStorage.setItem('jade_admin_token', res.token);
        setSessionToken(res.token);
        await loadData(res.token);
      } else {
        setLoginError(res.message || 'Identifiants incorrects.');
      }
    } catch {
      setLoginError('Erreur de connexion.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jade_admin_token');
    setSessionToken(null);
    setPasswordInput('');
    setStats(null);
    setWorkshops([]);
    setActiveTab('dashboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image dépasse 5 Mo. Veuillez choisir une image plus légère.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateWorkshopSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionToken) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('imageUrl', imagePreview);

    startTransition(async () => {
      const res = await createWorkshop(sessionToken, formData);
      if (res.success) {
        setAlertBanner({ type: 'success', text: res.message });
        form.reset();
        setIsCreateModalOpen(false);
        await loadData(sessionToken);
        setActiveTab('workshops');
      } else {
        setAlertBanner({ type: 'error', text: res.message });
      }
    });
  };

  const handleDeleteWorkshop = async (workshopId: string, title: string) => {
    if (!sessionToken) return;
    if (!confirm(`Supprimer l'atelier « ${title} » et ses réservations associées ?`)) return;

    startTransition(async () => {
      const res = await deleteWorkshop(sessionToken, workshopId);
      if (res.success) {
        setAlertBanner({ type: 'success', text: res.message });
        await loadData(sessionToken);
      } else {
        setAlertBanner({ type: 'error', text: res.message });
      }
    });
  };

  const handleDeleteBooking = async (bookingId: string, name: string) => {
    if (!sessionToken) return;
    if (!confirm(`Annuler la réservation de ${name} et libérer la place ?`)) return;

    startTransition(async () => {
      const res = await deleteBooking(sessionToken, bookingId);
      if (res.success) {
        setAlertBanner({ type: 'success', text: res.message });
        await loadData(sessionToken);
      } else {
        setAlertBanner({ type: 'error', text: res.message });
      }
    });
  };

  const filteredWorkshops = workshops.filter((ws) => {
    const isUpcoming = new Date(ws.date) >= new Date(new Date().setHours(0, 0, 0, 0));
    if (workshopFilter === 'upcoming') return isUpcoming;
    if (workshopFilter === 'past') return !isUpcoming;
    return true;
  });

  // ==============================================================================
  // VUE 1 : LOGIN STYLE EVENTO
  // ==============================================================================
  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FC] text-slate-dark selection:bg-terracotta selection:text-white">
        <div className="w-full max-w-md bg-white rounded-[36px] p-8 sm:p-11 border border-warm-200/80 shadow-[0_20px_50px_rgba(45,55,72,0.08)] space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-terracotta-light text-terracotta text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espace Studio</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-dark tracking-tight">
              Connexion Jade
            </h1>
            <p className="text-xs text-slate-dark/70">
              Pilotez vos ateliers, suivez vos inscriptions et créez de nouvelles sessions.
            </p>
          </div>

          {loginError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-dark mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-dark/40" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  placeholder="nom@exemple.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-dark mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-dark/40" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-terracotta hover:bg-terracotta-hover text-white font-semibold rounded-full text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Accéder à l&apos;Espace Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-dark/60 hover:text-terracotta transition-colors"
            >
              <span>← Revenir au site public</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // VUE 2 : SIDEBAR AVEC 2 LIENS DISTINCTS (DASHBOARD & GESTION DES ATELIERS)
  // ==============================================================================
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex text-slate-dark">
      {/* -------------------------------------------------------------------------- */}
      {/* SIDEBAR AVEC EXACTEMENT 2 LIENS                                            */}
      {/* -------------------------------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-warm-200/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo EVENTO Style */}
        <div className="p-7 border-b border-warm-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-slate-dark block leading-none">Jade</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sage">Ateliers</span>
            </div>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-dark/60 hover:text-slate-dark rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 LIENS DISTINCTS DANS LA NAVIGATION */}
        <nav className="flex-1 p-5 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-dark/40 px-3 mb-2">
            Navigation
          </div>

          {/* LIEN 1 : TABLEAU DE BORD */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-terracotta text-white shadow-md shadow-terracotta/25'
                : 'text-slate-dark/70 hover:bg-warm-100 hover:text-slate-dark'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Tableau de Bord</span>
          </button>

          {/* LIEN 2 : GESTION DES ATELIERS (DISSOCIÉ) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('workshops');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workshops'
                ? 'bg-terracotta text-white shadow-md shadow-terracotta/25'
                : 'text-slate-dark/70 hover:bg-warm-100 hover:text-slate-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Gestion des Ateliers</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'workshops' ? 'bg-white/25 text-white' : 'bg-warm-200 text-slate-dark'
              }`}
            >
              {workshops.length}
            </span>
          </button>
        </nav>

        {/* Profil Utilisateur & Liens Pied */}
        <div className="p-5 border-t border-warm-100 space-y-3 bg-[#FAF7F2]/50">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-warm-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-sage-light text-sage flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-dark truncate">Jade Delorme</p>
              <p className="text-[10px] text-slate-dark/55 truncate">{emailInput}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-warm-100 rounded-full text-[11px] font-semibold border border-warm-200 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-dark/60" />
              <span>Voir le site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-dark/60 hover:text-red-600 hover:bg-red-50 rounded-full bg-white border border-warm-200 transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* ZONE CENTRALE (DASHBOARD & ATELIERS DISSOCIÉS)                             */}
      {/* -------------------------------------------------------------------------- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-warm-200/70 px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-dark rounded-xl bg-white border border-warm-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-dark">
                {activeTab === 'dashboard' ? 'Tableau de Bord' : 'Gestion des Ateliers'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Atelier</span>
          </button>
        </header>

        {/* Corps Principal */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Banner de notification */}
          {alertBanner && (
            <div
              className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between border animate-in fade-in ${
                alertBanner.type === 'success'
                  ? 'bg-sage-light border-sage/40 text-sage-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {alertBanner.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{alertBanner.text}</span>
              </div>
              <button onClick={() => setAlertBanner(null)} className="text-xs opacity-60 hover:opacity-100">
                ✕
              </button>
            </div>
          )}

          {/* ======================================================================== */}
          {/* ONGLET 1 : TABLEAU DE BORD (STATS & DERNIÈRES INSCRIPTIONS)              */}
          {/* ======================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              {/* 4 Cartes de métriques EVENTO style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Stat 1 : Ateliers */}
                <div className="relative bg-white p-6 sm:p-7 rounded-[32px] border border-warm-200/80 shadow-[0_4px_24px_rgba(45,55,72,0.04)] overflow-hidden group hover:border-terracotta/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-terracotta-light text-terracotta flex items-center justify-center shrink-0 shadow-inner">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-dark/50 bg-warm-100 px-3 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-dark block">
                    {stats?.totalWorkshops ?? workshops.length}
                  </span>
                  <p className="text-xs text-slate-dark/65 font-medium mt-1">Ateliers créés</p>
                </div>

                {/* Stat 2 : Participants */}
                <div className="relative bg-white p-6 sm:p-7 rounded-[32px] border border-warm-200/80 shadow-[0_4px_24px_rgba(45,55,72,0.04)] overflow-hidden group hover:border-sage/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-sage-light text-sage flex items-center justify-center shrink-0 shadow-inner">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage-700 bg-sage-light px-3 py-1 rounded-full">
                      Inscrits
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-dark block">
                    {stats?.totalParticipants ?? 0}
                  </span>
                  <p className="text-xs text-slate-dark/65 font-medium mt-1">Places réservées</p>
                </div>

                {/* Stat 3 : Sessions à venir */}
                <div className="relative bg-white p-6 sm:p-7 rounded-[32px] border border-warm-200/80 shadow-[0_4px_24px_rgba(45,55,72,0.04)] overflow-hidden group hover:border-terracotta/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-warm-100 text-terracotta flex items-center justify-center shrink-0 shadow-inner">
                      <Flame className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-terracotta-light px-3 py-1 rounded-full">
                      Actives
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-dark block">
                    {stats?.upcomingWorkshops ?? 0}
                  </span>
                  <p className="text-xs text-slate-dark/65 font-medium mt-1">Sessions programmées</p>
                </div>

                {/* Stat 4 : Réservations */}
                <div className="relative bg-white p-6 sm:p-7 rounded-[32px] border border-warm-200/80 shadow-[0_4px_24px_rgba(45,55,72,0.04)] overflow-hidden group hover:border-sage/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2D3748] text-white flex items-center justify-center shrink-0 shadow-inner">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-dark/50 bg-warm-100 px-3 py-1 rounded-full">
                      Commandes
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-dark block">
                    {stats?.totalBookings ?? 0}
                  </span>
                  <p className="text-xs text-slate-dark/65 font-medium mt-1">Réservations sans paiement</p>
                </div>
              </div>

              {/* Tableau des dernières réservations (Card Style EVENTO) */}
              <div className="bg-white rounded-[32px] border border-warm-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(45,55,72,0.04)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta block mb-0.5">
                      Flux en Direct
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-dark">
                      Dernières Inscriptions Reçues
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveTab('workshops')}
                    className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Consulter tous les ateliers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!stats?.recentBookings || stats.recentBookings.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-warm-200 rounded-2xl">
                    <p className="text-xs text-slate-dark/60">Aucune inscription enregistrée pour le moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.recentBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-[#F8F9FC] border border-warm-200/70 flex items-start justify-between gap-4 hover:border-terracotta/30 transition-all"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-dark truncate">{b.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-sage-light text-sage-700 text-[10px] font-bold shrink-0">
                              {b.seats} place{b.seats > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-dark/70 font-medium truncate">{b.workshop_title}</p>
                          <div className="flex items-center gap-3 pt-1 text-[11px]">
                            <a href={`mailto:${b.email}`} className="text-terracotta hover:underline flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">{b.email}</span>
                            </a>
                            <a href={`tel:${b.phone}`} className="text-slate-dark/60 hover:text-slate-dark flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{b.phone}</span>
                            </a>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-dark/40 font-mono shrink-0">
                          {b.created_at}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================================== */}
          {/* ONGLET 2 : GESTION DES ATELIERS (DISSOCIÉ DE DASHBOARD)                  */}
          {/* ======================================================================== */}
          {activeTab === 'workshops' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sage block mb-0.5">
                    Catalogue & Planning
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-slate-dark">
                    Gestion des Ateliers ({filteredWorkshops.length})
                  </h3>
                </div>

                {/* Filtres Pilules EVENTO */}
                <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-warm-200/80 shadow-xs">
                  <button
                    onClick={() => setWorkshopFilter('all')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      workshopFilter === 'all'
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'text-slate-dark/70 hover:text-slate-dark'
                    }`}
                  >
                    Tous ({workshops.length})
                  </button>
                  <button
                    onClick={() => setWorkshopFilter('upcoming')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      workshopFilter === 'upcoming'
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'text-slate-dark/70 hover:text-slate-dark'
                    }`}
                  >
                    À venir
                  </button>
                  <button
                    onClick={() => setWorkshopFilter('past')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      workshopFilter === 'past'
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'text-slate-dark/70 hover:text-slate-dark'
                    }`}
                  >
                    Passés
                  </button>
                </div>
              </div>

              {/* Liste des ateliers */}
              {filteredWorkshops.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[32px] border border-warm-200">
                  <p className="text-sm text-slate-dark/65">Aucun atelier trouvé avec ce filtre.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkshops.map((ws) => {
                    const isExpanded = openAccordionId === ws.id;
                    const fillPercentage = Math.min(100, Math.round((ws.total_booked_seats / ws.capacity) * 100));
                    const isFull = ws.remaining_seats <= 0;

                    return (
                      <div
                        key={ws.id}
                        className="bg-white rounded-[28px] border border-warm-200/80 shadow-[0_4px_20px_rgba(45,55,72,0.03)] overflow-hidden transition-all hover:border-terracotta/30"
                      >
                        {/* Ligne principale */}
                        <div
                          onClick={() => setOpenAccordionId(isExpanded ? null : ws.id)}
                          className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer hover:bg-[#FAF7F2]/40 transition-colors"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {ws.image_url ? (
                              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white">
                                <Image src={ws.image_url} alt={ws.title} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-2xl bg-warm-100 flex items-center justify-center shrink-0 text-terracotta">
                                <ImageIcon className="w-7 h-7" />
                              </div>
                            )}

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-terracotta flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {ws.date}
                                </span>
                                <span className="text-xs text-slate-dark/30">•</span>
                                <span className="text-xs text-sage font-bold flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {ws.start_time} - {ws.end_time}
                                </span>
                              </div>
                              <h4 className="text-base sm:text-lg font-bold text-slate-dark leading-snug truncate">
                                {ws.title}
                              </h4>
                            </div>
                          </div>

                          {/* Remplissage & Actions */}
                          <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-dark flex items-center gap-2 justify-end">
                                <span>{ws.total_booked_seats} / {ws.capacity} inscrits</span>
                                {isFull ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                    Complet
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-sage-light text-sage-700 text-[10px] font-bold">
                                    {ws.remaining_seats} libres
                                  </span>
                                )}
                              </div>

                              <div className="w-36 h-2 bg-warm-200 rounded-full mt-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isFull ? 'bg-red-500' : 'bg-terracotta'
                                  }`}
                                  style={{ width: `${fillPercentage}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWorkshop(ws.id, ws.title);
                                }}
                                className="p-2.5 text-slate-dark/40 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                title="Supprimer cet atelier"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="p-2 text-slate-dark/60 rounded-full bg-warm-100">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Détails dépliés des participants */}
                        {isExpanded && (
                          <div className="border-t border-warm-200/80 bg-[#FAF7F2]/60 p-5 sm:p-7 space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-dark/70 flex items-center gap-2">
                                <Users className="w-4 h-4 text-terracotta" />
                                <span>Table des participants ({ws.bookings.length} réservations)</span>
                              </h5>
                            </div>

                            {ws.bookings.length === 0 ? (
                              <div className="p-6 text-center bg-white rounded-2xl border border-warm-200/80">
                                <p className="text-xs text-slate-dark/60">
                                  Aucune inscription pour cet atelier.
                                </p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-sm">
                                  <thead className="bg-[#FAF7F2] border-b border-warm-200 text-slate-dark/70 font-bold uppercase tracking-wider">
                                    <tr>
                                      <th className="py-3.5 px-4">Participant</th>
                                      <th className="py-3.5 px-4">Email</th>
                                      <th className="py-3.5 px-4">Téléphone</th>
                                      <th className="py-3.5 px-4 text-center">Places</th>
                                      <th className="py-3.5 px-4">Date d&apos;inscription</th>
                                      <th className="py-3.5 px-4 text-right">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-warm-100">
                                    {ws.bookings.map((booking) => (
                                      <tr key={booking.id} className="hover:bg-cream/70 transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-slate-dark">
                                          {booking.name}
                                        </td>
                                        <td className="py-3.5 px-4">
                                          <a
                                            href={`mailto:${booking.email}`}
                                            className="inline-flex items-center gap-1 text-terracotta hover:underline font-medium"
                                          >
                                            <Mail className="w-3.5 h-3.5" />
                                            <span>{booking.email}</span>
                                          </a>
                                        </td>
                                        <td className="py-3.5 px-4">
                                          <a
                                            href={`tel:${booking.phone}`}
                                            className="inline-flex items-center gap-1 text-slate-dark/75 hover:text-slate-dark font-medium"
                                          >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>{booking.phone}</span>
                                          </a>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                          <span className="inline-block px-2.5 py-0.5 bg-sage-light text-sage-700 font-bold rounded-full">
                                            {booking.seats} place{booking.seats > 1 ? 's' : ''}
                                          </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-dark/60 font-mono text-[11px]">
                                          {booking.created_at}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteBooking(booking.id, booking.name)}
                                            className="text-red-500 hover:text-red-700 text-[11px] font-semibold hover:underline cursor-pointer"
                                          >
                                            Annuler
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ============================================================================== */}
      {/* MODALE CRÉATION D'ATELIER AVEC UPLOAD PHOTO (STYLE EVENTO)                     */}
      {/* ============================================================================== */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPending) setIsCreateModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-[36px] shadow-2xl border border-warm-200 overflow-hidden text-slate-dark my-8">
            {/* Header Modale */}
            <div className="p-6 sm:p-8 bg-[#FAF7F2] border-b border-warm-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta block mb-0.5">
                  Nouvelle Session
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-dark">
                  Créer un Atelier Céramique
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-dark/50 hover:text-slate-dark rounded-full hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleCreateWorkshopSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">
                    Titre de l&apos;atelier <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Ex : Initiation au Tournage & Façonnage de Grès"
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">
                    Description détaillée <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    placeholder="Présentez le programme, les techniques abordées et ce que chacun emporte..."
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">
                    Date <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">
                    Capacité (participants max) <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue={8}
                    min={1}
                    max={30}
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">
                    Heure de début <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="startTime"
                    defaultValue="14:00"
                    placeholder="14:00"
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">
                    Heure de fin <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="endTime"
                    defaultValue="16:30"
                    placeholder="16:30"
                    required
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>

              {/* MODULE D'IMAGE AVEC UPLOAD */}
              <div className="pt-2 border-t border-warm-200">
                <label className="block text-xs font-bold text-slate-dark mb-2.5">
                  Photo d&apos;illustration de l&apos;atelier
                </label>

                {/* Sélecteur de mode */}
                <div className="flex items-center gap-2 mb-3.5">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      imageMode === 'upload'
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'bg-warm-100 text-slate-dark/70 hover:bg-warm-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Uploader un fichier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageMode('preset')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      imageMode === 'preset'
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'bg-warm-100 text-slate-dark/70 hover:bg-warm-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Photos préréglées</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      imageMode === 'url'
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'bg-warm-100 text-slate-dark/70 hover:bg-warm-200'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lien URL</span>
                  </button>
                </div>

                {imageMode === 'upload' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-warm-300 hover:border-terracotta rounded-2xl bg-[#F8F9FC] text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-7 h-7 mx-auto text-terracotta mb-1.5" />
                    <p className="text-xs font-bold text-slate-dark">Cliquez pour importer une image (JPG, PNG, WebP)</p>
                    <p className="text-[10px] text-slate-dark/50 mt-0.5">Format paysage recommandé</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}

                {imageMode === 'preset' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_IMAGES.map((preset) => (
                      <div
                        key={preset.title}
                        onClick={() => setImagePreview(preset.url)}
                        className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          imagePreview === preset.url
                            ? 'border-terracotta ring-2 ring-terracotta/40 scale-102'
                            : 'border-transparent hover:opacity-80'
                        }`}
                      >
                        <Image src={preset.url} alt={preset.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                          <span className="text-[9px] font-bold text-white leading-tight">
                            {preset.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {imageMode === 'url' && (
                  <input
                    type="url"
                    value={imagePreview}
                    onChange={(e) => setImagePreview(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 bg-[#F8F9FC] border border-warm-200 rounded-xl text-xs focus:ring-2 focus:ring-terracotta/30 focus:outline-none"
                  />
                )}

                {imagePreview && (
                  <div className="mt-3 flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-warm-200">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white">
                      <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                    </div>
                    <div className="text-[11px] truncate">
                      <span className="font-bold text-slate-dark block">Photo sélectionnée</span>
                      <span className="text-slate-dark/60 block truncate">
                        Sera affichée en haut de la carte atelier
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-3 bg-warm-100 hover:bg-warm-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-7 py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publication...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publier cet Atelier</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
