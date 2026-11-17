import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScraper } from '../context/ScraperContext';
import { PRODUCTS, SOURCES, formatPrice, getLowestPrice, getHighestPrice, getBestSource, getArbitrageGap } from '../data/mockData';

const SOURCE_BADGE_COLORS = {
  Amazon: 'bg-orange-900/50 text-orange-400 border-orange-700',
  Flipkart: 'bg-blue-900/50 text-blue-400 border-blue-700',
  Croma: 'bg-green-900/50 text-green-400 border-green-700',
  Snapmint: 'bg-purple-900/50 text-purple-400 border-purple-700',
  Myntra: 'bg-pink-900/50 text-pink-400 border-pink-700',
};

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const {
    products,
    relativeGlobalScrape,
    secondsRemaining,
    intervalSeconds,
    setIntervalSeconds,
    isScrapingAll,
    justUpdated,
    handleReScrapeAll,
  } = useScraper();

  const topArbitrageProduct = products.length > 0
    ? [...products].sort((a, b) => getArbitrageGap(b) - getArbitrageGap(a))[0]
    : null;
  const maxArbitrageGap = topArbitrageProduct ? getArbitrageGap(topArbitrageProduct) : 0;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalSources = SOURCES.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time price intelligence across all sources</p>
        </div>

        {/* Live Auto-Scrape Countdown Control */}
        <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isScrapingAll ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 live-dot'}`}></span>
            <span className="text-xs text-slate-300">
              {isScrapingAll ? (
                <span className="text-amber-400 font-semibold">Auto-scraping new prices...</span>
              ) : (
                <>Next auto-scrape in <span className="text-sky-400 font-mono font-bold">{secondsRemaining}s</span></>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
            {[30, 60, 120].map(s => (
              <button
                key={s}
                onClick={() => setIntervalSeconds(s)}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  intervalSeconds === s ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title={`Set auto-scrape interval to ${s}s`}
              >
                {s < 60 ? `${s}s` : `${s / 60}m`}
              </button>
            ))}
          </div>

          <button
            onClick={handleReScrapeAll}
            disabled={isScrapingAll}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0 ml-1"
            title="Force scrape all right now"
          >
            🔄 <span className="hidden md:inline">Sync Now</span>
          </button>
        </div>
      </div>

      {/* Live Price Update Flash Alert */}
      {justUpdated && (
        <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-3.5 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-sm text-emerald-300">
            <span className="text-lg">⚡</span>
            <span><strong>Live Prices Updated:</strong> Fresh price data scraped across Amazon, Flipkart, Croma, Snapmint & Myntra!</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold">Just now</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search by name, brand, or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">✕</button>
        )}
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-900/50 rounded-lg flex items-center justify-center text-sky-400 text-xl">📦</div>
          <div>
            <div className="text-2xl font-heading font-bold text-white">{products.length}</div>
            <div className="text-xs text-slate-400">Total Products</div>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-400 text-xl">🏪</div>
          <div>
            <div className="text-2xl font-heading font-bold text-white">{totalSources}</div>
            <div className="text-xs text-slate-400">Sources</div>
          </div>
        </div>
        <div
          onClick={() => navigate('/scraper-status')}
          className="card flex items-center gap-3 cursor-pointer hover:border-emerald-700/60 transition-colors group"
          title="Click to view scraper status"
        >
          <div className="w-10 h-10 bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-400 text-xl group-hover:scale-110 transition-transform">📡</div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="live-dot w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
              <span className="text-sm font-heading font-bold text-emerald-400">{relativeGlobalScrape}</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              Last Scraped <span className="text-emerald-500 text-[10px]">● Live</span>
            </div>
          </div>
        </div>
        <div
          onClick={() => topArbitrageProduct && navigate(`/product/${topArbitrageProduct.id}`)}
          className="card flex items-center gap-3 cursor-pointer hover:border-yellow-700/60 transition-colors group"
          title={`Click to view ${topArbitrageProduct?.name}`}
        >
          <div className="w-10 h-10 bg-yellow-900/50 rounded-lg flex items-center justify-center text-yellow-400 text-xl group-hover:scale-110 transition-transform">💰</div>
          <div className="overflow-hidden">
            <div className="text-lg font-heading font-bold text-yellow-400">{formatPrice(maxArbitrageGap)}</div>
            <div className="text-xs text-slate-400 truncate max-w-[140px]" title={topArbitrageProduct?.name}>
              {topArbitrageProduct ? topArbitrageProduct.name : 'Max Arbitrage Gap'}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-white">
            Products
            {search && <span className="text-slate-400 text-sm font-normal ml-2">({filtered.length} results)</span>}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <div>No products found for "{search}"</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(product => {
              const lowest = getLowestPrice(product);
              const highest = getHighestPrice(product);
              const best = getBestSource(product);
              const gap = getArbitrageGap(product);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="card cursor-pointer hover:border-sky-700 transition-all group"
                >
                  {/* Top: Category + SKU */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge-blue text-xs">{product.category}</span>
                    <span className="text-xs text-slate-500 font-mono">{product.sku}</span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-44 rounded-xl mb-4 overflow-hidden bg-slate-900/80 border border-slate-700/60 flex items-center justify-center p-2 relative group-hover:border-sky-500/50 transition-colors">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden flex-col items-center justify-center gap-1 w-full h-full">
                      <span className="text-4xl">{product.emoji}</span>
                      <span className="text-xs text-slate-400">{product.brand}</span>
                    </div>
                  </div>

                  {/* Product name */}
                  <h3 className="font-heading font-semibold text-white text-sm mb-1 group-hover:text-sky-300 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-xs text-slate-400 mb-4">{product.brand}</div>

                  {/* Prices */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Lowest Price</div>
                      <div className="text-xl font-heading font-bold text-emerald-400">{formatPrice(lowest)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-0.5">Highest</div>
                      <div className="text-sm text-red-400 font-semibold">{formatPrice(highest)}</div>
                    </div>
                  </div>

                  {/* Best source badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${SOURCE_BADGE_COLORS[best]}`}>
                      Best on {best}
                    </span>
                    <span className="badge-yellow">Save {formatPrice(gap)}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span className="text-xs text-slate-500">Updated {product.lastUpdated}</span>
                    <span className="text-xs text-sky-400 group-hover:underline">View Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
