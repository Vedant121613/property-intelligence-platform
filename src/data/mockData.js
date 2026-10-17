/**
 * Pureframe Property Data Store (Mock Backend Layer)
 * 
 * Provides mock data for:
 * - 8 Metros with Monument Icons (Screenshot 1)
 * - Complete Mumbai Localities (Screenshot 2: Thane West, Mira Road, Dombivli East, etc.)
 * - Runwal Lands End Project with BHK Analysis (Screenshot 3)
 * - Y Square & Heera Solitaire Projects
 * - Transaction Lists & User Records
 */

export const CITIES = [
  { 
    id: 'pune', 
    name: 'Pune', 
    state: 'Maharashtra', 
    totalLocalities: 282, 
    totalProjects: 1450,
    monument: 'shaniwar-wada',
    monumentName: 'Shaniwar Wada',
    isUpcoming: false,
    status: 'Live'
  },
  { 
    id: 'mumbai', 
    name: 'Mumbai', 
    state: 'Maharashtra', 
    totalLocalities: 332, 
    totalProjects: 3200,
    monument: 'gateway-of-india',
    monumentName: 'Gateway of India',
    isUpcoming: true,
    status: 'Upcoming'
  }
];


export const DURATION_FILTERS = [
  { id: '12m', label: '12 Months' },
  { id: 'all', label: 'All' },
  { id: '6m', label: '6 Months' },
  { id: '3m', label: '3 Months' }
];

export const HOMEPAGE_RECENT_TRANSACTIONS = [
  {
    id: 'hp-1',
    soldDate: 'Sold on 12 Feb 2024',
    amount: '₹6.74 Cr',
    locality: 'Bandra West, Mumbai',
    unit: 'Flat No. 1204',
    carpetArea: '1,450 sq.ft'
  },
  {
    id: 'hp-2',
    soldDate: 'Sold on 27 Feb 2024',
    amount: '₹1.85 Cr',
    locality: 'Baner, Pune',
    unit: 'Flat No. 804',
    carpetArea: '1,320 sq.ft'
  },
  {
    id: 'hp-3',
    soldDate: 'Sold on 26 Feb 2024',
    amount: '₹13.70 Cr',
    locality: 'Worli, Mumbai',
    unit: 'Flat No. 3401',
    carpetArea: '3,200 sq.ft'
  },
  {
    id: 'hp-4',
    soldDate: 'Sold on 22 Feb 2024',
    amount: '₹4.79 Cr',
    locality: 'Koregaon Park, Pune',
    unit: 'Penthouse 1102',
    carpetArea: '2,150 sq.ft'
  }
];

export const USER_BENEFITS = [
  {
    id: 'buyers',
    title: 'For Home Buyers',
    desc: 'View actual transactions to determine a fair price for a property and buy it confidently.',
    icon: 'bag'
  },
  {
    id: 'sellers',
    title: 'For Home Sellers',
    desc: 'For a smooth, profitable sale, check Pureframe to understand what the market price is for a property like yours.',
    icon: 'coins'
  },
  {
    id: 'owners',
    title: 'For Home Owners',
    desc: 'Ever thought, "What is my home worth today?". The answer is just a few clicks away. Just enter your city and project\'s name to find out.',
    icon: 'home'
  },
  {
    id: 'brokers',
    title: 'For Brokers',
    desc: 'Provide home buyers and sellers with credible information in real time, with Pureframe\'s easily accessible data.',
    icon: 'handshake'
  }
];

