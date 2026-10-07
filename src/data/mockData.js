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
    id: 'mumbai', 
    name: 'Mumbai', 
    state: 'Maharashtra', 
    totalLocalities: 332, 
    totalProjects: 3200,
    monument: 'gateway-of-india',
    monumentName: 'Gateway of India'
  },
  { 
    id: 'pune', 
    name: 'Pune', 
    state: 'Maharashtra', 
    totalLocalities: 282, 
    totalProjects: 1450,
    monument: 'shaniwar-wada',
    monumentName: 'Shaniwar Wada'
  },
  { 
    id: 'bangalore', 
    name: 'Bangalore', 
    state: 'Karnataka', 
    totalLocalities: 340, 
    totalProjects: 2100,
    monument: 'vidhana-soudha',
    monumentName: 'Vidhana Soudha'
  },
  { 
    id: 'hyderabad', 
    name: 'Hyderabad', 
    state: 'Telangana', 
    totalLocalities: 220, 
    totalProjects: 1300,
    monument: 'charminar',
    monumentName: 'Charminar'
  },
  { 
    id: 'chennai', 
    name: 'Chennai', 
    state: 'Tamil Nadu', 
    totalLocalities: 195, 
    totalProjects: 1150,
    monument: 'ripon-building',
    monumentName: 'Ripon Building'
  },
  { 
    id: 'noida', 
    name: 'Noida', 
    state: 'Uttar Pradesh', 
    totalLocalities: 180, 
    totalProjects: 980,
    monument: 'noida-tower',
    monumentName: 'Noida City Center'
  },
  { 
    id: 'delhi', 
    name: 'Delhi', 
    state: 'Delhi NCR', 
    totalLocalities: 380, 
    totalProjects: 2600,
    monument: 'india-gate',
    monumentName: 'India Gate'
  },
  { 
    id: 'ahmedabad', 
    name: 'Ahmedabad', 
    state: 'Gujarat', 
    totalLocalities: 175, 
    totalProjects: 890,
    monument: 'sidi-saiyyed',
    monumentName: 'Sidi Saiyyed Mosque'
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
    amount: '₹3.25 Cr',
    locality: 'Whitefield, Bangalore',
    unit: 'Villa No. 42',
    carpetArea: '2,800 sq.ft'
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

// Complete Localities by City (Matches Screenshot 2 for Mumbai)
export const LOCALITIES_BY_CITY = {
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
  ],
  pune: [
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
  bangalore: [
    { id: 'whitefield', name: 'Whitefield', saleTxns: 1420, activeProjects: 34, avgPriceSqFt: '₹ 8,200/sq.ft' },
    { id: 'bellandur', name: 'Bellandur', saleTxns: 1100, activeProjects: 22, avgPriceSqFt: '₹ 9,500/sq.ft' },
    { id: 'sarjapur-road', name: 'Sarjapur Road', saleTxns: 1280, activeProjects: 29, avgPriceSqFt: '₹ 7,800/sq.ft' },
    { id: 'electronic-city', name: 'Electronic City', saleTxns: 950, activeProjects: 25, avgPriceSqFt: '₹ 5,600/sq.ft' }
  ],
  hyderabad: [
    { id: 'gachibowli', name: 'Gachibowli', saleTxns: 840, activeProjects: 26, avgPriceSqFt: '₹ 8,900/sq.ft' },
    { id: 'madhapur', name: 'Madhapur', saleTxns: 690, activeProjects: 21, avgPriceSqFt: '₹ 9,800/sq.ft' },
    { id: 'kondapur', name: 'Kondapur', saleTxns: 780, activeProjects: 24, avgPriceSqFt: '₹ 8,200/sq.ft' }
  ],
  chennai: [
    { id: 'omr', name: 'Old Mahabalipuram Road', saleTxns: 610, activeProjects: 19, avgPriceSqFt: '₹ 6,400/sq.ft' },
    { id: 'velachery', name: 'Velachery', saleTxns: 540, activeProjects: 16, avgPriceSqFt: '₹ 8,100/sq.ft' }
  ],
  noida: [
    { id: 'sector-150', name: 'Sector 150', saleTxns: 520, activeProjects: 18, avgPriceSqFt: '₹ 6,500/sq.ft' },
    { id: 'sector-137', name: 'Sector 137', saleTxns: 480, activeProjects: 14, avgPriceSqFt: '₹ 5,800/sq.ft' }
  ],
  delhi: [
    { id: 'dwarka', name: 'Dwarka', saleTxns: 790, activeProjects: 22, avgPriceSqFt: '₹ 11,200/sq.ft' },
    { id: 'rohini', name: 'Rohini', saleTxns: 640, activeProjects: 19, avgPriceSqFt: '₹ 10,500/sq.ft' }
  ],
  ahmedabad: [
    { id: 'sg-highway', name: 'SG Highway', saleTxns: 560, activeProjects: 17, avgPriceSqFt: '₹ 5,400/sq.ft' },
    { id: 'bopal', name: 'Bopal', saleTxns: 490, activeProjects: 15, avgPriceSqFt: '₹ 4,700/sq.ft' }
  ]
};

export const PROJECTS_BY_LOCALITY = {
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
