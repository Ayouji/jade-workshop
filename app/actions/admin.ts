'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';

export interface AdminBookingItem {
  id: string;
  workshop_id: string;
  workshop_title?: string;
  name: string;
  email: string;
  phone: string;
  seats: number;
  created_at: string;
}

export interface AdminWorkshopItem {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  image_url: string | null;
  created_at: string;
  total_booked_seats: number;
  remaining_seats: number;
  bookings: AdminBookingItem[];
}

export interface DashboardStats {
  totalWorkshops: number;
  upcomingWorkshops: number;
  pastWorkshops: number;
  totalBookings: number;
  totalParticipants: number;
  recentBookings: AdminBookingItem[];
}

function verifyTokenOrCredentials(tokenOrKey: string): boolean {
  const expectedEmail = (process.env.ADMIN_EMAIL || 'ayoujilhassan183@gmail.com').trim().toLowerCase();
  const expectedPassword = (process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || 'jade_workshop_2026').trim();

  const trimmed = tokenOrKey.trim();
  // Vérification de clé directe ou token simple de session
  if (trimmed === expectedPassword || trimmed === `admin_session_${expectedEmail}`) {
    return true;
  }

  // Compatibilité avec encodage base64 email:password
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');
    if (decoded === `${expectedEmail}:${expectedPassword}`) {
      return true;
    }
  } catch {
    // Ignorer si pas du base64
  }

  return false;
}

/**
 * Connexion sécurisée par Email et Mot de passe
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; message?: string; user?: { email: string; name: string } }> {
  const expectedEmail = (process.env.ADMIN_EMAIL || 'ayoujilhassan183@gmail.com').trim().toLowerCase();
  const expectedPassword = (process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || 'jade_workshop_2026').trim();

  if (email.trim().toLowerCase() === expectedEmail && password.trim() === expectedPassword) {
    // Génère un token de session simple et sécurisé
    const token = Buffer.from(`${expectedEmail}:${expectedPassword}`).toString('base64');
    return {
      success: true,
      token,
      user: {
        email: expectedEmail,
        name: 'Jade Delorme',
      },
    };
  }

  return {
    success: false,
    message: 'Identifiants invalides. Vérifiez votre adresse email et votre mot de passe.',
  };
}

/**
 * Vérifie la validité d'une session
 */
export async function verifyAdminSession(token: string): Promise<boolean> {
  return verifyTokenOrCredentials(token);
}

/**
 * Alias pour compatibilité avec l'ancienne signature
 */
export async function verifyAdminKey(key: string): Promise<boolean> {
  return verifyTokenOrCredentials(key);
}

/**
 * Récupère les statistiques consolidées pour le Dashboard
 */