// Complete Localities by City (Pune Live & Mumbai Upcoming)
export const LOCALITIES_BY_CITY = {
  pune: [
    { id: 'kharadi', name: 'Kharadi', saleTxns: 2671, activeProjects: 60, avgPriceSqFt: '₹ 8,950/sq.ft' },
    { id: 'saswad-road', name: 'Saswad Road', saleTxns: 68, activeProjects: 7, avgPriceSqFt: '₹ 4,850/sq.ft' },
    { id: 'manchar', name: 'Manchar', saleTxns: 58, activeProjects: 5, avgPriceSqFt: '₹ 3,400/sq.ft' },
    { id: 'sanghavi', name: 'Sanghavi', saleTxns: 62, activeProjects: 12, avgPriceSqFt: '₹ 7,100/sq.ft' },
    { id: 'somwar-peth', name: 'Somwar Peth', saleTxns: 47, activeProjects: 6, avgPriceSqFt: '₹ 9,200/sq.ft' },
    { id: 'lulla-nagar', name: 'Lulla Nagar', saleTxns: 52, activeProjects: 9, avgPriceSqFt: '₹ 8,900/sq.ft' },
    { id: 'chandan-nagar', name: 'Chandan Nagar', saleTxns: 63, activeProjects: 14, avgPriceSqFt: '₹ 6,750/sq.ft' },
    { id: 'rasta-peth', name: 'Rasta Peth', saleTxns: 57, activeProjects: 4, avgPriceSqFt: '₹ 8,400/sq.ft' },
    { id: 'shukrawar-peth', name: 'Shukrawar Peth', saleTxns: 58, activeProjects: 8, avgPriceSqFt: '₹ 9,500/sq.ft' },
    { id: 'khed', name: 'Khed', saleTxns: 55, activeProjects: 6, avgPriceSqFt: '₹ 3,600/sq.ft' },
    { id: 'parvati-gaon', name: 'Parvati Gaon', saleTxns: 54, activeProjects: 7, avgPriceSqFt: '₹ 7,800/sq.ft' },
    { id: 'uttam-nagar', name: 'Uttam Nagar', saleTxns: 48, activeProjects: 5, avgPriceSqFt: '₹ 4,500/sq.ft' },
    { id: 'purandar', name: 'Purandar', saleTxns: 54, activeProjects: 4, avgPriceSqFt: '₹ 3,200/sq.ft' },
    { id: 'chourainagar', name: 'Chourainagar', saleTxns: 48, activeProjects: 6, avgPriceSqFt: '₹ 5,100/sq.ft' },
    { id: 'university-road', name: 'University Road', saleTxns: 44, activeProjects: 11, avgPriceSqFt: '₹ 11,500/sq.ft' },
    { id: 'aundh-road', name: 'Aundh Road', saleTxns: 41, activeProjects: 15, avgPriceSqFt: '₹ 9,800/sq.ft' },
    { id: 'karve-road', name: 'Karve Road', saleTxns: 41, activeProjects: 13, avgPriceSqFt: '₹ 10,200/sq.ft' }
  ],
  mumbai: [
    { id: 'thane-west', name: 'Thane West', saleTxns: 7536, activeProjects: 124, avgPriceSqFt: '₹ 14,800/sq.ft' },
    { id: 'mira-road', name: 'Mira Road', saleTxns: 7152, activeProjects: 98, avgPriceSqFt: '₹ 9,600/sq.ft' },
    { id: 'dombivli-east', name: 'Dombivli East', saleTxns: 6921, activeProjects: 84, avgPriceSqFt: '₹ 6,800/sq.ft' },
    { id: 'bhiwandi', name: 'Bhiwandi', saleTxns: 4184, activeProjects: 45, avgPriceSqFt: '₹ 4,900/sq.ft' },
    { id: 'malad-west', name: 'Malad West', saleTxns: 3518, activeProjects: 72, avgPriceSqFt: '₹ 21,200/sq.ft' },
    { id: 'andheri-west', name: 'Andheri West', saleTxns: 3225, activeProjects: 88, avgPriceSqFt: '₹ 26,000/sq.ft' },
    { id: 'mulund-west', name: 'Mulund West', saleTxns: 2930, activeProjects: 56, avgPriceSqFt: '₹ 19,400/sq.ft' },
    { id: 'chembur', name: 'Chembur', saleTxns: 2919, activeProjects: 62, avgPriceSqFt: '₹ 22,500/sq.ft' },
    { id: 'kandivali-west', name: 'Kandivali West', saleTxns: 2755, activeProjects: 65, avgPriceSqFt: '₹ 20,800/sq.ft' },
    { id: 'badlapur-east', name: 'Badlapur East', saleTxns: 2752, activeProjects: 38, avgPriceSqFt: '₹ 4,200/sq.ft' },
    { id: 'kalyan-west', name: 'Kalyan West', saleTxns: 2705, activeProjects: 54, avgPriceSqFt: '₹ 6,400/sq.ft' },
    { id: 'vikhroli-east', name: 'Vikhroli East', saleTxns: 2678, activeProjects: 42, avgPriceSqFt: '₹ 18,900/sq.ft' },
    { id: 'andheri-east', name: 'Andheri East', saleTxns: 2590, activeProjects: 70, avgPriceSqFt: '₹ 20,500/sq.ft' },
    { id: 'ambernath', name: 'Ambernath', saleTxns: 2494, activeProjects: 36, avgPriceSqFt: '₹ 4,100/sq.ft' },
    { id: 'bhandup-west', name: 'Bhandup West', saleTxns: 2472, activeProjects: 48, avgPriceSqFt: '₹ 16,800/sq.ft' },
    { id: 'ghodbunder-road', name: 'Ghodbunder Road', saleTxns: 2380, activeProjects: 82, avgPriceSqFt: '₹ 13,200/sq.ft' },
    { id: 'kandivali-east', name: 'Kandivali East', saleTxns: 2210, activeProjects: 52, avgPriceSqFt: '₹ 21,500/sq.ft' },
    { id: 'bandra-west', name: 'Bandra West', saleTxns: 920, activeProjects: 24, avgPriceSqFt: '₹ 45,000/sq.ft' },
    { id: 'borivali-west', name: 'Borivali West', saleTxns: 1850, activeProjects: 44, avgPriceSqFt: '₹ 21,500/sq.ft' }
  ]
};

