import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, SOURCES, SCRAPER_STATUS } from '../data/mockData';

const ScraperContext = createContext();

// Function to generate realistic market price fluctuations
function generateUpdatedPrices(prevProducts) {
  return prevProducts.map(p => {
    const updatedPrices = { ...p.prices };
    SOURCES.forEach(s => {
      if (updatedPrices[s] !== null) {
        // 60% chance price fluctuates slightly between -2% and +2%
        if (Math.random() > 0.4) {
          const deltaPercent = (Math.random() - 0.48) * 0.035;
          const delta = Math.round(updatedPrices[s] * deltaPercent);
          updatedPrices[s] = Math.max(999, updatedPrices[s] + delta);
        }
      }
    });
    return {
      ...p,
      prices: updatedPrices,
      lastUpdated: 'Just now',
    };
  });
}

export function ScraperProvider({ children }) {
  // Products state with live dynamic prices
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('price_engine_products_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(p => {
          const defaultProduct = PRODUCTS.find(d => d.id === p.id) || p;
          return {
            ...p,
            prices: {
              ...defaultProduct.prices,
              ...p.prices,
              Myntra: p.prices?.Myntra ?? defaultProduct.prices.Myntra,
            },
          };
        });
      } catch (e) {}
    }
    return PRODUCTS;
  });

  // Unified auto-scraping interval (default: 60 seconds)
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [lastGlobalScrape, setLastGlobalScrape] = useState(() => Date.now() - 15000);
  const [isScrapingAll, setIsScrapingAll] = useState(false);
  const [reScraping, setReScraping] = useState(new Set());
  const [justUpdated, setJustUpdated] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [statuses, setStatuses] = useState(() => {
    const saved = localStorage.getItem('scraper_statuses_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SCRAPER_STATUS.map(s => ({
      ...s,
      lastRunTimestamp: Date.now() - 15000,
    }));
  });

  // Core 1-second background countdown & auto-scrape trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Trigger automated unified scrape!
          triggerUnifiedScrape();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalSeconds]);

  const triggerUnifiedScrape = () => {
    setIsScrapingAll(true);

    setTimeout(() => {
      const current = Date.now();

      // 1. Update product prices
      setProducts(prev => {
        const updated = generateUpdatedPrices(prev);
        try { localStorage.setItem('price_engine_products_v4', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      // 2. Update scraper statuses for all 5 sources
      setStatuses(prev => {
        const updated = prev.map(s => ({
          ...s,
          lastRunTimestamp: current,
          latency: (0.7 + Math.random() * 1.1).toFixed(1) + 's',
          status: 'Healthy',
        }));
        try { localStorage.setItem('scraper_statuses_v3', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      setLastGlobalScrape(current);
      setIsScrapingAll(false);
      setJustUpdated(true);

      setTimeout(() => setJustUpdated(false), 4500);
    }, 1200);
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleReScrape = (source) => {
    setReScraping(prev => new Set([...prev, source]));
    setTimeout(() => {
      const current = Date.now();
      setStatuses(prev => {
        const next = prev.map(s =>
          s.source === source
            ? { ...s, lastRunTimestamp: current, latency: (0.7 + Math.random() * 1.1).toFixed(1) + 's' }
            : s
        );
        try { localStorage.setItem('scraper_statuses_v3', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      setLastGlobalScrape(current);
      setReScraping(prev => {
        const n = new Set(prev);
        n.delete(source);
        return n;
      });
    }, 1200);
  };

  const handleReScrapeAll = () => {
    triggerUnifiedScrape();
    setSecondsRemaining(intervalSeconds);
  };

  return (
    <ScraperContext.Provider
      value={{
        products,
        statuses,
        lastGlobalScrape,
        relativeGlobalScrape: formatRelativeTime(lastGlobalScrape),
        secondsRemaining,
        intervalSeconds,
        setIntervalSeconds,
        isScrapingAll,
        reScraping,
        justUpdated,
        handleReScrape,
        handleReScrapeAll,
        formatRelativeTime,
      }}
    >
      {children}
    </ScraperContext.Provider>
  );
}

export function useScraper() {
  const context = useContext(ScraperContext);
  if (!context) throw new Error('useScraper must be used within ScraperProvider');
  return context;
}
