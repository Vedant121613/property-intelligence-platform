/**
 * Pureframe Database Service
 * 
 * Communicates with the local PostgreSQL Express backend (http://localhost:5000/api)
 * Stores & tracks user mobile number, name, 3 free attempts, payment status, and selected plan.
 */

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${API_ROOT}/api`;

/**
 * Fetch user profile from PostgreSQL
 */
export async function getDbUser(phone) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone) return null;
  try {
    const res = await fetch(`${API_BASE}/user/${cleanPhone}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.exists ? data.user : null;
  } catch (err) {
    return null;
  }
}

/**
 * Login or create user in PostgreSQL
 */
export async function dbPhoneLogin(phone, name) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  try {
    const res = await fetch(`${API_BASE}/auth/phone-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, name })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    return data.user;
  } catch (err) {
    console.warn('Backend login error:', err);
    // Graceful fallback
    return {
      phone: cleanPhone,
      name: name || `User ${cleanPhone.slice(-4)}`,
      free_attempts_left: 3,
      free_attempts_used: 0,
      is_payment_done: false,
      selected_plan: 'none',
      unlocked_deeds: []
    };
  }
}

/**
 * Attempt to unlock a deed - enforces 3 free attempts limit or paid plan in PostgreSQL
 */
export async function dbUnlockDeed(phone, transactionId) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  try {
    const res = await fetch(`${API_BASE}/user/unlock-deed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, transactionId })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('dbUnlockDeed network error:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Select a subscription plan and record payment done in PostgreSQL
 */
export async function dbSelectPlan(phone, planId) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  try {
    const res = await fetch(`${API_BASE}/user/select-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, planId, isPaymentDone: true })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Plan activation failed');
    return data;
  } catch (err) {
    console.error('dbSelectPlan error:', err);
    throw err;
  }
}

/**
 * Get available plans from database
 */
export async function dbGetPlans() {
  try {
    const res = await fetch(`${API_BASE}/plans`);
    const data = await res.json();
    if (data.success && data.plans) return data.plans;
    return [];
  } catch (err) {
    console.warn('Failed to load plans from DB:', err);
    return [];
  }
}

/**
 * Reset free attempts for testing
 */
export async function dbResetAttempts(phone) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  try {
    const res = await fetch(`${API_BASE}/user/reset-attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to reset attempts:', err);
    return null;
  }
}
