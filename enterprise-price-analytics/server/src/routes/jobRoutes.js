import { Router } from 'express'
import { body, query, param } from 'express-validator'
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
} from '../controllers/jobController.js'
import { VALID_STATUSES } from '../services/jobService.js'

const router = Router()

// ── GET /api/jobs ─────────────────────────────────────────────
router.get(
  '/',
  [
    query('status').optional().isIn(VALID_STATUSES).withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  ],
  getJobs
)

// ── GET /api/jobs/:id ─────────────────────────────────────────
router.get(
  '/:id',
  [param('id').isUUID().withMessage('id must be a valid UUID')],
  getJobById
)

// ── POST /api/jobs ────────────────────────────────────────────
router.post(
  '/',
  [
    body('source').trim().notEmpty().withMessage('source is required'),
    body('status').optional().isIn(VALID_STATUSES).withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
  ],
  createJob
)

// ── PUT /api/jobs/:id ─────────────────────────────────────────
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('id must be a valid UUID'),
    body('status').optional().isIn(VALID_STATUSES).withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
    body('products_found').optional().isInt({ min: 0 }).withMessage('products_found must be a non-negative integer'),
  ],
  updateJob
)

export default router
