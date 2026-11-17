import { createClient } from '@supabase/supabase-js';

// Get environment variables or fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * -------------------------------------------------------------
 * API METHODS FOR ALL 7 PAGES
 * -------------------------------------------------------------
 */

// 1. DASHBOARD & MATRIX: Fetch all products with their latest 5-source prices
export async function getProductsFromSupabase() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      brand,
      sku,
      category,
      emoji,
      image,
      last_updated,
      product_prices (
        source,
        price,
        in_stock
      )
    `);

  if (error) {
    console.error('Error fetching products:', error);
    return null;
  }

  // Format Supabase relational data into the format this UI uses
  return data.map(p => {
    const prices = { Amazon: null, Flipkart: null, Croma: null, Snapmint: null, Myntra: null };
    const stock = { Amazon: false, Flipkart: false, Croma: false, Snapmint: false, Myntra: false };

    if (p.product_prices) {
      p.product_prices.forEach(pp => {
        prices[pp.source] = pp.price;
        stock[pp.source] = pp.in_stock;
      });
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      sku: p.sku,
      category: p.category,
      emoji: p.emoji,
      image: p.image,
      lastUpdated: p.last_updated || 'Just now',
      prices,
      stock,
    };
  });
}

// 2. PRODUCT DETAIL: Fetch price history for charts (7D / 30D)
export async function getPriceHistoryFromSupabase(productId, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data, error } = await supabase
    .from('price_history')
    .select('date, source, price')
    .eq('product_id', productId)
    .gte('date', cutoffDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching price history:', error);
    return [];
  }

  // Pivot data by date for Recharts: [{ date: '2024-01-01', Amazon: 12000, Flipkart: 11900, ... }]
  const dateMap = {};
  data.forEach(row => {
    if (!dateMap[row.date]) {
      dateMap[row.date] = { date: row.date };
    }
    dateMap[row.date][row.source] = row.price;
  });

  return Object.values(dateMap);
}

// 3. SCRAPER STATUS: Fetch status of all 5 scraper bots
export async function getScraperStatusesFromSupabase() {
  const { data, error } = await supabase
    .from('scraper_status')
    .select('*')
    .order('source', { ascending: true });

  if (error) {
    console.error('Error fetching scraper statuses:', error);
    return null;
  }

  return data.map(s => ({
    source: s.source,
    status: s.status,
    lastRunTimestamp: new Date(s.last_run).getTime(),
    latency: s.latency,
    successRate: s.success_rate,
  }));
}

// 4. SCRAPER STATUS: Trigger a re-scrape via Supabase Edge Function or Webhook
export async function triggerScraperRun(source = 'all') {
  const { data, error } = await supabase.functions.invoke('run-scraper', {
    body: { source },
  });

  if (error) {
    console.error('Error triggering scraper:', error);
    return false;
  }
  return data;
}

// 5. PRICE ALERTS: Fetch user alerts
export async function getAlertsFromSupabase(userId = 'default_user') {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
  return data;
}

// 6. PRICE ALERTS: Add new alert
export async function createAlertInSupabase(alertData) {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([
      {
        user_id: 'default_user',
        product_id: alertData.productId,
        product_name: alertData.productName,
        target_price: alertData.targetPrice,
        current_lowest: alertData.currentLowest,
        status: alertData.status,
      },
    ])
    .select();

  if (error) {
    console.error('Error creating alert:', error);
    return null;
  }
  return data[0];
}

// 7. PRICE ALERTS: Remove alert
export async function deleteAlertFromSupabase(alertId) {
  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId);

  if (error) {
    console.error('Error deleting alert:', error);
    return false;
  }
  return true;
}

// 8. REALTIME SUBSCRIPTION: Listen for live price updates from backend scraper!
export function subscribeToLivePriceUpdates(onPriceChange) {
  return supabase
    .channel('public:product_prices')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'product_prices' },
      payload => {
        console.log('⚡ Realtime Supabase price change received:', payload);
        onPriceChange(payload);
      }
    )
    .subscribe();
}
