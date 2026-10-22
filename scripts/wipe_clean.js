const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('--- PURGING ALL DATA FROM DATABASE ---');
  await pool.query('TRUNCATE TABLE registrations, schedule_items, events, workshops, organizers, legacy_editions, branches CASCADE;');
  
  const tables = ['workshops', 'events', 'branches', 'schedule_items', 'legacy_editions', 'registrations', 'organizers'];
  const results = {};
  for (const t of tables) {
    const res = await pool.query('SELECT COUNT(*) FROM ' + t);
    results[t] = parseInt(res.rows[0].count, 10);
  }
  console.log('CONFIRMED TABLE COUNTS (SHOULD BE ALL 0):', results);
  await pool.end();
}

main().catch((err) => {
  console.error('Error during wipe:', err);
  process.exit(1);
});
