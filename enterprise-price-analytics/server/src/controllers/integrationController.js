import { getScraperStatus, getMlStatus } from '../services/integrationService.js'
import { sendSuccess } from '../utils/response.js'

export const getScraperIntegrationStatus = async (req, res, next) => {
  try {
    const status = await getScraperStatus()
    return sendSuccess(res, status, 'Scraper integration status retrieved successfully')
  } catch (err) {
    next(err)
  }
}

export const getMlIntegrationStatus = async (req, res, next) => {
  try {
    const status = await getMlStatus()
    return sendSuccess(res, status, 'ML integration status retrieved successfully')
  } catch (err) {
    next(err)
  }
}
