/**
 * Pureframe Authentication & OTP Client Service
 * 
 * Provides client-side OTP dispatch via SMS and WhatsApp.
 * Supports exposed window methods (sendOtp, verifyOtp, retryOtp)
 * and server-side access-token verification.
 */

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${API_ROOT}/api`;

/**
 * Format mobile number to 91XXXXXXXXXX (country code without +)
 */
export function formatIdentifier(mobile) {
  const clean = String(mobile || '').replace(/\D/g, '');
  if (clean.length === 10) return `91${clean}`;
  if (clean.length > 10 && clean.startsWith('91')) return clean;
  return clean;
}

/**
 * Check if the OTP Widget methods are available on the window
 */
export function isWidgetLoaded() {
  return typeof window !== 'undefined' && typeof window.sendOtp === 'function';
}

/**
 * Wait for widget to initialize if still loading
 */
export async function waitForWidget(timeoutMs = 3000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      if (typeof window.sendOtp === 'function' && typeof window.verifyOtp === 'function') {
        return resolve(true);
      }
      if (Date.now() - start > timeoutMs) {
        return resolve(false);
      }
      setTimeout(check, 100);
    };
    check();
  });
}

/**
 * Send OTP to mobile number
 * @param {string} mobile - 10-digit number
 * @param {string} [channel='11'] - '11' for SMS, '12' for WhatsApp
 */
export async function sendOtp(mobile, channel = '11') {
  const identifier = formatIdentifier(mobile);
  console.log(`[OTP] Dispatching to identifier: ${identifier} via channel: ${channel === '12' ? 'WhatsApp' : 'SMS'}`);

  await waitForWidget(2500);

  return new Promise((resolve, reject) => {
    // 1. If Client Widget window.sendOtp is available
    if (typeof window.sendOtp === 'function') {
      try {
        window.sendOtp(
          identifier,
          (successData) => {
            console.log('[OTP Send Success]:', successData);
            
            // If user explicitly requested WhatsApp delivery, invoke retryOtp with channel '12'
            if (channel === '12' && typeof window.retryOtp === 'function') {
              console.log('[OTP] Requesting delivery via WhatsApp (channel 12)...');
              window.retryOtp(
                '12',
                (waData) => {
                  console.log('[OTP WhatsApp Delivery Success]:', waData);
                  resolve({
                    success: true,
                    data: waData,
                    channel: 'whatsapp',
                    message: 'Verification code sent to your WhatsApp'
                  });
                },
                (waErr) => {
                  console.error('[OTP WhatsApp Error]:', waErr);
                  resolve({
                    success: true,
                    data: successData,
                    channel: 'sms',
                    message: 'Code sent via SMS (WhatsApp fallback)'
                  });
                }
              );
              return;
            }

            resolve({
              success: true,
              data: successData,
              channel: 'sms',
              message: 'Verification code sent via SMS'
            });
          },
          (errorData) => {
            // Detailed console logging for developer diagnosis
            console.error('[OTP Send Error]:', errorData);
            try {
              console.error('[OTP Error Details]:', JSON.stringify(errorData, null, 2));
            } catch {}

            const errMsg = typeof errorData === 'string'
              ? errorData
              : (errorData?.message || errorData?.description || 'Unable to send OTP. Check console for details.');
            
            reject(new Error(errMsg));
          }
        );
        return;
      } catch (err) {
        console.error('[OTP sendOtp Exception]:', err);
        reject(err);
        return;
      }
    }

    // 2. Fallback to backend API if widget script did not load
    console.warn('[OTP] Client widget not available on window. Falling back to backend endpoint...');
    fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: identifier.slice(-10) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          resolve({ success: true, reqId: data.reqId, message: data.message });
        } else {
          console.error('[Backend Send OTP Error]:', data);
          reject(new Error(data.message || 'Failed to dispatch OTP'));
        }
      })
      .catch(err => {
        console.error('[Backend Network Error]:', err);
        reject(err);
      });
  });
}

/**
 * Verify OTP entered by the user
 * @param {string|number} otp - 4 to 6 digit code
 * @param {string} [reqId] - Optional session ID
 * @param {string} [phone] - User mobile number
 */
export async function verifyOtp(otp, reqId, phone) {
  const cleanOtp = String(otp || '').trim();
  console.log(`[OTP] Verifying code: ${cleanOtp}`);

  return new Promise((resolve, reject) => {
    // 1. Client Widget verifyOtp
    if (typeof window.verifyOtp === 'function') {
      try {
        const onSuccess = async (data) => {
          console.log('[OTP Verify Success]:', data);

          // If JWT / access token is present, perform server-side verification
          const token = data?.['access-token'] || data?.token || data?.message;
          if (token && typeof token === 'string' && token.length > 20) {
            try {
              console.log('[OTP] Verifying access token with backend...');
              await fetch(`${API_BASE}/auth/verify-access-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'access-token': token, phone })
              });
            } catch (e) {
              console.warn('[OTP] Server token check notice:', e);
            }
          }

          resolve({ success: true, data, message: 'Verification successful' });
        };

        const onError = (error) => {
          console.error('[OTP Verify Error]:', error);
          try {
            console.error('[OTP Verify Error Details]:', JSON.stringify(error, null, 2));
          } catch {}

          const msg = typeof error === 'string'
            ? error
            : (error?.message || 'Invalid or expired code');
          reject(new Error(msg));
        };

        if (reqId) {
          window.verifyOtp(cleanOtp, onSuccess, onError, reqId);
        } else {
          window.verifyOtp(cleanOtp, onSuccess, onError);
        }
        return;
      } catch (err) {
        console.error('[OTP verifyOtp Exception]:', err);
        reject(err);
        return;
      }
    }

    // 2. Fallback to Backend verify endpoint
    fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp: cleanOtp, reqId, mobile: phone })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          resolve({ success: true, message: data.message });
        } else {
          console.error('[Backend Verify Error]:', data);
          reject(new Error(data.message || 'Invalid code'));
        }
      })
      .catch(err => {
        console.error('[Backend Verify Network Error]:', err);
        reject(err);
      });
  });
}

