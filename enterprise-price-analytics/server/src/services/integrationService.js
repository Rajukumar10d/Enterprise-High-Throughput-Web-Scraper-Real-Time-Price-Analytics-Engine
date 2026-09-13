const integrationState = {
  scraper: {
    status: 'configured',
    mode: 'local-hosted',
    lastSyncAt: new Date().toISOString(),
    queueDepth: 2,
    nodes: ['amazon', 'flipkart', 'croma'],
  },
  ml: {
    status: 'pending',
    mode: 'interface-only',
    lastSyncAt: null,
    model: 'not-configured',
  },
}

export const getScraperStatus = async () => ({
  ...integrationState.scraper,
  ready: true,
  description: 'Scraper integration layer is ready for a future external worker connection.',
})

export const getMlStatus = async () => ({
  ...integrationState.ml,
  ready: false,
  description: 'ML pipeline integration is stubbed and will be connected when the model service is live.',
})
