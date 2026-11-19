const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const priceListArchive = require('./data/price-list-archive.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    if (!priceListArchive.length) return [];
    return [{
      source: '/cjenik.csv',
      headers: [
        { key: 'Content-Type', value: 'text/csv; charset=utf-8' },
        { key: 'Content-Disposition', value: `attachment; filename="${priceListArchive[0].filename}"` },
      ],
    }, {
      source: '/cjenik-excel.csv',
      headers: [
        { key: 'Content-Type', value: 'text/csv; charset=utf-8' },
        { key: 'Content-Disposition', value: `attachment; filename="${priceListArchive[0].filename.replace(/\.csv$/, '_EXCEL.csv')}"` },
      ],
    }];
  },
};

module.exports = (phase) => ({
  ...nextConfig,
  // Builds must not replace assets being served by a running development server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
