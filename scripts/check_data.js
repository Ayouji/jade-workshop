const { neon } = require('@neondatabase/serverless');

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_rPChfi9svH6M@ep-spring-water-a54417t2-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function main() {
  const workshops = await sql`SELECT id, title, TO_CHAR(date, 'YYYY-MM-DD') as date, start_time, end_time, capacity FROM workshops ORDER BY date ASC`;
  const bookings = await sql`SELECT id, workshop_id, name, email, seats FROM bookings`;
  console.log('--- WORKSHOPS (' + workshops.length + ') ---');
  console.log(JSON.stringify(workshops, null, 2));
  console.log('--- BOOKINGS (' + bookings.length + ') ---');
  console.log(JSON.stringify(bookings, null, 2));
}

main().catch(console.error);
