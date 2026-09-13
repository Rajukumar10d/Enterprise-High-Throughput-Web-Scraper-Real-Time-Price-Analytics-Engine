import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

const server = app.listen(PORT, () => {
  console.log('')
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║     Enterprise Price Analytics API — Server Ready    ║')
  console.log('╠══════════════════════════════════════════════════════╣')
  console.log(`║  Mode        : ${NODE_ENV.padEnd(37)}║`)
  console.log(`║  Port        : ${String(PORT).padEnd(37)}║`)
  console.log(`║  API Base    : http://localhost:${PORT}/api             ║`)
  console.log(`║  Health      : http://localhost:${PORT}/api/health      ║`)
  console.log('╚══════════════════════════════════════════════════════╝')
  console.log('')
})

// ── Graceful Shutdown ─────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully…`)
  server.close(() => {
    console.log('✅ Server closed.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))

// Unhandled promise rejections — log and exit so nodemon can restart
process.on('unhandledRejection', (reason) => {
  console.error('🔴 Unhandled Promise Rejection:', reason)
  process.exit(1)
})
