import { Bell, Menu, RefreshCcw, Search, ShieldCheck } from 'lucide-react'

export default function Header({ title = 'Enterprise Price Analytics', onRefresh, onMenuToggle }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Enterprise</p>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
        </div>

        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            aria-label="Search"
            className="w-44 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button type="button" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <ShieldCheck size={16} />
            <span>System Operational</span>
          </div>
        </div>
      </div>
    </header>
  )
}
