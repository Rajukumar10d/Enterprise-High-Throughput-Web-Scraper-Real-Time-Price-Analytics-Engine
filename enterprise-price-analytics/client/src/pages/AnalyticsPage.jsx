import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Layout from '../components/layout/Layout.jsx'
import Loading from '../components/common/Loading.jsx'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import useProducts from '../hooks/useProducts.js'

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useProducts({ page: 1, limit: 8 })

  const chartData = (data || []).map((product) => ({
    name: product.name.split(' ').slice(0, 2).join(' '),
    price: Number(product.current_price || 0),
    change: Number(product.price_change_percentage || 0),
  }))

  return (
    <Layout title="Price Analytics" onRefresh={refetch}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Price trend overview</h2>
          <p className="mt-1 text-sm text-slate-500">Latest market movement across tracked products</p>
        </div>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {loading ? (
          <Loading message="Loading analytics..." />
        ) : chartData.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']} />
                  <Area type="monotone" dataKey="price" stroke="#4f46e5" fill="url(#priceFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <EmptyState title="No analytics data" description="Product data is not available to render the chart." />
        )}
      </div>
    </Layout>
  )
}
