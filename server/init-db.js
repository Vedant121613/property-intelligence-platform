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
