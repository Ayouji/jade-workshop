import nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface SendBookingEmailParams {
  bookingId?: string;
  workshopTitle: string;
  workshopDate: string;
  workshopStartTime: string;
  workshopEndTime: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  seats: number;
}

/**
 * Template simple, épuré et chaleureux pour le participant
 * Zéro ID de réservation technique, focus sur l'expérience atelier
 */
function getParticipantEmailHtml(params: SendBookingEmailParams): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #F7F5F0; padding: 36px 20px; color: #24211D;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #B85B3A; font-weight: 600; display: block; margin-bottom: 4px;">Jade Studio</span>
        <h1 style="color: #24211D; font-size: 24px; margin: 0; font-family: Georgia, serif; font-weight: normal;">Confirmation de votre session</h1>
      </div>

      <div style="background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #E5E0D8;">
        <p style="font-size: 15px; line-height: 1.5; margin: 0 0 14px; color: #24211D;">
          Bonjour <strong>${params.participantName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #57534E; margin: 0 0 20px;">
          Votre place pour l'atelier <strong>${params.workshopTitle}</strong> est bien confirmée. Nous nous réjouissons de vous accueillir au studio.
        </p>

        <div style="background-color: #F7F5F0; border-left: 3px solid #B85B3A; padding: 16px 18px; margin: 0 0 20px; border-radius: 6px;">
          <div style="margin-bottom: 8px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; font-weight: 600; display: block;">Atelier</span>
            <strong style="font-size: 14px; color: #24211D;">${params.workshopTitle}</strong>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; font-weight: 600; display: block;">Date</span>
            <span style="font-size: 14px; color: #24211D;">${params.workshopDate}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; font-weight: 600; display: block;">Horaires</span>
            <span style="font-size: 14px; color: #24211D;">${params.workshopStartTime} — ${params.workshopEndTime}</span>
          </div>
          <div>
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; font-weight: 600; display: block;">Participants</span>
            <span style="font-size: 14px; color: #24211D;">${params.seats} place${params.seats > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div style="font-size: 13px; line-height: 1.5; color: #78716C; border-top: 1px solid #E5E0D8; padding-top: 16px;">
          <p style="margin: 0 0 6px;">
          <strong>Tout est fourni :</strong> Terreau biologique, pots, jeunes plants et outils de jardinage vous attendent sur place. Vous repartirez avec vos propres créations végétales.
          </p>
          <p style="margin: 0;">
             <strong>Accueil :</strong> Nous vous conseillons d'arriver 5 à 10 minutes avant le début de la session.
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #A8A29E;">
        <p style="margin: 0;">Jade Studio · Creative Gardening Workshops</p>
      </div>
    </div>
  `;
}

/**
 * Template simple de notification pour le studio Jade
 */
function getAdminEmailHtml(params: SendBookingEmailParams): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background: #ffffff; border: 1px solid #E5E0D8; border-radius: 12px; max-width: 480px; color: #24211D;">
      <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #B85B3A; font-weight: 600; display: block; margin-bottom: 4px;">Nouvelle Inscription</span>
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #24211D;">${params.workshopTitle}</h2>

      <div style="background-color: #F7F5F0; padding: 14px 16px; border-radius: 8px; font-size: 13px; line-height: 1.6;">
        <p style="margin: 0 0 6px;"><strong>Participant :</strong> ${params.participantName}</p>
        <p style="margin: 0 0 6px;"><strong>Email :</strong> <a href="mailto:${params.participantEmail}" style="color: #B85B3A; text-decoration: none;">${params.participantEmail}</a></p>
        <p style="margin: 0 0 6px;"><strong>Téléphone :</strong> ${params.participantPhone}</p>
        <p style="margin: 0 0 6px;"><strong>Places :</strong> ${params.seats}</p>
        <p style="margin: 0 0 6px;"><strong>Date :</strong> ${params.workshopDate}</p>
        <p style="margin: 0;"><strong>Horaires :</strong> ${params.workshopStartTime} — ${params.workshopEndTime}</p>
      </div>
    </div>
  `;
}

/**
 * Envoie les emails de réservation.
 * Priorise Gmail SMTP si GMAIL_USER et GMAIL_APP_PASSWORD sont renseignés.
 * Sinon, bascule sur Resend si RESEND_API_KEY est présent.
 */
export async function sendBookingEmails(params: SendBookingEmailParams): Promise<{ success: boolean; provider: string }> {
  const gmailUser = process.env.GMAIL_USER || (process.env.ADMIN_NOTIFICATION_EMAIL?.includes('@gmail.com') ? process.env.ADMIN_NOTIFICATION_EMAIL : undefined);
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || gmailUser || 'lalatech39@gmail.com';
  const participantHtml = getParticipantEmailHtml(params);
  const adminHtml = getAdminEmailHtml(params);
  const subjectParticipant = `Confirmation de votre place : ${params.workshopTitle} (${params.workshopDate})`;
  const subjectAdmin = `Inscription atelier : ${params.participantName} - ${params.workshopTitle} (${params.seats} pl.)`;

  // ============================================================================
  // MÉTHODE 1 : GMAIL SMTP (Nodemailer)
  // Recommandé car permet d'envoyer à N'IMPORTE QUEL email sans acheter de domaine
  // ============================================================================
  if (gmailUser && gmailAppPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword.replace(/\s+/g, ''), // Nettoie les espaces éventuels des mots de passe Google
        },
      });

      // 1. Envoi au participant (fonctionne pour toute adresse email)
      await transporter.sendMail({
        from: `"Jade Workshop" <${gmailUser}>`,
        to: params.participantEmail,
        subject: subjectParticipant,
        html: participantHtml,
      });

      // 2. Notification à Jade (admin)
      if (adminEmail !== params.participantEmail) {
        await transporter.sendMail({
          from: `"Jade Workshop" <${gmailUser}>`,
          to: adminEmail,
          subject: subjectAdmin,
          html: adminHtml,
        });
      }

      console.log(`[Email] Emails envoyés avec succès via Gmail (${gmailUser})`);
      return { success: true, provider: 'gmail' };
    } catch (gmailError) {
      console.error('[Email Error Gmail]:', gmailError);
      // Poursuit pour essayer Resend si configuré
    }
  }

  // ============================================================================
  // MÉTHODE 2 : RESEND API (Fallback)
  // ============================================================================
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      // Si nous sommes sur le domaine de test onboarding@resend.dev, Resend n'autorise
      // l'envoi qu'à l'adresse du compte (lalatech39@gmail.com).
      const isTestDomain = fromEmail.includes('resend.dev');

      if (isTestDomain && params.participantEmail !== adminEmail) {
        // En mode test Resend : on envoie à l'admin avec en-tête indicatif
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `[TEST CLIENT -> ${params.participantEmail}] ${subjectParticipant}`,
          html: participantHtml,
        });
        console.log(`[Email Resend Test] Email envoyé à ${adminEmail} (destiné à ${params.participantEmail})`);
      } else {
        // Domaine vérifié ou participant == compte propriétaire
        await resend.emails.send({
          from: fromEmail,
          to: params.participantEmail,
          subject: subjectParticipant,
          html: participantHtml,
        });
      }

      // Notification admin
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: subjectAdmin,
        html: adminHtml,
      });

      return { success: true, provider: 'resend' };
    } catch (resendError: any) {
      console.error('[Email Error Resend]:', resendError?.message || resendError);
    }
  }

  console.warn('[Email] Aucun service d\'email configuré (ni Gmail ni Resend valide).');
  return { success: false, provider: 'none' };
}
