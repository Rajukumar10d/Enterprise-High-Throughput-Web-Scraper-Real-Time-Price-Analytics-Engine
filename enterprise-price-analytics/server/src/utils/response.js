/**
 * Standardised API response helpers.
 * Always use these to ensure consistent response shape across all endpoints.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data - Payload to include under `data`
 * @param {string} message - Human-readable message
 * @param {number} statusCode - HTTP status (default 200)
 * @param {Object|null} pagination - Optional pagination meta
 */
export const sendSuccess = (res, data = null, message = 'Operation successful', statusCode = 200, pagination = null) => {
  const body = {
    success: true,
    data,
    message,
  }
  if (pagination) body.pagination = pagination
  return res.status(statusCode).json(body)
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status (default 500)
 * @param {*} errors - Optional validation/debug errors (only in development)
 */
export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const body = {
    success: false,
    data: null,
    message,
  }
  // Only expose error details in development to avoid information leakage in production
  if (process.env.NODE_ENV !== 'production' && errors) {
    body.errors = errors
  }
  return res.status(statusCode).json(body)
}

/**
 * Build a pagination metadata object.
 */
export const buildPagination = (page, limit, total) => ({
  page: Number(page),
  limit: Number(limit),
  total: Number(total),
  totalPages: Math.ceil(Number(total) / Number(limit)),
})
