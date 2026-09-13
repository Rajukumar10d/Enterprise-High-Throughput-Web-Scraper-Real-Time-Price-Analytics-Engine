import Layout from '../components/layout/Layout.jsx'
import Loading from '../components/common/Loading.jsx'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import Badge from '../components/common/Badge.jsx'
import useSources from '../hooks/useSources.js'

export default function SourcesPage() {
  const { data, loading, error, refetch } = useSources()

  return (
    <Layout title="Sources" onRefresh={refetch}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-indigo-600">Marketplaces</p>
            <h2 className="text-2xl font-bold text-slate-800">Connected sources</h2>
          </div>
          <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {data.length} sync points
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {loading ? (
          <Loading message="Loading sources..." />
        ) : data.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((source) => (
              <div key={source.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{source.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{source.base_url || 'No URL configured'}</p>
                  </div>
                  <Badge tone={source.status === 'active' ? 'success' : 'warning'}>{source.status || 'inactive'}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No sources configured" description="Add a marketplace source to begin collection." />
        )}
      </div>
    </Layout>
  )
}
