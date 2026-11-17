import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { PRODUCTS, SOURCES, SOURCE_COLORS, formatPrice, generatePriceHistory } from '../data/mockData';

function calcVolatility(prices) {
  if (!prices || prices.length < 2) return '0.0';
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  return ((Math.sqrt(variance) / mean) * 100).toFixed(1);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
        <div style={{ color: '#94a3b8', marginBottom: 8, fontSize: 11 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }}></span>
            <span style={{ color: '#cbd5e1' }}>{p.dataKey}:</span>
            <span style={{ color: 'white', fontWeight: 600 }}>
              {typeof p.value === 'number' ? formatPrice(p.value) : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7D');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const days = dateRange === '7D' ? 7 : dateRange === '14D' ? 14 : 30;

  const computed = useMemo(() => {
    const products = selectedProduct === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.id === parseInt(selectedProduct));

    const sources = selectedSource === 'all' ? SOURCES : [selectedSource];

    // Build price history for each product
    const allHistories = products.map(p => generatePriceHistory(p.id).slice(-days));

    // Trend data: average per source per day
    const trendData = [];
    for (let i = 0; i < days; i++) {
      const entry = { date: (allHistories[0] && allHistories[0][i]) ? allHistories[0][i].date : '' };
      sources.forEach(src => {
        let srcTotal = 0, srcCount = 0;
        allHistories.forEach(history => {
          const dayEntry = history[i];
          if (dayEntry && dayEntry[src] != null) {
            srcTotal += dayEntry[src];
            srcCount++;
          }
        });
        entry[src] = srcCount > 0 ? Math.round(srcTotal / srcCount) : null;
      });
      trendData.push(entry);
    }

    // Metrics from current prices
    const allPrices = [];
    products.forEach(p => {
      sources.forEach(s => {
        if (p.prices[s] != null) allPrices.push(p.prices[s]);
      });
    });

    const avgPrice = allPrices.length > 0
      ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length) : 0;
    const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
    const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
    const volatility = calcVolatility(allPrices);

    // Source average bar chart data
    const sourceAvgData = sources.map(src => {
      const srcPrices = products
        .map(p => p.prices[src])
        .filter(price => price != null);
      const avg = srcPrices.length > 0
        ? Math.round(srcPrices.reduce((a, b) => a + b, 0) / srcPrices.length)
        : 0;
      return { source: src, avg, color: SOURCE_COLORS[src] };
    });

    // Insights
    const cheapestSource = sourceAvgData.length > 0
      ? sourceAvgData.reduce((best, cur) => cur.avg < best.avg ? cur : best, sourceAvgData[0])
      : null;

    const priceDiff = highestPrice - lowestPrice;

    const insights = [
      {
        icon: '⚡',
        title: 'Market Price War',
        text: cheapestSource
          ? `${cheapestSource.source} consistently offers the lowest average price. Consider prioritizing it for procurement.`
          : 'Not enough data to determine cheapest source.',
      },
      {
        icon: '💹',
        title: 'Arbitrage Intelligence',
        text: `Maximum price gap of ${formatPrice(priceDiff)} detected. Buying from cheapest vs selling at highest could yield significant margins.`,
      },
    ];

    return { trendData, avgPrice, lowestPrice, highestPrice, volatility, sourceAvgData, insights };
  }, [days, selectedProduct, selectedSource]);

  const { trendData, avgPrice, lowestPrice, highestPrice, volatility, sourceAvgData, insights } = computed;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Price trends, volatility analysis, and market insights</p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          {['7D', '14D', '30D'].map(d => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                dateRange === d ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
        >
          <option value="all">All Products</option>
          {PRODUCTS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
        >
          <option value="all">All Sources</option>
          {SOURCES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-xl mb-1">📈</div>
          <div className="text-lg font-heading font-bold text-sky-400">{formatPrice(avgPrice)}</div>
          <div className="text-xs text-slate-400">Average Price</div>
        </div>
        <div className="metric-card">
          <div className="text-xl mb-1">🟢</div>
          <div className="text-lg font-heading font-bold text-emerald-400">{formatPrice(lowestPrice)}</div>
          <div className="text-xs text-slate-400">Lowest Price</div>
        </div>
        <div className="metric-card">
          <div className="text-xl mb-1">🔴</div>
          <div className="text-lg font-heading font-bold text-red-400">{formatPrice(highestPrice)}</div>
          <div className="text-xs text-slate-400">Highest Price</div>
        </div>
        <div className="metric-card">
          <div className="text-xl mb-1">📉</div>
          <div className="text-lg font-heading font-bold text-yellow-400">{volatility}%</div>
          <div className="text-xs text-slate-400">Volatility</div>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="card">
        <h2 className="font-heading font-semibold text-white mb-5">Price Trend ({dateRange})</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            {SOURCES.map(src => (
              <Line
                key={src}
                type="monotone"
                dataKey={src}
                stroke={SOURCE_COLORS[src]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Source Bar Chart */}
      <div className="card">
        <h2 className="font-heading font-semibold text-white mb-5">Source-wise Average Price</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sourceAvgData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="source" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
              {sourceAvgData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div>
        <h2 className="font-heading font-semibold text-white mb-4">Auto-Generated Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, i) => (
            <div key={i} className="card" style={{ borderColor: '#1e40af', background: 'rgba(30,58,138,0.1)' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <div className="font-semibold text-sky-300 mb-1">{insight.title}</div>
                  <div className="text-sm text-slate-400">{insight.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
