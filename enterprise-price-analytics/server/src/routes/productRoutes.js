import { Router } from 'express'
import { body, query, param } from 'express-validator'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'

const router = Router()

const VALID_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED']
const VALID_CATEGORIES = ['Electronics', 'Mobiles', 'Laptops', 'Accessories', 'Home Appliances', 'Gaming', 'Other']
const VALID_SORT = ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'created_at_desc', 'created_at_asc', 'updated_at_desc']

// ── GET /api/products ─────────────────────────────────────────
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
    query('sort').optional().isIn(VALID_SORT).withMessage(`sort must be one of: ${VALID_SORT.join(', ')}`),
  ],
  getProducts
)

// ── GET /api/products/:id ─────────────────────────────────────
router.get(
  '/:id',
  [param('id').isUUID().withMessage('id must be a valid UUID')],
  getProductById
)

// ── POST /api/products ────────────────────────────────────────
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('current_price').isFloat({ min: 0 }).withMessage('current_price must be a non-negative number'),
    body('previous_price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('previous_price must be a non-negative number'),
    body('currency').optional().isIn(VALID_CURRENCIES).withMessage(`currency must be one of: ${VALID_CURRENCIES.join(', ')}`),
    body('source').optional().trim().notEmpty().withMessage('source cannot be empty if provided'),
    body('category').optional().isIn(VALID_CATEGORIES).withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  ],
  createProduct
)

// ── PUT /api/products/:id ─────────────────────────────────────
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('id must be a valid UUID'),
    body('name').optional().trim().notEmpty().withMessage('name cannot be empty if provided'),
    body('current_price').optional().isFloat({ min: 0 }).withMessage('current_price must be a non-negative number'),
    body('previous_price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('previous_price must be a non-negative number'),
    body('currency').optional().isIn(VALID_CURRENCIES).withMessage(`currency must be one of: ${VALID_CURRENCIES.join(', ')}`),
  ],
  updateProduct
)

// ── DELETE /api/products/:id ──────────────────────────────────
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('id must be a valid UUID')],
  deleteProduct
)

export default router
