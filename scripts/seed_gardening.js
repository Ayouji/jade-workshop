const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function seedGardening() {
  console.log('Seeding October Gardening Workshops...');

  const query = `
    INSERT INTO workshops (title, description, date, start_time, end_time, capacity, image_url)
    VALUES
      (
        'Seasonal Gardening Basics - Herbs & Seed Starting',
        'Learn soil preparation, seed germination, and planting kitchen herbs in containers or garden beds.',
        '2026-10-03',
        '10:00',
        '12:30',
        10,
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        'Seasonal Gardening Basics - Soil Health & Composting',
        'Master organic composting, soil microbial life, and natural amendments for thriving vegetable beds.',
        '2026-10-10',
        '10:00',
        '12:30',
        10,
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        'Seasonal Gardening Basics - Autumn Vegetable Planting',
        'Plant cool-season vegetables: leafy greens, root crops, garlic, and winter-hardy alliums.',
        '2026-10-17',
        '10:00',
        '12:30',
        10,
        'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        'Seasonal Gardening Basics - Natural Pest Control & Pruning',
        'Protect your crops using companion planting, beneficial pollinators, and organic pest deterrents.',
        '2026-10-24',
        '10:00',
        '12:30',
        10,
        'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        'Seasonal Gardening Basics - Winter Prep & Herb Harvesting',
        'Harvest and dry herbs, prepare protective mulch, and tuck your garden in for winter vitality.',
        '2026-10-31',
        '10:00',
        '12:30',
        10,
        'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&w=1200&q=80'
      )
    ON CONFLICT DO NOTHING;
  `;

  await sql.query(query);
  console.log('Successfully inserted October 2026 Saturday workshops into Neon DB!');
}

seedGardening().catch(console.error);
