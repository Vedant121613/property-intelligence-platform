import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runAutoMigration() {
  try {
    const check = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!check.rows[0]?.exists) {
      console.log('[DB Auto-Init] Tables not found. Initializing database schema from init-db.sql...');
      const sqlPath = resolve(__dirname, 'init-db.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await query(sql);
      console.log('[DB Auto-Init] Database schema & default data created successfully!');
    } else {
      console.log('[DB Auto-Init] Database tables verified.');
    }

    // Ensure pune_projects table exists
    await query(`
      CREATE TABLE IF NOT EXISTS pune_projects (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        project_name TEXT NOT NULL,
        project_slug TEXT,
        rera_id TEXT,
        registration_number TEXT,
        date_of_registration TEXT,
        proposed_completion_date TEXT,
        taluka TEXT NOT NULL,
        taluka_slug TEXT NOT NULL,
        village TEXT NOT NULL,
        village_slug TEXT NOT NULL,
        address TEXT,
        street_name TEXT,
        locality TEXT,
        pin_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_pune_projects_taluka ON pune_projects(taluka_slug);
      CREATE INDEX IF NOT EXISTS idx_pune_projects_village ON pune_projects(village_slug);
    `);

    // Ensure any previously created tables have widened TEXT columns
    try {
      await query(`
        ALTER TABLE IF EXISTS property_records 
          ALTER COLUMN record_id TYPE TEXT,
          ALTER COLUMN project_slug TYPE TEXT,
          ALTER COLUMN project_name TYPE TEXT,
          ALTER COLUMN locality TYPE TEXT,
          ALTER COLUMN city TYPE TEXT,
          ALTER COLUMN doc_no TYPE TEXT,
          ALTER COLUMN reg_date TYPE TEXT,
          ALTER COLUMN price_formatted TYPE TEXT,
          ALTER COLUMN carpet_area TYPE TEXT,
          ALTER COLUMN unit TYPE TEXT,
          ALTER COLUMN building TYPE TEXT;

        ALTER TABLE IF EXISTS kharadi_projects 
          ALTER COLUMN id TYPE TEXT,
          ALTER COLUMN name TYPE TEXT,
          ALTER COLUMN slug TYPE TEXT,
          ALTER COLUMN locality TYPE TEXT,
          ALTER COLUMN taluka TYPE TEXT,
          ALTER COLUMN city TYPE TEXT,
          ALTER COLUMN developer TYPE TEXT,
          ALTER COLUMN rera_id TYPE TEXT,
          ALTER COLUMN quoted_pricing TYPE TEXT,
          ALTER COLUMN bhks TYPE TEXT,
          ALTER COLUMN completion TYPE TEXT,
          ALTER COLUMN pin_code TYPE TEXT;

        ALTER TABLE IF EXISTS users 
          ADD COLUMN IF NOT EXISTS email TEXT,
          ADD COLUMN IF NOT EXISTS city TEXT,
          ADD COLUMN IF NOT EXISTS role TEXT;
      `);
    } catch (widenErr) {
      // Ignore if table doesn't exist yet
    }

    // Kharadi Projects & Transactions Migration Check
    const kharadiCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'kharadi_projects'
      );
    `);

    let needKharadiSeed = !kharadiCheck.rows[0]?.exists;
    if (!needKharadiSeed) {
      const countRes = await query(`SELECT COUNT(*) FROM kharadi_projects`);
      const currentCount = parseInt(countRes.rows[0]?.count || 0, 10);
      if (currentCount < 200) {
        console.log(`[DB Auto-Init] Existing kharadi_projects count (${currentCount}) is less than expected 231. Reseeding with full authentic dataset...`);
        needKharadiSeed = true;
      }
    }

    if (needKharadiSeed) {
      console.log('[DB Auto-Init] Initializing Kharadi projects & property records from data.sql...');
      const dataSqlPath = fs.existsSync(resolve(__dirname, 'data.sql'))
        ? resolve(__dirname, 'data.sql')
        : resolve(__dirname, '../data.sql');

      if (fs.existsSync(dataSqlPath)) {
        const sql = fs.readFileSync(dataSqlPath, 'utf8');
        await query(sql);
        console.log('[DB Auto-Init] Kharadi data.sql imported successfully into PostgreSQL!');
      } else {
        console.warn('[DB Auto-Init] data.sql not found at', dataSqlPath);
      }
    } else {
      console.log('[DB Auto-Init] Kharadi projects verified in PostgreSQL.');
    }
  } catch (err) {
    console.warn('[DB Auto-Init] Schema check/migration note:', err.message);
  }
}

async function runCliInit() {
  try {
    const sqlPath = resolve(__dirname, 'init-db.sql');
    console.log(`[Init DB] Reading SQL from ${sqlPath}...`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[Init DB] Executing migration script...');
    await query(sql);
    console.log('[Init DB] Database schema & default data created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Init DB] Failed to initialize database:', err);
    process.exit(1);
  }
}

// If executed directly: node init-db.js
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runCliInit();
}
