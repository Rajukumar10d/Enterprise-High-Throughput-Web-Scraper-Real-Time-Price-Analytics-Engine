import { BarChart3, Boxes, BriefcaseBusiness, LayoutDashboard, PackageSearch, Settings, Warehouse } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: PackageSearch },
  { to: '/analytics', label: 'Price Analytics', icon: BarChart3 },
  { to: '/jobs', label: 'Scraping Jobs', icon: BriefcaseBusiness },
  { to: '/sources', label: 'Sources', icon: Warehouse },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white p-5 shadow-lg transition-transform lg:static lg:translate-x-0`}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Platform</p>
          <h1 className="mt-1 text-xl font-bold text-slate-800">Price Analytics</h1>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close menu">
            ×
          </button>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Current status</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
          <span>System operational</span>
        </div>
      </div>
    </aside>
  )
}
