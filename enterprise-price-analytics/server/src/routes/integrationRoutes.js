import { Router } from 'express'
import { getScraperIntegrationStatus, getMlIntegrationStatus } from '../controllers/integrationController.js'

const router = Router()

router.get('/scraper/status', getScraperIntegrationStatus)
router.get('/ml/status', getMlIntegrationStatus)

export default router
