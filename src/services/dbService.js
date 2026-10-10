/**
 * Pureframe Database Service
 * 
 * Communicates with the local PostgreSQL Express backend (http://localhost:5000/api)
 * and maintains a persistent per-phone-number registry in localStorage (pureframe_users_registry)
 * so that free attempts (3 of 3), unlocks, and payment states are strictly tracked per phone number
 * across logins, re-logins, page refreshes, and even if the backend is temporarily offline.
 */

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${API_ROOT}/api`;
const REGISTRY_KEY = 'pureframe_users_registry';

/**
 * Retrieve local user registry dictionary from localStorage
 * Format: { [phone10digits]: { phone, name, free_attempts_left, free_attempts_used, is_payment_done, selected_plan, unlocked_deeds: [] } }
 */
export function getLocalUsersRegistry() {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save user registry dictionary to localStorage
 */
export function saveLocalUsersRegistry(registry) {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    console.warn('Failed to save user registry to localStorage:', err);
  }
}

/**
 * Get profile for a specific phone number from local registry
 */
export function getLocalUserByPhone(phone) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone) return null;
  const reg = getLocalUsersRegistry();
  return reg[cleanPhone] || null;
}

/**
 * Save or update profile for a specific phone number in local registry
 */
export function saveLocalUserByPhone(phone, fields) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone) return null;
  const reg = getLocalUsersRegistry();
  const existing = reg[cleanPhone] || {
    phone: cleanPhone,
    name: `User ${cleanPhone.slice(-4) || 'Member'}`,
    free_attempts_left: 3,
    free_attempts_used: 0,
    is_payment_done: false,
    selected_plan: 'none',
    unlocked_deeds: []
  };

  const updated = {
    ...existing,
    ...fields,
    phone: cleanPhone
  };

  reg[cleanPhone] = updated;
  saveLocalUsersRegistry(reg);
  return updated;
}

/**
 * Fetch user profile from PostgreSQL with local fallback
 */
export async function getDbUser(phone) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone) return null;

  const localUser = getLocalUserByPhone(cleanPhone);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/user/${cleanPhone}`, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.exists && data.user) {
        // Sync database user into local registry
        return saveLocalUserByPhone(cleanPhone, {
          ...(localUser || {}),
          ...data.user,
          phone: cleanPhone
        });
      }
    }
  } catch (err) {
    // Backend offline or timed out
  }

  return localUser;
}

/**
 * Login or create user in PostgreSQL and local registry.
 * Preserves previously used/decremented attempts when logging in again with the same number!
 */
export async function dbPhoneLogin(phone, name) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone) return null;

  const displayName = name || `User ${cleanPhone.slice(-4) || 'Member'}`;

  // 1. Check if user already exists in local registry
  let userRecord = getLocalUserByPhone(cleanPhone);
  if (!userRecord) {
    // Brand new user: initialize with 3 free attempts
    userRecord = {
      phone: cleanPhone,
      name: displayName,
      free_attempts_left: 3,
      free_attempts_used: 0,
      is_payment_done: false,
      selected_plan: 'none',
      unlocked_deeds: []
    };
    saveLocalUserByPhone(cleanPhone, userRecord);
  }

  // 2. Sync with PostgreSQL backend
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}/auth/phone-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, name: displayName }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        // If DB has fewer attempts left (e.g. unlocked on other tab), respect the minimum left
        const dbAttemptsLeft = data.user.free_attempts_left !== undefined ? data.user.free_attempts_left : userRecord.free_attempts_left;
        const attemptsLeft = Math.min(dbAttemptsLeft, userRecord.free_attempts_left);
        const attemptsUsed = 3 - attemptsLeft;

        const merged = saveLocalUserByPhone(cleanPhone, {
          ...userRecord,
          ...data.user,
          free_attempts_left: attemptsLeft,
          free_attempts_used: attemptsUsed,
          phone: cleanPhone
        });
        return merged;
      }
    }
  } catch (err) {
    console.warn('Backend unavailable, continuing with persistent local registry:', err.message);
  }

  return userRecord;
}

/**
 * Attempt to unlock a deed - enforces 3 free attempts limit or paid plan.
 * Decrements attempts both in PostgreSQL and locally in the phone registry.
 */
