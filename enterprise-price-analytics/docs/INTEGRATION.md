# Integration Notes

The scraper and ML workers are intentionally outside the primary web app. This project exposes stable interfaces that both teams can target without changing the dashboard behavior.

- Scraper interface: /api/integrations/scraper/status
- ML interface: /api/integrations/ml/status
- Analytics interface: /api/analytics/*
