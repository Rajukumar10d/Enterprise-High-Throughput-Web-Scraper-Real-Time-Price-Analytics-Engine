import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import productRoutes from './routes/productRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import sourceRoutes from './routes/sourceRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import integrationRoutes from './routes/integrationRoutes.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// ── CORS ──────────────────────────────────────────────────────
// Allow the React dev server (5173) and any production origin
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_ORIGIN,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: Origin ${origin} is not allowed`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Enterprise Price Analytics API is running',
  })
})

// ── API Routes ────────────────────────────────────────────────
app.use('/api/products', productRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/sources', sourceRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/integrations', integrationRoutes)

// ── 404 & Error Handlers ──────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
