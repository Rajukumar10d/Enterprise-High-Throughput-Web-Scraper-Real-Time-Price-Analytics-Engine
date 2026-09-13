import { sendError } from '../utils/response.js'

/**
 * Global error-handling middleware.
 * Express identifies error middleware by its 4-argument signature (err, req, res, next).
 * Must be registered LAST in app.js.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err.message || err)

  // express-validator errors propagated via next(err)
  if (err.type === 'validation') {
    return sendError(res, err.message, 422, err.errors)
  }

  // Supabase / PostgreSQL errors
  if (err.code && typeof err.code === 'string') {
    // Unique constraint violation
    if (err.code === '23505') {
      return sendError(res, 'Duplicate entry — a record with these values already exists.', 409)
    }
    // Foreign key violation
    if (err.code === '23503') {
      return sendError(res, 'Referenced resource does not exist.', 400)
    }
  }

  // Invalid UUID format (PostgreSQL)
  if (err.message && err.message.includes('invalid input syntax for type uuid')) {
    return sendError(res, 'Invalid ID format — expected a UUID.', 400)
  }

  // Generic fallback
  const statusCode = err.statusCode || err.status || 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'

  return sendError(res, message, statusCode, process.env.NODE_ENV !== 'production' ? err.stack : null)
}
