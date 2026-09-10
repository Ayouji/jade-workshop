-- ==============================================================================
-- SCRIPT DE SEED MINIMAL NEON POSTGRESQL - 2 ATELIERS DE TEST
-- ==============================================================================

-- 1. Nettoyage optionnel (décommentez si vous souhaitez repartir de zéro)
-- TRUNCATE TABLE bookings, workshops CASCADE;

-- 2. Insertion de 2 ateliers démo
INSERT INTO workshops (title, description, date, start_time, end_time, capacity, image_url)
VALUES
    (
        'Tournage & Façonnage de Grès Brut',
        'Apprenez les gestes fondamentaux du tour de potier : centrage, tirage de la terre et façonnage d''un bol ou d''une coupelle unique.',
        CURRENT_DATE + INTERVAL '5 days',
        '14:00',
        '16:30',
        8,
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80'
    ),
    (
        'Modelage & Émaillage Nuance Terracotta',
        'Création à la main de pièces sculpturales et application d''engobes minéraux aux teintes chaudes et terreuses.',
        CURRENT_DATE + INTERVAL '10 days',
        '10:30',
        '13:00',
        6,
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80'
    );
