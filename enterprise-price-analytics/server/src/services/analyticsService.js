import supabase, { isSupabaseConfigured } from '../lib/supabase.js'

const inMemoryProducts = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Mobiles',
    source: 'Amazon',
    current_price: 124999,
    previous_price: 134999,
    price_change_percentage: -7.41,
    last_scraped_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    name: 'Apple iPhone 15 Pro Max',
    category: 'Mobiles',
    source: 'Flipkart',
    current_price: 159900,
    previous_price: 164900,
    price_change_percentage: -3.03,
    last_scraped_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    name: 'Dell XPS 15 Laptop',
    category: 'Laptops',
    source: 'Amazon',
    current_price: 189990,
    previous_price: 199990,
    price_change_percentage: -5,
    last_scraped_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
]

const inMemoryPriceHistory = [
  { product_id: '33333333-0000-0000-0000-000000000001', price: 134999, recorded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { product_id: '33333333-0000-0000-0000-000000000001', price: 124999, recorded_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
  { product_id: '33333333-0000-0000-0000-000000000002', price: 164900, recorded_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
  { product_id: '33333333-0000-0000-0000-000000000002', price: 159900, recorded_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { product_id: '33333333-0000-0000-0000-000000000003', price: 199990, recorded_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { product_id: '33333333-0000-0000-0000-000000000003', price: 189990, recorded_at: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
]

export const getAnalyticsOverview = async () => {
  if (!isSupabaseConfigured || !supabase) {
    const productTrend = inMemoryProducts.map((product) => ({
      name: product.name,
      price: Number(product.current_price),
      change: Number(product.price_change_percentage || 0),
    }))

    const discountCount = inMemoryProducts.filter((product) => Number(product.price_change_percentage || 0) < 0).length
    const avgPrice = inMemoryProducts.reduce((sum, product) => sum + Number(product.current_price || 0), 0) / Math.max(inMemoryProducts.length, 1)

    return {
      totalProducts: inMemoryProducts.length,
      avgPrice,
      discountCount,
      productTrend,
      sourceComparison: [
        { source: 'Amazon', avgPrice: 157494.5, discountRate: 66.7 },
        { source: 'Flipkart', avgPrice: 159900, discountRate: 33.3 },
      ],
    }
  }

  const { data, error } = await supabase.from('products').select('id, name, category, source, current_price, previous_price, price_change_percentage')
  if (error) throw error

  const productTrend = (data || []).map((product) => ({
    name: product.name,
    price: Number(product.current_price || 0),
    change: Number(product.price_change_percentage || 0),
  }))

  const avgPrice = (data || []).reduce((sum, product) => sum + Number(product.current_price || 0), 0) / Math.max((data || []).length, 1)

  return {
    totalProducts: (data || []).length,
    avgPrice,
    discountCount: (data || []).filter((product) => Number(product.price_change_percentage || 0) < 0).length,
    productTrend,
    sourceComparison: (data || []).reduce((acc, product) => {
      const existing = acc.find((entry) => entry.source === product.source)
      if (existing) {
        existing.avgPrice = (existing.avgPrice + Number(product.current_price || 0)) / 2
      } else {
        acc.push({ source: product.source, avgPrice: Number(product.current_price || 0), discountRate: Number(product.price_change_percentage || 0) })
      }
      return acc
    }, []),
  }
}

export const getPriceHistoryByProduct = async (productId) => {
  if (!isSupabaseConfigured || !supabase) {
    return inMemoryPriceHistory.filter((entry) => entry.product_id === productId)
  }

  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('product_id', productId)
    .order('recorded_at', { ascending: true })

  if (error) throw error
  return data || []
}

export const getSourceComparison = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return [
      { source: 'Amazon', avgPrice: 157494.5, discountRate: 66.7 },
      { source: 'Flipkart', avgPrice: 159900, discountRate: 33.3 },
      { source: 'Croma', avgPrice: 172990, discountRate: 50 },
    ]
  }

  const { data, error } = await supabase.from('products').select('source, current_price, price_change_percentage')
  if (error) throw error

  const grouped = new Map()
  for (const product of data || []) {
    if (!grouped.has(product.source)) {
      grouped.set(product.source, { source: product.source, total: 0, count: 0, discountCount: 0 })
    }
    const item = grouped.get(product.source)
    item.total += Number(product.current_price || 0)
    item.count += 1
    if (Number(product.price_change_percentage || 0) < 0) item.discountCount += 1
  }

  return [...grouped.values()].map((item) => ({
    source: item.source,
    avgPrice: item.total / Math.max(item.count, 1),
    discountRate: (item.discountCount / Math.max(item.count, 1)) * 100,
  }))
}
