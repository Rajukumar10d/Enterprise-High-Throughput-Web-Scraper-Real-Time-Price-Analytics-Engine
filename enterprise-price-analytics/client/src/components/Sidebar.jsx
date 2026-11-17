import { NavLink } from 'react-router-dom';
import { useScraper } from '../context/ScraperContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⬛', end: true },
  { to: '/matrix', label: 'Comparison Matrix', icon: '🔲' },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
  { to: '/alerts', label: 'Price Alerts', icon: '🔔' },
  { to: '/scraper-status', label: 'Scraper Status', icon: '🤖' },
  { to: '/reports', label: 'Reports', icon: '📄' },
];

export default function Sidebar() {
  const { relativeGlobalScrape } = useScraper();

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-slate-900 border-r border-slate-700/60 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <div>
            <div className="font-heading font-bold text-white text-sm leading-tight">Price Analytics</div>
            <div className="text-xs text-slate-500">Engine v2.0</div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 py-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="live-dot w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
          <span>Scraped {relativeGlobalScrape}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/60">
        <div className="text-xs text-slate-500">10 products · 5 sources</div>
        <div className="text-xs text-slate-600 mt-0.5">© 2024 Price Analytics Engine</div>
      </div>
    </aside>
  );
}
