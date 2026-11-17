import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScraper } from '../context/ScraperContext';
import { SOURCES, formatPrice, getLowestPrice, getHighestPrice, getArbitrageGap } from '../data/mockData';

export default function Matrix() {
  const [sortByGap, setSortByGap] = useState(false);
  const navigate = useNavigate();
  const { products } = useScraper();

  const sortedProducts = sortByGap
    ? [...products].sort((a, b) => getArbitrageGap(b) - getArbitrageGap(a))
    : products;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Comparison Matrix</h1>
        <p className="text-slate-400 text-sm mt-1">10 Products × 5 Sources — side-by-side price comparison</p>
      </div>

      {/* Controls */}
      <div className="card flex items-center gap-4">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => setSortByGap(v => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative ${sortByGap ? 'bg-sky-600' : 'bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${sortByGap ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
          </div>
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Sort by biggest price gap</span>
        </label>
        {sortByGap && (
          <span className="badge-yellow">↑ Sorted by arbitrage margin</span>
        )}
        <div className="ml-auto flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-600 inline-block"></span> Lowest</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-900/60 border border-red-600 inline-block"></span> Highest</span>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-56">Product</th>
                {SOURCES.map(source => (
                  <th key={source} className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[130px]">
                    {source}
                  </th>
                ))}
                <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[110px]">Gap</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product, idx) => {
                const lowest = getLowestPrice(product);
                const highest = getHighestPrice(product);
                const gap = getArbitrageGap(product);

                return (
                  <tr
                    key={product.id}
                    className={`table-row-hover border-b border-slate-700/50 ${idx % 2 === 0 ? '' : 'bg-slate-800/30'}`}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-white leading-tight">{product.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{product.brand} · {product.sku}</div>
                    </td>

                    {/* Source prices */}
                    {SOURCES.map(source => {
                      const price = product.prices[source];
                      const isLowest = price === lowest;
                      const isHighest = price === highest && price !== lowest;

                      return (
                        <td key={source} className="px-4 py-4 text-center">
                          {price === null ? (
                            <span className="text-slate-600 text-xs">—</span>
                          ) : (
                            <div className={`inline-block px-2.5 py-1 rounded-lg ${isLowest ? 'bg-emerald-900/50 border border-emerald-700' : isHighest ? 'bg-red-900/40 border border-red-800' : 'bg-transparent'}`}>
                              <div className={`text-sm font-semibold ${isLowest ? 'text-emerald-400' : isHighest ? 'text-red-400' : 'text-slate-300'}`}>
                                {formatPrice(price)}
                              </div>
                              {isLowest && <div className="text-xs text-emerald-500 font-bold">LOWEST</div>}
                              {isHighest && <div className="text-xs text-red-500 font-bold">HIGHEST</div>}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Gap */}
                    <td className="px-4 py-4 text-center">
                      <span className="badge-yellow text-xs">{formatPrice(gap)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center">Click any row to view product details</p>
    </div>
  );
}
