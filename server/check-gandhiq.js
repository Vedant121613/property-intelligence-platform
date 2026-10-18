import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('project gandhiq.csv', 'utf8').replace(/^\uFEFF/, '');

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i+1];
    if (c === '"') {
      if (inQ && n === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (c === ',' && !inQ) {
      row.push(cur);
      cur = '';
    } else if ((c === '\r' || c === '\n') && !inQ) {
      if (c === '\r' && n === '\n') i++;
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

const rows = parseCSV(content);
const headers = rows[0].map(h => h.trim());
console.log('Total parsed rows:', rows.length);
console.log('Headers:', headers);

const socIdx = headers.indexOf('society_name');
const consIdx = headers.indexOf('consideration');
const mktIdx = headers.indexOf('market_value');
const dateIdx = headers.indexOf('r_date');
const bldgIdx = headers.indexOf('building_name');
const flatIdx = headers.indexOf('flat_no');
const floorIdx = headers.indexOf('floor');
const descIdx = headers.indexOf('property_description');
const docIdx = headers.indexOf('doc_no');
const dnameIdx = headers.indexOf('d_name');
const sellerIdx = headers.indexOf('10');
const buyerIdx = headers.indexOf('purchaser_name');

console.log({ socIdx, consIdx, mktIdx, dateIdx, bldgIdx, flatIdx, floorIdx });

const societies = {};
let emptySocCount = 0;
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  let s = (r[socIdx] || '').trim();
  if (!s) {
    emptySocCount++;
    // Check if society can be derived from property_description
    const desc = r[descIdx] || '';
    const m = desc.match(/"([^"]+)"/);
    if (m) s = m[1].trim();
  }
  societies[s] = (societies[s] || 0) + 1;
}

console.log('Empty society_name rows:', emptySocCount);
console.log('Societies found:', Object.keys(societies).length);
console.log('Top societies:', Object.entries(societies).sort((a,b)=>b[1]-a[1]).slice(0, 30));

console.log('\nSample 15 rows:');
for (let i = 1; i <= 15; i++) {
  const r = rows[i];
  console.log({
    id: r[1],
    society: r[socIdx],
    building: r[bldgIdx],
    unit: r[flatIdx],
    date: r[dateIdx],
    consideration: r[consIdx],
    market_value: r[mktIdx],
    type: r[dnameIdx]
  });
}

