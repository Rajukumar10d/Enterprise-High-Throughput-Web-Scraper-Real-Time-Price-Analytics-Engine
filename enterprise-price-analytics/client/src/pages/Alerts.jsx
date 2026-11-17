import { useState, useEffect } from 'react';
import { PRODUCTS, formatPrice, getLowestPrice } from '../data/mockData';

const STORAGE_KEY = 'price_alerts';

function loadAlerts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAlerts(alerts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export default function Alerts() {
  const [alerts, setAlerts] = useState(loadAlerts);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    saveAlerts(alerts);
  }, [alerts]);

  const handleAdd = () => {
    setError(''); setSuccess('');
    if (!selectedProduct) { setError('Please select a product.'); return; }
    if (!targetPrice || isNaN(targetPrice) || Number(targetPrice) <= 0) {
      setError('Please enter a valid target price.'); return;
    }
    const product = PRODUCTS.find(p => p.id === parseInt(selectedProduct));
    const currentLowest = getLowestPrice(product);
    const alert = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      targetPrice: Number(targetPrice),
      currentLowest,
      status: currentLowest <= Number(targetPrice) ? 'Triggered' : 'Pending',
      createdAt: new Date().toLocaleDateString(),
    };
    setAlerts(prev => [alert, ...prev]);
    setSelectedProduct('');
    setTargetPrice('');
    setSuccess(`Alert set for ${product.name}!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemove = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const pendingCount = alerts.filter(a => a.status === 'Pending').length;
  const triggeredCount = alerts.filter(a => a.status === 'Triggered').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Price Alerts</h1>
        <p className="text-slate-400 text-sm mt-1">Get notified when prices drop below your target — persisted in browser</p>
      </div>

      {/* Stats */}
      {alerts.length > 0 && (
        <div className="flex gap-4">
          <div className="card flex items-center gap-3 flex-1">
            <span className="text-2xl">🔔</span>
            <div>
              <div className="text-xl font-heading font-bold text-white">{alerts.length}</div>
              <div className="text-xs text-slate-400">Total Alerts</div>
            </div>
          </div>
          <div className="card flex items-center gap-3 flex-1">
            <span className="text-2xl">⏳</span>
            <div>
              <div className="text-xl font-heading font-bold text-yellow-400">{pendingCount}</div>
              <div className="text-xs text-slate-400">Pending</div>
            </div>
          </div>
          <div className="card flex items-center gap-3 flex-1">
            <span className="text-2xl">✅</span>
            <div>
              <div className="text-xl font-heading font-bold text-emerald-400">{triggeredCount}</div>
              <div className="text-xs text-slate-400">Triggered</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Alert Form */}
      <div className="card">
        <h2 className="font-heading font-semibold text-white mb-5">Set New Alert</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="flex-1 bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-sky-500"
          >
            <option value="">Select a product...</option>
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
            <input
              type="number"
              placeholder="Target price"
              value={targetPrice}
              onChange={e => setTargetPrice(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg pl-7 pr-4 py-2.5 focus:outline-none focus:border-sky-500 w-44"
            />
          </div>

          <button onClick={handleAdd} className="btn-primary whitespace-nowrap">
            🔔 Set Alert
          </button>
        </div>

        {error && <div className="mt-3 text-red-400 text-sm flex items-center gap-2">⚠️ {error}</div>}
        {success && <div className="mt-3 text-emerald-400 text-sm flex items-center gap-2">✅ {success}</div>}

        {/* Preview */}
        {selectedProduct && (
          <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
            Current lowest price:{' '}
            <span className="text-emerald-400 font-semibold">
              {formatPrice(getLowestPrice(PRODUCTS.find(p => p.id === parseInt(selectedProduct))))}
            </span>
          </div>
        )}
      </div>

      {/* Alerts Table */}
      {alerts.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <div className="text-4xl mb-3">🔕</div>
          <div>No alerts set yet. Add one above!</div>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-white">Active Alerts</h2>
            <button
              onClick={() => setAlerts([])}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Product', 'Target Price', 'Current Lowest', 'Status', 'Created', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-5 py-4">
                      <div className="text-sm text-white font-medium line-clamp-1">{alert.productName}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-sky-400">{formatPrice(alert.targetPrice)}</td>
                    <td className="px-5 py-4 text-sm text-emerald-400 font-semibold">{formatPrice(alert.currentLowest)}</td>
                    <td className="px-5 py-4">
                      {alert.status === 'Triggered' ? (
                        <span className="badge-green">✓ Triggered</span>
                      ) : (
                        <span className="badge-yellow">⏳ Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{alert.createdAt}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleRemove(alert.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded border border-red-900 hover:border-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-700">
            <p className="text-xs text-slate-500">💾 Alerts are saved in your browser — they persist across page refreshes</p>
          </div>
        </div>
      )}
    </div>
  );
}
