import { Router } from 'express'
import { param } from 'express-validator'
import { getOverview, getProductPriceHistory, getComparison } from '../controllers/analyticsController.js'

const router = Router()

router.get('/overview', getOverview)
router.get('/price-history/:productId', [param('productId').isUUID().withMessage('productId must be a valid UUID')], getProductPriceHistory)
router.get('/source-comparison', getComparison)

export default router
