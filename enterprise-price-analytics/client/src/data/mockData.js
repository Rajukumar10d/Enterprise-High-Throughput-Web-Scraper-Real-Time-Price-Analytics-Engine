
export const SOURCES = ['Amazon', 'Flipkart', 'Croma', 'Snapmint', 'Myntra'];

export const SOURCE_COLORS = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Croma: '#6CC04A',
  Snapmint: '#7C3AED',
  Myntra: '#FF3F6C',
};

export const SOURCE_URLS = {
  Amazon: 'https://amazon.in',
  Flipkart: 'https://flipkart.com',
  Croma: 'https://croma.com',
  Snapmint: 'https://snapmint.com',
  Myntra: 'https://myntra.com',
};

export const PRODUCTS = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    sku: 'APL-IP15PM-256',
    category: 'Smartphones',
    emoji: '📱',
    image: '/images/iphone.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 134900, Flipkart: 129999, Croma: 139900, Snapmint: 127500, Myntra: 132000 },
    stock: { Amazon: true, Flipkart: true, Croma: true, Snapmint: false, Myntra: true },
    lastUpdated: '2 mins ago',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 512GB',
    brand: 'Samsung',
    sku: 'SAM-S24U-512',
    category: 'Smartphones',
    emoji: '📱',
    image: '/images/samsung.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 124999, Flipkart: 119999, Croma: 129900, Snapmint: 117800, Myntra: 122000 },
    stock: { Amazon: true, Flipkart: true, Croma: false, Snapmint: true, Myntra: true },
    lastUpdated: '5 mins ago',
  },
  {
    id: 3,
    name: 'Sony Bravia 65" 4K OLED TV',
    brand: 'Sony',
    sku: 'SNY-TV65-OLED',
    category: 'Televisions',
    emoji: '📺',
    image: '/images/sony_tv.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 189900, Flipkart: 182000, Croma: 195000, Snapmint: 178000, Myntra: 184999 },
    stock: { Amazon: true, Flipkart: true, Croma: true, Snapmint: true, Myntra: true },
    lastUpdated: '10 mins ago',
  },
  {
    id: 4,
    name: 'Dell XPS 15 Core i9 RTX 4070',
    brand: 'Dell',
    sku: 'DEL-XPS15-I9',
    category: 'Laptops',
    emoji: '💻',
    image: '/images/dell_xps.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 219000, Flipkart: 212999, Croma: 224900, Snapmint: 209000, Myntra: 216000 },
    stock: { Amazon: true, Flipkart: false, Croma: true, Snapmint: true, Myntra: true },
    lastUpdated: '3 mins ago',
  },
  {
    id: 5,
    name: 'Dyson V15 Detect Vacuum Cleaner',
    brand: 'Dyson',
    sku: 'DYS-V15-DET',
    category: 'Appliances',
    emoji: '🌀',
    image: '/images/dyson.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 52900, Flipkart: 49999, Croma: 54900, Snapmint: 48500, Myntra: 51000 },
    stock: { Amazon: true, Flipkart: true, Croma: true, Snapmint: true, Myntra: true },
    lastUpdated: '8 mins ago',
  },
  {
    id: 6,
    name: 'Apple MacBook Pro M3 Pro 14"',
    brand: 'Apple',
    sku: 'APL-MBP-M3P-14',
    category: 'Laptops',
    emoji: '💻',
    image: '/images/macbook.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 198900, Flipkart: 194999, Croma: 205000, Snapmint: 189900, Myntra: 196500 },
    stock: { Amazon: true, Flipkart: true, Croma: true, Snapmint: false, Myntra: true },
    lastUpdated: '1 min ago',
  },
  {
    id: 7,
    name: 'Bose QuietComfort 45 Headphones',
    brand: 'Bose',
    sku: 'BSE-QC45-BLK',
    category: 'Audio',
    emoji: '🎧',
    image: '/images/bose.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 24900, Flipkart: 22999, Croma: 26500, Snapmint: 21999, Myntra: 23500 },
    stock: { Amazon: true, Flipkart: true, Croma: false, Snapmint: true, Myntra: true },
    lastUpdated: '15 mins ago',
  },
  {
    id: 8,
    name: 'OnePlus 12 256GB Flowy Emerald',
    brand: 'OnePlus',
    sku: 'OP-12-256-EM',
    category: 'Smartphones',
    emoji: '📱',
    image: '/images/oneplus.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 64999, Flipkart: 61999, Croma: 66900, Snapmint: 60500, Myntra: 63000 },
    stock: { Amazon: true, Flipkart: true, Croma: true, Snapmint: true, Myntra: true },
    lastUpdated: '4 mins ago',
  },
  {
    id: 9,
    name: 'LG 1.5 Ton 5 Star Inverter AC',
    brand: 'LG',
    sku: 'LG-AC-1.5T-5S',
    category: 'Appliances',
    emoji: '❄️',
    image: '/images/ac.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 42999, Flipkart: 39999, Croma: 44500, Snapmint: 38500, Myntra: 41500 },
    stock: { Amazon: true, Flipkart: true, Croma: true, Snapmint: true, Myntra: true },
    lastUpdated: '6 mins ago',
  },
  {
    id: 10,
    name: 'GoPro Hero 12 Black Action Cam',
    brand: 'GoPro',
    sku: 'GPR-H12-BLK',
    category: 'Cameras',
    emoji: '📷',
    image: '/images/gopro.jpg',
    bgColor: '#1e293b',
    prices: { Amazon: 36500, Flipkart: 34999, Croma: 37900, Snapmint: 33900, Myntra: 35500 },
    stock: { Amazon: true, Flipkart: true, Croma: false, Snapmint: true, Myntra: true },
    lastUpdated: '12 mins ago',
  },
];

