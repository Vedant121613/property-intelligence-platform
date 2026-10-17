/**
 * Pureframe API Base Configuration
 * Intelligently resolves between local development and deployed Render backend at runtime.
 */

export function getApiRoot() {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || '';
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '') {
      return 'https://pureframe-api.onrender.com';
    }
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    const envUrl = String(import.meta.env.VITE_API_BASE_URL).trim();
    if (envUrl && envUrl !== 'undefined' && envUrl !== 'null') {
      return envUrl.replace(/\/+$/, '');
    }
  }

  return 'http://localhost:5000';
}

export function getApiBase() {
  return `${getApiRoot()}/api`;
}

// Proxied exports for backwards compatibility with existing imports
export const API_ROOT = typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? 'https://pureframe-api.onrender.com'
  : ((typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'https://pureframe-api.onrender.com').replace(/\/+$/, '');

export const API_BASE = `${API_ROOT}/api`;
