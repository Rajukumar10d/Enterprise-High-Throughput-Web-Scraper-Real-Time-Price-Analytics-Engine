import { useState } from 'react';
import { PRODUCTS, SOURCES, formatPrice, getLowestPrice, getBestSource, generatePriceHistory } from '../data/mockData';

function downloadCSV(filename, rows) {
  const content = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCurrentPrices() {
  const rows = [['Product', 'Brand', 'SKU', ...SOURCES, 'Lowest Price', 'Best Source']];
  PRODUCTS.forEach(p => {
    const sourcePrices = SOURCES.map(s => p.prices[s] !== null ? p.prices[s] : 'N/A');
    rows.push([
      p.name, p.brand, p.sku,
      ...sourcePrices,
      getLowestPrice(p),
      getBestSource(p),
    ]);
  });
  downloadCSV('current-prices-all-sources.csv', rows);
}

function exportPriceHistory(days) {
  const rows = [['Date', 'Product', ...SOURCES]];
  PRODUCTS.forEach(p => {
    const history = generatePriceHistory(p.id).slice(-days);
    history.forEach(entry => {
      rows.push([
        entry.date,
        p.name,
        ...SOURCES.map(s => entry[s] ?? 'N/A'),
      ]);
    });
  });
  downloadCSV(`price-history-${days}d.csv`, rows);
}

function exportBestDeals() {
  const rows = [['Product', 'Brand', 'SKU', 'Best Source', 'Best Price', 'Savings vs Highest']];
  PRODUCTS.forEach(p => {
    const best = getBestSource(p);
    const bestPrice = p.prices[best];
    const highest = Math.max(...SOURCES.map(s => p.prices[s]).filter(x => x !== null));
    rows.push([p.name, p.brand, p.sku, best, bestPrice, highest - bestPrice]);
  });
  downloadCSV('best-deals-summary.csv', rows);
}

const REPORT_CONFIGS = [
  {
    id: 'current',
    icon: '📊',
    title: 'Current Prices (All 5 Sources)',
    description: 'Snapshot of the latest prices for all 10 products across all 5 sources, with the best source highlighted.',
    color: 'sky',
    badge: 'Live Data',
    rows: `${PRODUCTS.length} products × ${SOURCES.length} sources`,
    action: exportCurrentPrices,
    filename: 'current-prices-all-sources.csv',
  },
  {
    id: 'history-7d',
    icon: '📈',
    title: 'Price History — Last 7 Days',
    description: 'Daily price data for all products and sources over the past 7 days for trend analysis.',
    color: 'purple',
    badge: '7D History',
    rows: `${PRODUCTS.length * 7} data points`,
    action: () => exportPriceHistory(7),
    filename: 'price-history-7d.csv',
  },
  {
    id: 'history-30d',
    icon: '📉',
    title: 'Price History — Last 30 Days',
    description: 'Complete 30-day price history across all products and sources for detailed analysis.',
    color: 'violet',
    badge: '30D History',
    rows: `${PRODUCTS.length * 30} data points`,
    action: () => exportPriceHistory(30),
    filename: 'price-history-30d.csv',
  },
  {
    id: 'deals',
    icon: '💰',
    title: 'Best-Deals Summary',
    description: 'The cheapest source per product with savings amount vs. the highest price available.',
    color: 'emerald',
    badge: 'Arbitrage',
    rows: `${PRODUCTS.length} best-deal picks`,
    action: exportBestDeals,
    filename: 'best-deals-summary.csv',
  },
];

const COLOR_MAP = {
  sky: { border: 'border-sky-800', bg: 'bg-sky-900/10', badge: 'bg-sky-900/50 text-sky-400 border-sky-700', btn: 'border-sky-700 text-sky-400 hover:bg-sky-900/40', icon: 'bg-sky-900/50 text-sky-400' },
  purple: { border: 'border-purple-800', bg: 'bg-purple-900/10', badge: 'bg-purple-900/50 text-purple-400 border-purple-700', btn: 'border-purple-700 text-purple-400 hover:bg-purple-900/40', icon: 'bg-purple-900/50 text-purple-400' },
  violet: { border: 'border-violet-800', bg: 'bg-violet-900/10', badge: 'bg-violet-900/50 text-violet-400 border-violet-700', btn: 'border-violet-700 text-violet-400 hover:bg-violet-900/40', icon: 'bg-violet-900/50 text-violet-400' },
  emerald: { border: 'border-emerald-800', bg: 'bg-emerald-900/10', badge: 'bg-emerald-900/50 text-emerald-400 border-emerald-700', btn: 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/40', icon: 'bg-emerald-900/50 text-emerald-400' },
};

export default function Reports() {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (config) => {
    setDownloading(config.id);
    setTimeout(() => {
      config.action();
      setDownloading(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 text-sm mt-1">One-click CSV exports — download directly to your browser</p>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_CONFIGS.map(config => {
          const c = COLOR_MAP[config.color];
          const isDownloading = downloading === config.id;

          return (
            <div key={config.id} className={`card border ${c.border} ${c.bg} flex flex-col gap-4`}>
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${c.icon}`}>
                  {config.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-white text-sm">{config.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${c.badge}`}>{config.badge}</span>
                  </div>
                  <p className="text-xs text-slate-400">{config.description}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700 pt-3">
                <span>📋 {config.rows}</span>
                <span className="font-mono">{config.filename}</span>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(config)}
                disabled={isDownloading}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                  isDownloading
                    ? 'border-slate-600 text-slate-500 cursor-not-allowed'
                    : c.btn
                }`}
              >
                {isDownloading ? (
                  <><span className="animate-spin">⟳</span> Preparing...</>
                ) : (
                  <><span>⬇️</span> Download CSV</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="card border-slate-700 bg-slate-800/50">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-semibold text-slate-300 text-sm mb-1">About CSV Exports</div>
            <div className="text-xs text-slate-500">
              All exports use real-time mock data and are immediately downloaded to your browser's default download folder.
              Files are UTF-8 encoded and compatible with Excel, Google Sheets, and any CSV reader.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
