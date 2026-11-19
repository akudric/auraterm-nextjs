const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { loadTypeScript } = require('../scripts/load-typescript.cjs');
const { formatPrice, basePriceLabel } = loadTypeScript('lib/prices.ts');
const { servicePriceListCsv, servicePriceListExcelCsv, servicePriceListRows } = loadTypeScript('lib/price-list.ts');
const { regularPlans, multiSplitPlans, addons } = loadTypeScript('lib/site-content.ts');

test('Croatian prices preserve cents and distinguish baseline dates from current prices', () => {
  const normalized = value => value.replace(/\s/g, ' ');
  assert.equal(normalized(formatPrice(337.5)), '337,50 €');
  assert.equal(normalized(formatPrice(18.75)), '18,75 €');
  assert.equal(normalized(formatPrice(0)), '0,00 €');
  assert.equal(normalized(basePriceLabel({ price: 337.5, date: '2026-09-10' })), 'Bazna cijena (10.09.2026.): 337,50 € s PDV-om');
});

test('all displayed prices include exactly 25% VAT and have a historical baseline', () => {
  const entries = [...regularPlans, ...multiSplitPlans, ...addons.map(item => ({ ...item, price: item.cijena }))];
  for (const item of entries) {
    assert.equal(Math.round(item.price * 100), Math.round(item.netPrice * 125));
    assert.ok(item.basePrice);
    assert.ok(Number.isFinite(item.basePrice.price));
    assert.match(item.basePrice.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('CSV covers every displayed service with unambiguous VAT-inclusive prices', () => {
  const rows = servicePriceListRows();
  assert.equal(rows.length, regularPlans.length + multiSplitPlans.length + addons.length);
  const csv = servicePriceListCsv(rows);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.equal(csv.trim().split('\r\n').length, rows.length + 1);
  assert.ok(csv.includes('"337,50";"NE";"337,50"'));
  assert.ok(csv.includes('10.09.2026.'));
  assert.ok(csv.includes('Nadopuna radne tvari (po 100 g)'));
});

test('CSV escapes separators and quotes and does not overwrite a historical price with the current price', () => {
  const csv = servicePriceListCsv([{ name: 'Usluga; "test"', price: 20.25, basePrice: 15.5, baseDate: '2026-09-10', specialSale: false }]);
  assert.ok(csv.includes('"Usluga; ""test""";"20,25";"NE";"15,50"'));
  assert.throws(() => servicePriceListCsv([{ name: 'Test', price: NaN, basePrice: 1, baseDate: '2026-09-10', specialSale: false }]));
});

test('published CSV and immutable release agree with the website data', () => {
  const archive = JSON.parse(fs.readFileSync('data/price-list-archive.json', 'utf8'));
  assert.ok(archive.length > 0, 'Generate the current CSV with npm run prices:update.');
  const expected = servicePriceListCsv(servicePriceListRows());
  assert.equal(fs.readFileSync('public/cjenik.csv', 'utf8'), expected, 'Run npm run prices:update after editing prices.');
  assert.equal(fs.readFileSync('public/cjenik-excel.csv', 'utf8'), servicePriceListExcelCsv(servicePriceListRows()));
  assert.equal(fs.readFileSync(`public/cjenici/${archive[0].filename}`, 'utf8'), expected);
  for (const entry of archive) assert.ok(fs.existsSync(`public/cjenici/${entry.filename}`));
});

test('Excel CSV specifies its delimiter and preserves the standard CSV data and encoding', () => {
  const rows = servicePriceListRows();
  const excel = servicePriceListExcelCsv(rows);
  assert.ok(excel.startsWith('\uFEFFsep=;\r\n'));
  assert.equal(excel.slice('\uFEFFsep=;\r\n'.length), servicePriceListCsv(rows).slice(1));
  assert.ok(!servicePriceListCsv(rows).includes('sep=;'));
});