export const PROJECTS_BY_LOCALITY = {
  'pune/kharadi': [
    {
      id: 'vj-indiworks-kharadi-central',
      name: 'VJ IndiWorks Kharadi Central',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 672,
      lastSoldDate: '21/02/2026',
      lastSoldPrice: '₹49.56 Lac',
      developer: 'Vilas Javdekar Developers',
      totalUnits: '1344',
      soldUnits: '672',
      completion: 'Ready / 2026 - 2027',
      bhks: 'Office, Commercial',
      quotedPricing: '25.0 Lac - 1.00 Cr',
      reraNumbers: '63',
      priceTrendDirection: 'up'
    },
    {
      id: 'palladio-kharadi-central-phase-2',
      name: 'Palladio Kharadi Central Phase 2',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 499,
      lastSoldDate: '11/04/2025',
      lastSoldPrice: '₹1.12 Cr',
      developer: 'Vilas Javdekar Developers',
      totalUnits: '998',
      soldUnits: '499',
      completion: 'Ready / 2026 - 2027',
      bhks: '2, 3 BHK',
      quotedPricing: '41.9 Lac - 1.64 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'vj-central-avenue-kharadi',
      name: 'VJ Central Avenue Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 208,
      lastSoldDate: '20/06/2025',
      lastSoldPrice: '₹39.80 Lac',
      developer: 'Vilas Javdekar Developers',
      totalUnits: '416',
      soldUnits: '208',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 1.38 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'kharadi-elite-residency',
      name: 'Kharadi Elite Residency',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 160,
      lastSoldDate: '10/11/2025',
      lastSoldPrice: '₹2.08 Cr',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '320',
      soldUnits: '160',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 45.00 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'eknath-pathare-wasti-enclave',
      name: 'Eknath Pathare Wasti Enclave',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 149,
      lastSoldDate: '31/01/2024',
      lastSoldPrice: '₹0.31 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '298',
      soldUnits: '149',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 0.04 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'palladio-kharadi-central',
      name: 'Palladio Kharadi Central',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 144,
      lastSoldDate: '26/05/2025',
      lastSoldPrice: '₹99.32 Lac',
      developer: 'Vilas Javdekar Developers',
      totalUnits: '288',
      soldUnits: '144',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 2.29 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'dev-exotica-kharadi',
      name: 'Dev Exotica Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 104,
      lastSoldDate: '22/07/2025',
      lastSoldPrice: '₹24.63 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '208',
      soldUnits: '104',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 1.49 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'krushna-park-chsl',
      name: 'Krushna Park CHSL',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 81,
      lastSoldDate: '21/04/2025',
      lastSoldPrice: '₹25.95 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '81',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 1.15 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'k-inclusive-housing-kharadi',
      name: 'K Inclusive Housing Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 68,
      lastSoldDate: '17/03/2025',
      lastSoldPrice: '₹17.68 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '68',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '9.9 Lac - 1.24 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'samarth-colony-kharadi',
      name: 'Samarth Colony Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 58,
      lastSoldDate: '09/02/2024',
      lastSoldPrice: '₹0.20 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '58',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 0.01 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: '',
      name: 'देव एकझोटिका या बिल्डींग',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 57,
      lastSoldDate: '13/03/2024',
      lastSoldPrice: '₹2.10 Cr',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '57',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 28.00 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'samta-housing-society',
      name: 'Samta Housing Society',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 52,
      lastSoldDate: '30/01/2024',
      lastSoldPrice: '₹0.13 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '52',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 0.00 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'shreeram-co-operative-housing-society-kharadi',
      name: 'Shreeram Co-operative Housing Society Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 31,
      lastSoldDate: '24/07/2024',
      lastSoldPrice: '₹29.65 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '31',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 1.91 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'shri-gangai-kunj-kharadi',
      name: 'Shri Gangai Kunj Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 14,
      lastSoldDate: '10/07/2024',
      lastSoldPrice: '₹0.23 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '14',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 0.00 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'sara-chawl-kharadi',
      name: 'Sara Chawl Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 14,
      lastSoldDate: '03/11/2025',
      lastSoldPrice: '₹0.12 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '14',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 0.00 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'jadhav-apartment-kharadi',
      name: 'Jadhav Apartment Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 12,
      lastSoldDate: '10/04/2024',
      lastSoldPrice: '₹0.13 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '12',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 0.00 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'shivkrupa-niwas-kharadi',
      name: 'Shivkrupa Niwas Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 10,
      lastSoldDate: '05/12/2024',
      lastSoldPrice: '₹0.11 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '10',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 0.00 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'bhauncha-ashirwad-kharadi',
      name: 'Bhauncha Ashirwad Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 9,
      lastSoldDate: '19/07/2024',
      lastSoldPrice: '₹0.17 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '9',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 0.00 Cr',
      reraNumbers: '59',
      priceTrendDirection: 'up'
    },
    {
      id: 'tribhuwan-near-jawalkar-kirana-shop',
      name: 'Tribhuwan Near Jawalkar Kirana Shop',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 9,
      lastSoldDate: '07/05/2025',
      lastSoldPrice: '₹0.10 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '9',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.0 Lac - 0.00 Cr',
      reraNumbers: '61',
      priceTrendDirection: 'up'
    },
    {
      id: 'ram-krushna-niwas-kharadi',
      name: 'Ram Krushna Niwas Kharadi',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: 9,
      lastSoldDate: '29/04/2026',
      lastSoldPrice: '₹0.12 Lac',
      developer: 'Reputed Kharadi Builder',
      totalUnits: '200',
      soldUnits: '9',
      completion: 'Ready / 2026 - 2027',
      bhks: '1, 2, 3 BHK',
      quotedPricing: '0.1 Lac - 0.00 Cr',
      reraNumbers: '63',
      priceTrendDirection: 'up'
    }
  ],

  'mumbai/thane-west': [
    {
      id: 'runwal-lands-end',
      name: 'Runwal Lands End',
      city: 'Mumbai',
      locality: 'Thane West',
      saleTxns: 5204,
      lastSoldDate: 'Oct 2026',
      lastSoldPrice: 'Rs. 1.01 Cr',
      developer: 'Runwal Group',
      totalUnits: '15,344',
      soldUnits: '5,204',
      completion: 'Jun 2029 - Apr 2031',
      bhks: '1, 2',
      quotedPricing: '66.96 Lac - 1.08 Cr',
      reraNumbers: 'P51700046298, P51700056121',
      priceTrendDirection: 'down'
    },
    {
      id: 'y-square',
      name: 'Y Square',
      city: 'Mumbai',
      locality: 'Thane West',
      saleTxns: 838,
      lastSoldDate: '29 Sep 2026',
      lastSoldPrice: 'Rs. 56.09 Lac',
      developer: 'Y Developers',
      totalUnits: '450',
      soldUnits: '380',
      completion: 'Dec 2026',
      bhks: '1, 2',
      quotedPricing: '55 - 85 Lac',
      reraNumbers: 'P51700030114',
      priceTrendDirection: 'up'
    }
  ],
  'pune/saswad-road': [
    {
      id: 'heera-solitaire',
      name: 'Heera Solitaire',
      city: 'Pune',
      locality: 'Saswad Road',
      saleTxns: 2,
      lastSoldDate: 'Mar 2026',
      lastSoldPrice: 'Rs. 42.50 Lac',
      developer: 'Heera Developer',
      totalUnits: '-',
      soldUnits: '-',
      completion: '-',
      rera: '-',
      quotedPricing: '-',
      reraNumbers: '-',
      priceTrendDirection: 'down'
    },
    {
      id: 'ekpat-lavania',
      name: 'Ekpat Lavania',
      city: 'Pune',
      locality: 'Saswad Road',
      saleTxns: 0,
      lastSoldDate: 'Jan 2025',
      lastSoldPrice: 'Rs. 38.00 Lac',
      developer: 'Ekpat Group',
      totalUnits: 48,
      soldUnits: 32,
      completion: 'Ready to Move',
      rera: 'P52100021455',
      quotedPricing: 'Rs. 36 - 45 Lac',
      reraNumbers: 'P52100021455',
      priceTrendDirection: 'stable'
    },
    {
      id: 'satyam-shiv-florence',
      name: 'Satyam Shiv Florence',
      city: 'Pune',
      locality: 'Saswad Road',
      saleTxns: 0,
      lastSoldDate: 'Nov 2024',
      lastSoldPrice: 'Rs. 51.20 Lac',
      developer: 'Satyam Shiv Infra',
      totalUnits: 72,
      soldUnits: 55,
      completion: 'Ready to Move',
      rera: 'P52100018902',
      quotedPricing: 'Rs. 48 - 62 Lac',
      reraNumbers: 'P52100018902',
      priceTrendDirection: 'up'
    }
  ]
};

