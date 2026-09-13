import { Activity, ArrowUpRight, Boxes, BriefcaseBusiness, TrendingUp, Warehouse } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import Loading from '../components/common/Loading.jsx'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import Badge from '../components/common/Badge.jsx'
import useProducts from '../hooks/useProducts.js'
import useJobs from '../hooks/useJobs.js'
import useSources from '../hooks/useSources.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatPercentage } from '../utils/formatPercentage.js'

const productSummary = (products) => {
  if (!products.length) return { average: 0, best: null }

  const average = products.reduce((sum, item) => sum + Number(item.current_price || 0), 0) / products.length
  const best = [...products].sort((a, b) => Number(b.price_change_percentage || 0) - Number(a.price_change_percentage || 0))[0]

  return { average, best }
}

export default function Dashboard() {
  const { data: products = [], loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts({ page: 1, limit: 6 })
  const { data: jobs = [], loading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs({ page: 1, limit: 5 })
  const { data: sources = [], loading: sourcesLoading, error: sourcesError, refetch: refetchSources } = useSources()

  const stats = [
    {
      title: 'Tracked products',
      value: String(products.length || 0),
      detail: { text: 'Active catalog coverage', trend: 'up' },
      tone: 'info',
      icon: Boxes,
    },
    {
      title: 'Avg. price',
      value: formatCurrency(productSummary(products).average),
      detail: { text: 'Across latest prices', trend: 'up' },
      tone: 'success',
      icon: TrendingUp,
    },
    {
      title: 'Active jobs',
      value: String(jobs.filter((job) => ['pending', 'running'].includes(job.status)).length),
      detail: { text: 'Scraping cycle health', trend: 'up' },
      tone: 'warning',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Sources',
      value: String(sources.length || 0),
      detail: { text: 'Connected marketplaces', trend: 'up' },
      tone: 'neutral',
      icon: Warehouse,
    },
  ]

  const topProducts = products.slice(0, 4)
  const bestProduct = productSummary(products).best

  return (
    <Layout title="Dashboard" onRefresh={() => { refetchProducts(); refetchJobs(); refetchSources() }}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {(productsError || jobsError || sourcesError) && (
          <ErrorMessage message="One or more data feeds failed to load." onRetry={() => { refetchProducts(); refetchJobs(); refetchSources() }} />
        )}

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800">Top tracked products</h3>
              <Link to="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
            </div>

            {productsLoading ? (
              <Loading message="Loading products..." />
            ) : topProducts.length ? (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/40">
                    <div>
                      <p className="font-semibold text-slate-800">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.category} • {product.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{formatCurrency(product.current_price, product.currency)}</p>
                      <p className={`text-xs ${Number(product.price_change_percentage || 0) <= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {formatPercentage(product.price_change_percentage)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No products available" description="The tracker has no catalog items yet." />
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity size={18} className="text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Performance snapshot</h3>
            </div>

            {bestProduct ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Best movement</p>
                  <p className="mt-2 text-xl font-bold text-slate-800">{bestProduct.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{formatPercentage(bestProduct.price_change_percentage)} vs previous price</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Catalog health</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">{Math.round((products.filter((product) => Number(product.price_change_percentage || 0) < 0).length / Math.max(products.length, 1)) * 100)}%</p>
                    <p className="text-sm text-slate-500">Discounted items</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Live jobs</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">{jobs.filter((job) => job.status === 'running').length}</p>
                    <p className="text-sm text-slate-500">Currently running</p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="No analytics summary" description="Add products to start tracking price movement." />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-800">Recent jobs</h3>
            <Link to="/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Open jobs</Link>
          </div>

          {jobsLoading ? (
            <Loading message="Loading jobs..." />
          ) : jobs.length ? (
            <div className="space-y-3">
              {jobs.slice(0, 4).map((job) => (
                <div key={job.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{job.category || 'General monitoring'}</p>
                    <p className="text-sm text-slate-500">Source: {job.source || 'N/A'} • {job.status || 'pending'}</p>
                  </div>
                  <Badge tone={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : job.status === 'running' ? 'info' : 'warning'}>
                    {job.status || 'pending'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No job history" description="There are no scraping jobs to show yet." />
          )}
        </div>
      </div>
    </Layout>
  )
}
