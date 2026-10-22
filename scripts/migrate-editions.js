const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    // 1. Create editions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS editions (
        year INT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        theme VARCHAR(255),
        dates VARCHAR(100),
        is_active BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'upcoming',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Insert inaugural 2026 edition
    await pool.query(`
      INSERT INTO editions (year, name, theme, dates, is_active, status)
      VALUES (2026, 'Sumshodhini ''26', 'National Science & Technology Symposium', 'October 23–24, 2026', true, 'live')
      ON CONFLICT (year) DO UPDATE SET
        is_active = true,
        status = 'live';
    `);

    // 3. Create schedules table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id VARCHAR(100) PRIMARY KEY,
        edition_year INT NOT NULL DEFAULT 2026,
        day_number INT NOT NULL,
        time VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        venue VARCHAR(255),
        category VARCHAR(50),
        badge VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check all tables in public schema
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Tables in public schema:', tablesRes.rows.map(r => r.table_name));

    const edRes = await pool.query('SELECT * FROM editions ORDER BY year DESC');
    console.log('Editions in Neon DB:', edRes.rows);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
