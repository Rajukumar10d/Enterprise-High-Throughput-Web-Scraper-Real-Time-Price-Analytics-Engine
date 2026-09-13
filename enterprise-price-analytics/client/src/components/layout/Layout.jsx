import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

export default function Layout({ children, title, onRefresh }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {mobileOpen && (
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Header title={title} onRefresh={onRefresh} onMenuToggle={() => setMobileOpen((value) => !value)} />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
