/**
 * Pureframe Backend MSG91 Service
 * 
 * Secure server-to-server communication with MSG91 APIs.
 * Secrets are loaded strictly via process.env and NEVER exposed to clients.
 */

// Mask mobile numbers in logs for privacy and compliance
export function maskMobile(mobile) {
  if (!mobile) return '****';
  const clean = String(mobile).replace(/\D/g, '');
  if (clean.length <= 4) return '****';
  return `${clean.slice(0, 4)}****${clean.slice(-2)}`;
}

// Format mobile to Indian standard with country code 91
export function normalizeMobile(mobile) {
  if (!mobile) return '';
  const clean = String(mobile).replace(/\D/g, '');
  if (clean.length === 10) return `91${clean}`;
  if (clean.length > 10 && clean.startsWith('91')) return clean;
  return clean;
}

/**
 * Validate MSG91 configuration on server startup
 */
export function validateMsg91Config() {
  const authKey = process.env.MSG91_AUTH_KEY;
  const widgetId = process.env.MSG91_WIDGET_ID;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  const isPlaceholder = !authKey || authKey === 'your_new_rotated_secret_here';

  if (isPlaceholder) {
    console.warn('\n[MSG91 CONFIG WARNING] MSG91_AUTH_KEY is not yet configured or is using placeholder.');
    console.warn('Place your newly rotated MSG91 AuthKey in server/.env to send real SMS OTPs.\n');
    return false;
  }

  if (!widgetId && !templateId) {
    console.warn('\n[MSG91 CONFIG WARNING] Neither MSG91_WIDGET_ID nor MSG91_TEMPLATE_ID is configured.');
    console.warn('Provide MSG91_WIDGET_ID or MSG91_TEMPLATE_ID in server/.env.\n');
    return false;
  }

  console.log('[MSG91 CONFIG] Credentials validated for server-side OTP dispatch.');
  return true;
}

/**
 * Dispatch OTP via MSG91 API
 * @param {string} mobile - 10-digit mobile number
 * @returns {Promise<{ success: boolean, reqId?: string, message?: string }>}
 */
export async function sendOtp(mobile) {
  const formattedMobile = normalizeMobile(mobile);
  const masked = maskMobile(formattedMobile);
  console.log(`[MSG91] Starting OTP dispatch for mobile: ${masked}`);

  const authKey = process.env.MSG91_AUTH_KEY;
  const widgetId = process.env.MSG91_WIDGET_ID;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || authKey === 'your_new_rotated_secret_here') {
    console.error('[MSG91] Error: MSG91_AUTH_KEY is not configured in server/.env');
    return {
      success: false,
      message: 'SMS service is temporarily unavailable. Server configuration required.'
    };
  }

  try {
    // 1. If using Widget API (Server-side)
    if (widgetId) {
      const response = await fetch('https://control.msg91.com/api/v5/widget/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'tokenauth': authKey
        },
        body: JSON.stringify({
          widgetId,
          tokenAuth: authKey,
          identifier: formattedMobile
        })
      });

      const data = await response.json();

      if (response.ok && data.type !== 'error' && !data.hasError) {
        const reqId = data.message || data.reqId || `req_${Date.now()}`;
        console.log(`[MSG91] OTP dispatched successfully. Request ID generated.`);
        return {
          success: true,
          reqId: String(reqId)
        };
      } else {
        const errMsg = data.message || 'Failed to dispatch OTP';
        console.warn(`[MSG91] Dispatch rejected by MSG91: ${errMsg}`);
        return {
          success: false,
          message: 'Unable to send OTP. Please verify your mobile number or try again later.'
        };
      }
    }

    // 2. Fallback to Direct OTP API if Template ID provided
    if (templateId) {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${formattedMobile}&authkey=${authKey}`;
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();

      if (response.ok && data.type !== 'error') {
        const reqId = data.message || `req_${Date.now()}`;
        console.log(`[MSG91] Template OTP dispatched successfully.`);
        return {
          success: true,
          reqId: String(reqId)
        };
      } else {
        console.warn(`[MSG91] Direct OTP failed: ${data.message || 'Unknown error'}`);
        return {
          success: false,
          message: 'Unable to send OTP. Please try again later.'
        };
      }
    }

    return {
      success: false,
      message: 'Server OTP configuration incomplete.'
    };
  } catch (err) {
    console.error(`[MSG91] Network error during sendOtp: ${err.message}`);
    return {
      success: false,
      message: 'Network error communicating with SMS provider. Please try again.'
    };
  }
}

/**
 * Verify OTP entered by the user
 * @param {string} reqId - Request ID returned by sendOtp
 * @param {string} otp - 4 to 6 digit OTP
 * @param {string} [mobile] - Mobile number
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function verifyOtp(reqId, otp, mobile) {
  console.log(`[MSG91] Verifying OTP for request ID: ${reqId ? reqId.slice(0, 8) + '...' : 'none'}`);

  const authKey = process.env.MSG91_AUTH_KEY;
  const widgetId = process.env.MSG91_WIDGET_ID;
  const formattedMobile = mobile ? normalizeMobile(mobile) : '';

  if (!authKey || authKey === 'your_new_rotated_secret_here') {
    console.error('[MSG91] Verification blocked: MSG91_AUTH_KEY not configured');
    return {
      success: false,
      message: 'Authentication service configuration incomplete.'
    };
  }

  try {
    // 1. Verify via Widget API
    if (widgetId) {
      const response = await fetch('https://control.msg91.com/api/v5/widget/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'tokenauth': authKey
        },
        body: JSON.stringify({
          widgetId,
          reqId,
          otp: String(otp).trim()
        })
      });

      const data = await response.json();

      if (response.ok && (data.type === 'success' || data.status === 'success' || !data.hasError)) {
        console.log(`[MSG91] OTP verified successfully by provider.`);
        return { success: true };
      } else {
        console.warn(`[MSG91] OTP verification failed: ${data.message || 'Invalid code'}`);
        return {
          success: false,
          message: 'Invalid or expired OTP. Please try again.'
        };
      }
    }

    // 2. Verify via Standard OTP API
    if (formattedMobile) {
      const url = `https://control.msg91.com/api/v5/otp/verify?otp=${encodeURIComponent(otp)}&mobile=${formattedMobile}&authkey=${authKey}`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data.type !== 'error' && data.type !== 'failure') {
        console.log(`[MSG91] Direct OTP verification successful.`);
        return { success: true };
      } else {
        console.warn(`[MSG91] Direct verification failed: ${data.message}`);
        return {
          success: false,
          message: 'Invalid or expired OTP. Please try again.'
        };
      }
    }

    return {
      success: false,
      message: 'Invalid verification request parameters.'
    };
  } catch (err) {
    console.error(`[MSG91] Network error during verifyOtp: ${err.message}`);
    return {
      success: false,
      message: 'Error verifying OTP with provider. Please try again.'
    };
  }
}