/**
 * Resend OTP code via SMS ('11') or WhatsApp ('12')
 * @param {string} [channel='11'] - '11' for SMS, '12' for WhatsApp
 * @param {string} [reqId] - Optional reqId
 */
export async function resendOtp(channel = '11', reqId) {
  const channelName = channel === '12' ? 'WhatsApp' : 'SMS';
  console.log(`[OTP] Resending code via channel ${channel} (${channelName})...`);

  return new Promise((resolve, reject) => {
    // 1. Client Widget retryOtp
    if (typeof window.retryOtp === 'function') {
      try {
        window.retryOtp(
          channel,
          (data) => {
            console.log(`[OTP Resend via ${channelName} Success]:`, data);
            resolve({
              success: true,
              data,
              channel,
              message: channel === '12' ? 'New code sent to your WhatsApp' : 'New code sent via SMS'
            });
          },
          (error) => {
            console.error(`[OTP Resend via ${channelName} Error]:`, error);
            try {
              console.error('[OTP Resend Error Details]:', JSON.stringify(error, null, 2));
            } catch {}

            const msg = typeof error === 'string'
              ? error
              : (error?.message || `Unable to resend via ${channelName}`);
            reject(new Error(msg));
          },
          reqId
        );
        return;
      } catch (err) {
        console.error('[OTP retryOtp Exception]:', err);
        reject(err);
        return;
      }
    }

    // 2. Fallback to Backend resend endpoint
    fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, reqId })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          resolve({ success: true, message: data.message });
        } else {
          console.error('[Backend Resend Error]:', data);
          reject(new Error(data.message || 'Unable to resend'));
        }
      })
      .catch(err => {
        console.error('[Backend Resend Network Error]:', err);
        reject(err);
      });
  });
}
