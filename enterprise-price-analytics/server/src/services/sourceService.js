import { randomUUID } from 'node:crypto'
import supabase, { isSupabaseConfigured } from '../lib/supabase.js'

const TABLE = 'sources'

const inMemorySources = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Amazon',
    base_url: 'https://www.amazon.in',
    status: 'active',
    last_scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Flipkart',
    base_url: 'https://www.flipkart.com',
    status: 'active',
    last_scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'Croma',
    base_url: 'https://www.croma.com',
    status: 'active',
    last_scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]

/**
 * Retrieve all sources.
 */
export const findSources = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return [...inMemorySources].sort((a, b) => a.name.localeCompare(b.name))
  }

  const { data, error } = await supabase.from(TABLE).select('*').order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Find a source by UUID.
 */
export const findSourceById = async (id) => {
  if (!isSupabaseConfigured || !supabase) {
    return inMemorySources.find((item) => item.id === id) || null
  }

  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Create a new source entry.
 */
export const insertSource = async (payload) => {
  if (!isSupabaseConfigured || !supabase) {
    const source = {
      id: randomUUID(),
      ...payload,
      status: payload.status || 'active',
      last_scraped_at: payload.last_scraped_at || null,
      created_at: new Date().toISOString(),
    }
    inMemorySources.unshift(source)
    return source
  }

  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single()
  if (error) throw error
  return data
}

/**
 * Update an existing source.
 */
export const updateSourceById = async (id, payload) => {
  if (!isSupabaseConfigured || !supabase) {
    const index = inMemorySources.findIndex((item) => item.id === id)
    if (index === -1) return null
    const updated = { ...inMemorySources[index], ...payload }
    inMemorySources[index] = updated
    return updated
  }

  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}