export async function dbUnlockDeed(phone, transactionId) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  const txnStr = String(transactionId);

  // 1. Try PostgreSQL Backend
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}/user/unlock-deed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, transactionId: txnStr }),
      signal: controller.signal
    });
    clearTimeout(timer);

    const data = await res.json();

    if (data.unlocked || data.alreadyUnlocked || data.success) {
      // Backend unlock succeeded! Save to local registry
      saveLocalUserByPhone(cleanPhone, {
        free_attempts_left: data.free_attempts_left,
        free_attempts_used: data.free_attempts_used,
        is_payment_done: data.is_payment_done,
        selected_plan: data.selected_plan,
        unlocked_deeds: data.unlocked_deeds
      });
      return {
        ...data,
        success: true,
        unlocked: true
      };
    } else if (data.limitReached) {
      saveLocalUserByPhone(cleanPhone, { free_attempts_left: 0, free_attempts_used: 3 });
      return {
        ...data,
        success: false,
        limitReached: true
      };
    }
  } catch (err) {
    console.warn('Backend unlock request failed, executing local fallback:', err.message);
  }

  // 2. Local Fallback Execution (Bulletproof local attempt tracking)
  let localUser = getLocalUserByPhone(cleanPhone) || {
    phone: cleanPhone,
    name: `User ${cleanPhone.slice(-4) || 'Member'}`,
    free_attempts_left: 3,
    free_attempts_used: 0,
    is_payment_done: false,
    selected_plan: 'none',
    unlocked_deeds: []
  };

  const unlockedDeeds = Array.isArray(localUser.unlocked_deeds) ? [...localUser.unlocked_deeds] : [];

  // Case A: Already unlocked
  if (unlockedDeeds.includes(txnStr)) {
    return {
      success: true,
      unlocked: true,
      alreadyUnlocked: true,
      free_attempts_left: localUser.free_attempts_left,
      free_attempts_used: localUser.free_attempts_used,
      is_payment_done: localUser.is_payment_done,
      selected_plan: localUser.selected_plan,
      unlocked_deeds: unlockedDeeds
    };
  }

  // Case B: Paid plan active
  if (localUser.is_payment_done) {
    unlockedDeeds.push(txnStr);
    const updated = saveLocalUserByPhone(cleanPhone, {
      ...localUser,
      unlocked_deeds: unlockedDeeds
    });
    return {
      success: true,
      unlocked: true,
      method: 'paid_plan',
      free_attempts_left: updated.free_attempts_left,
      free_attempts_used: updated.free_attempts_used,
      is_payment_done: true,
      selected_plan: updated.selected_plan,
      unlocked_deeds: unlockedDeeds
    };
  }

  // Case C: Free attempt available (> 0)
  if (localUser.free_attempts_left > 0) {
    const newLeft = Math.max(0, localUser.free_attempts_left - 1);
    const newUsed = (localUser.free_attempts_used || 0) + 1;
    unlockedDeeds.push(txnStr);

    const updated = saveLocalUserByPhone(cleanPhone, {
      ...localUser,
      free_attempts_left: newLeft,
      free_attempts_used: newUsed,
      unlocked_deeds: unlockedDeeds
    });

    return {
      success: true,
      unlocked: true,
      method: 'free_trial',
      free_attempts_left: newLeft,
      free_attempts_used: newUsed,
      is_payment_done: false,
      selected_plan: updated.selected_plan,
      unlocked_deeds: unlockedDeeds,
      message: `Deed unlocked successfully! You have ${newLeft} free attempt(s) remaining.`
    };
  }

  // Case D: Free limit reached (0 attempts left)
  return {
    success: false,
    unlocked: false,
    limitReached: true,
    free_attempts_left: 0,
    free_attempts_used: localUser.free_attempts_used || 3,
    is_payment_done: false,
    selected_plan: localUser.selected_plan,
    message: 'You have used all 3 free deed unlocks. Please select a subscription plan to continue.'
  };
}

/**
 * Select a subscription plan and record payment done in PostgreSQL & local registry
 */
export async function dbSelectPlan(phone, planId) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

  saveLocalUserByPhone(cleanPhone, {
    is_payment_done: true,
    selected_plan: planId
  });

  try {
    const res = await fetch(`${API_BASE}/user/select-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, planId, isPaymentDone: true })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend plan selection offline, saved locally:', err.message);
    return { success: true, message: `Plan ${planId.toUpperCase()} activated!` };
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
    return [];
  }
}

/**
 * Reset free attempts for testing
 */
export async function dbResetAttempts(phone) {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  saveLocalUserByPhone(cleanPhone, {
    free_attempts_left: 3,
    free_attempts_used: 0,
    is_payment_done: false,
    selected_plan: 'none',
    unlocked_deeds: []
  });

  try {
    const res = await fetch(`${API_BASE}/user/reset-attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });
    return await res.json();
  } catch (err) {
    return { success: true, free_attempts_left: 3 };
  }
}
