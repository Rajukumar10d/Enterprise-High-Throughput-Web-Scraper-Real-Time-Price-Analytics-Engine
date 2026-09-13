import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Loading from '../components/common/Loading.jsx'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import Pagination from '../components/common/Pagination.jsx'
import Badge from '../components/common/Badge.jsx'
import useProducts from '../hooks/useProducts.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatPercentage } from '../utils/formatPercentage.js'

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)
  const { data, pagination, loading, error, refetch } = useProducts({ page, limit: pageSize })

  const totalPages = pagination?.totalPages || 1

  return (
    <Layout title="Products" onRefresh={() => refetch()}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-indigo-600">Catalog</p>
            <h2 className="text-2xl font-bold text-slate-800">Tracked products</h2>
          </div>
          <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {pagination?.total || 0} products
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {loading ? (
          <Loading message="Loading products..." />
        ) : data.length ? (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Product</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Source</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Price</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-4">
                          <Link to={`/products/${product.id}`} className="block">
                            <p className="font-semibold text-slate-800">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.category}</p>
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{product.source}</td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800">{formatCurrency(product.current_price, product.currency)}</p>
                          <p className="text-xs text-slate-500">{product.currency}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={Number(product.price_change_percentage || 0) <= 0 ? 'success' : 'warning'}>
                            {formatPercentage(product.price_change_percentage)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No products found" description="No products match the current filters." />
        )}
      </div>
    </Layout>
  )
}
