import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.resolve(__dirname, '../data 1.9.csv');

function parseCSV(content) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const next = content[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(cur);
      cur = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row.push(cur);
      cur = '';
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        rows.push(row);
      }
      row = [];
    } else {
      cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

const content = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(content);

console.log(`Parsed ${rows.length} rows.`);

// Let's inspect column names based on property_records schema:
// 0: id
// 1: input_dist
// 2: input_tahsil
// 3: input_village
// 4: input_year
// 5: input_prop_no
// 6: property_number
// 7: rera_id
// 8: doc_no
// 9: d_name
// 10: r_date
// 11: sro_name
// 12: seller_name
// 13: purchaser_name
// 14: property_description
// 15: sro_code
// 16: status
// 17: vilekha_type
// 18: consideration
// 19: market_value
// 20: bhmapan
// 21: area
// 22: aakarni
// 23: seller_details
// 24: purchaser_details
// 25: doc_date
// 26: reg_date_inner
// 27: serial_no
// 28: stamp_duty
// 29: reg_fee
// 30: remarks
// 31: valuation_details
// 32: article_selected
// 33: extracted_text
// 34: signature
// 35: scraped_at
// 36: docno
// 37: dname
// 38: rdate
// 39: sroname
// 40: srocode
// 41: survey_no
// 42: pdf_link
// 43: society_name
// 44: building_name
// 45: flat_no
// 46: floor
// 47: property_type
// 48: plot_no
// 49: survey_cts_no
// 50: area_sqft
// 51: area_sqm
// 52: cleaned_doc_type
// 53: pdf_links

const projectMap = {};

for (const r of rows) {
  let society = (r[43] || '').trim();
  let bldg = (r[44] || '').trim();
  let desc = (r[14] || '').trim();
  let flat = (r[45] || '').trim();
  let floor = (r[46] || '').trim();
  let rera = (r[7] || '').trim();
  let priceStr = (r[18] || r[19] || '').replace(/[^0-9]/g, '');
  let price = parseInt(priceStr, 10) || 0;
  let date = r[10] || r[25] || '';
  let carpetArea = r[21] || r[50] || '';
  let docNo = r[8] || r[36] || '';
  let purchaser = (r[13] || '').replace(/[{}"']/g, '').trim();
  let seller = (r[12] || '').trim();

  // Normalize project name
  let name = society;
  if (!name || name === 'SOCIETY_PROJECT' || name.length < 3) {
    if (bldg && bldg.length > 2 && !bldg.toLowerCase().startsWith('building') && !bldg.toLowerCase().startsWith('wing')) {
      name = bldg;
    } else if (desc) {
      name = desc;
    }
  }

  // Clean name from leading flat numbers (e.g. "407 PALLADIO KHARADI CENTRAL PH-2" -> "PALLADIO KHARADI CENTRAL PH-2")
  name = name.replace(/^[0-9]+[\s,\-]+/, '').trim();
  // Strip trailing building/wing if standard
  name = name.replace(/,?\s*(BLDG|BUILDING|WING)\s*[\-\w]+$/i, '').trim();

  if (!name) name = 'Kharadi Prime Residences';

  if (!projectMap[name]) {
    projectMap[name] = {
      name,
      count: 0,
      rera: rera || '',
      prices: [],
      dates: [],
      recentTransactions: [],
      buildings: new Set(),
      areas: []
    };
  }

  const proj = projectMap[name];
  proj.count++;
  if (price > 0) proj.prices.push(price);
  if (date) proj.dates.push(date);
  if (bldg) proj.buildings.add(bldg);
  if (carpetArea) proj.areas.push(carpetArea);
  if (rera && !proj.rera) proj.rera = rera;

  if (proj.recentTransactions.length < 8) {
    proj.recentTransactions.push({
      id: r[0] || String(Math.random()),
      docNo,
      date,
      price,
      priceFormatted: price > 0 ? (price >= 10000000 ? `₹${(price/10000000).toFixed(2)} Cr` : `₹${(price/100000).toFixed(2)} Lac`) : '₹--',
      purchaser: purchaser.split(',')[0] || 'Verified Citizen',
      seller: seller || 'Promoter / Builder',
      unit: flat ? `Flat ${flat}` : (desc.match(/Flat\s*No[:\s]*([^\s,]+)/i)?.[1] ? `Flat ${desc.match(/Flat\s*No[:\s]*([^\s,]+)/i)[1]}` : 'Residential Unit'),
      carpetArea: carpetArea.replace(/^1\)\s*/, '').trim() || '650 - 1,250 sq.ft',
      building: bldg || 'Wing A'
    });
  }
}

const sortedProjects = Object.values(projectMap).sort((a, b) => b.count - a.count);

console.log(`Identified ${sortedProjects.length} distinct projects/societies in Kharadi.`);
console.log('Top 15 projects:');
sortedProjects.slice(0, 15).forEach(p => {
  const avgPrice = p.prices.length > 0 ? Math.round(p.prices.reduce((a,b)=>a+b,0)/p.prices.length) : 0;
  console.log(`- ${p.name}: ${p.count} transactions, avg: ₹${(avgPrice/100000).toFixed(1)}L, buildings: ${Array.from(p.buildings).slice(0, 3).join(', ')}`);
});
