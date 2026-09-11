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
  Sprout,
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
  Check,
  Search,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'workshops';

const PRESET_IMAGES = [
  {
    title: 'Herbs & Seed Starting',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Soil Health & Composting',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Autumn Vegetable Planting',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Natural Pest Defense',
    url: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Winter Prep & Harvesting',
    url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AdminPage() {
  // Auth state
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('ayoujilhassan183@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  const [workshopFilter, setWorkshopFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workshops, setWorkshops] = useState<AdminWorkshopItem[]>([]);

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string>(PRESET_IMAGES[0].url);
  const [imageMode, setImageMode] = useState<'preset' | 'upload' | 'url'>('preset');
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
    try {
      setIsRefreshing(true);
      const [statsRes, workshopsRes] = await Promise.all([
        getDashboardStats(token),
        getAdminWorkshops(token),
      ]);

      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
      if (workshopsRes.success && workshopsRes.workshops) {
        setWorkshops(workshopsRes.workshops);
      }
    } catch (err) {
      console.error('Erreur chargement données admin:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await loginAdmin(emailInput, passwordInput);
      if (res.success && res.token) {
        setSessionToken(res.token);
        localStorage.setItem('jade_admin_token', res.token);
        await loadData(res.token);
      } else {
        setLoginError(res.message || 'Identifiants administrateur incorrects.');
      }
    } catch (err) {
      setLoginError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setSessionToken(null);
    localStorage.removeItem('jade_admin_token');
    setPasswordInput('');
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
    if (!confirm(`Supprimer définitivement l'atelier « ${title} » et ses réservations associées ?`)) return;

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

  const filteredWorkshops = workshops
    .filter((ws) => {
      const isUpcoming = new Date(ws.date) >= new Date(new Date().setHours(0, 0, 0, 0));
      if (workshopFilter === 'upcoming') return isUpcoming;
      if (workshopFilter === 'past') return !isUpcoming;
      return true;
    })
    .filter((ws) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        ws.title.toLowerCase().includes(q) ||
        ws.description.toLowerCase().includes(q) ||
        ws.date.includes(q)
      );
    });

  // ==============================================================================
  // VUE 1 : LOGIN ÉLÉGANT STYLE NOTION / LINEAR (FOND CHAUD, BORDURES FINES)
  // ==============================================================================
  if (!sessionToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FBFBFA] text-neutral-900 font-sans selection:bg-[#1B4332] selection:text-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo & Subtitle */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center mx-auto shadow-xs">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
                Jade Belstead
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Espace d&apos;administration des ateliers
              </p>
            </div>
          </div>

          {/* Form Card Notion Style */}
          <div className="bg-white border border-[#EBEBEA] rounded-xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200/80 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Email administrateur
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="nom@exemple.com"
                    className="w-full h-9 pl-9 pr-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full h-9 pl-9 pr-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-9 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-medium text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer pt-0.5"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <span>← Retour au site public</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // VUE 2 : TABLEAU DE BORD SAAS NOTION / LINEAR STYLE
  // ==============================================================================
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex text-neutral-900 font-sans antialiased selection:bg-[#1B4332] selection:text-white">
      {/* -------------------------------------------------------------------------- */}
      {/* SIDEBAR ÉPURÉE STYLE NOTION                                                */}
      {/* -------------------------------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#F7F7F5] border-r border-[#EBEBEA] transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="h-14 px-4 border-b border-[#EBEBEA] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#1B4332] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sprout className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-xs text-neutral-900 block truncate leading-tight">Jade Belstead</span>
              <span className="text-[10px] text-neutral-500 block truncate">Ateliers de Jardinage</span>
            </div>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2.5 mb-1.5">
              Général
            </div>
            <nav className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-200/80 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'dashboard' ? 'text-[#1B4332]' : 'text-neutral-400'}`} />
                <span>Tableau de Bord</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('workshops');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'workshops'
                    ? 'bg-neutral-200/80 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'workshops' ? 'text-[#1B4332]' : 'text-neutral-400'}`} />
                  <span>Gestion des Ateliers</span>
                </div>
                <span className="text-[11px] px-1.5 py-0.2 rounded-md font-mono font-medium text-neutral-600 bg-neutral-200/90">
                  {workshops.length}
                </span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2.5 mb-1.5">
              Système
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-white border border-[#EBEBEA] text-xs space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-neutral-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Base PostgreSQL active</span>
              </div>
              <p className="text-neutral-500 text-[10px] leading-relaxed">
                Connecté au cluster Neon en temps réel
              </p>
            </div>
          </div>
        </div>

        {/* Profil & Actions Footer */}
        <div className="p-3 border-t border-[#EBEBEA] space-y-2 bg-[#F7F7F5]">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-[#EBEBEA] shadow-2xs">
            <div className="w-6 h-6 rounded-md bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-neutral-900 truncate">Jade Belstead</p>
              <p className="text-[10px] text-neutral-500 truncate">Administratrice</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 bg-white hover:bg-neutral-50 rounded-lg text-xs font-medium text-neutral-700 border border-[#EBEBEA] transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span>Voir le site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="h-8 px-2.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg bg-white border border-[#EBEBEA] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-900/20 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* ZONE CENTRALE (DASHBOARD & ATELIERS)                                        */}
      {/* -------------------------------------------------------------------------- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#EBEBEA] h-14 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-neutral-600 rounded-lg bg-neutral-100 border border-[#EBEBEA]"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 hidden sm:inline font-medium">Administration</span>
              <span className="text-neutral-300 hidden sm:inline">/</span>
              <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">
                {activeTab === 'dashboard' ? 'Vue d\'ensemble' : 'Gestion des Ateliers'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sessionToken && loadData(sessionToken)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 bg-white hover:bg-neutral-50 text-neutral-600 text-xs font-medium rounded-lg border border-[#EBEBEA] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1B4332]' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvel Atelier</span>
            </button>
          </div>
        </header>

        {/* Corps Principal */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Notification Banner */}
          {alertBanner && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border shadow-2xs ${
                alertBanner.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
                  : 'bg-red-50 border-red-200/80 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {alertBanner.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{alertBanner.text}</span>
              </div>
              <button
                onClick={() => setAlertBanner(null)}
                className="text-xs opacity-60 hover:opacity-100 p-0.5 ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ======================================================================== */}
          {/* ONGLET 1 : TABLEAU DE BORD (STATS & DERNIÈRES INSCRIPTIONS)              */}
          {/* ======================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Cartes de métriques proportionnées style Linear */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div className="bg-white p-5 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-medium">Ateliers Programmés</span>
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-neutral-900 font-mono">
                      {stats?.totalWorkshops ?? workshops.length}
                    </span>
                    <span className="text-xs text-neutral-400">sessions</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#F2F2F0] text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Créés au catalogue</span>
                    <span className="font-mono text-neutral-700">{stats?.totalWorkshops ?? 0}</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-5 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-medium">Places Réservées</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-emerald-900 font-mono">
                      {stats?.totalParticipants ?? 0}
                    </span>
                    <span className="text-xs text-neutral-400">participants</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#F2F2F0] text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Statut</span>
                    <span className="font-medium text-emerald-800">Inscriptions actives</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-5 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-medium">Sessions à Venir</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-neutral-900 font-mono">
                      {stats?.upcomingWorkshops ?? 0}
                    </span>
                    <span className="text-xs text-neutral-400">actives</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#F2F2F0] text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Créneaux restants</span>
                    <span className="font-mono text-neutral-700">{stats?.upcomingWorkshops ?? 0}</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white p-5 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-medium">Réservations Totales</span>
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-neutral-900 font-mono">
                      {stats?.totalBookings ?? 0}
                    </span>
                    <span className="text-xs text-neutral-400">dossiers</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#F2F2F0] text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Type de paiement</span>
                    <span className="text-emerald-800 font-medium">Gratuit (Community)</span>
                  </div>
                </div>
              </div>

              {/* Tableau épuré des dernières inscriptions */}
              <div className="bg-white rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#EBEBEA] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                      Dernières Inscriptions Reçues
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Participants ayant réservé leur place en ligne
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('workshops')}
                    className="text-xs font-medium text-[#1B4332] hover:text-[#2D6A4F] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir tous les ateliers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!stats?.recentBookings || stats.recentBookings.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 text-xs">
                    Aucune inscription enregistrée pour le moment.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FBFBFA] border-b border-[#EBEBEA] text-neutral-500 font-medium text-[11px]">
                        <tr>
                          <th className="py-3 px-5 font-medium">Participant</th>
                          <th className="py-3 px-5 font-medium">Atelier</th>
                          <th className="py-3 px-5 font-medium text-center">Places</th>
                          <th className="py-3 px-5 font-medium">Contact</th>
                          <th className="py-3 px-5 font-medium text-right">Inscrit le</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2F2F0]">
                        {stats.recentBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#FBFBFA] transition-colors">
                            <td className="py-3 px-5">
                              <span className="font-semibold text-neutral-900 block">{b.name}</span>
                            </td>
                            <td className="py-3 px-5 text-neutral-700 truncate max-w-[220px]">
                              {b.workshop_title}
                            </td>
                            <td className="py-3 px-5 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-mono font-medium text-[11px]">
                                {b.seats} place{b.seats > 1 ? 's' : ''}
                              </span>
                            </td>
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3 text-xs">
                                <a
                                  href={`mailto:${b.email}`}
                                  className="text-[#1B4332] hover:underline flex items-center gap-1"
                                >
                                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>{b.email}</span>
                                </a>
                                {b.phone && (
                                  <a
                                    href={`tel:${b.phone}`}
                                    className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>{b.phone}</span>
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-5 text-right font-mono text-[11px] text-neutral-400">
                              {b.created_at}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================================== */}
          {/* ONGLET 2 : GESTION DES ATELIERS & PARTICIPANTS                           */}
          {/* ======================================================================== */}
          {activeTab === 'workshops' && (
            <div className="space-y-4">
              {/* Barre de contrôle : filtres & recherche */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Segmented Control Notion Style */}
                <div className="inline-flex bg-neutral-200/60 p-1 rounded-lg border border-[#E5E5E3] text-xs">
                  <button
                    onClick={() => setWorkshopFilter('all')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      workshopFilter === 'all'
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Tous ({workshops.length})
                  </button>
                  <button
                    onClick={() => setWorkshopFilter('upcoming')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      workshopFilter === 'upcoming'
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    À venir
                  </button>
                  <button
                    onClick={() => setWorkshopFilter('past')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      workshopFilter === 'past'
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Passés
                  </button>
                </div>

                {/* Recherche */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer les ateliers..."
                    className="w-full h-8 pl-8 pr-3 bg-white border border-[#EBEBEA] rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#1B4332] shadow-2xs"
                  />
                </div>
              </div>

              {/* Liste ordonnée des ateliers */}
              {filteredWorkshops.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-[#EBEBEA] p-6 shadow-2xs">
                  <p className="text-xs text-neutral-500">Aucun atelier ne correspond à votre filtre.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-[#EBEBEA] overflow-hidden">
                  {filteredWorkshops.map((ws) => {
                    const isExpanded = openAccordionId === ws.id;
                    const fillPercentage = Math.min(100, Math.round((ws.total_booked_seats / ws.capacity) * 100));
                    const isFull = ws.remaining_seats <= 0;

                    return (
                      <div key={ws.id} className="group">
                        {/* Ligne principale */}
                        <div
                          onClick={() => setOpenAccordionId(isExpanded ? null : ws.id)}
                          className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#FBFBFA] transition-colors"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Miniature bien cadrée */}
                            {ws.image_url ? (
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#EBEBEA] bg-neutral-100 shadow-2xs">
                                <Image src={ws.image_url} alt={ws.title} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-neutral-100 border border-[#EBEBEA] flex items-center justify-center shrink-0 text-neutral-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-semibold text-[#1B4332] flex items-center gap-1 font-mono">
                                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                  {ws.date}
                                </span>
                                <span className="text-neutral-300">•</span>
                                <span className="text-neutral-500 flex items-center gap-1 font-mono">
                                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                  {ws.start_time} – {ws.end_time}
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold text-neutral-900 truncate">
                                {ws.title}
                              </h4>
                            </div>
                          </div>

                          {/* Capacité & Actions */}
                          <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
                            {/* Jauge */}
                            <div className="text-right">
                              <div className="text-xs font-mono font-medium text-neutral-800 flex items-center gap-2 justify-end">
                                <span>{ws.total_booked_seats} / {ws.capacity} inscrits</span>
                                {isFull ? (
                                  <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-800 font-sans text-[10px] font-semibold border border-red-200">
                                    Complet
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-sans text-[10px] font-semibold border border-emerald-200">
                                    {ws.remaining_seats} libres
                                  </span>
                                )}
                              </div>

                              <div className="w-36 h-1.5 bg-neutral-100 rounded-full mt-1.5 overflow-hidden border border-neutral-200/60">
                                <div
                                  className={`h-full transition-all duration-300 rounded-full ${
                                    isFull ? 'bg-red-500' : 'bg-[#1B4332]'
                                  }`}
                                  style={{ width: `${fillPercentage}%` }}
                                />
                              </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWorkshop(ws.id, ws.title);
                                }}
                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Supprimer cet atelier"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="p-2 text-neutral-400">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Accordéon : Tableau des inscrits */}
                        {isExpanded && (
                          <div className="border-t border-[#EBEBEA] bg-[#FBFBFA] p-4 sm:p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#1B4332]" />
                                <span>Participants inscrits ({ws.bookings.length} réservations)</span>
                              </span>
                            </div>

                            {ws.bookings.length === 0 ? (
                              <div className="p-4 text-center bg-white rounded-lg border border-[#EBEBEA] text-xs text-neutral-400 shadow-2xs">
                                Aucune inscription enregistrée pour cet atelier pour le moment.
                              </div>
                            ) : (
                              <div className="overflow-x-auto bg-white rounded-lg border border-[#EBEBEA] shadow-2xs">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-[#F7F7F5] border-b border-[#EBEBEA] text-neutral-500 text-[11px]">
                                    <tr>
                                      <th className="py-2.5 px-4 font-medium">Nom</th>
                                      <th className="py-2.5 px-4 font-medium">Email</th>
                                      <th className="py-2.5 px-4 font-medium">Téléphone</th>
                                      <th className="py-2.5 px-4 font-medium text-center">Places</th>
                                      <th className="py-2.5 px-4 font-medium">Inscrit le</th>
                                      <th className="py-2.5 px-4 font-medium text-right">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#F2F2F0]">
                                    {ws.bookings.map((booking) => (
                                      <tr key={booking.id} className="hover:bg-[#FBFBFA] transition-colors">
                                        <td className="py-2.5 px-4 font-semibold text-neutral-900">
                                          {booking.name}
                                        </td>
                                        <td className="py-2.5 px-4">
                                          <a
                                            href={`mailto:${booking.email}`}
                                            className="inline-flex items-center gap-1 text-[#1B4332] hover:underline"
                                          >
                                            <Mail className="w-3 h-3 text-neutral-400" />
                                            <span>{booking.email}</span>
                                          </a>
                                        </td>
                                        <td className="py-2.5 px-4">
                                          <a
                                            href={`tel:${booking.phone}`}
                                            className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900"
                                          >
                                            <Phone className="w-3 h-3 text-neutral-400" />
                                            <span>{booking.phone}</span>
                                          </a>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono font-medium rounded-md border border-emerald-200/70 text-[11px]">
                                            {booking.seats} place{booking.seats > 1 ? 's' : ''}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-4 text-neutral-400 font-mono text-[11px]">
                                          {booking.created_at}
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteBooking(booking.id, booking.name)}
                                            className="text-red-600 hover:text-red-800 text-[11px] font-medium hover:underline cursor-pointer"
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
      {/* MODALE CRÉATION D'ATELIER (NOTION / LINEAR STYLE)                              */}
      {/* ============================================================================== */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPending) setIsCreateModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#EBEBEA] overflow-hidden text-neutral-900 my-8">
            {/* Header Modale */}
            <div className="px-6 py-4 border-b border-[#EBEBEA] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Ajouter un nouvel atelier
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Publiez un créneau sur le planning officiel de Jade Belstead
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleCreateWorkshopSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Titre de l&apos;atelier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Ex : Seasonal Gardening Basics - Autumn Harvest"
                    className="w-full h-9 px-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Description détaillée <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    placeholder="Programme abordé, conseils pratiques et techniques horticoles..."
                    className="w-full p-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full h-9 px-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Capacité (places) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      defaultValue={10}
                      min={1}
                      max={50}
                      required
                      className="w-full h-9 px-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Heure de début <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="startTime"
                      defaultValue="10:00"
                      required
                      placeholder="10:00"
                      className="w-full h-9 px-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Heure de fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="endTime"
                      defaultValue="12:30"
                      required
                      placeholder="12:30"
                      className="w-full h-9 px-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Sélecteur d'image */}
                <div className="pt-2 border-t border-[#EBEBEA]">
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    Photo d&apos;illustration de l&apos;atelier
                  </label>

                  {/* Mode de sélection */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <button
                      type="button"
                      onClick={() => setImageMode('preset')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        imageMode === 'preset'
                          ? 'bg-[#1B4332] text-white shadow-2xs'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Presets Jardinage
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        imageMode === 'upload'
                          ? 'bg-[#1B4332] text-white shadow-2xs'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Uploader</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        imageMode === 'url'
                          ? 'bg-[#1B4332] text-white shadow-2xs'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Lien URL
                    </button>
                  </div>

                  {imageMode === 'preset' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESET_IMAGES.map((preset) => {
                        const isSelected = imagePreview === preset.url;
                        return (
                          <div
                            key={preset.title}
                            onClick={() => setImagePreview(preset.url)}
                            className={`relative h-18 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              isSelected
                                ? 'border-[#1B4332] ring-1 ring-[#1B4332]'
                                : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                          >
                            <Image src={preset.url} alt={preset.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-neutral-900/40 flex items-end p-2">
                              <span className="text-[10px] font-medium text-white leading-tight">
                                {preset.title}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-md bg-[#1B4332] text-white flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {imageMode === 'upload' && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 border border-dashed border-[#D4D4D0] hover:border-[#1B4332] rounded-lg bg-[#FBFBFA] text-center cursor-pointer transition-colors"
                    >
                      <Upload className="w-5 h-5 mx-auto text-neutral-400 mb-1" />
                      <p className="text-xs font-medium text-neutral-700">Sélectionnez une photo (JPG, PNG, WebP)</p>
                      <p className="text-[10px] text-neutral-400">Poids max 5 Mo</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}

                  {imageMode === 'url' && (
                    <input
                      type="url"
                      value={imagePreview}
                      onChange={(e) => setImagePreview(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full h-9 px-3 bg-[#FBFBFA] border border-[#E5E5E3] rounded-lg text-xs focus:bg-white focus:border-[#1B4332] focus:outline-none"
                    />
                  )}

                  {imagePreview && (
                    <div className="mt-2.5 flex items-center gap-2.5 p-2 bg-[#FBFBFA] rounded-lg border border-[#EBEBEA]">
                      <div className="relative w-12 h-9 rounded-md overflow-hidden shrink-0 border border-[#EBEBEA]">
                        <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                      </div>
                      <span className="text-[11px] text-neutral-600 truncate font-medium">Image sélectionnée pour la carte</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EBEBEA]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-9 px-3.5 bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-medium border border-[#EBEBEA] transition-colors cursor-pointer shadow-2xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-9 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-lg text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publication...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publier cet atelier</span>
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