/**
 * Resend OTP using existing session
 * @param {string} reqId - Request ID
 * @param {string} [channel] - '11' (SMS), '12' (WhatsApp), '4' (Voice)
 * @param {string} [mobile] - Mobile number
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function resendOtp(reqId, channel = '11', mobile) {
  console.log(`[MSG91] Retrying OTP dispatch for channel: ${channel}`);

  const authKey = process.env.MSG91_AUTH_KEY;
  const widgetId = process.env.MSG91_WIDGET_ID;
  const formattedMobile = mobile ? normalizeMobile(mobile) : '';

  if (!authKey || authKey === 'your_new_rotated_secret_here') {
    return {
      success: false,
      message: 'SMS service configuration incomplete.'
    };
  }

  try {
    // 1. Resend via Widget API
    if (widgetId) {
      const response = await fetch('https://control.msg91.com/api/v5/widget/retryOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'tokenauth': authKey
        },
        body: JSON.stringify({
          widgetId,
          reqId,
          retryChannel: channel || '11'
        })
      });

      const data = await response.json();

      if (response.ok && data.type !== 'error' && !data.hasError) {
        console.log(`[MSG91] Retry request accepted by provider.`);
        return {
          success: true,
          message: channel === '12' ? 'New OTP dispatched via WhatsApp.' : 'New OTP dispatched via SMS.'
        };
      } else {
        console.warn(`[MSG91] Retry rejected: ${data.message}`);
        return {
          success: false,
          message: data.message || 'Unable to resend OTP at this time.'
        };
      }
    }

    // 2. Resend via Standard API
    if (formattedMobile) {
      const retryType = channel === '4' ? 'voice' : 'text';
      const url = `https://control.msg91.com/api/v5/otp/retry?authkey=${authKey}&mobile=${formattedMobile}&retrytype=${retryType}`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data.type !== 'error') {
        return {
          success: true,
          message: 'New OTP dispatched via SMS.'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Unable to resend OTP.'
        };
      }
    }

    return {
      success: false,
      message: 'Missing session parameters for retry.'
    };
  } catch (err) {
    console.error(`[MSG91] Error in resendOtp: ${err.message}`);
    return {
      success: false,
      message: 'Network error resending OTP. Please try again.'
    };
  }
}
