const { Pool } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString });

async function main() {
  console.log('Connecting to Neon DB...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_gallery (
      id SERIAL PRIMARY KEY,
      edition_year INT NOT NULL DEFAULT 2026,
      branch_code VARCHAR(20) NOT NULL,
      item_type VARCHAR(20) NOT NULL,
      item_id VARCHAR(100) NOT NULL,
      item_title VARCHAR(255) NOT NULL,
      image_url TEXT NOT NULL,
      caption VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_gallery_lookup ON event_gallery(edition_year, branch_code, item_type);
    CREATE INDEX IF NOT EXISTS idx_gallery_item ON event_gallery(item_id);
  `);
  console.log('event_gallery table created successfully!');

  // Check columns
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'event_gallery'
  `);
  console.log('Columns:', res.rows.map(r => `${r.column_name} (${r.data_type})`));
  await pool.end();
}

main().catch(console.error);
