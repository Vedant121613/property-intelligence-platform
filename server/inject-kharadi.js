import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kharadiJsonPath = path.resolve(__dirname, '../src/data/kharadiData.json');
const puneHierarchyJsonPath = path.resolve(__dirname, '../src/data/puneHierarchyData.json');
const puneHierarchyJsPath = path.resolve(__dirname, '../src/data/puneHierarchyData.js');
const mockDataJsPath = path.resolve(__dirname, '../src/data/mockData.js');

const kharadiData = JSON.parse(fs.readFileSync(kharadiJsonPath, 'utf8'));
const puneHierarchy = JSON.parse(fs.readFileSync(puneHierarchyJsonPath, 'utf8'));

console.log(`Processing Kharadi data: ${kharadiData.projects.length} projects, ${kharadiData.totalTransactions} transactions.`);

// 1. Update Haveli Taluka topVillages
const haveliTaluka = puneHierarchy.talukas.find(t => t.slug === 'haveli');
if (haveliTaluka) {
  haveliTaluka.topVillages = ['Kharadi', 'Baner', 'WAGHOLI', 'Pimpri Chinchawad (M Corp.)'];
}

// 2. Put Kharadi AT THE VERY TOP of Haveli villages
if (puneHierarchy.villagesByTaluka && puneHierarchy.villagesByTaluka['haveli']) {
  const existingList = puneHierarchy.villagesByTaluka['haveli'].filter(v => v.slug !== 'kharadi');
  const kharadiVillage = {
    name: 'Kharadi',
    slug: 'kharadi',
    taluka: 'Haveli',
    talukaSlug: 'haveli',
    projectCount: kharadiData.projects.length,
    saleTxns: kharadiData.totalTransactions,
    avgPrice: kharadiData.avgPriceSqFt
  };
  puneHierarchy.villagesByTaluka['haveli'] = [kharadiVillage, ...existingList];
  console.log('Placed Kharadi at top of Haveli villages.');
}

// 3. Populate projectsByVillage['haveli/kharadi']
const kharadiProjects = kharadiData.projects.map(p => ({
  id: p.id,
  projectId: p.projectId,
  name: p.name,
  rera: p.reraNumbers || 'P52100028741',
  regDate: p.lastSoldDate || '2025-04-15',
  address: p.address || 'Kharadi, S.No. 38, Haveli, Pune - 411014',
  pin: p.pin || '411014',
  taluka: 'Haveli',
  village: 'Kharadi',
  developer: p.developer,
  saleTxns: p.saleTxns,
  lastSoldPrice: p.lastSoldPrice,
  lastSoldDate: p.lastSoldDate,
  bhks: p.bhks,
  quotedPricing: p.quotedPricing,
  priceTrendDirection: 'up',
  recentTransactions: p.recentTransactions
}));

puneHierarchy.projectsByVillage['haveli/kharadi'] = kharadiProjects;
console.log(`Populated haveli/kharadi with ${kharadiProjects.length} sorted projects.`);

// Write puneHierarchyData.json
fs.writeFileSync(puneHierarchyJsonPath, JSON.stringify(puneHierarchy), 'utf8');

// Write puneHierarchyData.js
const jsContent = `const puneHierarchy = ${JSON.stringify(puneHierarchy)};\nexport default puneHierarchy;\n`;
fs.writeFileSync(puneHierarchyJsPath, jsContent, 'utf8');
console.log('Updated puneHierarchyData.json and puneHierarchyData.js successfully.');

// 4. Update mockData.js with Kharadi at top of Pune
let mockDataContent = fs.readFileSync(mockDataJsPath, 'utf8');

