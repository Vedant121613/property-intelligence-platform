import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getDbUser, 
  dbPhoneLogin, 
  dbUnlockDeed, 
  dbSelectPlan, 
  dbResetAttempts 
} from '../services/dbService';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr_8921',
  name: 'Vedant Sharma',
  email: 'vedant.sharma@pureframe.io',
  phone: '+91 91722 72519',
  rawPhone: '9172272519',
  city: 'Mumbai',
  role: 'Property Investor & Home Buyer',
  avatar: 'VS',
  free_attempts_left: 3,
  free_attempts_used: 0,
  is_payment_done: false,
  selected_plan: 'none',
  joinedDate: 'January 2026',
  verifiedBadge: true,
  emailNotifications: true,
  smsAlerts: true
};

const DEFAULT_UNLOCKED = ['11089052'];
const DEFAULT_SAVED = ['y-square', 'heera-solitaire'];
const DEFAULT_ORDERS = [
  {
    id: 'PF-ORD-8841',
    projectName: 'Y Square',
    unitNo: '512',
    locality: 'Thane West, Mumbai',
    price: 'Rs. 699',
    status: 'Ready to Download',
    date: '04 Oct 2026',
    downloadUrl: '#'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [freeAttemptsLeft, setFreeAttemptsLeft] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_free_attempts');
      return saved !== null ? parseInt(saved, 10) : (user?.free_attempts_left ?? 3);
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

  // Synchronize user from PostgreSQL on startup
  useEffect(() => {
    if (user?.rawPhone || user?.phone) {
      const phone = user.rawPhone || user.phone;
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
    const formattedName = emailOrPhone.includes('@')
      ? emailOrPhone.split('@')[0].replace('.', ' ')
      : 'Investor User';
    const initials = formattedName
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'PF';

    const newUser = {
      id: `usr_${Date.now()}`,
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      email: emailOrPhone.includes('@') ? emailOrPhone : 'user@pureframe.io',
      phone: emailOrPhone.includes('@') ? '+91 98200 12345' : emailOrPhone,
      city: 'Mumbai',
      role: 'Home Buyer & Investor',
      avatar: initials,
      joinedDate: 'October 2026',
      verifiedBadge: true,
      emailNotifications: true,
      smsAlerts: true
    };
    setUser(newUser);
    return newUser;
  };

  const loginWithPhoneOtp = async (phoneNumber) => {
    const cleanNumber = (phoneNumber || '').replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
    const initials = cleanNumber ? `P${cleanNumber.slice(-1)}` : 'PF';

    try {
      const dbUser = await dbPhoneLogin(cleanNumber, `User ${cleanNumber.slice(-4)}`);
      const fullUser = {
        id: `usr_${dbUser.id || cleanNumber}`,
        name: dbUser.name || `User ${cleanNumber.slice(-4)}`,
        email: `${cleanNumber}@pureframe.io`,
        phone: formattedPhone,
        rawPhone: cleanNumber,
        city: 'Mumbai',
        role: 'Verified Property Buyer',
        avatar: initials,
        free_attempts_left: dbUser.free_attempts_left !== undefined ? dbUser.free_attempts_left : 3,
        free_attempts_used: dbUser.free_attempts_used || 0,
        is_payment_done: Boolean(dbUser.is_payment_done),
        selected_plan: dbUser.selected_plan || 'none',
        joinedDate: 'October 2026',
        verifiedBadge: true,
        emailNotifications: true,
        smsAlerts: true
      };

      setUser(fullUser);
      setFreeAttemptsLeft(fullUser.free_attempts_left);
      setFreeAttemptsUsed(fullUser.free_attempts_used);
      setIsPaymentDone(fullUser.is_payment_done);
      setSelectedPlan(fullUser.selected_plan);
      if (Array.isArray(dbUser.unlocked_deeds)) {
        setUnlockedTxns(dbUser.unlocked_deeds);
      }
      return fullUser;
    } catch {
      const fallback = {
        id: `usr_${cleanNumber || Date.now()}`,
        name: `User ${cleanNumber.slice(-4) || 'Member'}`,
        email: `${cleanNumber || 'user'}@pureframe.io`,
        phone: formattedPhone,
        rawPhone: cleanNumber,
        city: 'Mumbai',
        role: 'Verified Property Buyer',
        avatar: initials,
        free_attempts_left: 3,
        free_attempts_used: 0,
        is_payment_done: false,
        selected_plan: 'none',
        joinedDate: 'October 2026',
        verifiedBadge: true
      };
      setUser(fallback);
      return fallback;
    }
  };

  const demoLogin = () => {
    setUser(DEFAULT_USER);
    setFreeAttemptsLeft(3);
    setFreeAttemptsUsed(0);
    setIsPaymentDone(false);
    setSelectedPlan('none');
    return DEFAULT_USER;
  };

  const signup = ({ name, email, phone, city }) => {
    const initials = name
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'PF';

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      city: city || 'Mumbai',
      role: 'Verified Property Buyer',
      avatar: initials,
      joinedDate: 'October 2026',
      verifiedBadge: true,
      emailNotifications: true,
      smsAlerts: true
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  const unlockTxn = async (txnId) => {
    const phone = user?.rawPhone || user?.phone || '9172272519';
    try {
      const res = await dbUnlockDeed(phone, txnId);
      if (res.unlocked || res.alreadyUnlocked) {
        if (!unlockedTxns.includes(String(txnId))) {
          setUnlockedTxns(prev => [...prev, String(txnId)]);
        }
        if (res.free_attempts_left !== undefined) {
          setFreeAttemptsLeft(res.free_attempts_left);
        }
        if (res.free_attempts_used !== undefined) {
          setFreeAttemptsUsed(res.free_attempts_used);
        }
        return { success: true, freeAttemptsLeft: res.free_attempts_left };
      } else if (res.limitReached) {
        setFreeAttemptsLeft(0);
        return { success: false, limitReached: true, message: res.message };
      }
      return res;
    } catch {
      if (freeAttemptsLeft > 0 || isPaymentDone) {
        setUnlockedTxns(prev => [...prev, String(txnId)]);
        if (!isPaymentDone) {
          setFreeAttemptsLeft(p => Math.max(0, p - 1));
          setFreeAttemptsUsed(p => p + 1);
        }
        return { success: true, freeAttemptsLeft: Math.max(0, freeAttemptsLeft - 1) };
      }
      return { success: false, limitReached: true };
    }
  };

  const selectPlan = async (planId) => {
    const phone = user?.rawPhone || user?.phone || '9172272519';
    try {
      const res = await dbSelectPlan(phone, planId);
      setIsPaymentDone(true);
      setSelectedPlan(planId);
      setUser(prev => prev ? ({ ...prev, is_payment_done: true, selected_plan: planId }) : prev);
      return res;
    } catch {
      setIsPaymentDone(true);
      setSelectedPlan(planId);
      return { success: true };
    }
  };

  const resetAttempts = async () => {
    const phone = user?.rawPhone || user?.phone || '9172272519';
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
        demoLogin,
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