// Generate price history for last 30 days
export function generatePriceHistory(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return [];

  const history = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const entry = { date: date.toISOString().split('T')[0] };

    SOURCES.forEach(source => {
      const base = product.prices[source];
      if (base === null) { entry[source] = null; return; }
      const variation = (Math.random() - 0.5) * 0.08 * base;
      entry[source] = Math.round(base + variation);
    });

    history.push(entry);
  }
  return history;
}

export function getLowestPrice(product) {
  const validPrices = SOURCES.map(s => product.prices[s]).filter(p => p !== null);
  return Math.min(...validPrices);
}

export function getHighestPrice(product) {
  const validPrices = SOURCES.map(s => product.prices[s]).filter(p => p !== null);
  return Math.max(...validPrices);
}

export function getBestSource(product) {
  let best = null, bestPrice = Infinity;
  SOURCES.forEach(s => {
    if (product.prices[s] !== null && product.prices[s] < bestPrice) {
      bestPrice = product.prices[s];
      best = s;
    }
  });
  return best;
}

export function getArbitrageGap(product) {
  return getHighestPrice(product) - getLowestPrice(product);
}

export const formatPrice = (price) => {
  if (price === null) return 'N/A';
  return '₹' + price.toLocaleString('en-IN');
};

// Scraper status mock data
export const SCRAPER_STATUS = [
  { source: 'Amazon', status: 'Healthy', lastRun: '2 mins ago', nextRun: 'in 8 mins', latency: '1.2s', successRate: '99.2%' },
  { source: 'Flipkart', status: 'Healthy', lastRun: '3 mins ago', nextRun: 'in 7 mins', latency: '0.9s', successRate: '98.7%' },
  { source: 'Croma', status: 'Healthy', lastRun: '5 mins ago', nextRun: 'in 5 mins', latency: '1.8s', successRate: '97.1%' },
  { source: 'Snapmint', status: 'Healthy', lastRun: '4 mins ago', nextRun: 'in 6 mins', latency: '2.1s', successRate: '95.4%' },
  { source: 'Myntra', status: 'Healthy', lastRun: '6 mins ago', nextRun: 'in 4 mins', latency: '1.4s', successRate: '96.8%' },
];