export const PROJECT_DETAILS = {
  'vj-indiworks-kharadi-central': {
    id: 'vj-indiworks-kharadi-central',
    slug: 'Pune Kharadi VJ IndiWorks Kharadi Central/kh-101',
    name: 'VJ IndiWorks Kharadi Central',
    city: 'Pune',
    locality: 'Kharadi',
    developer: 'Vilas Javdekar Developers',
    totalUnits: '1,450',
    soldUnits: '672',
    completion: 'Dec 2026',
    bhks: 'Office, Commercial',
    quotedPricing: '25.0 Lac - 1.00 Cr',
    reraNumbers: '63',
    lastSold: {
      date: '21/02/2026',
      amount: '₹49.56 Lac',
      direction: 'up'
    },
    bhkAnalysis: {
      updatedDate: 'Last Updated on MahaRERA / IGR - Apr 2025',
      soldPercentage: 82,
      unitsSoldSummary: '672 of 1,450',
      breakdown: [
        { bhk: 'Commercial Office', totalUnits: '950', unitsSold: '540', percentage: '57%' },
        { bhk: 'Retail Spaces', totalUnits: '500', unitsSold: '132', percentage: '26%' }
      ]
    },
    totalTransactionsCount: 672,
    transactions: {
      sale: [
        { id: 'kh-3861', date: '21/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #529', amount: '₹49.96 Lac', purchaser: 'राहुल राजाभाऊ पाठारे', docNo: '1735/2025', isLocked: true },
        { id: 'kh-3752', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #537', amount: '₹49.96 Lac', purchaser: 'गुलाब गोपाळ सवदे.', docNo: '1176/2025', isLocked: true },
        { id: 'kh-3753', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #538', amount: '₹49.12 Lac', purchaser: 'राहुल नानासाहेब लंके', docNo: '1197/2025', isLocked: true },
        { id: 'kh-3754', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #539', amount: '₹49.12 Lac', purchaser: 'मंगेश नानाभाऊ लंके.', docNo: '1198/2025', isLocked: true },
        { id: 'kh-3755', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #540', amount: '₹48.28 Lac', purchaser: 'महेश दत्तात्रय रुद्रवार-', docNo: '1199/2025', isLocked: true },
        { id: 'kh-3756', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #541', amount: '₹49.54 Lac', purchaser: 'महेंद्र सिंग लोधी', docNo: '1196/2025', isLocked: true },
        { id: 'kh-3757', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #542', amount: '₹49.96 Lac', purchaser: 'गितांजली संदीप वाघ-', docNo: '1193/2025', isLocked: true },
        { id: 'kh-3758', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #543', amount: '₹50.80 Lac', purchaser: 'स्वप्नाली शशिकांत नारकर', docNo: '1186/2025', isLocked: true },
        { id: 'kh-3759', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #544', amount: '₹48.28 Lac', purchaser: 'मनोज बलाना तर्फे कु. मु. धारक मंगलदास मारुती आवटे.', docNo: '1177/2025', isLocked: true },
        { id: 'kh-3760', date: '11/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #545', amount: '₹48.28 Lac', purchaser: 'रुपाली एकनाथ पडवळ', docNo: '1202/2025', isLocked: true },
        { id: 'kh-3761', date: '12/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #546', amount: '₹33.70 Lac', purchaser: 'दिलीप वसंत काळे-', docNo: '1240/2025', isLocked: true },
        { id: 'kh-3762', date: '12/02/2026', type: 'Sale / Title Deed', floorTower: 'Building न', unit: 'Unit #547', amount: '₹33.70 Lac', purchaser: 'शैलजा दिलीप काळे', docNo: '1241/2025', isLocked: true }
      ],
      rent: []
    },
    litigations: { totalCases: '0', items: [] },
    reraComplaints: { totalComplaints: '0', items: [] }
  },
  'palladio-kharadi-central-phase-2': {
    id: 'palladio-kharadi-central-phase-2',
    slug: 'Pune Kharadi Palladio Kharadi Central Phase 2/kh-102',
    name: 'Palladio Kharadi Central Phase 2',
    city: 'Pune',
    locality: 'Kharadi',
    developer: 'Vilas Javdekar Developers',
    totalUnits: '850',
    soldUnits: '499',
    completion: 'Ready / 2026',
    bhks: '2, 3 BHK',
    quotedPricing: '41.9 Lac - 1.64 Cr',
    reraNumbers: '61',
    lastSold: {
      date: '11/04/2025',
      amount: '₹1.12 Cr',
      direction: 'up'
    },
    bhkAnalysis: {
      updatedDate: 'Last Updated on MahaRERA / IGR - Apr 2025',
      soldPercentage: 74,
      unitsSoldSummary: '499 of 850',
      breakdown: [
        { bhk: '2 BHK', totalUnits: '480', unitsSold: '310', percentage: '65%' },
        { bhk: '3 BHK', totalUnits: '370', unitsSold: '189', percentage: '51%' }
      ]
    },
    totalTransactionsCount: 499,
    transactions: {
      sale: [
        { id: 'kh-3315', date: '11/04/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #101', amount: '₹1.24 Cr', purchaser: 'KOMALGAJANANPANDE', docNo: '8981/2025', isLocked: true },
        { id: 'kh-3317', date: '22/04/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #103', amount: '₹78.89 Lac', purchaser: 'SACHIN PRABHAKAR BIRAJDAR ', docNo: '9871/2025', isLocked: true },
        { id: 'kh-3318', date: '22/04/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #104', amount: '₹1.24 Cr', purchaser: 'ANSHUL KHANDELWAL ', docNo: '9886/2025', isLocked: true },
        { id: 'kh-3319', date: '02/05/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #105', amount: '₹80.15 Lac', purchaser: 'GAUTAMKUMAR', docNo: '10365/2025', isLocked: true },
        { id: 'kh-3321', date: '13/05/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #107', amount: '₹81.99 Lac', purchaser: 'RANJAN RAMCHANDRA DAUNDKAR ', docNo: '11057/2025', isLocked: true },
        { id: 'kh-3322', date: '26/05/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #108', amount: '₹1.24 Cr', purchaser: 'SHRIRANGDATTATRAYHALWE', docNo: '12074/2025', isLocked: true },
        { id: 'kh-3327', date: '27/06/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #113', amount: '₹1.10 Cr', purchaser: 'SANDESH SUHAS KULKARNI ', docNo: '14839/2025', isLocked: true },
        { id: 'kh-3330', date: '14/07/2025', type: 'Sale / Title Deed', floorTower: 'Building E2', unit: 'Unit #116', amount: '₹1.30 Cr', purchaser: 'SHILPA SHARMA', docNo: '15570/2025', isLocked: true },
        { id: 'kh-3339', date: '08/11/2025', type: 'Sale / Title Deed', floorTower: 'Building E2', unit: 'Unit #125', amount: '₹60.47 Lac', purchaser: 'DEEPA PUROHIT', docNo: '4380/2025', isLocked: true },
        { id: 'kh-3340', date: '26/06/2025', type: 'Sale / Title Deed', floorTower: 'Building E3', unit: 'Unit #126', amount: '₹1.24 Cr', purchaser: 'TANUSHREE GANESH ADHAO', docNo: '5745/2025', isLocked: true },
        { id: 'kh-3341', date: '11/09/2025', type: 'Sale / Title Deed', floorTower: 'Wing E2', unit: 'Unit #127', amount: '₹90.28 Lac', purchaser: 'ASMITAKATIYAR', docNo: '18607/2025', isLocked: true },
        { id: 'kh-3342', date: '23/09/2025', type: 'Sale / Title Deed', floorTower: 'Wing E-3', unit: 'Unit #128', amount: '₹75.00 Lac', purchaser: 'TARUNMAHESHKUMARGEHI', docNo: '19130/2025', isLocked: true }
      ],
      rent: []
    },
    litigations: { totalCases: '0', items: [] },
    reraComplaints: { totalComplaints: '0', items: [] }
  },

  'runwal-lands-end': {
    id: 'runwal-lands-end',
    slug: 'Mumbai Thane West Runwal Lands End/131123',
    name: 'Runwal Lands End',
    city: 'Mumbai',
    locality: 'Thane West',
    developer: 'Runwal Group',
    totalUnits: '15,344',
    soldUnits: '5,204',
    completion: 'Jun 2029 - Apr 2031',
    bhks: '1, 2',
    quotedPricing: '66.96 Lac - 1.08 Cr',
    reraNumbers: 'P51700046298, P51700056121',
    lastSold: {
      date: 'Oct 2026',
      amount: 'Rs. 1.01 Cr',
      direction: 'down'
    },
    bhkAnalysis: {
      updatedDate: 'Last Updated on MahaRERA - Jan 2025',
      soldPercentage: 34,
      unitsSoldSummary: '1,301 of 3,836',
      breakdown: [
        { bhk: '1 BHK', totalUnits: '2,450', unitsSold: '880', percentage: '36%' },
        { bhk: '2 BHK', totalUnits: '1,386', unitsSold: '421', percentage: '30%' }
      ]
    },
    totalTransactionsCount: 5204,
    transactions: {
      sale: [
        { id: 'rw-1', date: 'Oct, 2026', type: 'Sale', floorTower: '18, Tower 2', unit: '1804', amount: '₹ 1.01 Cr', isLocked: true },
        { id: 'rw-2', date: 'Sep, 2026', type: 'Sale', floorTower: '12, Tower 1', unit: '1202', amount: '₹ 89.50 Lac', isLocked: true },
        { id: 'rw-3', date: 'Aug, 2026', type: 'Sale', floorTower: '7, Tower 3', unit: '705', amount: '₹ 72.80 Lac', isLocked: true }
      ],
      rent: []
    },
    litigations: { totalCases: '-', items: [] },
    reraComplaints: { totalComplaints: '-', items: [] },
    trendingProjectsInLocality: [
      { id: 'y-square', name: 'Y Square', saleTxns: 838 }
    ]
  },
  'heera-solitaire': {
    id: 'heera-solitaire',
    slug: 'Pune Saswad Road Heera Solitaire/82558',
    name: 'Heera Solitaire',
    city: 'Pune',
    locality: 'Saswad Road',
    developer: 'Heera Developer',
    totalUnits: '-',
    soldUnits: '-',
    completion: '-',
    bhks: '1, 2',
    rera: '-',
    quotedPricing: '-',
    reraNumbers: '-',
    lastSold: {
      date: 'Mar 2026',
      amount: 'Rs. 42.50 Lac',
      direction: 'down'
    },
    totalTransactionsCount: 72,
    transactions: {
      sale: [
        { id: 'tx-1', date: 'Mar, 2026', type: 'Sale', floorTower: '3, -', unit: '301', amount: '₹ 42.50 Lac', isLocked: true },
        { id: 'tx-2', date: 'Feb, 2026', type: 'Sale', floorTower: '3, -', unit: '301', amount: '₹ 42.50 Lac', isLocked: true }
      ],
      rent: []
    },
    litigations: { totalCases: '-', items: [] },
    reraComplaints: { totalComplaints: '-', items: [] },
    trendingProjectsInLocality: [
      { id: 'satyam-shiv-florence', name: 'Satyam Shiv Florence', saleTxns: 0 },
      { id: 'ekpat-lavania', name: 'Ekpat Lavania', saleTxns: 0 }
    ]
  },
  'y-square': {
    id: 'y-square',
    slug: 'Mumbai Thane West Y Square/144282',
    name: 'Y Square',
    city: 'Mumbai',
    locality: 'Thane West',
    developer: 'Y Developers',
    totalUnits: '450',
    soldUnits: '380',
    completion: 'Dec 2026',
    bhks: '1, 2',
    rera: 'P51700030114',
    quotedPricing: 'Rs. 55 - 85 Lac',
    reraNumbers: 'P51700030114',
    lastSold: {
      date: 'Sep 2026',
      amount: 'Rs. 56.09 Lac',
      direction: 'up'
    },
    totalTransactionsCount: 838,
    transactions: {
      sale: [
        { id: '11089052', date: '29 Sep, 2026', type: 'Sale', floorTower: '5, 21 B', unit: '512', amount: '₹ 56.09 Lac', isLocked: true }
      ],
      rent: []
    },
    litigations: { totalCases: '-', items: [] },
    reraComplaints: { totalComplaints: '-', items: [] },
    trendingProjectsInLocality: [
      { id: 'runwal-lands-end', name: 'Runwal Lands End', saleTxns: 5204 }
    ]
  }
};

export const Y_SQUARE_TRANSACTIONS = [
  {
    id: '11089052',
    date: '29 Sep, 2026',
    project: 'Y Square',
    locality: 'Thane West',
    type: 'Sale',
    floorTower: '5, 21 B',
    unit: '512',
    displayAmount: '₹56.09 Lac',
    exactAmount: '₹56,08,952',
    isLocked: true,
    areaSqFt: 323,
    rateSqFt: '₹17,388',
    saleType: 'Developer Sale',
    carpetType: 'Carpet'
  },
  {
    id: '11089053',
    date: '29 Sep, 2026',
    project: 'Y Square',
    locality: 'Thane West',
    type: 'Sale',
    floorTower: '14, 21 B',
    unit: '1409',
    displayAmount: '₹62.40 Lac',
    exactAmount: '₹62,40,000',
    isLocked: true,
    areaSqFt: 360,
    rateSqFt: '₹17,333',
    saleType: 'Developer Sale',
    carpetType: 'Carpet'
  },
  {
    id: '11089054',
    date: '28 Sep, 2026',
    project: 'Y Square',
    locality: 'Thane West',
    type: 'Sale',
    floorTower: '7, 21 B',
    unit: '712',
    displayAmount: '₹57.50 Lac',
    exactAmount: '₹57,50,000',
    isLocked: true,
    areaSqFt: 330,
    rateSqFt: '₹17,424',
    saleType: 'Developer Sale',
    carpetType: 'Carpet'
  }
];

export const TRANSACTION_DETAILS_BY_ID = {
  '11089052': {
    id: '11089052',
    project: 'Y Square',
    locality: 'Thane West',
    city: 'Mumbai',
    viewedBy: '20+ buyers',
    amountHeadline: '₹56.09 Lac',
    saleTypeBadge: 'Sale',
    amountExact: '₹56,08,952',
    registrationDate: '29 Sep 2026',
    areaSqFt: '323',
    ratePerSqFt: '₹17,388',
    unitNo: '512',
    floor: '5',
    towerWing: '21 / B',
    areaType: 'Carpet',
    saleType: 'Developer Sale',
    description: 'Residential apartment unit 512 located on 5th floor in Wing B of Y Square, registered at Thane Joint Sub-Registrar Office under Maharashtra Stamp Act.',
    agreementCopyPrice: 'Rs. 699'
  }
};

export const FAQS_BY_LOCALITY = {
  'saswad-road': [
    {
      question: 'What is the range of housing prices in Saswad Road?',
      answer: 'Properties in Saswad Road range between ₹ 28 Lac to ₹ 75 Lac, with an average registration rate of ₹ 4,850 per sq. ft.'
    }
  ]
};
