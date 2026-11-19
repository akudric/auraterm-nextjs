const fs = require('node:fs');
const path = require('node:path');
const { loadTypeScript } = require('./load-typescript.cjs');
const { servicePriceListCsv, servicePriceListExcelCsv, servicePriceListRows } = loadTypeScript('lib/price-list.ts');
const publication = JSON.parse(fs.readFileSync('data/price-list-publication.json', 'utf8'));

if (!/^\d{11}$/.test(publication.oib ?? '')) throw new Error('Set the company OIB in data/price-list-publication.json.');
if (!publication.location || !/^[A-Za-z0-9_-]+$/.test(publication.location)) {
  throw new Error('Set the location filename segment (or ZA_SVA_PRODAJNA_MJESTA when confirmed).');
}
if (!Number.isInteger(publication.revision) || publication.revision < 1) throw new Error('Invalid publication revision.');
if (!/^\d{8}_\d{4}$/.test(publication.publishedAt ?? '')) throw new Error('Set the planned publication time in Europe/Zagreb: YYYYMMDD_HHMM.');

const filename = `${publication.oib}_${publication.location}_USLUGE_${publication.revision}_${publication.publishedAt}.csv`;
const csv = servicePriceListCsv(servicePriceListRows());
const archiveDirectory = path.resolve('public/cjenici');
const archivePath = path.join(archiveDirectory, filename);
if (fs.existsSync(archivePath) && fs.readFileSync(archivePath, 'utf8') !== csv) {
  throw new Error('This release already exists with different prices. Increment revision and update publishedAt; keep the old release.');
}
fs.mkdirSync(archiveDirectory, { recursive: true });
fs.writeFileSync(archivePath, csv, 'utf8');
fs.writeFileSync('public/cjenik.csv', csv, 'utf8');
fs.writeFileSync('public/cjenik-excel.csv', servicePriceListExcelCsv(servicePriceListRows()), 'utf8');

const manifestPath = 'data/price-list-archive.json';
const history = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (!history.some(entry => entry.filename === filename)) {
  history.unshift({ filename, publishedAt: publication.publishedAt, revision: publication.revision });
}
fs.writeFileSync(manifestPath, JSON.stringify(history, null, 2) + '\n');
console.log(`Prepared ${servicePriceListRows().length} services in /cjenik.csv and /cjenici/${filename}`);
