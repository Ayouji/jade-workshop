-- ==============================================================================
-- SCRIPT DE CLÔTURE & INITIALISATION PRODUCTION (NEON POSTGRESQL)
-- Projet : Jade Workshop Booking
-- À exécuter dans la console SQL de Neon.tech (SQL Editor)
-- ==============================================================================

-- 1. Activation des extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Création de la table des Ateliers (Workshops)
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Création de la table des Réservations (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    seats INTEGER NOT NULL CHECK (seats >= 1 AND seats <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Index de performance
CREATE INDEX IF NOT EXISTS idx_bookings_workshop_id ON bookings(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops(date);

-- ==============================================================================
-- 5. INSERTION DE 2 ATELIERS RÉELS POUR L'OUVERTURE DU SITE
-- ==============================================================================

INSERT INTO workshops (title, description, date, start_time, end_time, capacity, image_url)
VALUES 
    (
        'Initiation au Tournage Céramique & Grès Blanc',
        'Venez découvrir le tour de potier et la magie de la terre qui prend forme sous vos mains. Au cours de cet atelier de 2h30, Jade vous guide dans l''apprentissage des gestes clés : centrage, perçage et montée de terre pour façonner vos premiers bols et coupelles.',
        CURRENT_DATE + INTERVAL '7 days',
        '14:00',
        '16:30',
        8,
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80'
    ),
    (
        'Modelage & Émaillage Teinte Terracotta',
        'Une séance de création à la main sans tour, axée sur les techniques douces du pincé et du colombin. Façonnez un vase organique ou un duo de tasses texturées, puis appliquez nos émaux artisanaux aux nuances chaudes et terreuses.',
        CURRENT_DATE + INTERVAL '14 days',
        '10:30',
        '13:00',
        6,
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80'
    );
