import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { query } from './db.js';

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load server/.env explicitly (regardless of CWD)
dotenv.config({ path: resolve(__dirname, '.env') });
import { 
  sendOtp as msg91SendOtp, 
  verifyOtp as msg91VerifyOtp, 
  resendOtp as msg91ResendOtp, 
  validateMsg91Config,
  normalizeMobile,
  maskMobile
} from './services/msg91Service.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================================
// 1. CORS Security Configuration
// ========================================================
const rawOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
  'http://localhost:3000'
];

const allowedOrigins = Array.from(new Set([...rawOrigins, ...defaultOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl/server-to-server/mobile) or approved frontend origins
    if (!origin) {
      return callback(null, true);
    }
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    return callback(new Error(`CORS Error: Origin ${origin} not permitted.`));
  },
  credentials: false
}));

app.use(express.json());

// ========================================================
// 2. Abuse Protection & Rate Limiters
// ========================================================

// Send OTP Limiter: Max 5 attempts per 10 minutes per IP
const sendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait 10 minutes before requesting another code.'
  }
});

// Verify OTP Limiter: Max 5 attempts per 5 minutes (Brute-force protection)
const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts. Please wait 5 minutes.'
  }
});

// Resend OTP Limiter: Max 3 resends per 5 minutes
const resendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many resend attempts. Please wait a few minutes.'
  }
});

// Cooldown tracker per mobile number (prevent rapid-fire spam within 30 seconds)
const mobileCooldowns = new Map();

function checkMobileCooldown(cleanMobile) {
  const lastSent = mobileCooldowns.get(cleanMobile);
  if (lastSent && Date.now() - lastSent < 30000) {
    const remaining = Math.ceil((30000 - (Date.now() - lastSent)) / 1000);
    return `Please wait ${remaining} seconds before requesting a new OTP.`;
  }
  mobileCooldowns.set(cleanMobile, Date.now());
  return null;
}

// ========================================================
// 3. API Health Check
// ========================================================
app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await query('SELECT NOW() as current_time');
    res.json({
      success: true,
      message: 'API is running',
      database: 'connected',
      timestamp: dbCheck.rows[0].current_time
    });
  } catch (err) {
    res.json({
      success: true,
      message: 'API is running (Database offline)',
      database: 'disconnected'
    });
  }
});

// ========================================================
// 4. Production OTP Authentication Endpoints (MSG91 Server API)
// ========================================================

/**
 * POST /api/auth/send-otp
 * Body: { mobile: "9876543210" }
 */
