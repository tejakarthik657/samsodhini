const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require' });

async function check() {
  const ed = await pool.query('SELECT * FROM editions');
  console.log('Editions:', ed.rows);

  const brCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'branches'");
  console.log('Branches columns:', brCols.rows.map(r => `${r.column_name} (${r.data_type})`));

  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Public tables:', tables.rows.map(r => r.table_name));

  await pool.end();
}

check().catch(console.error);
