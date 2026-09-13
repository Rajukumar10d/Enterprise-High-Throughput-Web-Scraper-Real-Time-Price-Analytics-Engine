import { validationResult } from 'express-validator'
import {
  findProducts,
  findProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
  computePriceFields,
} from '../services/productService.js'
import { sendSuccess, sendError, buildPagination } from '../utils/response.js'

// ── GET /api/products ─────────────────────────────────────────
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, source, page = 1, limit = 10, sort } = req.query
    const { data, count } = await findProducts({ search, category, source, page, limit, sort })

    return sendSuccess(
      res,
      data,
      'Products retrieved successfully',
      200,
      buildPagination(page, limit, count)
    )
  } catch (err) {
    next(err)
  }
}

// ── GET /api/products/:id ─────────────────────────────────────
export const getProductById = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id)
    if (!product) return sendError(res, 'Product not found', 404)
    return sendSuccess(res, product, 'Product retrieved successfully')
  } catch (err) {
    next(err)
  }
}

// ── POST /api/products ────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const {
      name, description, category, source,
      source_product_id, product_url, image_url,
      currency = 'INR', current_price, previous_price,
    } = req.body

    const priceFields = computePriceFields(current_price, previous_price)

    const product = await insertProduct({
      name,
      description,
      category,
      source,
      source_product_id,
      product_url,
      image_url,
      currency,
      current_price: parseFloat(current_price),
      previous_price: previous_price ? parseFloat(previous_price) : null,
      ...priceFields,
      last_scraped_at: new Date().toISOString(),
    })

    return sendSuccess(res, product, 'Product created successfully', 201)
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/products/:id ─────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const existing = await findProductById(req.params.id)
    if (!existing) return sendError(res, 'Product not found', 404)

    const updatePayload = { ...req.body }

    // Recalculate price fields when price data changes
    const newCurrentPrice = req.body.current_price ?? existing.current_price
    const newPreviousPrice = req.body.previous_price ?? existing.current_price // current becomes previous if updating

    if (req.body.current_price !== undefined) {
      const priceFields = computePriceFields(newCurrentPrice, newPreviousPrice)
      Object.assign(updatePayload, priceFields, {
        last_scraped_at: new Date().toISOString(),
      })
    }

    const product = await updateProductById(req.params.id, updatePayload)
    return sendSuccess(res, product, 'Product updated successfully')
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/products/:id ──────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    const existing = await findProductById(req.params.id)
    if (!existing) return sendError(res, 'Product not found', 404)

    await deleteProductById(req.params.id)
    return sendSuccess(res, null, 'Product deleted successfully')
  } catch (err) {
    next(err)
  }
}