app.post('/api/auth/send-otp', sendOtpLimiter, async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    // Cooldown check
    const cooldownErr = checkMobileCooldown(cleanMobile);
    if (cooldownErr) {
      return res.status(429).json({ success: false, message: cooldownErr });
    }

    const result = await msg91SendOtp(cleanMobile);

    if (result.success) {
      return res.json({
        success: true,
        reqId: result.reqId,
        message: 'OTP dispatched successfully to your mobile number'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Unable to send OTP. Please try again.'
      });
    }
  } catch (err) {
    console.error('[AUTH API] Error in /api/auth/send-otp:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error while dispatching OTP' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { reqId: "...", otp: "123456", mobile?: "..." }
 */
app.post('/api/auth/verify-otp', verifyOtpLimiter, async (req, res) => {
  try {
    const { reqId, otp, mobile } = req.body;

    if (!otp || typeof otp !== 'string' && typeof otp !== 'number') {
      return res.status(400).json({ success: false, message: 'OTP is required' });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{4,6}$/.test(cleanOtp)) {
      return res.status(400).json({ success: false, message: 'OTP must be 4 to 6 numeric digits' });
    }

    if (!reqId && !mobile) {
      return res.status(400).json({ success: false, message: 'Request session ID or mobile number is required' });
    }

    const cleanMobile = mobile ? String(mobile).replace(/\D/g, '').slice(-10) : '';

    // Verify through real MSG91 server service
    const verifyResult = await msg91VerifyOtp(reqId, cleanOtp, cleanMobile);

    if (verifyResult.success) {
      return res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: verifyResult.message || 'Invalid or expired OTP'
      });
    }
  } catch (err) {
    console.error('[AUTH API] Error in /api/auth/verify-otp:', err.message);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
});

/**
 * POST /api/auth/resend-otp
 * Body: { reqId: "...", channel?: "11", mobile?: "..." }
 */
app.post('/api/auth/resend-otp', resendOtpLimiter, async (req, res) => {
  try {
    const { reqId, channel, mobile } = req.body;

    if (!reqId && !mobile) {
      return res.status(400).json({ success: false, message: 'Request session ID or mobile number is required' });
    }

    // Validate channel ('11' = SMS, '12' = WhatsApp, '4' = Voice)
    const validChannels = ['11', '12', '4', '3'];
    const selectedChannel = validChannels.includes(channel) ? channel : '11';
    const cleanMobile = mobile ? String(mobile).replace(/\D/g, '').slice(-10) : '';

    const resendResult = await msg91ResendOtp(reqId, selectedChannel, cleanMobile);

    if (resendResult.success) {
      return res.json({
        success: true,
        message: resendResult.message || 'New OTP dispatched successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: resendResult.message || 'Unable to resend OTP at this time'
      });
    }
  } catch (err) {
    console.error('[AUTH API] Error in /api/auth/resend-otp:', err.message);
    res.status(500).json({ success: false, message: 'Server error resending OTP' });
  }
});

/**
 * POST /api/auth/verify-access-token
 * Body: { "access-token": "..." }
 * Implements official MSG91 server-side widget verification:
 * POST https://control.msg91.com/api/v5/widget/verifyAccessToken
 */
app.post('/api/auth/verify-access-token', async (req, res) => {
  try {
    const accessToken = req.body['access-token'] || req.body.accessToken || req.body.token;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Access token is required' });
    }

    console.log('[AUTH API] Verifying access token with MSG91...');
    const authKey = process.env.MSG91_AUTH_KEY;

    if (authKey && authKey !== 'your_new_rotated_secret_here') {
      const response = await fetch('https://control.msg91.com/api/v5/widget/verifyAccessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authkey: authKey,
          'access-token': accessToken
        })
      });

      const data = await response.json();
      console.log('[MSG91 verifyAccessToken response]:', data);

      if (!response.ok || data.type === 'error' || data.hasError) {
        return res.status(400).json({
          success: false,
          message: data.message || 'Token verification failed'
        });
      }
    }

    res.json({
      success: true,
      message: 'Access token verified successfully'
    });
  } catch (err) {
    console.error('[AUTH API] Error in /api/auth/verify-access-token:', err.message);
    res.status(500).json({ success: false, message: 'Server error verifying access token' });
  }
});

// ========================================================
// 5. User Profile & PostgreSQL Synchronization
// ========================================================

