import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UnlockTransactionModal({
  isOpen,
  onClose,
  transaction,
  onUnlockSuccess
}) {
  const { 
    freeAttemptsLeft, 
    freeAttemptsUsed, 
    isPaymentDone, 
    selectedPlan, 
    unlockTxn, 
    selectPlan, 
    resetAttempts 
  } = useAuth();

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [chosenPlanId, setChosenPlanId] = useState('investor');
  const [isProcessing, setIsProcessing] = useState(false);
  const [planSuccessNotice, setPlanSuccessNotice] = useState('');

  if (!isOpen || !transaction) return null;

  // Handle free unlock (Decrements free attempts in PostgreSQL)
  const handleFreeUnlockAndGo = async () => {
    if (!agreedToTerms || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await unlockTxn(transaction.id);
      if (res.success || res.unlocked) {
        onUnlockSuccess(transaction.id);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle plan purchase & activation in PostgreSQL
  const handleSelectPlanAndUnlock = async () => {
    setIsProcessing(true);
    try {
      await selectPlan(chosenPlanId);
      setPlanSuccessNotice(`Payment recorded in PostgreSQL! ${chosenPlanId.toUpperCase()} plan activated.`);
      
      // Auto unlock deed after plan activation
      setTimeout(async () => {
        await unlockTxn(transaction.id);
        onUnlockSuccess(transaction.id);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // Quick reset helper for testing
  const handleResetForTesting = async () => {
    setIsProcessing(true);
    await resetAttempts();
    setIsProcessing(false);
  };

  const PLANS_OPTIONS = [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹999',
      period: '/month',
      badge: null,
      desc: '25 Verified Deeds'
    },
    {
      id: 'investor',
      name: 'Investor Pro',
      price: '₹2,499',
      period: '/month',
      badge: 'Popular',
      desc: 'Unlimited Deeds + Certified Copy'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹5,999',
      period: '/month',
      badge: 'Team',
      desc: 'Bulk Access & MahaRERA Sync'
    }
  ];

  const hasFreeAttempts = (freeAttemptsLeft > 0) || isPaymentDone;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '520px', borderRadius: '14px', overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="modal-header" 
          style={{ 
            background: hasFreeAttempts ? '#FFFFFF' : '#FFF7ED',
            borderBottom: '1px solid #E2E8F0',
            padding: '20px 24px' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: hasFreeAttempts ? '#FFF4EE' : '#FEE2E2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: hasFreeAttempts ? '#F05A28' : '#EF4444'
              }}
            >
              {hasFreeAttempts ? <Lock size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>
                {hasFreeAttempts ? 'Unlock Transaction Deed' : 'Free Limit Reached (3/3 Used)'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Unit {transaction.unit} • {transaction.project || 'Y Square'}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ color: '#94A3B8', padding: '4px', cursor: 'pointer' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          
          {/* Summary Box */}
          <div 
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748B' }}>Registration Date:</span>
              <span style={{ fontWeight: 600, color: '#1E293B' }}>{transaction.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748B' }}>Tower &amp; Floor:</span>
              <span style={{ fontWeight: 600, color: '#1E293B' }}>Floor {transaction.floorTower}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748B' }}>Deed Amount:</span>
              <span style={{ fontWeight: 800, color: '#F05A28', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={13} /> {transaction.displayAmount ? '••••••••••' : 'Locked'}
              </span>
            </div>
          </div>

          {/* CASE 1: USER HAS FREE ATTEMPTS (3, 2, or 1 Left) */}
          {hasFreeAttempts && !isPaymentDone && (
            <>
              {/* Attempt Counter Meter Banner */}
              <div 
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 700, fontSize: '0.875rem' }}>
                    <ShieldCheck size={18} />
                    <span>Free Trial Attempts: {freeAttemptsLeft} of 3 remaining</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#D1FAE5', padding: '2px 8px', borderRadius: '12px' }}>
                    Free Tier
                  </span>
                </div>

                {/* 3 Step Dot Progress Meter */}
                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  {[1, 2, 3].map((step) => {
                    const isUsed = step <= (3 - freeAttemptsLeft);
                    return (
                      <div 
                        key={step}
                        style={{
                          flex: 1,
                          height: '6px',
                          borderRadius: '3px',
                          background: isUsed ? '#94A3B8' : '#10B981',
                          transition: 'background 0.3s'
                        }}
                        title={isUsed ? `Attempt ${step} used` : `Attempt ${step} available`}
                      />
                    );
                  })}
                </div>

                <p style={{ fontSize: '0.775rem', color: '#047857', marginTop: '6px' }}>
                  Pureframe provides 3 free deed valuations verified from the local PostgreSQL registry. After 3 unlocks, choose an affordable subscription plan.
                </p>
              </div>

              {/* Free Agreement Checkbox */}
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  color: '#334155',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  userSelect: 'none'
                }}
              >
                <input 
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#F05A28', cursor: 'pointer' }}
                />
                <span>
                  I agree to use <strong>1 of my {freeAttemptsLeft} free attempts</strong> to unlock this deed valuation
                </span>
              </label>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleFreeUnlockAndGo}
                disabled={!agreedToTerms || isProcessing}
                className="hero-search-btn"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Unlock size={18} />
                <span>
                  {isProcessing ? 'Unlocking Deed...' : `Unlock Free Record (${freeAttemptsLeft} Left)`}
                </span>
                <ArrowRight size={18} />
              </button>
            </>
          )}

          {/* CASE 2: USER IS ALREADY ON A PAID PLAN */}
          {isPaymentDone && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div 
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '18px',
                  color: '#1D4ED8',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                ✓ Active Plan: {selectedPlan.toUpperCase()} (Unlimited Deed Access)
              </div>
              <button
                type="button"
                onClick={handleFreeUnlockAndGo}
                className="hero-search-btn"
                style={{ width: '100%', padding: '12px' }}
              >
                Unlock Transaction Deed (Unlimited Access)
              </button>
            </div>
          )}

          {/* CASE 3: 0 FREE ATTEMPTS LEFT & PAYMENT NOT DONE -> CHOOSE A PLAN */}
          {!hasFreeAttempts && (
            <div>
              <div 
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  color: '#991B1B',
                  fontSize: '0.85rem'
                }}
              >
                <strong>Free trial limit reached:</strong> You have unlocked 3 deeds. To view this transaction record and all future registries, select a plan below. Payment status is saved directly in PostgreSQL.
              </div>

              {planSuccessNotice && (
                <div style={{ background: '#ECFDF5', color: '#065F46', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '14px' }}>
                  ✓ {planSuccessNotice}
                </div>
              )}

              {/* 3 Plan Selection Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {PLANS_OPTIONS.map((plan) => {
                  const isSelected = chosenPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setChosenPlanId(plan.id)}
                      style={{
                        border: isSelected ? '2px solid #F05A28' : '1px solid #E2E8F0',
                        background: isSelected ? '#FFF7ED' : '#FFFFFF',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="radio" 
                          name="plan_choice"
                          checked={isSelected}
                          onChange={() => setChosenPlanId(plan.id)}
                          style={{ accentColor: '#F05A28', width: '16px', height: '16px' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.925rem', color: '#1E293B' }}>
                              {plan.name}
                            </span>
                            {plan.badge && (
                              <span style={{ background: '#EA580C', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {plan.desc}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                          {plan.price}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{plan.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Plan Activation & Payment Button */}
              <button
                type="button"
                onClick={handleSelectPlanAndUnlock}
                disabled={isProcessing}
                className="hero-search-btn"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <CreditCard size={18} />
                <span>
                  {isProcessing ? 'Recording in PostgreSQL...' : `Select ${chosenPlanId.toUpperCase()} & Unlock Deed`}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
