import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getDbUser, 
  dbPhoneLogin, 
  dbUnlockDeed, 
  dbSelectPlan, 
  dbResetAttempts,
  getLocalUserByPhone,
  saveLocalUserByPhone
} from '../services/dbService';

const AuthContext = createContext(null);

const DEFAULT_UNLOCKED = [];
const DEFAULT_SAVED = ['heera-solitaire'];
const DEFAULT_ORDERS = [];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name === 'Vedant Sharma' || parsed?.id === 'usr_8921') {
          localStorage.removeItem('pureframe_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [freeAttemptsLeft, setFreeAttemptsLeft] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_free_attempts');
      return saved !== null ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [freeAttemptsUsed, setFreeAttemptsUsed] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_attempts_used');
      return saved !== null ? parseInt(saved, 10) : (user?.free_attempts_used ?? 0);
    } catch {
      return 0;
    }
  });

  const [isPaymentDone, setIsPaymentDone] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_is_paid');
      return saved !== null ? JSON.parse(saved) : (user?.is_payment_done ?? false);
    } catch {
      return false;
    }
  });

  const [selectedPlan, setSelectedPlan] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_selected_plan');
      return saved ? saved : (user?.selected_plan ?? 'none');
    } catch {
      return 'none';
    }
  });

  const [unlockedTxns, setUnlockedTxns] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_unlocked_txns');
      return saved ? JSON.parse(saved) : DEFAULT_UNLOCKED;
    } catch {
      return DEFAULT_UNLOCKED;
    }
  });

  const [savedProperties, setSavedProperties] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_saved_props');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED;
    } catch {
      return DEFAULT_SAVED;
    }
  });

  const [agreementOrders, setAgreementOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_agreement_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('pureframe_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pureframe_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pureframe_unlocked_txns', JSON.stringify(unlockedTxns));
  }, [unlockedTxns]);

  useEffect(() => {
    localStorage.setItem('pureframe_saved_props', JSON.stringify(savedProperties));
  }, [savedProperties]);

  useEffect(() => {
    localStorage.setItem('pureframe_agreement_orders', JSON.stringify(agreementOrders));
  }, [agreementOrders]);

  // Synchronize state to localStorage
  useEffect(() => {
    localStorage.setItem('pureframe_free_attempts', String(freeAttemptsLeft));
  }, [freeAttemptsLeft]);

  useEffect(() => {
    localStorage.setItem('pureframe_attempts_used', String(freeAttemptsUsed));
  }, [freeAttemptsUsed]);

  useEffect(() => {
    localStorage.setItem('pureframe_is_paid', JSON.stringify(isPaymentDone));
  }, [isPaymentDone]);

  useEffect(() => {
    localStorage.setItem('pureframe_selected_plan', selectedPlan);
  }, [selectedPlan]);

  // Synchronize user from PostgreSQL and local registry on startup
  useEffect(() => {
    if (user?.rawPhone || user?.phone) {
      const phone = (user.rawPhone || user.phone || '').replace(/\D/g, '').slice(-10);
      const local = getLocalUserByPhone(phone);
      if (local) {
        if (local.free_attempts_left !== undefined) setFreeAttemptsLeft(local.free_attempts_left);
        if (local.free_attempts_used !== undefined) setFreeAttemptsUsed(local.free_attempts_used);
        if (local.is_payment_done !== undefined) setIsPaymentDone(Boolean(local.is_payment_done));
        if (local.selected_plan) setSelectedPlan(local.selected_plan);
        if (Array.isArray(local.unlocked_deeds)) setUnlockedTxns(local.unlocked_deeds);
      }
      getDbUser(phone).then(dbU => {
        if (dbU) {
          if (dbU.free_attempts_left !== undefined) setFreeAttemptsLeft(dbU.free_attempts_left);
          if (dbU.free_attempts_used !== undefined) setFreeAttemptsUsed(dbU.free_attempts_used);
          if (dbU.is_payment_done !== undefined) setIsPaymentDone(Boolean(dbU.is_payment_done));
          if (dbU.selected_plan) setSelectedPlan(dbU.selected_plan);
          if (Array.isArray(dbU.unlocked_deeds)) setUnlockedTxns(dbU.unlocked_deeds);
        }
      }).catch(() => {});
    }
  }, []);

  const login = (emailOrPhone, password) => {
    const isEmail = (emailOrPhone || '').includes('@');
    const cleanPhone = !isEmail ? (emailOrPhone || '').replace(/\D/g, '').slice(-10) : '';
    const phoneToUse = cleanPhone || '9820012345';
    const formattedPhone = `+91 ${phoneToUse.slice(0, 5)} ${phoneToUse.slice(5)}`;

    // Immediately read from local per-phone registry so decremented attempts are restored!
    const local = getLocalUserByPhone(phoneToUse) || {
      phone: phoneToUse,
      name: isEmail ? emailOrPhone.split('@')[0].replace('.', ' ') : `User ${phoneToUse.slice(-4)}`,
      free_attempts_left: 3,
      free_attempts_used: 0,
      is_payment_done: false,
      selected_plan: 'none',
      unlocked_deeds: []
    };

    const formattedName = local.name || (isEmail ? emailOrPhone.split('@')[0].replace('.', ' ') : `User ${phoneToUse.slice(-4)}`);
    const initials = formattedName
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'PF';

    const newUser = {
      id: `usr_${phoneToUse}`,
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      email: isEmail ? emailOrPhone : `${phoneToUse}@pureframe.io`,
      phone: formattedPhone,
      rawPhone: phoneToUse,
      city: 'Pune',
      role: 'Home Buyer & Investor',
      avatar: initials,
      free_attempts_left: local.free_attempts_left,
      free_attempts_used: local.free_attempts_used,
      is_payment_done: local.is_payment_done,
      selected_plan: local.selected_plan,
      unlocked_deeds: local.unlocked_deeds || [],
      joinedDate: 'October 2026',
      verifiedBadge: true,
      emailNotifications: true,
      smsAlerts: true
    };

    saveLocalUserByPhone(phoneToUse, newUser);
    setUser(newUser);
    setFreeAttemptsLeft(local.free_attempts_left);
    setFreeAttemptsUsed(local.free_attempts_used);
    setIsPaymentDone(local.is_payment_done);
    setSelectedPlan(local.selected_plan);
    setUnlockedTxns(local.unlocked_deeds || []);

    // Also sync in background with PostgreSQL
    dbPhoneLogin(phoneToUse, newUser.name).then(dbU => {
      if (dbU) {
        if (dbU.free_attempts_left !== undefined) setFreeAttemptsLeft(dbU.free_attempts_left);
        if (dbU.free_attempts_used !== undefined) setFreeAttemptsUsed(dbU.free_attempts_used);
        if (dbU.is_payment_done !== undefined) setIsPaymentDone(Boolean(dbU.is_payment_done));
        if (dbU.selected_plan) setSelectedPlan(dbU.selected_plan);
        if (Array.isArray(dbU.unlocked_deeds)) setUnlockedTxns(dbU.unlocked_deeds);
      }
    }).catch(() => {});

    return newUser;
  };

  const loginWithPhoneOtp = async (phoneNumber) => {
    const cleanNumber = (phoneNumber || '').replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
    const initials = cleanNumber ? `P${cleanNumber.slice(-1)}` : 'PF';

    // 1. Immediately read existing attempts from local registry
    const local = getLocalUserByPhone(cleanNumber);
    const initialAttemptsLeft = local?.free_attempts_left !== undefined ? local.free_attempts_left : 3;
    const initialAttemptsUsed = local?.free_attempts_used !== undefined ? local.free_attempts_used : (3 - initialAttemptsLeft);
    const initialIsPaid = Boolean(local?.is_payment_done);
    const initialPlan = local?.selected_plan || 'none';
    const initialUnlocked = Array.isArray(local?.unlocked_deeds) ? local.unlocked_deeds : [];

    try {
      const dbUser = await dbPhoneLogin(cleanNumber, `User ${cleanNumber.slice(-4)}`);
      const finalLeft = dbUser.free_attempts_left !== undefined ? dbUser.free_attempts_left : initialAttemptsLeft;
      const finalUsed = dbUser.free_attempts_used !== undefined ? dbUser.free_attempts_used : initialAttemptsUsed;
      const finalPaid = dbUser.is_payment_done !== undefined ? Boolean(dbUser.is_payment_done) : initialIsPaid;
      const finalPlan = dbUser.selected_plan || initialPlan;
      const finalUnlocked = Array.isArray(dbUser.unlocked_deeds) ? dbUser.unlocked_deeds : initialUnlocked;

      const fullUser = {
        id: `usr_${dbUser.id || cleanNumber}`,
        name: dbUser.name || `User ${cleanNumber.slice(-4)}`,
        email: `${cleanNumber}@pureframe.io`,
        phone: formattedPhone,
        rawPhone: cleanNumber,
        city: 'Pune',
        role: 'Verified Property Buyer',
        avatar: initials,
        free_attempts_left: finalLeft,
        free_attempts_used: finalUsed,
        is_payment_done: finalPaid,
        selected_plan: finalPlan,
        unlocked_deeds: finalUnlocked,
        joinedDate: 'October 2026',
        verifiedBadge: true,
        emailNotifications: true,
        smsAlerts: true
      };

      setUser(fullUser);
      setFreeAttemptsLeft(finalLeft);
      setFreeAttemptsUsed(finalUsed);
      setIsPaymentDone(finalPaid);
      setSelectedPlan(finalPlan);
      setUnlockedTxns(finalUnlocked);
      return fullUser;
    } catch {
      const fallback = {
        id: `usr_${cleanNumber || Date.now()}`,
        name: `User ${cleanNumber.slice(-4) || 'Member'}`,
        email: `${cleanNumber || 'user'}@pureframe.io`,
        phone: formattedPhone,
        rawPhone: cleanNumber,
        city: 'Pune',
        role: 'Verified Property Buyer',
        avatar: initials,
        free_attempts_left: initialAttemptsLeft,
        free_attempts_used: initialAttemptsUsed,
        is_payment_done: initialIsPaid,
        selected_plan: initialPlan,
        unlocked_deeds: initialUnlocked,
        joinedDate: 'October 2026',
        verifiedBadge: true
      };
      setUser(fallback);
      setFreeAttemptsLeft(initialAttemptsLeft);
      setFreeAttemptsUsed(initialAttemptsUsed);
      setIsPaymentDone(initialIsPaid);
      setSelectedPlan(initialPlan);
      setUnlockedTxns(initialUnlocked);
      return fallback;
    }
  };

  const signup = ({ name, email, phone, city }) => {
    const cleanNumber = (phone || '').replace(/\D/g, '').slice(-10) || '9820012345';
    const formattedPhone = `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
    
    // Check local registry
    const local = getLocalUserByPhone(cleanNumber) || {
      phone: cleanNumber,
      name: name || `User ${cleanNumber.slice(-4)}`,
      free_attempts_left: 3,
      free_attempts_used: 0,
      is_payment_done: false,
      selected_plan: 'none',
      unlocked_deeds: []
    };

    const initials = (name || 'PF')
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'PF';

    const newUser = {
      id: `usr_${cleanNumber}`,
      name: name || local.name,
      email: email || `${cleanNumber}@pureframe.io`,
      phone: formattedPhone,
      rawPhone: cleanNumber,
      city: city || 'Pune',
      role: 'Verified Property Buyer',
      avatar: initials,
      free_attempts_left: local.free_attempts_left,
      free_attempts_used: local.free_attempts_used,
      is_payment_done: local.is_payment_done,
      selected_plan: local.selected_plan,
      unlocked_deeds: local.unlocked_deeds || [],
      joinedDate: 'October 2026',
      verifiedBadge: true,
      emailNotifications: true,
      smsAlerts: true
    };

    saveLocalUserByPhone(cleanNumber, newUser);
    setUser(newUser);
    setFreeAttemptsLeft(local.free_attempts_left);
    setFreeAttemptsUsed(local.free_attempts_used);
    setIsPaymentDone(local.is_payment_done);
    setSelectedPlan(local.selected_plan);
    setUnlockedTxns(local.unlocked_deeds || []);

    dbPhoneLogin(cleanNumber, name).catch(() => {});
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setFreeAttemptsLeft(3);
    setFreeAttemptsUsed(0);
    setIsPaymentDone(false);
    setSelectedPlan('none');
    setUnlockedTxns([]);
    localStorage.removeItem('pureframe_user');
    localStorage.removeItem('pureframe_free_attempts');
    localStorage.removeItem('pureframe_attempts_used');
    localStorage.removeItem('pureframe_is_paid');
    localStorage.removeItem('pureframe_selected_plan');
    localStorage.removeItem('pureframe_unlocked_txns');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      if (updated.rawPhone) {
        saveLocalUserByPhone(updated.rawPhone, updated);
      }
      return updated;
    });
  };

  const unlockTxn = async (txnId) => {
    const txnStr = String(txnId);
    const phone = user?.rawPhone || (user?.phone || '').replace(/\D/g, '').slice(-10) || '9820012345';
    
    try {
      const res = await dbUnlockDeed(phone, txnStr);
      if (res.unlocked || res.alreadyUnlocked || res.success) {
        setUnlockedTxns(prev => {
          if (!prev.includes(txnStr)) {
            return [...prev, txnStr];
          }
          return prev;
        });

        const newLeft = res.free_attempts_left !== undefined 
          ? res.free_attempts_left 
          : (isPaymentDone ? freeAttemptsLeft : Math.max(0, freeAttemptsLeft - 1));
        const newUsed = res.free_attempts_used !== undefined 
          ? res.free_attempts_used 
          : (isPaymentDone ? freeAttemptsUsed : freeAttemptsUsed + 1);

        setFreeAttemptsLeft(newLeft);
        setFreeAttemptsUsed(newUsed);

        setUser(prev => {
          if (!prev) return prev;
          const deeds = Array.from(new Set([...(prev.unlocked_deeds || []), txnStr]));
          return {
            ...prev,
            free_attempts_left: newLeft,
            free_attempts_used: newUsed,
            unlocked_deeds: deeds
          };
        });

        return { 
          success: true, 
          unlocked: true, 
          freeAttemptsLeft: newLeft,
          freeAttemptsUsed: newUsed 
        };
      } else if (res.limitReached) {
        setFreeAttemptsLeft(0);
        return { success: false, limitReached: true, message: res.message };
      }
      return res;
    } catch (err) {
      if (freeAttemptsLeft > 0 || isPaymentDone) {
        setUnlockedTxns(prev => [...prev, txnStr]);
        const newLeft = !isPaymentDone ? Math.max(0, freeAttemptsLeft - 1) : freeAttemptsLeft;
        const newUsed = !isPaymentDone ? freeAttemptsUsed + 1 : freeAttemptsUsed;
        setFreeAttemptsLeft(newLeft);
        setFreeAttemptsUsed(newUsed);
        saveLocalUserByPhone(phone, {
          free_attempts_left: newLeft,
          free_attempts_used: newUsed,
          unlocked_deeds: [...unlockedTxns, txnStr]
        });
        return { success: true, unlocked: true, freeAttemptsLeft: newLeft };
      }
      return { success: false, limitReached: true };
    }
  };

  const selectPlan = async (planId) => {
    setIsPaymentDone(true);
    setSelectedPlan(planId);
    if (user) {
      setUser(prev => ({ ...prev, is_payment_done: true, selected_plan: planId }));
    } else {
      const subscriberUser = {
        id: `usr_${Date.now()}`,
        name: 'Pro Subscriber',
        email: 'subscriber@pureframe.io',
        phone: '+91 91722 72519',
        rawPhone: '9172272519',
        city: 'Pune',
        role: 'Verified Pro Investor',
        avatar: 'PS',
        free_attempts_left: 3,
        free_attempts_used: 0,
        is_payment_done: true,
        selected_plan: planId,
        joinedDate: 'October 2026',
        verifiedBadge: true,
        emailNotifications: true,
        smsAlerts: true
      };
      setUser(subscriberUser);
    }

    const phone = user?.rawPhone || (user?.phone || '').replace(/\D/g, '').slice(-10) || '9172272519';
    try {
      const res = await dbSelectPlan(phone, planId);
      return res;
    } catch {
      return { success: true };
    }
  };

  const resetAttempts = async () => {
    const phone = user?.rawPhone || (user?.phone || '').replace(/\D/g, '').slice(-10) || '9172272519';
    try {
      await dbResetAttempts(phone);
    } catch {}
    setFreeAttemptsLeft(3);
    setFreeAttemptsUsed(0);
    setIsPaymentDone(false);
    setSelectedPlan('none');
    setUser(prev => prev ? ({ ...prev, free_attempts_left: 3, free_attempts_used: 0, is_payment_done: false, selected_plan: 'none' }) : prev);
  };

  const isTxnUnlocked = (txnId) => {
    return unlockedTxns.includes(String(txnId));
  };

  const toggleSaveProperty = (projectId) => {
    setSavedProperties(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const isPropertySaved = (projectId) => {
    return savedProperties.includes(projectId);
  };

  const orderAgreement = ({ projectName, unitNo, locality, price = 'Rs. 699' }) => {
    const newOrder = {
      id: `PF-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      projectName,
      unitNo,
      locality,
      price,
      status: 'Processing with IGR (Est. 2 hrs)',
      date: 'Today',
      downloadUrl: '#'
    };
    setAgreementOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginWithPhoneOtp,
        signup,
        logout,
        updateProfile,
        unlockedTxns,
        unlockTxn,
        isTxnUnlocked,
        savedProperties,
        toggleSaveProperty,
        isPropertySaved,
        agreementOrders,
        orderAgreement,
        freeAttemptsLeft,
        freeAttemptsUsed,
        isPaymentDone,
        selectedPlan,
        selectPlan,
        resetAttempts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
