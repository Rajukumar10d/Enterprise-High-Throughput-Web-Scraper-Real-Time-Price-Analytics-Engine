import { validationResult } from 'express-validator'
import { getAnalyticsOverview, getPriceHistoryByProduct, getSourceComparison } from '../services/analyticsService.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getOverview = async (req, res, next) => {
  try {
    const overview = await getAnalyticsOverview()
    return sendSuccess(res, overview, 'Analytics overview retrieved successfully')
  } catch (err) {
    next(err)
  }
}

export const getProductPriceHistory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())

    const history = await getPriceHistoryByProduct(req.params.productId)
    return sendSuccess(res, history, 'Product price history retrieved successfully')
  } catch (err) {
    next(err)
  }
}

export const getComparison = async (req, res, next) => {
  try {
    const comparison = await getSourceComparison()
    return sendSuccess(res, comparison, 'Source comparison retrieved successfully')
  } catch (err) {
    next(err)
  }
}
