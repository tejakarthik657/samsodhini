const { Pool } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString });

async function runMigration() {
  console.log('1. Updating 2026 Edition dates to October 30–31, 2026...');
  await pool.query(`
    UPDATE editions 
    SET dates = 'October 30–31, 2026'
    WHERE year = 2026;
  `);

  console.log('2. Adding logo and student body columns to branches table...');
  await pool.query(`
    ALTER TABLE branches 
    ADD COLUMN IF NOT EXISTS logo_url TEXT,
    ADD COLUMN IF NOT EXISTS student_body_poster_url TEXT,
    ADD COLUMN IF NOT EXISTS student_body_title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS student_body_description TEXT;
  `);

  console.log('3. Creating student_body_posters table for multi-year preservation...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_body_posters (
      id SERIAL PRIMARY KEY,
      edition_year INT NOT NULL DEFAULT 2026,
      branch_code VARCHAR(20) NOT NULL,
      poster_url TEXT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      faculty_advisor VARCHAR(255) DEFAULT '',
      student_president VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_branch_edition_poster UNIQUE(branch_code, edition_year)
    );

    CREATE INDEX IF NOT EXISTS idx_sb_posters_lookup ON student_body_posters(edition_year, branch_code);
  `);

  console.log('4. Verifying editions dates:');
  const eds = await pool.query('SELECT year, dates FROM editions');
  console.log(eds.rows);

  console.log('Migration complete!');
  await pool.end();
}

runMigration().catch(console.error);
