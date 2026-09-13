import { validationResult } from 'express-validator'
import {
  findSources,
  findSourceById,
  insertSource,
  updateSourceById,
} from '../services/sourceService.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ── GET /api/sources ──────────────────────────────────────────
export const getSources = async (req, res, next) => {
  try {
    const data = await findSources()
    return sendSuccess(res, data, 'Sources retrieved successfully')
  } catch (err) {
    next(err)
  }
}

// ── GET /api/sources/:id ──────────────────────────────────────
export const getSourceById = async (req, res, next) => {
  try {
    const source = await findSourceById(req.params.id)
    if (!source) return sendError(res, 'Source not found', 404)
    return sendSuccess(res, source, 'Source retrieved successfully')
  } catch (err) {
    next(err)
  }
}

// ── POST /api/sources ─────────────────────────────────────────
export const createSource = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const { name, base_url, status = 'active' } = req.body
    const source = await insertSource({ name, base_url, status })
    return sendSuccess(res, source, 'Source created successfully', 201)
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/sources/:id ──────────────────────────────────────
export const updateSource = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const existing = await findSourceById(req.params.id)
    if (!existing) return sendError(res, 'Source not found', 404)

    const source = await updateSourceById(req.params.id, req.body)
    return sendSuccess(res, source, 'Source updated successfully')
  } catch (err) {
    next(err)
  }
}
