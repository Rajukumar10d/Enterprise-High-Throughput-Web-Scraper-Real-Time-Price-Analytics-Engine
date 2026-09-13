import { randomUUID } from 'node:crypto'
import supabase, { isSupabaseConfigured } from '../lib/supabase.js'

const TABLE = 'products'

const inMemoryProducts = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Samsung smartphone',
    category: 'Mobiles',
    source: 'Amazon',
    source_product_id: 'B0CQR4JRPB',
    product_url: 'https://www.amazon.in/dp/B0CQR4JRPB',
    image_url: 'https://example.com/s24.jpg',
    currency: 'INR',
    current_price: 124999,
    previous_price: 134999,
    price_change: -10000,
    price_change_percentage: -7.41,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_scraped_at: new Date().toISOString(),
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    name: 'Apple iPhone 15 Pro Max',
    description: 'Apple A17 Pro smartphone',
    category: 'Mobiles',
    source: 'Flipkart',
    source_product_id: 'MOBGTAGPYHKGUUZN',
    product_url: 'https://www.flipkart.com/apple-iphone-15-pro-max',
    image_url: 'https://example.com/iphone15.jpg',
    currency: 'INR',
    current_price: 159900,
    previous_price: 164900,
    price_change: -5000,
    price_change_percentage: -3.03,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_scraped_at: new Date().toISOString(),
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    name: 'Dell XPS 15 Laptop',
    description: 'Premium productivity laptop',
    category: 'Laptops',
    source: 'Amazon',
    source_product_id: 'XPS15-01',
    product_url: 'https://www.amazon.in/dp/XPS15-01',
    image_url: 'https://example.com/xps15.jpg',
    currency: 'INR',
    current_price: 189990,
    previous_price: 199990,
    price_change: -10000,
    price_change_percentage: -5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_scraped_at: new Date().toISOString(),
  },
]

const inMemoryPriceHistory = [
  { id: '44444444-0000-0000-0000-000000000001', product_id: '33333333-0000-0000-0000-000000000001', price: 134999, currency: 'INR', source: 'Amazon', recorded_at: new Date().toISOString() },
  { id: '44444444-0000-0000-0000-000000000002', product_id: '33333333-0000-0000-0000-000000000001', price: 124999, currency: 'INR', source: 'Amazon', recorded_at: new Date().toISOString() },
  { id: '44444444-0000-0000-0000-000000000003', product_id: '33333333-0000-0000-0000-000000000002', price: 164900, currency: 'INR', source: 'Flipkart', recorded_at: new Date().toISOString() },
  { id: '44444444-0000-0000-0000-000000000004', product_id: '33333333-0000-0000-0000-000000000002', price: 159900, currency: 'INR', source: 'Flipkart', recorded_at: new Date().toISOString() },
  { id: '44444444-0000-0000-0000-000000000005', product_id: '33333333-0000-0000-0000-000000000003', price: 199990, currency: 'INR', source: 'Amazon', recorded_at: new Date().toISOString() },
  { id: '44444444-0000-0000-0000-000000000006', product_id: '33333333-0000-0000-0000-000000000003', price: 189990, currency: 'INR', source: 'Amazon', recorded_at: new Date().toISOString() },
]

const normalizeProduct = (product) => ({
  ...product,
  current_price: Number(product.current_price),
  previous_price: product.previous_price == null ? null : Number(product.previous_price),
  price_change: product.price_change == null ? null : Number(product.price_change),
  price_change_percentage: product.price_change_percentage == null ? null : Number(product.price_change_percentage),
})

const applyMemoryProductFilters = (items, { search, category, source }) => {
  let filtered = [...items]

  if (search) {
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  }
  if (category) {
    filtered = filtered.filter((item) => item.category === category)
  }
  if (source) {
    filtered = filtered.filter((item) => item.source === source)
  }

  return filtered
}

const applyMemorySort = (items, sort = 'created_at_desc') => {
  const sorted = [...items]
  const sortMap = {
    price_asc: (a, b) => Number(a.current_price) - Number(b.current_price),
    price_desc: (a, b) => Number(b.current_price) - Number(a.current_price),
    name_asc: (a, b) => a.name.localeCompare(b.name),
    name_desc: (a, b) => b.name.localeCompare(a.name),
    created_at_desc: (a, b) => new Date(b.created_at) - new Date(a.created_at),
    created_at_asc: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    updated_at_desc: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
  }

  const sorter = sortMap[sort] || sortMap.created_at_desc
  return sorted.sort(sorter)
}