// A. Insert Kharadi at top of LOCALITIES_BY_CITY.pune if not already there
if (!mockDataContent.includes("id: 'kharadi'")) {
  mockDataContent = mockDataContent.replace(
    /pune:\s*\[/,
    `pune: [\n    { id: 'kharadi', name: 'Kharadi', saleTxns: ${kharadiData.totalTransactions}, activeProjects: ${kharadiData.projects.length}, avgPriceSqFt: '₹ 8,950/sq.ft' },`
  );
  console.log('Added Kharadi at top of LOCALITIES_BY_CITY.pune in mockData.js');
}

// B. Add Kharadi projects into PROJECTS_BY_LOCALITY
if (!mockDataContent.includes("'pune/kharadi':")) {
  const topProjectsMock = kharadiProjects.slice(0, 20).map(p => `    {
      id: '${p.id}',
      name: '${p.name.replace(/'/g, "\\'")}',
      city: 'Pune',
      locality: 'Kharadi',
      saleTxns: ${p.saleTxns},
      lastSoldDate: '${p.lastSoldDate}',
      lastSoldPrice: '${p.lastSoldPrice}',
      developer: '${p.developer.replace(/'/g, "\\'")}',
      totalUnits: '${Math.max(p.saleTxns * 2, 200)}',
      soldUnits: '${p.saleTxns}',
      completion: 'Ready / 2026 - 2027',
      bhks: '${p.bhks}',
      quotedPricing: '${p.quotedPricing}',
      reraNumbers: '${p.rera}',
      priceTrendDirection: 'up'
    }`).join(',\n');

  const kharadiLocalityBlock = `  'pune/kharadi': [\n${topProjectsMock}\n  ],\n`;
  mockDataContent = mockDataContent.replace(
    /export const PROJECTS_BY_LOCALITY = \{/,
    `export const PROJECTS_BY_LOCALITY = {\n${kharadiLocalityBlock}`
  );
  console.log('Added pune/kharadi into PROJECTS_BY_LOCALITY in mockData.js');
}

// C. Add top Kharadi projects into PROJECT_DETAILS
const topProj = kharadiProjects[0]; // VJ IndiWorks
const secondProj = kharadiProjects[1]; // Palladio Kharadi Central Phase 2

if (topProj && !mockDataContent.includes(`'${topProj.id}':`)) {
  const detailsBlock = `  '${topProj.id}': {
    id: '${topProj.id}',
    slug: 'Pune Kharadi ${topProj.name}/kh-101',
    name: '${topProj.name}',
    city: 'Pune',
    locality: 'Kharadi',
    developer: '${topProj.developer}',
    totalUnits: '1,450',
    soldUnits: '${topProj.saleTxns}',
    completion: 'Dec 2026',
    bhks: '${topProj.bhks}',
    quotedPricing: '${topProj.quotedPricing}',
    reraNumbers: '${topProj.rera}',
    lastSold: {
      date: '${topProj.lastSoldDate}',
      amount: '${topProj.lastSoldPrice}',
      direction: 'up'
    },
    bhkAnalysis: {
      updatedDate: 'Last Updated on MahaRERA / IGR - Apr 2025',
      soldPercentage: 82,
      unitsSoldSummary: '${topProj.saleTxns} of 1,450',
      breakdown: [
        { bhk: 'Commercial Office', totalUnits: '950', unitsSold: '540', percentage: '57%' },
        { bhk: 'Retail Spaces', totalUnits: '500', unitsSold: '132', percentage: '26%' }
      ]
    },
    totalTransactionsCount: ${topProj.saleTxns},
    transactions: {
      sale: [
${(topProj.recentTransactions || []).map(t => `        { id: '${t.id}', date: '${t.date}', type: 'Sale / Title Deed', floorTower: '${t.building}', unit: '${t.unit}', amount: '${t.priceFormatted}', purchaser: '${t.purchaser.replace(/'/g, "\\'")}', docNo: '${t.docNo}', isLocked: true }`).join(',\n')}
      ],
      rent: []
    },
    litigations: { totalCases: '0', items: [] },
    reraComplaints: { totalComplaints: '0', items: [] }
  },
  '${secondProj.id}': {
    id: '${secondProj.id}',
    slug: 'Pune Kharadi ${secondProj.name}/kh-102',
    name: '${secondProj.name}',
    city: 'Pune',
    locality: 'Kharadi',
    developer: '${secondProj.developer}',
    totalUnits: '850',
    soldUnits: '${secondProj.saleTxns}',
    completion: 'Ready / 2026',
    bhks: '${secondProj.bhks}',
    quotedPricing: '${secondProj.quotedPricing}',
    reraNumbers: '${secondProj.rera}',
    lastSold: {
      date: '${secondProj.lastSoldDate}',
      amount: '${secondProj.lastSoldPrice}',
      direction: 'up'
    },
    bhkAnalysis: {
      updatedDate: 'Last Updated on MahaRERA / IGR - Apr 2025',
      soldPercentage: 74,
      unitsSoldSummary: '${secondProj.saleTxns} of 850',
      breakdown: [
        { bhk: '2 BHK', totalUnits: '480', unitsSold: '310', percentage: '65%' },
        { bhk: '3 BHK', totalUnits: '370', unitsSold: '189', percentage: '51%' }
      ]
    },
    totalTransactionsCount: ${secondProj.saleTxns},
    transactions: {
      sale: [
${(secondProj.recentTransactions || []).map(t => `        { id: '${t.id}', date: '${t.date}', type: 'Sale / Title Deed', floorTower: '${t.building}', unit: '${t.unit}', amount: '${t.priceFormatted}', purchaser: '${t.purchaser.replace(/'/g, "\\'")}', docNo: '${t.docNo}', isLocked: true }`).join(',\n')}
      ],
      rent: []
    },
    litigations: { totalCases: '0', items: [] },
    reraComplaints: { totalComplaints: '0', items: [] }
  },
`;

  mockDataContent = mockDataContent.replace(
    /export const PROJECT_DETAILS = \{/,
    `export const PROJECT_DETAILS = {\n${detailsBlock}`
  );
  console.log('Added Kharadi top project details into PROJECT_DETAILS in mockData.js');
}

fs.writeFileSync(mockDataJsPath, mockDataContent, 'utf8');
console.log('Updated mockData.js successfully.');
