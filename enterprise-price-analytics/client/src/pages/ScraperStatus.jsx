import { useScraper } from '../context/ScraperContext';

export default function ScraperStatus() {
  const {
    statuses,
    reScraping,
    handleReScrape,
    handleReScrapeAll,
    formatRelativeTime,
    secondsRemaining,
    intervalSeconds,
    setIntervalSeconds,
    isScrapingAll,
  } = useScraper();

  const healthyCount = statuses.filter(s => s.status === 'Healthy').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Scraper Status</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor and control data scrapers for all 5 sources</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Auto-Interval:</span>
            {[30, 60, 120].map(s => (
              <button
                key={s}
                onClick={() => setIntervalSeconds(s)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  intervalSeconds === s ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s < 60 ? `${s}s` : `${s / 60}m`}
              </button>
            ))}
          </div>

          <button
            onClick={handleReScrapeAll}
            disabled={isScrapingAll}
            className="btn-primary flex items-center gap-2"
          >
            <span className="text-base">{isScrapingAll ? '⟳' : '🔄'}</span>
            {isScrapingAll ? 'Scraping All 5 Sources...' : 'Re-scrape All 5 Sources'}
          </button>
        </div>
      </div>

      {/* Unified Auto-Scrape Status Banner */}
      <div className="card bg-sky-950/30 border-sky-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-emerald-400 rounded-full live-dot"></span>
          <div>
            <div className="text-sm font-semibold text-white">Unified Automated Engine Active</div>
            <div className="text-xs text-slate-400">
              All 5 sources scrape together automatically every <span className="text-sky-300 font-bold">{intervalSeconds}s</span> and update live dashboard prices.
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400">Next Automatic Run in</div>
          <div className="text-lg font-mono font-bold text-sky-400">
            {isScrapingAll ? 'Scraping now...' : `${secondsRemaining}s`}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-400 text-lg">✅</div>
          <div>
            <div className="text-xl font-heading font-bold text-emerald-400">{healthyCount}/{statuses.length}</div>
            <div className="text-xs text-slate-400">Healthy Sources</div>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-900/50 rounded-lg flex items-center justify-center text-sky-400 text-lg">⚡</div>
          <div>
            <div className="text-xl font-heading font-bold text-sky-400">
              {(statuses.reduce((a, s) => a + parseFloat(s.latency), 0) / statuses.length).toFixed(1)}s
            </div>
            <div className="text-xs text-slate-400">Avg Latency</div>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-400 text-lg">📊</div>
          <div>
            <div className="text-xl font-heading font-bold text-purple-400">
              {(statuses.reduce((a, s) => a + parseFloat(s.successRate), 0) / statuses.length).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">Avg Success Rate</div>
          </div>
        </div>
      </div>

      {/* Status Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                {['Source', 'Status', 'Last Run', 'Next Run', 'Latency', 'Success Rate', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statuses.map((row, idx) => (
                <tr key={row.source} className={`border-b border-slate-700/50 ${idx % 2 === 0 ? '' : 'bg-slate-800/30'}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="live-dot w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span className="font-semibold text-white">{row.source}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge-green">{reScraping.has(row.source) ? '⟳ Scraping...' : row.status}</span>
                  </td>
                  {/* Last Run */}
                  <td className="px-5 py-4 text-sm text-slate-300 font-medium">
                    {formatRelativeTime(row.lastRunTimestamp)}
                  </td>
                  {/* Next Run */}
                  <td className="px-5 py-4 text-sm text-sky-400 font-mono font-semibold">
                    {isScrapingAll || reScraping.has(row.source) ? (
                      <span className="text-amber-400 animate-pulse">Scraping now...</span>
                    ) : (
                      `in ${secondsRemaining}s`
                    )}
                  </td>
                  {/* Latency */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-sky-400 text-sm">{row.latency}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-1.5 w-16">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full"
                          style={{ width: row.successRate }}
                        ></div>
                      </div>
                      <span className="text-xs text-emerald-400 font-semibold">{row.successRate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleReScrape(row.source)}
                      disabled={reScraping.has(row.source)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                        reScraping.has(row.source)
                          ? 'border-slate-600 text-slate-500 cursor-not-allowed'
                          : 'border-sky-700 text-sky-400 hover:bg-sky-900/40'
                      }`}
                    >
                      {reScraping.has(row.source) ? '⟳ Running...' : '🔄 Re-scrape now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