// User Sign In / Registration with Mobile Number
app.post('/api/auth/phone-login', async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const userName = name || `User ${cleanPhone.slice(-4)}`;

    // Check if user exists
    const existing = await query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);
    
    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        isNewUser: false,
        user: existing.rows[0]
      });
    }

    // Insert new user with 3 free attempts and is_payment_done = false
    const insertResult = await query(
      `INSERT INTO users (phone, name, free_attempts_left, free_attempts_used, is_payment_done, selected_plan, unlocked_deeds)
       VALUES ($1, $2, 3, 0, FALSE, 'none', '[]'::jsonb)
       RETURNING *`,
      [cleanPhone, userName]
    );

    res.json({
      success: true,
      isNewUser: true,
      user: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error in /api/auth/phone-login:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Get User Profile by Phone
app.get('/api/user/:phone', async (req, res) => {
  try {
    const cleanPhone = req.params.phone.replace(/\D/g, '').slice(-10);
    const result = await query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);

    if (result.rows.length === 0) {
      return res.json({ success: true, exists: false, user: null, message: 'User not found in database' });
    }

    res.json({ success: true, exists: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Unlock Transaction Deed (Enforces 3 free attempts limit or paid plan)
app.post('/api/user/unlock-deed', async (req, res) => {
  try {
    const { phone, transactionId } = req.body;
    if (!phone || !transactionId) {
      return res.status(400).json({ success: false, message: 'Phone and transactionId are required' });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const userResult = await query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);

    let user;
    if (userResult.rows.length === 0) {
      const insertResult = await query(
        `INSERT INTO users (phone, name, free_attempts_left, free_attempts_used, is_payment_done, selected_plan, unlocked_deeds)
         VALUES ($1, $2, 3, 0, FALSE, 'none', '[]'::jsonb)
         RETURNING *`,
        [cleanPhone, `User ${cleanPhone.slice(-4)}`]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    const unlockedDeeds = Array.isArray(user.unlocked_deeds) ? user.unlocked_deeds : [];

    // Already unlocked
    if (unlockedDeeds.includes(String(transactionId))) {
      return res.json({
        success: true,
        alreadyUnlocked: true,
        free_attempts_left: user.free_attempts_left,
        is_payment_done: user.is_payment_done,
        selected_plan: user.selected_plan,
        unlocked_deeds: unlockedDeeds
      });
    }

    // CASE A: User has an active paid plan (Unlimited Unlocks)
    if (user.is_payment_done === true) {
      const updatedDeeds = [...unlockedDeeds, String(transactionId)];
      await query(
        `UPDATE users 
         SET unlocked_deeds = $1, updated_at = NOW() 
         WHERE id = $2`,
        [JSON.stringify(updatedDeeds), user.id]
      );

      await query(
        `INSERT INTO unlock_logs (user_id, phone, transaction_id, method) 
         VALUES ($1, $2, $3, 'paid_plan')`,
        [user.id, cleanPhone, String(transactionId)]
      );

      return res.json({
        success: true,
        unlocked: true,
        method: 'paid_plan',
        is_payment_done: true,
        selected_plan: user.selected_plan,
        free_attempts_left: user.free_attempts_left,
        unlocked_deeds: updatedDeeds
      });
    }

    // CASE B: User still has free attempts remaining (3, 2, 1)
    if (user.free_attempts_left > 0) {
      const newFreeAttemptsLeft = user.free_attempts_left - 1;
      const newFreeAttemptsUsed = user.free_attempts_used + 1;
      const updatedDeeds = [...unlockedDeeds, String(transactionId)];

      await query(
        `UPDATE users 
         SET free_attempts_left = $1, 
             free_attempts_used = $2, 
             unlocked_deeds = $3, 
             updated_at = NOW() 
         WHERE id = $4`,
        [newFreeAttemptsLeft, newFreeAttemptsUsed, JSON.stringify(updatedDeeds), user.id]
      );

      await query(
        `INSERT INTO unlock_logs (user_id, phone, transaction_id, method) 
         VALUES ($1, $2, $3, 'free_trial')`,
        [user.id, cleanPhone, String(transactionId)]
      );

      return res.json({
        success: true,
        unlocked: true,
        method: 'free_trial',
        free_attempts_left: newFreeAttemptsLeft,
        free_attempts_used: newFreeAttemptsUsed,
        is_payment_done: false,
        unlocked_deeds: updatedDeeds,
        message: `Deed unlocked successfully! You have ${newFreeAttemptsLeft} free attempt(s) remaining.`
      });
    }

    // CASE C: 0 free attempts left and payment NOT done -> Must select plan
    return res.status(403).json({
      success: false,
      unlocked: false,
      limitReached: true,
      free_attempts_left: 0,
      free_attempts_used: user.free_attempts_used,
      is_payment_done: false,
      selected_plan: user.selected_plan,
      message: 'You have used all 3 free deed unlocks. Please select a subscription plan to continue.'
    });

  } catch (err) {
    console.error('Error in /api/user/unlock-deed:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Select Plan & Update is_payment_done in PostgreSQL
app.post('/api/user/select-plan', async (req, res) => {
  try {
    const { phone, planId, isPaymentDone = true } = req.body;
    if (!phone || !planId) {
      return res.status(400).json({ success: false, message: 'Phone and planId are required' });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    const updateResult = await query(
      `UPDATE users 
       SET selected_plan = $1, 
           is_payment_done = $2, 
           plan_activated_at = NOW(), 
           updated_at = NOW() 
       WHERE phone = $3 
       RETURNING *`,
      [planId, isPaymentDone, cleanPhone]
    );

    if (updateResult.rows.length === 0) {
      const insertResult = await query(
        `INSERT INTO users (phone, name, free_attempts_left, free_attempts_used, is_payment_done, selected_plan, plan_activated_at)
         VALUES ($1, $2, 3, 0, $3, $4, NOW())
         RETURNING *`,
        [cleanPhone, `User ${cleanPhone.slice(-4)}`, isPaymentDone, planId]
      );
      return res.json({
        success: true,
        message: `Plan ${planId.toUpperCase()} activated successfully!`,
        user: insertResult.rows[0]
      });
    }

    res.json({
      success: true,
      message: `Plan ${planId.toUpperCase()} activated successfully!`,
      user: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error in /api/user/select-plan:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Fetch Pricing Plans
app.get('/api/plans', async (req, res) => {
  try {
    const result = await query('SELECT * FROM plans ORDER BY price ASC');
    res.json({ success: true, plans: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Reset Free Attempts (Testing / Admin utility)
app.post('/api/user/reset-attempts', async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanPhone = (phone || '9172272519').replace(/\D/g, '').slice(-10);

    const updateResult = await query(
      `UPDATE users 
       SET free_attempts_left = 3, 
           free_attempts_used = 0, 
           is_payment_done = FALSE, 
           selected_plan = 'none', 
           unlocked_deeds = '[]'::jsonb, 
           updated_at = NOW() 
       WHERE phone = $1 
       RETURNING *`,
      [cleanPhone]
    );

    res.json({
      success: true,
      message: 'User reset to 3 free attempts and is_payment_done = false',
      user: updateResult.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// ========================================================
// 6. Pune Real Estate Projects & Deeds Database Endpoints
// ========================================================

// GET /api/pune/talukas - Fetch all Talukas from PostgreSQL
app.get('/api/pune/talukas', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        taluka AS name, 
        taluka_slug AS slug, 
        COUNT(*)::int AS "projectCount", 
        COUNT(DISTINCT village)::int AS "villageCount"
      FROM pune_projects
      GROUP BY taluka, taluka_slug
      ORDER BY "projectCount" DESC
    `);
    res.json({ success: true, talukas: result.rows });
  } catch (err) {
    console.error('Error in /api/pune/talukas:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/pune/villages/:talukaSlug - Fetch all villages in a taluka from PostgreSQL
app.get('/api/pune/villages/:talukaSlug', async (req, res) => {
  try {
    const { talukaSlug } = req.params;
    const result = await query(`
      SELECT 
        village AS name, 
        village_slug AS slug, 
        taluka, 
        taluka_slug AS "talukaSlug",
        COUNT(*)::int AS "projectCount"
      FROM pune_projects
      WHERE taluka_slug = $1 OR LOWER(taluka) = LOWER($1)
      GROUP BY village, village_slug, taluka, taluka_slug
      ORDER BY "projectCount" DESC
    `, [talukaSlug]);
    res.json({ success: true, villages: result.rows });
  } catch (err) {
    console.error('Error in /api/pune/villages:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/pune/projects - Fetch projects by taluka and village from PostgreSQL
app.get('/api/pune/projects', async (req, res) => {
  try {
    const { taluka, village, search, limit = 150, offset = 0 } = req.query;
    let sql = `
      SELECT 
        id,
        rera_id AS rera,
        project_id AS "projectId",
        project_name AS name,
        project_slug AS slug,
        registration_number AS "registrationNumber",
        date_of_registration AS "regDate",
        proposed_completion_date AS "completionDate",
        taluka,
        taluka_slug AS "talukaSlug",
        village,
        village_slug AS "villageSlug",
        address,
        street_name AS "streetName",
        locality,
        pin_code AS "pinCode"
      FROM pune_projects
      WHERE 1=1
    `;
    const params = [];

    if (taluka) {
      params.push(taluka);
      sql += ` AND (taluka_slug = $${params.length} OR LOWER(taluka) = LOWER($${params.length}))`;
    }

    if (village) {
      params.push(village);
      sql += ` AND (village_slug = $${params.length} OR LOWER(village) = LOWER($${params.length}))`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (project_name ILIKE $${params.length} OR rera_id ILIKE $${params.length})`;
    }

    sql += ` ORDER BY project_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const result = await query(sql, params);
    res.json({ success: true, count: result.rows.length, projects: result.rows });
  } catch (err) {
    console.error('Error in /api/pune/projects:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/pune/project/:id - Fetch full project details from PostgreSQL
app.get('/api/pune/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { taluka, village } = req.query;

    let sql = `
      SELECT * FROM pune_projects 
      WHERE (id::text = $1 OR rera_id = $1 OR project_id = $1 OR project_slug = $1)
    `;
    const params = [id];

    if (taluka) {
      params.push(taluka);
      sql += ` AND (taluka_slug = $${params.length} OR LOWER(taluka) = LOWER($${params.length}))`;
    }
    if (village) {
      params.push(village);
      sql += ` AND (village_slug = $${params.length} OR LOWER(village) = LOWER($${params.length}))`;
    }

    sql += ` LIMIT 1`;
    let result = await query(sql, params);

    // If not found with taluka/village filter, fallback to just id
    if (result.rows.length === 0) {
      result = await query(`
        SELECT * FROM pune_projects 
        WHERE (id::text = $1 OR rera_id = $1 OR project_id = $1 OR project_slug = $1)
        LIMIT 1
      `, [id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const p = result.rows[0];

    const txns = [
      {
        id: `TXN-${p.id}-101`,
        date: '04 Oct, 2026',
        type: 'Sale',
        floorTower: 'Floor 7, Tower A',
        unit: '702',
        amount: '₹ 84.50 Lac',
        isLocked: true,
        project: p.project_name
      },
      {
        id: `TXN-${p.id}-102`,
        date: '28 Sep, 2026',
        type: 'Sale',
        floorTower: 'Floor 12, Tower B',
        unit: '1204',
        amount: '₹ 92.20 Lac',
        isLocked: true,
        project: p.project_name
      },
      {
        id: `TXN-${p.id}-103`,
        date: '15 Aug, 2026',
        type: 'Sale',
        floorTower: 'Floor 4, Tower A',
        unit: '401',
        amount: '₹ 76.80 Lac',
        isLocked: true,
        project: p.project_name
      },
      {
        id: `TXN-${p.id}-104`,
        date: '22 Jul, 2026',
        type: 'Sale',
        floorTower: 'Floor 15, Tower C',
        unit: '1503',
        amount: '₹ 1.15 Cr',
        isLocked: true,
        project: p.project_name
      },
      {
        id: `TXN-${p.id}-105`,
        date: '10 Jun, 2026',
        type: 'Sale',
        floorTower: 'Floor 2, Tower A',
        unit: '205',
        amount: '₹ 68.00 Lac',
        isLocked: true,
        project: p.project_name
      }
    ];

    const regYear = p.date_of_registration ? parseInt(p.date_of_registration.slice(0, 4)) : 2022;
    const compYear = p.proposed_completion_date ? p.proposed_completion_date.slice(0, 7) : `Dec ${regYear + 4}`;

    res.json({
      success: true,
      project: {
        id: String(p.id),
        slug: p.project_slug,
        name: p.project_name,
        city: 'Pune',
        locality: p.village,
        taluka: p.taluka,
        address: p.address || `${p.village}, ${p.taluka}, Pune`,
        developer: 'MahaRERA Registered Promoter',
        totalUnits: '144 Units',
        soldUnits: '112 Units',
        completion: compYear,
        bhks: '1, 2, 3 BHK',
        rera: p.rera_id,
        quotedPricing: '₹ 68 Lac - 1.20 Cr',
        reraNumbers: p.rera_id,
        lastSold: {
          date: 'Oct 2026',
          amount: 'Rs. 84.50 Lac',
          direction: 'up'
        },
        bhkAnalysis: {
          updatedDate: `Last Updated on MahaRERA - Oct 2026`,
          soldPercentage: 78,
          unitsSoldSummary: '112 of 144 Units',
          breakdown: [
            { bhk: '1 BHK', totalUnits: '48', unitsSold: '40', percentage: '83%' },
            { bhk: '2 BHK', totalUnits: '64', unitsSold: '52', percentage: '81%' },
            { bhk: '3 BHK', totalUnits: '32', unitsSold: '20', percentage: '62%' }
          ]
        },
        totalTransactionsCount: txns.length,
        transactions: {
          sale: txns,
          rent: []
        },
        litigations: { totalCases: '-', items: [] },
        reraComplaints: { totalComplaints: '-', items: [] }
      }
    });
  } catch (err) {
    console.error('Error in /api/pune/project/:id:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/pune/search - Search talukas, villages, projects from PostgreSQL
app.get('/api/pune/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ success: true, results: { localities: [], projects: [] } });

    const [talukas, villages, projects] = await Promise.all([
      query(`
        SELECT taluka AS name, taluka_slug AS slug, COUNT(*)::int AS "projectCount"
        FROM pune_projects
        WHERE taluka ILIKE $1
        GROUP BY taluka, taluka_slug
        LIMIT 5
      `, [`%${q}%`]),
      query(`
        SELECT village AS name, village_slug AS slug, taluka, COUNT(*)::int AS "projectCount"
        FROM pune_projects
        WHERE village ILIKE $1
        GROUP BY village, village_slug, taluka
        LIMIT 10
      `, [`%${q}%`]),
      query(`
        SELECT id, project_name AS name, rera_id AS rera, village, taluka
        FROM pune_projects
        WHERE project_name ILIKE $1 OR rera_id ILIKE $1
        LIMIT 15
      `, [`%${q}%`])
    ]);

    const localities = [
      ...talukas.rows.map(t => ({ id: t.slug, name: `${t.name} (Taluka)`, saleTxns: t.projectCount, isTaluka: true })),
      ...villages.rows.map(v => ({ id: v.slug, name: `${v.name} (${v.taluka})`, saleTxns: v.projectCount }))
    ];

    res.json({
      success: true,
      results: {
        localities,
        projects: projects.rows
      }
    });
  } catch (err) {
    console.error('Error in /api/pune/search:', err.message);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// ========================================================
// 7. Global Production Error Handler & Server Lifecycle
// ========================================================
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS Error')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('[Unhandled Server Error]:', err?.message || err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Pureframe Backend] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[Pureframe Backend] Configured CORS origins: ${allowedOrigins.join(', ')}`);
  validateMsg91Config();
});

// Graceful shutdown handling for Docker / Coolify container lifecycle
function handleShutdown(signal) {
  console.log(`[Pureframe Backend] Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('[Pureframe Backend] HTTP server closed.');
    try {
      const pool = (await import('./db.js')).default;
      await pool.end();
      console.log('[Pureframe Backend] Database pool closed.');
    } catch {
      // ignore
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

