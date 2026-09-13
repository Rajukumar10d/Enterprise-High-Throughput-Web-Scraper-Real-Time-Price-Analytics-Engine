import { sendError } from '../utils/response.js'

/**
 * Catch-all 404 handler for undefined routes.
 * Must be registered AFTER all valid routes.
 */
export const notFound = (req, res, next) => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404)
}