export async function getDashboardStats(token: string): Promise<{
  success: boolean;
  message?: string;
  stats?: DashboardStats;
}> {
  if (!verifyTokenOrCredentials(token)) {
    return { success: false, message: 'Session expirée ou non autorisée.' };
  }

  try {
    const sql = getDb();

    // 1. Statistiques des ateliers
    const workshopsStats = await sql`
      SELECT 
        COUNT(*)::int AS total_workshops,
        COUNT(CASE WHEN date >= CURRENT_DATE THEN 1 END)::int AS upcoming_workshops,
        COUNT(CASE WHEN date < CURRENT_DATE THEN 1 END)::int AS past_workshops
      FROM workshops
    `;

    // 2. Statistiques des réservations
    const bookingsStats = await sql`
      SELECT 
        COUNT(*)::int AS total_bookings,
        COALESCE(SUM(seats), 0)::int AS total_participants
      FROM bookings
    `;

    // 3. Les 8 réservations les plus récentes
    const recentBookingsRows = await sql`
      SELECT 
        b.id,
        b.workshop_id,
        w.title AS workshop_title,
        b.name,
        b.email,
        b.phone,
        b.seats,
        TO_CHAR(b.created_at, 'DD/MM/YYYY HH24:MI') AS created_at
      FROM bookings b
      LEFT JOIN workshops w ON b.workshop_id = w.id
      ORDER BY b.created_at DESC
      LIMIT 8
    `;

    const stats: DashboardStats = {
      totalWorkshops: Number(workshopsStats[0]?.total_workshops || 0),
      upcomingWorkshops: Number(workshopsStats[0]?.upcoming_workshops || 0),
      pastWorkshops: Number(workshopsStats[0]?.past_workshops || 0),
      totalBookings: Number(bookingsStats[0]?.total_bookings || 0),
      totalParticipants: Number(bookingsStats[0]?.total_participants || 0),
      recentBookings: recentBookingsRows.map((r: any) => ({
        id: r.id,
        workshop_id: r.workshop_id,
        workshop_title: r.workshop_title || 'Atelier inconnu',
        name: r.name,
        email: r.email,
        phone: r.phone,
        seats: Number(r.seats),
        created_at: r.created_at,
      })),
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    return { success: false, message: 'Erreur lors du calcul des statistiques.' };
  }
}

/**
 * Récupère tous les ateliers et l'ensemble de leurs réservations détaillées
 */
export async function getAdminWorkshops(token: string): Promise<{
  success: boolean;
  message?: string;
  workshops?: AdminWorkshopItem[];
}> {
  if (!verifyTokenOrCredentials(token)) {
    return { success: false, message: 'Session invalide ou expirée.' };
  }

  try {
    const sql = getDb();

    // 1. Tous les ateliers
    const workshopsRows = await sql`
      SELECT 
        w.id,
        w.title,
        w.description,
        TO_CHAR(w.date, 'YYYY-MM-DD') AS date,
        w.start_time,
        w.end_time,
        w.capacity,
        w.image_url,
        w.created_at,
        COALESCE(SUM(b.seats), 0)::int AS total_booked_seats,
        (w.capacity - COALESCE(SUM(b.seats), 0))::int AS remaining_seats
      FROM workshops w
      LEFT JOIN bookings b ON w.id = b.workshop_id
      GROUP BY w.id
      ORDER BY w.date DESC, w.start_time ASC
    `;

    // 2. Toutes les réservations
    const bookingsRows = await sql`
      SELECT 
        b.id,
        b.workshop_id,
        b.name,
        b.email,
        b.phone,
        b.seats,
        TO_CHAR(b.created_at, 'DD/MM/YYYY HH24:MI') AS created_at
      FROM bookings b
      ORDER BY b.created_at DESC
    `;

    const workshops: AdminWorkshopItem[] = workshopsRows.map((ws: any) => {
      const wsBookings = bookingsRows
        .filter((b: any) => b.workshop_id === ws.id)
        .map((b: any) => ({
          id: b.id,
          workshop_id: ws.id,
          name: b.name,
          email: b.email,
          phone: b.phone,
          seats: Number(b.seats),
          created_at: b.created_at,
        }));

      return {
        id: ws.id,
        title: ws.title,
        description: ws.description,
        date: ws.date,
        start_time: ws.start_time,
        end_time: ws.end_time,
        capacity: Number(ws.capacity),
        image_url: ws.image_url,
        created_at: ws.created_at,
        total_booked_seats: Number(ws.total_booked_seats),
        remaining_seats: Number(ws.remaining_seats),
        bookings: wsBookings,
      };
    });

    return { success: true, workshops };
  } catch (error) {
    console.error('Erreur getAdminWorkshops:', error);
    return { success: false, message: 'Erreur lors de la lecture des données en base.' };
  }
}

/**
 * Crée un nouvel atelier (avec support des images uploadées en base64 ou URL)
 */
export async function createWorkshop(
  token: string,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  if (!verifyTokenOrCredentials(token)) {
    return { success: false, message: 'Action non autorisée. Session invalide.' };
  }

  try {
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const date = formData.get('date')?.toString().trim();
    const startTime = formData.get('startTime')?.toString().trim();
    const endTime = formData.get('endTime')?.toString().trim();
    const capacityRaw = formData.get('capacity')?.toString().trim();
    const imageUrl = formData.get('imageUrl')?.toString().trim() || null;

    if (!title || !description || !date || !startTime || !endTime || !capacityRaw) {
      return { success: false, message: 'Tous les champs obligatoires doivent être renseignés.' };
    }

    const capacity = parseInt(capacityRaw, 10);
    if (isNaN(capacity) || capacity < 1) {
      return { success: false, message: 'La capacité doit être un nombre positif supérieur à 0.' };
    }

    const sql = getDb();

    await sql`
      INSERT INTO workshops (title, description, date, start_time, end_time, capacity, image_url)
      VALUES (${title}, ${description}, ${date}::DATE, ${startTime}, ${endTime}, ${capacity}, ${imageUrl})
    `;

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true, message: 'L\'atelier a été créé avec succès et est immédiatement visible en ligne !' };
  } catch (error) {
    console.error('Erreur createWorkshop:', error);
    return { success: false, message: 'Erreur lors de l\'enregistrement dans la base Neon.' };
  }
}

/**
 * Supprime un atelier
 */
export async function deleteWorkshop(
  token: string,
  workshopId: string
): Promise<{ success: boolean; message: string }> {
  if (!verifyTokenOrCredentials(token)) {
    return { success: false, message: 'Action non autorisée.' };
  }

  try {
    const sql = getDb();
    await sql`DELETE FROM workshops WHERE id = ${workshopId}`;

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true, message: 'L\'atelier a été supprimé.' };
  } catch (error) {
    console.error('Erreur deleteWorkshop:', error);
    return { success: false, message: 'Impossible de supprimer l\'atelier.' };
  }
}

/**
 * Annule/Supprime une réservation spécifique
 */
export async function deleteBooking(
  token: string,
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  if (!verifyTokenOrCredentials(token)) {
    return { success: false, message: 'Action non autorisée.' };
  }

  try {
    const sql = getDb();
    await sql`DELETE FROM bookings WHERE id = ${bookingId}`;

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true, message: 'La réservation a été annulée et la place est de nouveau libre.' };
  } catch (error) {
    console.error('Erreur deleteBooking:', error);
    return { success: false, message: 'Impossible d\'annuler la réservation.' };
  }
}
