import Layout from '../components/layout/Layout.jsx'
import Loading from '../components/common/Loading.jsx'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import Badge from '../components/common/Badge.jsx'
import useJobs from '../hooks/useJobs.js'
import { formatDate } from '../utils/formatDate.js'

export default function JobsPage() {
  const { data, loading, error, refetch } = useJobs({ page: 1, limit: 10 })

  return (
    <Layout title="Scraping Jobs" onRefresh={refetch}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-indigo-600">Operations</p>
            <h2 className="text-2xl font-bold text-slate-800">Job queue</h2>
          </div>
          <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {data.length} jobs
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {loading ? (
          <Loading message="Loading jobs..." />
        ) : data.length ? (
          <div className="space-y-3">
            {data.map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{job.category || 'General monitoring'}</p>
                    <p className="text-sm text-slate-500">Source: {job.source || 'N/A'}</p>
                  </div>
                  <Badge tone={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : job.status === 'running' ? 'info' : 'warning'}>
                    {job.status || 'pending'}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Started</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(job.started_at) || 'Not started'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completed</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(job.completed_at) || 'In progress'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Created</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(job.created_at) || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No jobs queued" description="There are no scraping jobs scheduled or recorded." />
        )}
      </div>
    </Layout>
  )
}
