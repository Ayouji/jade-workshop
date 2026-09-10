import { neon } from '@neondatabase/serverless';

/**
 * Interface représentant un atelier (Workshop) dans la base Neon
 */
export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  image_url: string | null;
  created_at: string;
}

/**
 * Interface enrichie avec le calcul des places restantes
 */
export interface WorkshopWithAvailability extends Workshop {
  booked_seats: number;
  remaining_seats: number;
}

/**
 * Interface représentant une réservation (Booking)
 */
export interface Booking {
  id: string;
  workshop_id: string;
  name: string;
  email: string;
  phone: string;
  seats: number;
  created_at: string;
}

/**
 * Initialisation du client SQL Neon Serverless
 * Utilise l'API HTTP de Neon via @neondatabase/serverless pour une compatibilité
 * native et ultra-performante sur Cloudflare Pages / Edge Runtime sans surcharge TCP.
 */
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL est manquant dans les variables d\'environnement. Veuillez configurer votre chaîne de connexion Neon.'
    );
  }

  return neon(databaseUrl);
}

/**
 * Récupère tous les ateliers à venir avec le calcul en temps réel des places restantes
 * Formule : capacity - COALESCE(SUM(bookings.seats), 0)
 */
export async function getWorkshopsWithAvailability(): Promise<WorkshopWithAvailability[]> {
  const sql = getDb();

  const rows = await sql`
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
      COALESCE(SUM(b.seats), 0)::int AS booked_seats,
      (w.capacity - COALESCE(SUM(b.seats), 0))::int AS remaining_seats
    FROM workshops w
    LEFT JOIN bookings b ON w.id = b.workshop_id
    WHERE w.date >= CURRENT_DATE
    GROUP BY w.id
    ORDER BY w.date ASC, w.start_time ASC
  `;

  return rows as unknown as WorkshopWithAvailability[];
}

/**
 * Récupère un atelier spécifique avec ses disponibilités
 */
export async function getWorkshopById(id: string): Promise<WorkshopWithAvailability | null> {
  const sql = getDb();

  const rows = await sql`
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
      COALESCE(SUM(b.seats), 0)::int AS booked_seats,
      (w.capacity - COALESCE(SUM(b.seats), 0))::int AS remaining_seats
    FROM workshops w
    LEFT JOIN bookings b ON w.id = b.workshop_id
    WHERE w.id = ${id}
    GROUP BY w.id
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return rows[0] as unknown as WorkshopWithAvailability;
}
