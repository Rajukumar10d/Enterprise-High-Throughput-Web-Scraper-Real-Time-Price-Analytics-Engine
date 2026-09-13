import { randomUUID } from 'node:crypto'
import supabase, { isSupabaseConfigured } from '../lib/supabase.js'

const TABLE = 'scraping_jobs'
export const VALID_STATUSES = ['pending', 'running', 'completed', 'failed']

const inMemoryJobs = [
  {
    id: '22222222-0000-0000-0000-000000000001',
    source: 'Amazon',
    category: 'Mobiles',
    status: 'completed',
    started_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 3 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    products_found: 12,
    error_message: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '22222222-0000-0000-0000-000000000002',
    source: 'Flipkart',
    category: 'Laptops',
    status: 'running',
    started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completed_at: null,
    products_found: 3,
    error_message: null,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
]

const applyMemoryJobFilters = (items, { status, source, category }) => {
  let filtered = [...items]
  if (status) filtered = filtered.filter((item) => item.status === status)
  if (source) filtered = filtered.filter((item) => item.source === source)
  if (category) filtered = filtered.filter((item) => item.category === category)
  return filtered
}

/**
 * Retrieve paginated scraping jobs with optional filtering.
 */
export const findJobs = async ({ status, source, category, page = 1, limit = 10 }) => {
  if (!isSupabaseConfigured || !supabase) {
    const filtered = applyMemoryJobFilters(inMemoryJobs, { status, source, category })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    const pageNumber = Number(page) || 1
    const limitNumber = Number(limit) || 10
    const start = (pageNumber - 1) * limitNumber
    return { data: filtered.slice(start, start + limitNumber), count: filtered.length }
  }

  const offset = (Number(page) - 1) * Number(limit)
  let query = supabase.from(TABLE).select('*', { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (source) query = query.eq('source', source)
  if (category) query = query.eq('category', category)

  query = query.order('created_at', { ascending: false }).range(offset, offset + Number(limit) - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

/**
 * Find a single job by UUID.
 */
export const findJobById = async (id) => {
  if (!isSupabaseConfigured || !supabase) {
    return inMemoryJobs.find((job) => job.id === id) || null
  }

  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Create a new scraping job.
 */
export const insertJob = async (payload) => {
  if (!isSupabaseConfigured || !supabase) {
    const job = {
      id: randomUUID(),
      ...payload,
      status: payload.status || 'pending',
      started_at: payload.started_at || null,
      completed_at: payload.completed_at || null,
      products_found: payload.products_found ?? 0,
      error_message: payload.error_message || null,
      created_at: new Date().toISOString(),
    }
    inMemoryJobs.unshift(job)
    return job
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...payload, status: payload.status || 'pending' }])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a scraping job (typically to change its status, set started_at / completed_at, etc.).
 */
export const updateJobById = async (id, payload) => {
  if (!isSupabaseConfigured || !supabase) {
    const index = inMemoryJobs.findIndex((item) => item.id === id)
    if (index === -1) return null
    const updated = { ...inMemoryJobs[index], ...payload }
    inMemoryJobs[index] = updated
    return updated
  }

  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

