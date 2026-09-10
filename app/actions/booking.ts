'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { sendBookingEmails } from '@/lib/email';

export interface BookingFormState {
  success: boolean;
  message: string;
  bookingId?: string;
}

/**
 * Server Action pour traiter la réservation d'un atelier
 * 1. Validation stricte des données d'entrée
 * 2. Vérification atomique de la capacité restante en base Neon
 * 3. Insertion de la réservation
 * 4. Envoi d'emails transactionnels (Client + Notification Jade) via Resend
 * 5. Revalidation du cache pour rafraîchir les places disponibles
 */
export async function bookWorkshop(
  prevState: BookingFormState | null,
  formData: FormData
): Promise<BookingFormState> {
  try {
    const workshopId = formData.get('workshopId')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const seatsRaw = formData.get('seats')?.toString().trim();

    // 1. Validation des champs obligatoires
    if (!workshopId || !name || !email || !phone || !seatsRaw) {
      return {
        success: false,
        message: 'Tous les champs sont requis pour valider votre réservation.',
      };
    }

    // Validation du format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Veuillez saisir une adresse email valide.',
      };
    }

    // Validation du nombre de places (1 à 3 max par commande)
    const seats = parseInt(seatsRaw, 10);
    if (isNaN(seats) || seats < 1 || seats > 3) {
      return {
        success: false,
        message: 'Le nombre de places réservables doit être compris entre 1 et 3.',
      };
    }

    const sql = getDb();

    // 2. Vérification en base de données de la disponibilité actuelle de l'atelier
    const workshopRows = await sql`
      SELECT 
        w.id,
        w.title,
        TO_CHAR(w.date, 'DD/MM/YYYY') AS formatted_date,
        w.start_time,
        w.end_time,
        w.capacity,
        (w.capacity - COALESCE(SUM(b.seats), 0))::int AS remaining_seats
      FROM workshops w
      LEFT JOIN bookings b ON w.id = b.workshop_id
      WHERE w.id = ${workshopId}
      GROUP BY w.id
      LIMIT 1
    `;

    if (workshopRows.length === 0) {
      return {
        success: false,
        message: 'Atelier introuvable. Veuillez actualiser la page.',
      };
    }

    const workshop = workshopRows[0];
    const remainingSeats = Number(workshop.remaining_seats);

    if (remainingSeats <= 0) {
      return {
        success: false,
        message: 'Désolé, cet atelier est désormais complet.',
      };
    }

    if (remainingSeats < seats) {
      return {
        success: false,
        message: `Il ne reste que ${remainingSeats} place${remainingSeats > 1 ? 's' : ''} disponible${remainingSeats > 1 ? 's' : ''} pour cet atelier.`,
      };
    }

    // 3. Insertion de la réservation dans la table bookings
    const insertResult = await sql`
      INSERT INTO bookings (workshop_id, name, email, phone, seats)
      VALUES (${workshopId}, ${name}, ${email}, ${phone}, ${seats})
      RETURNING id, created_at
    `;

    const newBookingId = insertResult[0]?.id as string;

    // 4. Envoi des emails de confirmation (Gmail SMTP prioritaire ou Resend)
    await sendBookingEmails({
      bookingId: newBookingId,
      workshopTitle: workshop.title,
      workshopDate: workshop.formatted_date,
      workshopStartTime: workshop.start_time,
      workshopEndTime: workshop.end_time,
      participantName: name,
      participantEmail: email,
      participantPhone: phone,
      seats,
    });


    // 5. Revalidation de la page d'accueil pour mettre à jour instantanément les compteurs de places
    revalidatePath('/');

    return {
      success: true,
      message: 'Votre réservation a été confirmée avec succès ! Un email de confirmation vous a été envoyé.',
      bookingId: newBookingId,
    };
  } catch (error) {
    console.error('Erreur lors du traitement de la réservation:', error);
    return {
      success: false,
      message: 'Une erreur imprévue est survenue. Veuillez réessayer dans quelques instants.',
    };
  }
}

/**
 * Alias pour correspondre à l'action createBooking demandée dans l'UI
 */
export const createBooking = bookWorkshop;