/**
 * Retrieve a paginated, filtered list of products.
 */
export const findProducts = async ({ search, category, source, page = 1, limit = 10, sort = 'created_at_desc' }) => {
  if (!isSupabaseConfigured || !supabase) {
    const filtered = applyMemorySort(applyMemoryProductFilters(inMemoryProducts, { search, category, source }), sort)
    const pageNumber = Number(page) || 1
    const limitNumber = Number(limit) || 10
    const start = (pageNumber - 1) * limitNumber
    const end = start + limitNumber
    return { data: filtered.slice(start, end).map(normalizeProduct), count: filtered.length }
  }

  const offset = (Number(page) - 1) * Number(limit)
  let query = supabase.from(TABLE).select('*', { count: 'exact' })

  if (search) query = query.ilike('name', `%${search}%`)
  if (category) query = query.eq('category', category)
  if (source) query = query.eq('source', source)

  const sortMap = {
    price_asc: { column: 'current_price', ascending: true },
    price_desc: { column: 'current_price', ascending: false },
    name_asc: { column: 'name', ascending: true },
    name_desc: { column: 'name', ascending: false },
    created_at_desc: { column: 'created_at', ascending: false },
    created_at_asc: { column: 'created_at', ascending: true },
    updated_at_desc: { column: 'updated_at', ascending: false },
  }

  const { column, ascending } = sortMap[sort] || sortMap.created_at_desc
  query = query.order(column, { ascending }).range(offset, offset + Number(limit) - 1)

  const { data, error, count } = await query
  if (error) throw error

  return { data, count }
}

/**
 * Find a single product by its UUID.
 */
export const findProductById = async (id) => {
  if (!isSupabaseConfigured || !supabase) {
    const product = inMemoryProducts.find((item) => item.id === id)
    if (!product) return null
    return {
      ...normalizeProduct(product),
      price_history: inMemoryPriceHistory.filter((entry) => entry.product_id === id),
    }
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*, price_history(*)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Insert a new product.
 */
export const insertProduct = async (payload) => {
  if (!isSupabaseConfigured || !supabase) {
    const product = normalizeProduct({
      ...payload,
      id: randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_scraped_at: new Date().toISOString(),
    })
    inMemoryProducts.unshift(product)
    return product
  }

  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single()
  if (error) throw error
  return data
}

/**
 * Update an existing product by UUID.
 */
export const updateProductById = async (id, payload) => {
  if (!isSupabaseConfigured || !supabase) {
    const index = inMemoryProducts.findIndex((item) => item.id === id)
    if (index === -1) return null

    const updated = normalizeProduct({
      ...inMemoryProducts[index],
      ...payload,
      updated_at: new Date().toISOString(),
      last_scraped_at: payload.last_scraped_at || inMemoryProducts[index].last_scraped_at,
    })

    inMemoryProducts[index] = updated
    return updated
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a product and its associated price_history rows.
 */
export const deleteProductById = async (id) => {
  if (!isSupabaseConfigured || !supabase) {
    const initialLength = inMemoryProducts.length
    const filteredProducts = inMemoryProducts.filter((product) => product.id !== id)
    const filteredHistory = inMemoryPriceHistory.filter((entry) => entry.product_id !== id)

    inMemoryProducts.splice(0, inMemoryProducts.length, ...filteredProducts)
    inMemoryPriceHistory.splice(0, inMemoryPriceHistory.length, ...filteredHistory)

    return initialLength !== filteredProducts.length
  }

  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
  return true
}

/**
 * Compute price_change and price_change_percentage from current and previous prices.
 */
export const computePriceFields = (currentPrice, previousPrice) => {
  const curr = parseFloat(currentPrice)
  const prev = parseFloat(previousPrice)

  if (isNaN(curr) || isNaN(prev) || prev === 0) {
    return { price_change: null, price_change_percentage: null }
  }

  const price_change = parseFloat((curr - prev).toFixed(2))
  const price_change_percentage = parseFloat((((curr - prev) / prev) * 100).toFixed(2))
  return { price_change, price_change_percentage }
}
