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
  // Initialize user from localStorage if authenticated
  // Default user with unlimited access
  const [user, setUser] = useState({
    id: 'usr_unlimited',
    name: 'Verified Investor',
    role: 'Unlimited Pro Access',
    is_payment_done: true,
    free_attempts_left: 999999
  });

  const [freeAttemptsLeft, setFreeAttemptsLeft] = useState(999999);
  const [freeAttemptsUsed, setFreeAttemptsUsed] = useState(0);
  const [isPaymentDone, setIsPaymentDone] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('pro_unlimited');

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

  // Modal State for Auth Dialog (Global trigger)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  const openAuthModal = (tab = 'signin', callback = null) => {
    setAuthModalTab(tab);
    if (callback) {
      setAuthSuccessCallback(() => callback);
    } else {
      setAuthSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthSuccessCallback(null);
  };

  const handleAuthSuccess = () => {
    if (typeof authSuccessCallback === 'function') {
      try {
        authSuccessCallback();
      } catch (err) {
        console.error('Auth success callback error:', err);
      }
    }
    setIsAuthModalOpen(false);
    setAuthSuccessCallback(null);
  };

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
          setUser(prev => prev ? ({ ...prev, ...dbU }) : prev);
        }
      }).catch(() => {});
    }
  }, []);

  const login = (emailOrPhone, password) => {
    const isEmail = (emailOrPhone || '').includes('@');
    const cleanPhone = !isEmail ? (emailOrPhone || '').replace(/\D/g, '').slice(-10) : '';
    const phoneToUse = cleanPhone || '98' + Math.floor(10000000 + Math.random() * 90000000);
    const formattedPhone = `+91 ${phoneToUse.slice(0, 5)} ${phoneToUse.slice(5)}`;

    // Read from local registry or initialize
    const local = getLocalUserByPhone(phoneToUse) || {
      phone: phoneToUse,
      name: isEmail ? emailOrPhone.split('@')[0].replace('.', ' ') : `User ${phoneToUse.slice(-4)}`,
      email: isEmail ? emailOrPhone : `${phoneToUse}@pureframe.io`,
      free_attempts_left: 3,
      free_attempts_used: 0,
      is_payment_done: false,
      selected_plan: 'none',
      unlocked_deeds: []
    };

    const rawName = local.name || (isEmail ? emailOrPhone.split('@')[0].replace('.', ' ') : `User ${phoneToUse.slice(-4)}`);
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const initials = formattedName
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'PF';

    const newUser = {
      id: `usr_${phoneToUse}`,
      name: formattedName,
      email: isEmail ? emailOrPhone : (local.email || `${phoneToUse}@pureframe.io`),
      phone: formattedPhone,
      rawPhone: phoneToUse,
      city: local.city || 'Pune',
      role: 'Home Buyer & Investor',
      avatar: initials,
      free_attempts_left: local.free_attempts_left !== undefined ? local.free_attempts_left : 3,
      free_attempts_used: local.free_attempts_used !== undefined ? local.free_attempts_used : 0,
      is_payment_done: Boolean(local.is_payment_done),
      selected_plan: local.selected_plan || 'none',
      unlocked_deeds: local.unlocked_deeds || [],
      joinedDate: 'October 2026',
      verifiedBadge: true,
      emailNotifications: true,
      smsAlerts: true
    };

    saveLocalUserByPhone(phoneToUse, newUser);
    setUser(newUser);
    setFreeAttemptsLeft(newUser.free_attempts_left);
    setFreeAttemptsUsed(newUser.free_attempts_used);
    setIsPaymentDone(newUser.is_payment_done);
    setSelectedPlan(newUser.selected_plan);
    setUnlockedTxns(newUser.unlocked_deeds || []);

    // Sync in background with PostgreSQL
    dbPhoneLogin(phoneToUse, newUser.name, newUser.email, newUser.city).then(dbU => {
      if (dbU) {
        if (dbU.free_attempts_left !== undefined) setFreeAttemptsLeft(dbU.free_attempts_left);
        if (dbU.free_attempts_used !== undefined) setFreeAttemptsUsed(dbU.free_attempts_used);
        if (dbU.is_payment_done !== undefined) setIsPaymentDone(Boolean(dbU.is_payment_done));
        if (dbU.selected_plan) setSelectedPlan(dbU.selected_plan);
        if (Array.isArray(dbU.unlocked_deeds)) setUnlockedTxns(dbU.unlocked_deeds);
        setUser(prev => prev ? ({ ...prev, ...dbU }) : prev);
      }
    }).catch(() => {});

    return newUser;
  };

  const loginWithPhoneOtp = async (phoneNumber) => {
    const cleanNumber = (phoneNumber || '').replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
    const initials = cleanNumber ? `P${cleanNumber.slice(-1)}` : 'PF';

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

      saveLocalUserByPhone(cleanNumber, fullUser);
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
      saveLocalUserByPhone(cleanNumber, fallback);
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
    const cleanNumber = (phone || '').replace(/\D/g, '').slice(-10) || ('98200' + Math.floor(10000 + Math.random() * 90000));
    const formattedPhone = `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
    
    // Check local registry
    const local = getLocalUserByPhone(cleanNumber) || {
      phone: cleanNumber,
      name: name || `User ${cleanNumber.slice(-4)}`,
      email: email || `${cleanNumber}@pureframe.io`,
      city: city || 'Pune',
      free_attempts_left: 3,
      free_attempts_used: 0,
      is_payment_done: false,
      selected_plan: 'none',
      unlocked_deeds: []
    };

    const displayName = name || local.name;
    const initials = displayName
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'PF';

    const newUser = {
      id: `usr_${cleanNumber}`,
      name: displayName,
      email: email || local.email || `${cleanNumber}@pureframe.io`,
      phone: formattedPhone,
      rawPhone: cleanNumber,
      city: city || local.city || 'Pune',
      role: 'Verified Property Buyer',
      avatar: initials,
      free_attempts_left: local.free_attempts_left !== undefined ? local.free_attempts_left : 3,
      free_attempts_used: local.free_attempts_used !== undefined ? local.free_attempts_used : 0,
      is_payment_done: Boolean(local.is_payment_done),
      selected_plan: local.selected_plan || 'none',
      unlocked_deeds: local.unlocked_deeds || [],
      joinedDate: 'October 2026',
      verifiedBadge: true,
      emailNotifications: true,
      smsAlerts: true
    };

    saveLocalUserByPhone(cleanNumber, newUser);
    setUser(newUser);
    setFreeAttemptsLeft(newUser.free_attempts_left);
    setFreeAttemptsUsed(newUser.free_attempts_used);
    setIsPaymentDone(newUser.is_payment_done);
    setSelectedPlan(newUser.selected_plan);
    setUnlockedTxns(newUser.unlocked_deeds || []);

    // Sync in PostgreSQL
    dbPhoneLogin(cleanNumber, displayName, newUser.email, newUser.city).catch(() => {});
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
    
    // If not logged in, request login / signup
    if (!user) {
      openAuthModal('signup');
      return { 
        success: false, 
        requireAuth: true, 
        message: 'Please sign in or create an account to use your 3 free unlocks' 
      };
    }

    const phone = user?.rawPhone || (user?.phone || '').replace(/\D/g, '').slice(-10) || '9820012345';
    
    // If already unlocked
    if (unlockedTxns.includes(txnStr)) {
      return { success: true, alreadyUnlocked: true, unlocked: true, freeAttemptsLeft };
    }

    // Active paid plan (unlimited unlocks)
    if (isPaymentDone) {
      setUnlockedTxns(prev => Array.from(new Set([...prev, txnStr])));
      dbUnlockDeed(phone, txnStr).catch(() => {});
      return { success: true, unlocked: true, isPaymentDone: true, freeAttemptsLeft };
    }

    // Free attempts exhausted
    if (freeAttemptsLeft <= 0) {
      return { success: false, limitReached: true, message: 'Free trial limit reached (3/3 used).' };
    }

    // Free attempt deduction
    try {
      const res = await dbUnlockDeed(phone, txnStr);
      if (res.unlocked || res.alreadyUnlocked || res.success) {
        setUnlockedTxns(prev => Array.from(new Set([...prev, txnStr])));

        const newLeft = res.free_attempts_left !== undefined 
          ? res.free_attempts_left 
          : Math.max(0, freeAttemptsLeft - 1);
        const newUsed = res.free_attempts_used !== undefined 
          ? res.free_attempts_used 
          : freeAttemptsUsed + 1;

        setFreeAttemptsLeft(newLeft);
        setFreeAttemptsUsed(newUsed);

        setUser(prev => {
          if (!prev) return prev;
          const deeds = Array.from(new Set([...(prev.unlocked_deeds || []), txnStr]));
          const updated = {
            ...prev,
            free_attempts_left: newLeft,
            free_attempts_used: newUsed,
            unlocked_deeds: deeds
          };
          saveLocalUserByPhone(phone, updated);
          return updated;
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
      if (freeAttemptsLeft > 0) {
        const newLeft = Math.max(0, freeAttemptsLeft - 1);
        const newUsed = freeAttemptsUsed + 1;
        setUnlockedTxns(prev => Array.from(new Set([...prev, txnStr])));
        setFreeAttemptsLeft(newLeft);
        setFreeAttemptsUsed(newUsed);
        setUser(prev => {
          if (!prev) return prev;
          const deeds = Array.from(new Set([...(prev.unlocked_deeds || []), txnStr]));
          const updated = {
            ...prev,
            free_attempts_left: newLeft,
            free_attempts_used: newUsed,
            unlocked_deeds: deeds
          };
          saveLocalUserByPhone(phone, updated);
          return updated;
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
      setUser(prev => {
        const updated = { ...prev, is_payment_done: true, selected_plan: planId };
        if (prev.rawPhone) saveLocalUserByPhone(prev.rawPhone, updated);
        return updated;
      });
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
      saveLocalUserByPhone('9172272519', subscriberUser);
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
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, free_attempts_left: 3, free_attempts_used: 0, is_payment_done: false, selected_plan: 'none' };
      saveLocalUserByPhone(phone, updated);
      return updated;
    });
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
        isAuthenticated: Boolean(user && (user.rawPhone || user.phone || user.id)),
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
        resetAttempts,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        handleAuthSuccess
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
