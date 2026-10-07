import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load server/.env explicitly regardless of CWD
dotenv.config({ path: resolve(__dirname, '.env') });

// ── Validate required env vars on startup ──────────────────────────────────
const required = ['PGHOST', 'PGPORT', 'PGUSER', 'PGDATABASE'];
const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.warn(`[DB] ⚠ Missing env vars: ${missing.join(', ')} — using defaults.`);
} else {
  console.log(`[DB] ✔ All PostgreSQL env vars loaded.`);
}

console.log(`[DB] Connecting to PostgreSQL:
  Host     : ${process.env.PGHOST || 'localhost'}
  Port     : ${process.env.PGPORT || 5432}
  Database : ${process.env.PGDATABASE || 'pureframe_db'}
  User     : ${process.env.PGUSER || 'postgres'}
  Password : ${process.env.PGPASSWORD ? '***set***' : '(default: postgres)'}
`);

// ── Connection Pool ────────────────────────────────────────────────────────
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'pureframe_db',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

// ── Pool Event Logs ────────────────────────────────────────────────────────
pool.on('connect', () => {
  console.log('[DB] 🔗 New client connected to PostgreSQL pool.');
});

pool.on('acquire', () => {
  // Uncomment if you want per-query verbose logs:
  // console.log('[DB] Client acquired from pool.');
});

pool.on('remove', () => {
  console.log('[DB] Client removed from pool (idle timeout or error).');
});

pool.on('error', (err) => {
  console.error('[DB] ❌ Unexpected error on idle PostgreSQL client:', err.message);
});

// ── Test connection on startup ─────────────────────────────────────────────
pool.connect((err, client, release) => {
  if (err) {
    console.error('[DB] ❌ Failed to connect to PostgreSQL on startup:', err.message);
    console.error('[DB]    Check that PostgreSQL is running and credentials in server/.env are correct.');
  } else {
    console.log('[DB] ✅ PostgreSQL connection verified successfully.');
    release();
  }
});

// ── Query Helper with Logging ──────────────────────────────────────────────
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[DB] ⚠ Slow query (${duration}ms): ${text.substring(0, 80)}...`);
    }
    return result;
  } catch (err) {
    console.error(`[DB] ❌ Query error after ${Date.now() - start}ms`);
    console.error(`[DB]    Query: ${text.substring(0, 120)}`);
    console.error(`[DB]    Error: ${err.message}`);
    throw err;
  }
};

export default pool;
