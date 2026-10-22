const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

const schemaSql = `
CREATE TABLE IF NOT EXISTS branches (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(16) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(32) NOT NULL,
  association_name VARCHAR(255) NOT NULL,
  association_short VARCHAR(32) NOT NULL,
  icon_name VARCHAR(64) DEFAULT 'Code',
  faculty_advisor VARCHAR(255) NOT NULL,
  student_president VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(64) NOT NULL,
  accent_color VARCHAR(32) NOT NULL,
  bg_light_color VARCHAR(32) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizers (
  id VARCHAR(64) PRIMARY KEY,
  branch_code VARCHAR(16) NOT NULL REFERENCES branches(code) ON DELETE CASCADE,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(64) DEFAULT 'BRANCH_ADMIN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workshops (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  branch_code VARCHAR(16) NOT NULL REFERENCES branches(code) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  tagline VARCHAR(512) NOT NULL,
  description TEXT,
  poster_url TEXT NOT NULL,
  year_lead_name VARCHAR(255) NOT NULL,
  year_lead_year VARCHAR(64) DEFAULT '4th Year B.Tech',
  year_lead_phone VARCHAR(64) NOT NULL,
  year_lead_email VARCHAR(255) NOT NULL,
  year_lead_avatar TEXT NOT NULL,
  resource_person_name VARCHAR(255) NOT NULL,
  resource_person_designation VARCHAR(255) NOT NULL,
  resource_person_company VARCHAR(255) NOT NULL,
  resource_person_bio TEXT NOT NULL,
  resource_person_avatar TEXT NOT NULL,
  resource_person_linkedin TEXT,
  resource_person_topics JSONB DEFAULT '[]'::jsonb,
  dates VARCHAR(128) NOT NULL,
  time VARCHAR(128) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  fees VARCHAR(128) NOT NULL,
  max_capacity INT DEFAULT 200,
  current_registered INT DEFAULT 0,
  live_status VARCHAR(64) DEFAULT 'upcoming',
  prerequisites JSONB DEFAULT '[]'::jsonb,
  takeaways JSONB DEFAULT '[]'::jsonb,
  syllabus JSONB DEFAULT '[]'::jsonb,
  registration_url TEXT NOT NULL,
  google_form_url TEXT,
  report_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  branch_code VARCHAR(16) NOT NULL REFERENCES branches(code) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  tagline VARCHAR(512) NOT NULL,
  description TEXT,
  poster_url TEXT NOT NULL,
  junior_coordinators JSONB DEFAULT '[]'::jsonb,
  venue VARCHAR(255) NOT NULL,
  day VARCHAR(32) NOT NULL,
  time VARCHAR(128) NOT NULL,
  prize_pool_first VARCHAR(64) NOT NULL,
  prize_pool_second VARCHAR(64) NOT NULL,
  prize_pool_third VARCHAR(64),
  prize_pool_total VARCHAR(64) NOT NULL,
  team_size VARCHAR(64) NOT NULL,
  current_registered INT DEFAULT 0,
  max_slots INT DEFAULT 100,
  status VARCHAR(32) DEFAULT 'upcoming',
  rules JSONB DEFAULT '[]'::jsonb,
  rounds JSONB DEFAULT '[]'::jsonb,
  registration_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id VARCHAR(64) PRIMARY KEY,
  time VARCHAR(128) NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(64) NOT NULL,
  branch_code VARCHAR(16),
  venue VARCHAR(255) NOT NULL,
  day VARCHAR(32) NOT NULL,
  speaker_or_lead VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legacy_editions (
  year INT PRIMARY KEY,
  theme VARCHAR(255) NOT NULL,
  dates VARCHAR(128) NOT NULL,
  total_attendees INT NOT NULL,
  total_events INT NOT NULL,
  total_workshops INT NOT NULL,
  prize_money_disbursed VARCHAR(128) NOT NULL,
  highlights JSONB DEFAULT '[]'::jsonb,
  souvenir_pdf_url TEXT,
  cover_image TEXT,
  gallery_preview JSONB DEFAULT '[]'::jsonb,
  chief_guest_name VARCHAR(255) NOT NULL,
  chief_guest_title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(64) PRIMARY KEY,
  pass_token VARCHAR(64) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  college VARCHAR(255) NOT NULL,
  roll_number VARCHAR(64) NOT NULL,
  branch VARCHAR(32) NOT NULL,
  year_of_study VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  team_name VARCHAR(255),
  target_title VARCHAR(255) NOT NULL,
  target_type VARCHAR(32) NOT NULL,
  payment_status VARCHAR(32) DEFAULT 'VERIFIED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function run() {
  try {
    console.log('Connecting to Neon PostgreSQL...');
    await pool.query(schemaSql);
    console.log('All Neon PostgreSQL tables created successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

run();
