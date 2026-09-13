import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getSources,
  getSourceById,
  createSource,
  updateSource,
} from '../controllers/sourceController.js'

const router = Router()

const VALID_SOURCE_STATUSES = ['active', 'inactive', 'paused']

// ── GET /api/sources ──────────────────────────────────────────
router.get('/', getSources)

// ── GET /api/sources/:id ──────────────────────────────────────
router.get(
  '/:id',
  [param('id').isUUID().withMessage('id must be a valid UUID')],
  getSourceById
)

// ── POST /api/sources ─────────────────────────────────────────
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('base_url').trim().isURL().withMessage('base_url must be a valid URL'),
    body('status').optional().isIn(VALID_SOURCE_STATUSES).withMessage(`status must be one of: ${VALID_SOURCE_STATUSES.join(', ')}`),
  ],
  createSource
)

// ── PUT /api/sources/:id ──────────────────────────────────────
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('id must be a valid UUID'),
    body('name').optional().trim().notEmpty().withMessage('name cannot be empty if provided'),
    body('base_url').optional().trim().isURL().withMessage('base_url must be a valid URL'),
    body('status').optional().isIn(VALID_SOURCE_STATUSES).withMessage(`status must be one of: ${VALID_SOURCE_STATUSES.join(', ')}`),
  ],
  updateSource
)

export default router
