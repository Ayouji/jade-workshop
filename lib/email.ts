import nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface SendBookingEmailParams {
  bookingId: string;
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
 * Génère le template HTML élégant pour le participant
 */
function getParticipantEmailHtml(params: SendBookingEmailParams): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; padding: 40px 24px; border-radius: 24px; color: #2D3748;">
      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C86D51; font-weight: 700;">Atelier Artisanal</span>
        <h1 style="color: #2D3748; font-size: 28px; margin: 8px 0 0; font-family: Georgia, serif; font-weight: 700;">Jade Workshop</h1>
      </div>

      <div style="background-color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #EFE8DD; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Bonjour <strong>${params.participantName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">
          Votre réservation pour l'atelier <strong>« ${params.workshopTitle} »</strong> est bien enregistrée ! Nous avons hâte de partager ce moment de façonnage avec vous.
        </p>

        <div style="background-color: #F7F3EC; border-left: 4px solid #C86D51; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 12px; color: #2D3748; font-size: 16px; font-weight: 700;">Détails pratiques de votre session :</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>📅 Date :</strong> ${params.workshopDate}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>⏰ Horaires :</strong> ${params.workshopStartTime} - ${params.workshopEndTime}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>🎟️ Places réservées :</strong> ${params.seats} participant${params.seats > 1 ? 's' : ''}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>📍 Lieu :</strong> L'Atelier de Jade, 14 rue des Artisans, 75011 Paris</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>🔖 N° Réservation :</strong> <code style="font-size: 12px; background: #fff; padding: 2px 6px; border-radius: 4px;">${params.bookingId}</code></p>
        </div>

        <p style="font-size: 13px; color: #718096; line-height: 1.5; margin-bottom: 0;">
          <em>💡 Information : aucun paiement en ligne n'est nécessaire. Le règlement s'effectue directement sur place le jour J. Tout le matériel (argile, tablier, cuissons et émaux) est fourni.</em>
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #A0AEC0;">
        <p>© ${new Date().getFullYear()} Jade Workshop. Tous droits réservés.</p>
      </div>
    </div>
  `;
}

/**
 * Génère le template HTML pour l'administrateur (Jade)
 */
function getAdminEmailHtml(params: SendBookingEmailParams): string {
  return `
    <div style="font-family: sans-serif; padding: 24px; background: #fff; border: 1px solid #ddd; border-radius: 12px; max-width: 500px;">
      <h2 style="color: #C86D51; margin-top: 0;">🔔 Nouvelle Réservation Reçue</h2>
      <p>Une nouvelle inscription vient d'être effectuée :</p>
      <ul style="line-height: 1.8; font-size: 14px;">
        <li><strong>Atelier :</strong> ${params.workshopTitle}</li>
        <li><strong>Date :</strong> ${params.workshopDate} (${params.workshopStartTime} - ${params.workshopEndTime})</li>
        <li><strong>Participant :</strong> ${params.participantName}</li>
        <li><strong>Email :</strong> <a href="mailto:${params.participantEmail}">${params.participantEmail}</a></li>
        <li><strong>Téléphone :</strong> ${params.participantPhone}</li>
        <li><strong>Nombre de places :</strong> ${params.seats}</li>
        <li><strong>ID Réservation :</strong> ${params.bookingId}</li>
      </ul>
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
  const subjectParticipant = `✨ Confirmation de votre atelier avec Jade : ${params.workshopTitle}`;
  const subjectAdmin = `🔔 Nouvelle réservation : ${params.workshopTitle} (${params.seats} place${params.seats > 1 ? 's' : ''})`;

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
