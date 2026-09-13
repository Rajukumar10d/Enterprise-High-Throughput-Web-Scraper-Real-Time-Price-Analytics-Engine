import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'

import app from '../src/app.js'

test('GET /api/health returns service status', async () => {
  const res = await request(app).get('/api/health')

  assert.equal(res.status, 200)
  assert.equal(res.body.success, true)
  assert.match(res.body.message, /running|ready/i)
})

test('GET /api/analytics/overview returns summary data', async () => {
  const res = await request(app).get('/api/analytics/overview')

  assert.equal(res.status, 200)
  assert.equal(res.body.success, true)
  assert.ok(res.body.data)
  assert.ok(Array.isArray(res.body.data.productTrend))
})

test('GET /api/integrations/scraper/status returns integration metadata', async () => {
  const res = await request(app).get('/api/integrations/scraper/status')

  assert.equal(res.status, 200)
  assert.equal(res.body.success, true)
  assert.equal(res.body.data.status, 'configured')
})
