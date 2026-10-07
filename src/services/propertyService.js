/**
 * Pureframe Property Data Service
 * 
 * Provides an abstracted API interface. Currently backed by mock data,
 * ready to be swapped with real REST / GraphQL endpoints when backend is connected.
 */

import {
  CITIES,
  LOCALITIES_BY_CITY,
  PROJECTS_BY_LOCALITY,
  PROJECT_DETAILS,
  FAQS_BY_LOCALITY,
  DURATION_FILTERS,
  HOMEPAGE_RECENT_TRANSACTIONS,
  USER_BENEFITS,
  Y_SQUARE_TRANSACTIONS,
  TRANSACTION_DETAILS_BY_ID
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USE_MOCK_DATA = true;

/**
 * Basic input sanitizer to prevent XSS in client-side queries
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return char;
      }
    });
}

/**
 * Get all supported cities
 */
export async function getCities() {
  if (USE_MOCK_DATA) {
    return Promise.resolve([...CITIES]);
  }
  const res = await fetch(`${API_BASE_URL}/cities`);
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

/**
 * Get localities for a given city with optional duration filter
 */
export async function getCityLocalities(cityId = 'pune', filter = 'all') {
  if (USE_MOCK_DATA) {
    const normalizedCity = cityId.toLowerCase();
    const localities = LOCALITIES_BY_CITY[normalizedCity] || LOCALITIES_BY_CITY['pune'];
    return Promise.resolve({
      city: CITIES.find(c => c.id === normalizedCity) || CITIES[0],
      totalCount: localities.length,
      localities: localities,
      currentFilter: filter
    });
  }
  const res = await fetch(`${API_BASE_URL}/cities/${cityId}/localities?filter=${filter}`);
  if (!res.ok) throw new Error(`Failed to fetch localities for ${cityId}`);
  return res.json();
}

/**
 * Get projects within a locality
 */
export async function getLocalityProjects(cityId = 'pune', localityId = 'saswad-road', duration = '12m') {
  if (USE_MOCK_DATA) {
    const key = `${cityId.toLowerCase()}/${localityId.toLowerCase()}`;
    const projects = PROJECTS_BY_LOCALITY[key] || PROJECTS_BY_LOCALITY['pune/saswad-road'] || [];
    const faqs = FAQS_BY_LOCALITY[localityId.toLowerCase()] || FAQS_BY_LOCALITY['saswad-road'] || [];
    
    return Promise.resolve({
      cityId,
      localityId,
      localityName: localityId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      projects,
      totalProjects: projects.length,
      duration,
      faqs
    });
  }
  const res = await fetch(`${API_BASE_URL}/locations/${cityId}/${localityId}/projects?duration=${duration}`);
  if (!res.ok) throw new Error('Failed to fetch locality projects');
  return res.json();
}

/**
 * Get complete project detail by ID
 */
export async function getProjectDetails(projectId = 'heera-solitaire') {
  if (USE_MOCK_DATA) {
    const normalized = projectId.toLowerCase().replace(/\s+/g, '-');
    const details = PROJECT_DETAILS[normalized] || PROJECT_DETAILS['heera-solitaire'];
    return Promise.resolve(details);
  }
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`);
  if (!res.ok) throw new Error(`Failed to fetch project details for ${projectId}`);
  return res.json();
}

/**
 * Get transactions list for a project (e.g. Y Square - 838 transactions view)
 */
export async function getProjectTransactionsList(projectId = 'y-square', filters = {}) {
  if (USE_MOCK_DATA) {
    let list = [...Y_SQUARE_TRANSACTIONS];
    if (filters.type && filters.type !== 'all') {
      list = list.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
    }
    return Promise.resolve({
      projectName: 'Y Square',
      locality: 'Thane West',
      city: 'Mumbai',
      totalCount: 838,
      viewedByCount: '20+ buyers',
      transactions: list
    });
  }
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

/**
 * Get single transaction detailed record (Screenshot 5: /details/:id)
 */
export async function getTransactionRecordDetails(transactionId = '11089052') {
  if (USE_MOCK_DATA) {
    const item = TRANSACTION_DETAILS_BY_ID[transactionId] || TRANSACTION_DETAILS_BY_ID['11089052'];
    return Promise.resolve(item);
  }
  const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
  if (!res.ok) throw new Error(`Failed to fetch transaction ${transactionId}`);
  return res.json();
}

/**
 * Get Homepage content (Screenshots 1-3)
 */
export async function getHomepageData() {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      recentTransactions: HOMEPAGE_RECENT_TRANSACTIONS,
      benefits: USER_BENEFITS
    });
  }
  const res = await fetch(`${API_BASE_URL}/homepage`);
  if (!res.ok) throw new Error('Failed to fetch homepage data');
  return res.json();
}

/**
 * Search across localities and projects
 */
export async function searchProperties(query = '', cityId = 'pune') {
  const sanitized = sanitizeInput(query).toLowerCase();
  if (!sanitized) return { localities: [], projects: [] };

  if (USE_MOCK_DATA) {
    const localities = (LOCALITIES_BY_CITY[cityId.toLowerCase()] || LOCALITIES_BY_CITY['pune'])
      .filter(l => l.name.toLowerCase().includes(sanitized));

    const allProjects = [];
    Object.values(PROJECTS_BY_LOCALITY).forEach(list => {
      list.forEach(p => {
        if (p.name.toLowerCase().includes(sanitized)) {
          allProjects.push(p);
        }
      });
    });

    return Promise.resolve({
      query: sanitized,
      localities,
      projects: allProjects
    });
  }

  const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(sanitized)}&city=${cityId}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

/**
 * Get duration filters list
 */
export function getDurationFilters() {
  return DURATION_FILTERS;
}
