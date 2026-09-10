# 🛠️ Guide de Maintenance & Dépannage Technique — Projet Jade

Ce document technique récapitule les procédures d'exploitation, de sauvegarde et de résolution d'incidents pour le site web **Jade Workshop Booking**.

---

## 1. ⚙️ Stack & Architecture Technique

- **Framework** : Next.js 16+ (App Router, Server Actions, React 19).
- **Hébergement Web & Edge** : Cloudflare Pages (`nodejs_compat` activé via `wrangler.toml`).
- **Base de Données** : Neon Serverless PostgreSQL (`@neondatabase/serverless` via HTTP / WebSocket).
- **Envoi d'Emails** : Gmail SMTP (`nodemailer`) avec mot de passe d'application Google (fallback Resend possible).
- **Styles & UI** : Tailwind CSS v4, Lucide React, design inspiré d'EVENTO.

---

## 2. 🔐 Gestion des Variables d'Environnement

### En Local (`.env.local`)
Le fichier [.env.local](file:///c:/Users/windows/Desktop/Hassan_Folder/projet-jade/.env.local) contient les clés actives :
```ini
# Base Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_rPChfi9svH6M@ep-spring-water-a54417t2-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Envoi d'emails via Gmail SMTP
GMAIL_USER="ayoujilhassan183@gmail.com"
GMAIL_APP_PASSWORD="kmvs cmly xyxh xalm"
ADMIN_NOTIFICATION_EMAIL="ayoujilhassan183@gmail.com"

# Identifiants Espace Admin (/admin)
ADMIN_EMAIL="ayoujilhassan183@gmail.com"
ADMIN_PASSWORD="jade_workshop_2026"
```

### En Production sur Cloudflare Pages
Lors de la mise en ligne ou pour modifier un mot de passe :
1. Connectez-vous sur [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Rendez-vous dans **Workers & Pages** > Cliquez sur votre projet **projet-jade**.
3. Allez dans l'onglet **Settings** > **Environment variables**.
4. Saisissez ou mettez à jour chacune des 5 variables ci-dessus en mode **Production** et **Preview** (cochez l'option *Encrypt* pour les mots de passe).
5. Déclenchez un redéploiement pour appliquer les nouvelles variables (*Deployments* > *Retry deployment*).

---

## 3. 💾 Sauvegarde & Restauration Neon PostgreSQL

Neon.tech offre une architecture serverless avec snapshots et branching automatiques.

### A. Sauvegarde Instantanée via Branching (Console Neon)
1. Rendez-vous sur la console [Neon.tech](https://console.neon.tech).
2. Ouvrez votre projet puis cliquez sur l'onglet **Branches**.
3. Cliquez sur **« Create Branch »** :
   - Choisissez la branche `main` comme source.
   - Donnez-lui un nom horodaté (ex: `backup_pre_prod_2026_09`).
4. Cela crée une copie instantanée exacte de la base de données sans surcoût et sans interruption de service.

### B. Sauvegarde Locale par Export SQL (pg_dump)
Si vous souhaitez archiver une copie `.sql` sur votre machine locale :
```bash
# Remplacer par votre chaîne de connexion
pg_dump "postgresql://neondb_owner:VOTRE_MDP@ep-spring-water-a54417t2-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require" > backup_jade.sql
```

### C. Restauration Point-in-Time (PITR)
En cas de fausse manipulation ou perte de données :
- Dans la console Neon > **Branches** > **Restore**.
- Vous pouvez remonter dans le temps jusqu'à une minute précise pour recréer une branche restaurée.

---

## 4. 🚑 Dépannage des Problèmes Courants

### Incident 1 : Les emails ne partent plus via Gmail
- **Symptôme** : La réservation réussit en base mais aucun email n'est reçu.
- **Cause 1 - Révocation du mot de passe d'application Google** : Si le mot de passe du compte Google `ayoujilhassan183@gmail.com` a été changé, Google révoque automatiquement les mots de passe d'application.
  - *Solution* : Se reconnecter sur [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), générer un nouveau code de 16 caractères et mettre à jour `GMAIL_APP_PASSWORD`.
- **Cause 2 - Quota SMTP Gmail** : Google autorise jusqu'à 500 emails par jour pour un compte gratuit personnel, ce qui est très largement suffisant pour un atelier artisanal. Si ce quota était un jour atteint, configurez simplement une clé Resend vérifiée dans `RESEND_API_KEY`.

### Incident 2 : Jade a oublié son mot de passe administrateur
- *Solution* : Modifiez la variable `ADMIN_PASSWORD` dans le fichier `.env.local` (en local) ou dans les variables Cloudflare Pages (en production).

### Incident 3 : Erreur d'affichage d'une image d'atelier externe
- *Cause* : Next.js bloque les noms de domaines externes non déclarés dans `next.config.ts`.
- *Solution* : Le fichier [next.config.ts](file:///c:/Users/windows/Desktop/Hassan_Folder/projet-jade/next.config.ts) est déjà configuré avec le wildcard `**` en protocole HTTPS pour autoriser toutes les images sécurisées et Unsplash. Les images uploadées directement depuis l'ordinateur sont encodées en Base64 et ne dépendent d'aucun hébergeur tiers.

---

## 5. 🚀 Commandes de Déploiement Utiles

```bash
# Vérifier la compilation et le typage TypeScript
npm run build

# Lancer le serveur local de test
npm run dev

# Prévisualiser avec Wrangler (Cloudflare)
npx wrangler pages dev .vercel/output/static
```
