import { validationResult } from 'express-validator'
import {
  findJobs,
  findJobById,
  insertJob,
  updateJobById,
  VALID_STATUSES,
} from '../services/jobService.js'
import { sendSuccess, sendError, buildPagination } from '../utils/response.js'

// ── GET /api/jobs ─────────────────────────────────────────────
export const getJobs = async (req, res, next) => {
  try {
    const { status, source, category, page = 1, limit = 10 } = req.query
    const { data, count } = await findJobs({ status, source, category, page, limit })

    return sendSuccess(
      res,
      data,
      'Jobs retrieved successfully',
      200,
      buildPagination(page, limit, count)
    )
  } catch (err) {
    next(err)
  }
}

// ── GET /api/jobs/:id ─────────────────────────────────────────
export const getJobById = async (req, res, next) => {
  try {
    const job = await findJobById(req.params.id)
    if (!job) return sendError(res, 'Job not found', 404)
    return sendSuccess(res, job, 'Job retrieved successfully')
  } catch (err) {
    next(err)
  }
}

// ── POST /api/jobs ────────────────────────────────────────────
export const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const { source, category, status = 'pending' } = req.body

    const job = await insertJob({ source, category, status })
    return sendSuccess(res, job, 'Job created successfully', 201)
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/jobs/:id ─────────────────────────────────────────
export const updateJob = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const existing = await findJobById(req.params.id)
    if (!existing) return sendError(res, 'Job not found', 404)

    const updatePayload = { ...req.body }

    // Auto-set timestamps based on status transitions
    if (updatePayload.status === 'running' && !updatePayload.started_at) {
      updatePayload.started_at = new Date().toISOString()
    }
    if (
      (updatePayload.status === 'completed' || updatePayload.status === 'failed') &&
      !updatePayload.completed_at
    ) {
      updatePayload.completed_at = new Date().toISOString()
    }

    const job = await updateJobById(req.params.id, updatePayload)
    return sendSuccess(res, job, 'Job updated successfully')
  } catch (err) {
    next(err)
  }
}
