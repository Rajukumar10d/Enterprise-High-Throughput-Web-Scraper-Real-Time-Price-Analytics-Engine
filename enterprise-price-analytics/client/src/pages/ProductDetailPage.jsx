import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Loading from '../components/common/Loading.jsx'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import ProductService from '../services/productService.js'
import Badge from '../components/common/Badge.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatPercentage } from '../utils/formatPercentage.js'
import { formatDate } from '../utils/formatDate.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await ProductService.getProductById(id)
        setProduct(response.data.data || response.data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load product details.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <Layout title="Product details"><Loading message="Loading product details..." /></Layout>
  if (error) return <Layout title="Product details"><ErrorMessage message={error} /></Layout>
  if (!product) return <Layout title="Product details"><div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">Product not found.</div></Layout>

  const priceHistory = Array.isArray(product.price_history) ? product.price_history : []

  return (
    <Layout title={product.name || 'Product detail'}>
      <div className="space-y-6">
        <Link to="/products" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">← Back to products</Link>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-indigo-600">{product.category}</p>
                <h2 className="mt-1 text-3xl font-bold text-slate-800">{product.name}</h2>
              </div>
              <Badge tone={Number(product.price_change_percentage || 0) <= 0 ? 'success' : 'warning'}>
                {formatPercentage(product.price_change_percentage)}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Current price</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">{formatCurrency(product.current_price, product.currency)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Previous price</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">{formatCurrency(product.previous_price, product.currency)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Source</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">{product.source}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              <p>{product.description || 'No description provided for this product yet.'}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <p><span className="font-medium text-slate-700">Product URL:</span> <a href={product.product_url} className="text-indigo-600 underline" target="_blank" rel="noreferrer">Open listing</a></p>
                <p><span className="font-medium text-slate-700">Last scraped:</span> {formatDate(product.last_scraped_at)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Price history</h3>
            <div className="mt-4 space-y-3">
              {priceHistory.length ? priceHistory.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{formatCurrency(entry.price, entry.currency)}</p>
                    <p className="text-xs text-slate-500">{entry.source}</p>
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(entry.recorded_at)}</span>
                </div>
              )) : <p className="text-sm text-slate-500">No price history available yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
