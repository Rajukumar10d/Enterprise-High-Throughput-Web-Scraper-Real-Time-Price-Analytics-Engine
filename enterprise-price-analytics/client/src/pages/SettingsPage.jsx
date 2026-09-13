import Layout from '../components/layout/Layout.jsx'

export default function SettingsPage() {
  return (
    <Layout title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">System settings</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span>API mode</span>
              <strong className="text-slate-800">Local development</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span>Data source fallback</span>
              <strong className="text-slate-800">Enabled</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span>Authentication</span>
              <strong className="text-slate-800">Not required</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Operational notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• The dashboard connects to the existing Express API routes.</li>
            <li>• No authentication layer is added in this phase.</li>
            <li>• Scraping and ML workflows are intentionally excluded from this UI phase.</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
