# 🚀 Guide de Déploiement Production — Ubuntu EC2 (Docker + Nginx + SSL)

Ce guide complet vous accompagne pas à pas pour déployer **Jade Workshop** sur une instance **AWS EC2 (Ubuntu)** avec **Docker**, **Nginx** en reverse proxy et **Certbot** (SSL gratuit Let's Encrypt) sur vos noms de domaine **`jaheztech.com`** et **`www.jaheztech.com`**.

---

## 1. 🌐 Configuration Préalable (DNS & AWS)

### A. Security Group AWS EC2
Dans la console AWS EC2 > **Security Groups** rattaché à votre instance, vérifiez que les **Inbound Rules** (règles entrantes) autorisent :
* **SSH** (Port 22) : Votre adresse IP (ou `0.0.0.0/0`)
* **HTTP** (Port 80) : `0.0.0.0/0` (partout)
* **HTTPS** (Port 443) : `0.0.0.0/0` (partout)

### B. Configuration DNS (Chez votre registrar ou Cloudflare)
Ajoutez deux enregistrements **Type A** pointant vers l'**IP publique** de votre serveur EC2 (ex: `54.x.x.x`) :
* **A** | `jaheztech.com` (ou `@`) ➔ `VOTRE_IP_PUBLIQUE_EC2`
* **A** | `www` (ou `www.jaheztech.com`) ➔ `VOTRE_IP_PUBLIQUE_EC2`

---

## 2. 💻 Connexion & Installation sur le Serveur Ubuntu

Connectez-vous à votre instance EC2 en SSH :
```bash
ssh -i "votre-cle.pem" ubuntu@VOTRE_IP_PUBLIQUE_EC2
```

### A. Mettre à jour le système
```bash
sudo apt update && sudo apt upgrade -y
```

### B. Installer Docker & Docker Compose
```bash
# Installation de Docker
sudo apt install -y docker.io docker-compose-v2

# Autoriser l'utilisateur ubuntu à utiliser Docker sans sudo
sudo usermod -aG docker $USER

# Démarrer et activer le service Docker
sudo systemctl enable --now docker
```
*(Optionnel : déconnectez-vous et reconnectez-vous en SSH pour que le groupe docker prenne effet sans sudo).*

### C. Installer Nginx & Certbot (Let's Encrypt)
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 3. 📂 Cloner le Projet & Configurer l'Environnement

### A. Cloner le dépôt GitHub
```bash
cd ~
git clone https://github.com/Ayouji/jade-workshop.git
cd jade-workshop
```

### B. Créer le fichier des variables de production
Créez le fichier `.env.production` :
```bash
nano .env.production
```

Collez-y vos variables réelles :
```ini
# Base de Données Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_rPChfi9svH6M@ep-spring-water-a54417t2-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Notifications & Administrateur
ADMIN_NOTIFICATION_EMAIL="contact.prelify@gmail.com"

# Configuration Gmail SMTP
GMAIL_USER="contact.prelify@gmail.com"
GMAIL_APP_PASSWORD="gaor lilv fhkl qgvy"

# Espace Admin (/admin)
ADMIN_EMAIL="contact.prelify@gmail.com"
ADMIN_PASSWORD="jade_workshop_2026"
ADMIN_SECRET_KEY="jade_workshop_2026"
```
*(Sauvegardez avec `Ctrl + O`, puis `Entrée`, puis quittez avec `Ctrl + X`).*

---

## 4. 🐳 Démarrer l'Application avec Docker

Lancez la construction et le démarrage du conteneur en arrière-plan :
```bash
docker compose up -d --build
```

### Vérifier que l'application tourne bien :
```bash
# Voir l'état du conteneur
docker ps

# Tester localement le conteneur
curl http://127.0.0.1:3000
```
Le conteneur est désormais actif et écoute en local sur le port `3000`.

---

## 5. 🛡️ Configuration de Nginx en Reverse Proxy

### A. Copier la configuration Nginx
```bash
sudo cp nginx/jaheztech.conf /etc/nginx/sites-available/jaheztech.conf
```

### B. Activer le site dans Nginx
```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/jaheztech.conf /etc/nginx/sites-enabled/

# Supprimer le site par défaut de Nginx
sudo rm -f /etc/nginx/sites-enabled/default

# Tester la syntaxe Nginx
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

À ce stade, votre site répond déjà en HTTP sur `http://jaheztech.com` !

---

## 6. 🔒 Activer le Certificat SSL Gratuit (HTTPS) avec Certbot

Exécutez simplement Certbot :
```bash
sudo certbot --nginx -d jaheztech.com -d www.jaheztech.com
```

* Saisissez votre adresse email (ex: `contact.prelify@gmail.com`).
* Acceptez les conditions d'utilisation (`Y`).
* Certbot configure automatiquement la redirection automatique de **HTTP vers HTTPS**.

Certbot met en place un renouvellement automatique du certificat via un cron systemd. Vous pouvez tester le renouvellement avec :
```bash
sudo certbot renew --dry-run
```

---

## 7. 🎉 Votre Site est en Ligne !

* **Site public** : `https://jaheztech.com` et `https://www.jaheztech.com`
* **Espace Gestion Admin** : `https://jaheztech.com/admin`
  * Identifiant : `contact.prelify@gmail.com`
  * Mot de passe : `jade_workshop_2026`

---

## 8. 🔄 Commandes Utiles au Quotidien

### Mettre à jour le site après un `git push` :
```bash
cd ~/jade-workshop
git pull
docker compose up -d --build
```

### Consulter les logs en direct de l'application :
```bash
docker compose logs -f web
```

### Redémarrer l'application :
```bash
docker compose restart
```

### Redémarrer Nginx :
```bash
sudo systemctl restart nginx
```
