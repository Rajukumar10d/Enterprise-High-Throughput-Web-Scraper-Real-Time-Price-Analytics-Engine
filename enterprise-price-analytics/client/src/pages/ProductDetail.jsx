import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScraper } from '../context/ScraperContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { SOURCES, SOURCE_COLORS, SOURCE_URLS, formatPrice, getLowestPrice, getBestSource, generatePriceHistory } from '../data/mockData';

const SOURCE_BADGE = {
  Amazon: 'bg-orange-900/50 text-orange-300 border-orange-700',
  Flipkart: 'bg-blue-900/50 text-blue-300 border-blue-700',
  Croma: 'bg-green-900/50 text-green-300 border-green-700',
  Snapmint: 'bg-purple-900/50 text-purple-300 border-purple-700',
  Myntra: 'bg-pink-900/50 text-pink-300 border-pink-700',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useScraper();
  const [chartFilter, setChartFilter] = useState('7D');

  const product = products.find(p => p.id === parseInt(id));

  const allHistory = useMemo(() => {
    if (!product) return [];
    return generatePriceHistory(product.id);
  }, [product?.id]);

  const chartData = useMemo(() => {
    const days = chartFilter === '7D' ? 7 : 30;
    return allHistory.slice(-days);
  }, [allHistory, chartFilter]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="text-5xl mb-4">🔍</div>
        <div className="text-lg font-semibold">Product not found</div>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">← Back to Dashboard</button>
      </div>
    );
  }

  const lowest = getLowestPrice(product);
  const bestSource = getBestSource(product);
  const highestPrice = Math.max(...SOURCES.map(s => product.prices[s]).filter(p => p !== null));
  const savings = highestPrice - lowest;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
          <div className="text-slate-400 mb-2">{label}</div>
          {payload.map(p => (
            <div key={p.dataKey} className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }}></span>
              <span className="text-slate-300">{p.dataKey}:</span>
              <span className="text-white font-semibold">{formatPrice(p.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        ← Back
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-slate-900 border border-slate-700/80 p-2 flex items-center justify-center shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-blue">{product.category}</span>
              <span className="text-xs text-slate-500 font-mono">{product.sku}</span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">{product.name}</h1>
            <p className="text-slate-400 text-sm">{product.brand} · Updated {product.lastUpdated}</p>
          </div>

          {/* Best Price Hero */}
          <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-5 text-center min-w-[200px]">
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">🏆 Best Price Now</div>
            <div className="text-3xl font-heading font-bold text-emerald-400 mb-1">{formatPrice(lowest)}</div>
            <div className="text-xs text-slate-400">on <span className="text-white font-semibold">{bestSource}</span></div>
            <div className="mt-3 pt-3 border-t border-emerald-800">
              <div className="text-xs text-slate-400">You save</div>
              <div className="text-lg font-bold text-yellow-400">{formatPrice(savings)}</div>
              <div className="text-xs text-slate-500">vs highest price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Prices */}
      <div>
        <h2 className="font-heading font-semibold text-white mb-4">Live Prices by Source</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {SOURCES.map(source => {
            const price = product.prices[source];
            const inStock = product.stock[source];
            const isBest = source === bestSource;

            return (
              <div key={source} className={`card relative flex flex-col gap-3 ${isBest ? 'border-emerald-600 bg-emerald-900/10' : ''}`}>
                {isBest && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">BEST</span>
                  </div>
                )}
                <div className={`text-sm font-semibold px-2 py-1 rounded-lg border text-center ${SOURCE_BADGE[source]}`}>
                  {source}
                </div>
                {price === null ? (
                  <div className="text-center text-slate-500 text-sm">Not listed</div>
                ) : (
                  <>
                    <div className={`text-center text-xl font-heading font-bold ${isBest ? 'text-emerald-400' : 'text-white'}`}>
                      {formatPrice(price)}
                    </div>
                    <div className={`text-center text-xs font-semibold ${inStock ? 'text-emerald-400' : 'text-red-400'}`}>
                      {inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </div>
                    <a
                      href={SOURCE_URLS[source]}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-center text-xs text-sky-400 hover:text-sky-300 underline"
                    >
                      Buy on {source} →
                    </a>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price History Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-white">Price History</h2>
          <div className="flex gap-2">
            {['7D', '30D'].map(f => (
              <button
                key={f}
                onClick={() => setChartFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${chartFilter === f ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            {SOURCES.map(source => (
              product.prices[source] !== null && (
                <Line
                  key={source}
                  type="monotone"
                  dataKey={source}
                  stroke={SOURCE_COLORS[source]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
