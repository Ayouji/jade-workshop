-- ==============================================================================
-- SCHEMA SQL POUR NEON POSTGRESQL - JADE WORKSHOP BOOKING
-- À exécuter directement dans la console SQL de Neon.tech (SQL Editor)
-- ==============================================================================

-- Activation de l'extension pgcrypto pour la génération d'UUID si non activée
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table des Ateliers (Workshops)
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

-- 2. Table des Réservations (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    seats INTEGER NOT NULL CHECK (seats >= 1 AND seats <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_bookings_workshop_id ON bookings(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops(date);

-- ==============================================================================
-- DONNÉES DE TEST / INITIALISATION (SEED DATA)
-- Vous pouvez exécuter cette section pour avoir des ateliers immédiatement visibles
-- ==============================================================================

INSERT INTO workshops (title, description, date, start_time, end_time, capacity, image_url)
VALUES 
    (
        'Initiation au Tournage Céramique & Grès Blanc',
        'Découvrez le travail de la terre sur tour de potier. Apprenez les gestes fondamentaux : centrage, perçage et montée de terre pour créer votre premier bol ou vase.',
        CURRENT_DATE + INTERVAL '7 days',
        '10:00',
        '12:30',
        8,
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80'
    ),
    (
        'Modelage & Émaillage Teinte Terracotta',
        'Créez un ensemble de pièces uniques à la main (technique du pincé et du colombin), puis explorez nos engobes et émaux artisanaux aux nuances chaudes et terreuses.',
        CURRENT_DATE + INTERVAL '12 days',
        '14:00',
        '17:00',
        6,
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80'
    ),
    (
        'Atelier Vases Organiques & Fleurs Séchées',
        'Façonnez un vase aux lignes pures et organiques, cuit selon la méthode japonaise Raku, idéal pour accueillir des compositions florales poétiques et intemporelles.',
        CURRENT_DATE + INTERVAL '18 days',
        '15:00',
        '18:00',
        8,
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80'
    ),
    (
        'Masterclass Émail Vert Sauge & Finitions Minérales',
        'Approfondissez la chimie des émaux avec Jade. Expérimentation sur biscuit, superposition de pigments naturels et création de textures satinées signature.',
        CURRENT_DATE + INTERVAL '25 days',
        '09:30',
        '13:00',
        6,
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80'
    )
ON CONFLICT DO NOTHING;
