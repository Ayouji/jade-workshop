const { neon } = require('@neondatabase/serverless');

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_rPChfi9svH6M@ep-spring-water-a54417t2-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function resetAndSeed() {
  console.log('1. Clearing old test bookings and workshops...');
  await sql`DELETE FROM bookings;`;
  await sql`DELETE FROM workshops;`;
  console.log('Old data cleared.');

  console.log('2. Inserting clean, professional Jade Gardening Workshops...');

  const cleanWorkshops = [
    {
      title: 'Seasonal Gardening Basics — Herbs & Seed Starting',
      description: 'Learn soil preparation, seed germination, and planting kitchen herbs in containers or garden beds. Each participant pots their own culinary herbs to take home.',
      date: '2026-09-19',
      start_time: '10:00 AM',
      end_time: '12:30 PM',
      capacity: 10,
      image_url: '/gardening_hero_studio.jpg'
    },
    {
      title: 'Seasonal Gardening Basics — Soil Health & Composting',
      description: 'Master organic composting, soil microbial life, and natural amendments for thriving vegetable beds. Hands-on soil testing and organic potting mix preparation.',
      date: '2026-09-26',
      start_time: '10:00 AM',
      end_time: '12:30 PM',
      capacity: 10,
      image_url: '/hero_gardening.jpg'
    },
    {
      title: 'Seasonal Gardening Basics — Autumn Vegetable Planting',
      description: 'Plant cool-season vegetables: leafy greens, root crops, garlic, and winter-hardy alliums. Step-by-step guidance from seed to harvest.',
      date: '2026-10-03',
      start_time: '10:00 AM',
      end_time: '12:30 PM',
      capacity: 10,
      image_url: '/gardening_hero_studio.jpg'
    },
    {
      title: 'Seasonal Gardening Basics — Companion Planting & Natural Care',
      description: 'Protect your crops using companion planting, beneficial pollinators, and organic pest deterrents. Explore natural garden biodiversity.',
      date: '2026-10-10',
      start_time: '10:00 AM',
      end_time: '12:30 PM',
      capacity: 10,
      image_url: '/hero_gardening.jpg'
    },
    {
      title: 'Winter Herb Care & Botanical Potting',
      description: 'Harvest and dry culinary herbs, prepare protective mulch for outdoor beds, and pot cold-hardy herbs for bright indoor windowsills.',
      date: '2026-10-17',
      start_time: '10:00 AM',
      end_time: '12:30 PM',
      capacity: 10,
      image_url: '/gardening_hero_studio.jpg'
    }
  ];

  for (const ws of cleanWorkshops) {
    await sql`
      INSERT INTO workshops (title, description, date, start_time, end_time, capacity, image_url)
      VALUES (${ws.title}, ${ws.description}, ${ws.date}, ${ws.start_time}, ${ws.end_time}, ${ws.capacity}, ${ws.image_url})
    `;
    console.log(`+ Added workshop: ${ws.title} (${ws.date})`);
  }

  console.log('\n3. Verifying updated database records:');
  const count = await sql`SELECT COUNT(*)::int as count FROM workshops;`;
  console.log(`Total workshops in database: ${count[0].count}`);
  const bookingsCount = await sql`SELECT COUNT(*)::int as count FROM bookings;`;
  console.log(`Total bookings in database: ${bookingsCount[0].count}`);
  console.log('\nDatabase reset and clean seeding complete!');
}

resetAndSeed().catch(console.error);
