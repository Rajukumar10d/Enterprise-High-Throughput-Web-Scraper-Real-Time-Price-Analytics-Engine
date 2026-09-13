-- ============================================================
-- Enterprise Price Analytics Engine — Seed Data
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- ============================================================
-- NOTE: These are demo records only. No real scraping was performed.
-- Prices are approximate INR values for illustration purposes.
-- ============================================================

-- Clear existing data (safe to re-run)
TRUNCATE TABLE price_history, scraping_jobs, products, sources RESTART IDENTITY CASCADE;

-- ============================================================
-- SOURCES (5)
-- ============================================================
INSERT INTO sources (id, name, base_url, status, last_scraped_at) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Amazon',          'https://www.amazon.in',          'active',   NOW() - INTERVAL '2 hours'),
  ('11111111-0000-0000-0000-000000000002', 'Flipkart',        'https://www.flipkart.com',       'active',   NOW() - INTERVAL '3 hours'),
  ('11111111-0000-0000-0000-000000000003', 'Croma',           'https://www.croma.com',          'active',   NOW() - INTERVAL '5 hours'),
  ('11111111-0000-0000-0000-000000000004', 'Reliance Digital', 'https://www.reliancedigital.in', 'active',  NOW() - INTERVAL '6 hours'),
  ('11111111-0000-0000-0000-000000000005', 'Demo Store',      'https://demo.priceanalytics.in', 'inactive', NOW() - INTERVAL '1 day');

-- ============================================================
-- SCRAPING JOBS (10)
-- ============================================================
INSERT INTO scraping_jobs (id, source, category, status, started_at, completed_at, products_found, error_message, created_at) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Amazon',           'Mobiles',        'completed', NOW() - INTERVAL '4 hours',   NOW() - INTERVAL '3 hours 50 min', 12, NULL,                    NOW() - INTERVAL '4 hours'),
  ('22222222-0000-0000-0000-000000000002', 'Flipkart',         'Laptops',        'completed', NOW() - INTERVAL '5 hours',   NOW() - INTERVAL '4 hours 45 min', 8,  NULL,                    NOW() - INTERVAL '5 hours'),
  ('22222222-0000-0000-0000-000000000003', 'Croma',            'Electronics',    'completed', NOW() - INTERVAL '6 hours',   NOW() - INTERVAL '5 hours 55 min', 15, NULL,                    NOW() - INTERVAL '6 hours'),
  ('22222222-0000-0000-0000-000000000004', 'Amazon',           'Gaming',         'completed', NOW() - INTERVAL '8 hours',   NOW() - INTERVAL '7 hours 50 min', 6,  NULL,                    NOW() - INTERVAL '8 hours'),
  ('22222222-0000-0000-0000-000000000005', 'Reliance Digital', 'Home Appliances','completed', NOW() - INTERVAL '10 hours',  NOW() - INTERVAL '9 hours 45 min', 9,  NULL,                    NOW() - INTERVAL '10 hours'),
  ('22222222-0000-0000-0000-000000000006', 'Flipkart',         'Accessories',    'failed',    NOW() - INTERVAL '12 hours',  NOW() - INTERVAL '11 hours 58 min',0,  'Connection timeout',   NOW() - INTERVAL '12 hours'),
  ('22222222-0000-0000-0000-000000000007', 'Amazon',           'Accessories',    'running',   NOW() - INTERVAL '15 minutes',NULL,                              3,   NULL,                    NOW() - INTERVAL '20 minutes'),
  ('22222222-0000-0000-0000-000000000008', 'Croma',            'Mobiles',        'pending',   NULL,                         NULL,                              0,   NULL,                    NOW() - INTERVAL '5 minutes'),
  ('22222222-0000-0000-0000-000000000009', 'Reliance Digital', 'Laptops',        'pending',   NULL,                         NULL,                              0,   NULL,                    NOW() - INTERVAL '2 minutes'),
  ('22222222-0000-0000-0000-000000000010', 'Demo Store',       'Electronics',    'failed',    NOW() - INTERVAL '2 days',    NOW() - INTERVAL '2 days',         0,   'Source unavailable',   NOW() - INTERVAL '2 days');

-- ============================================================
-- PRODUCTS (30) — Realistic Indian e-commerce products in INR
-- ============================================================
INSERT INTO products (id, name, description, category, source, source_product_id, product_url, image_url, currency, current_price, previous_price, price_change, price_change_percentage, last_scraped_at) VALUES

-- ── Mobiles (7) ──────────────────────────────────────────────
('33333333-0000-0000-0000-000000000001',
 'Samsung Galaxy S24 Ultra 12GB/256GB',
 'Flagship Samsung smartphone with 200MP camera, Snapdragon 8 Gen 3, titanium frame and S Pen.',
 'Mobiles', 'Amazon', 'B0CQR4JRPB',
 'https://www.amazon.in/dp/B0CQR4JRPB',
 'https://m.media-amazon.com/images/I/71oOe3lyhyL._SL1500_.jpg',
 'INR', 124999.00, 134999.00, -10000.00, -7.41, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000002',
 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
 'Apple A17 Pro chip, 48MP main camera, USB 3 speeds, action button.',
 'Mobiles', 'Flipkart', 'MOBGTAGPYHKGUUZN',
 'https://www.flipkart.com/apple-iphone-15-pro-max/p/itm6eb3a0064f2fd',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/8/g/r/-original-imagthfgyfcpqmy4.jpeg',
 'INR', 159900.00, 164900.00, -5000.00, -3.03, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000003',
 'OnePlus 12 12GB/256GB Silky Black',
 'Snapdragon 8 Gen 3, Hasselblad 50MP camera, 100W SUPERVOOC charging.',
 'Mobiles', 'Amazon', 'B0CQJNT2MD',
 'https://www.amazon.in/dp/B0CQJNT2MD',
 'https://m.media-amazon.com/images/I/71G4gXPViCL._SL1500_.jpg',
 'INR', 64999.00, 69999.00, -5000.00, -7.14, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000004',
 'Xiaomi 14 5G 12GB/512GB Black',
 'Snapdragon 8 Gen 3, Leica optics, 4610mAh battery.',
 'Mobiles', 'Croma', 'CRPH265040',
 'https://www.croma.com/xiaomi-14-5g-12gb-512gb-black/p/265040',
 'https://media.croma.com/image/upload/v1700730080/Croma%20Assets/Communication/Mobiles/Images/265040_0_qrxgit.png',
 'INR', 59999.00, 59999.00, 0.00, 0.00, NOW() - INTERVAL '5 hours'),

('33333333-0000-0000-0000-000000000005',
 'Google Pixel 8 Pro 12GB/256GB Obsidian',
 'Google Tensor G3, 50MP camera with AI photography features.',
 'Mobiles', 'Flipkart', 'MOBGTAG5HFQZ4ZYJ',
 'https://www.flipkart.com/google-pixel-8-pro/p/itm0ad8d8d72c99b',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/q/u/x/-original-imagtfyhjkrwkfq8.jpeg',
 'INR', 106999.00, 109999.00, -3000.00, -2.73, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000006',
 'Realme GT 6T 5G 12GB/256GB Fluid Silver',
 'Snapdragon 7+ Gen 3, 5500mAh, 120Hz AMOLED display.',
 'Mobiles', 'Amazon', 'B0D2CZNJSR',
 'https://www.amazon.in/dp/B0D2CZNJSR',
 'https://m.media-amazon.com/images/I/61dAfGQ1c-L._SL1500_.jpg',
 'INR', 29999.00, 32999.00, -3000.00, -9.09, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000007',
 'Nothing Phone (2a) 8GB/128GB Black',
 'Dimensity 7200 Pro, Glyph Interface, transparent design.',
 'Mobiles', 'Flipkart', 'MOBGX36YXFRJQQRA',
 'https://www.flipkart.com/nothing-phone-2a/p/itm1a36b1a92af7e',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/-original-imagysavfg5jhfku.jpeg',
 'INR', 23999.00, 25999.00, -2000.00, -7.69, NOW() - INTERVAL '3 hours'),

-- ── Laptops (6) ──────────────────────────────────────────────
('33333333-0000-0000-0000-000000000008',
 'Apple MacBook Air 15 M3 8GB/256GB Midnight',
 '15-inch MacBook Air with M3 chip, 18-hour battery, Liquid Retina display.',
 'Laptops', 'Amazon', 'B0CV9B369J',
 'https://www.amazon.in/dp/B0CV9B369J',
 'https://m.media-amazon.com/images/I/71vFKBpKakL._SL1500_.jpg',
 'INR', 134900.00, 139900.00, -5000.00, -3.57, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000009',
 'Dell XPS 15 9530 Intel Core i7 16GB/512GB SSD',
 '15.6" OLED InfinityEdge display, NVIDIA GeForce RTX 4060.',
 'Laptops', 'Croma', 'CRPH253899',
 'https://www.croma.com/dell-xps-15-9530/p/253899',
 'https://media.croma.com/image/upload/v1695042979/Croma%20Assets/Computers%20Peripherals/Laptops/Images/253899_0_gqluvs.png',
 'INR', 189990.00, 199990.00, -10000.00, -5.00, NOW() - INTERVAL '5 hours'),

('33333333-0000-0000-0000-000000000010',
 'ASUS ROG Zephyrus G14 AMD Ryzen 9 16GB/1TB SSD',
 '14" QHD+ 165Hz, RTX 4060, compact gaming powerhouse.',
 'Laptops', 'Amazon', 'B0CNV6SC91',
 'https://www.amazon.in/dp/B0CNV6SC91',
 'https://m.media-amazon.com/images/I/81YHsM-FAXL._SL1500_.jpg',
 'INR', 104990.00, 114990.00, -10000.00, -8.70, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000011',
 'Lenovo ThinkPad X1 Carbon Gen 12 Intel Core i7 32GB/1TB',
 'Ultra-light business laptop, 14" IPS display, MIL-SPEC tested.',
 'Laptops', 'Reliance Digital', 'RD10052881',
 'https://www.reliancedigital.in/lenovo-thinkpad-x1-carbon-gen-12/p/10052881',
 'https://media.reliancedigital.in/img/products/lenovo/10052881_1.jpg',
 'INR', 169990.00, 169990.00, 0.00, 0.00, NOW() - INTERVAL '6 hours'),

('33333333-0000-0000-0000-000000000012',
 'HP Spectre x360 14 Intel Core Ultra 7 16GB/1TB',
 '2-in-1 OLED laptop, HP Tilt Pen, premium aluminium chassis.',
 'Laptops', 'Flipkart', 'COMGR5QXXMGHUNRQ',
 'https://www.flipkart.com/hp-spectre-x360-14/p/itmd33a44e6e35e1',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/computer/-original-imagtdycr57pqyhb.jpeg',
 'INR', 149999.00, 159999.00, -10000.00, -6.25, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000013',
 'Acer Swift Go 16 Intel Core Ultra 5 16GB/512GB',
 'OLED display, 40Wh battery, thin and light productivity laptop.',
 'Laptops', 'Amazon', 'B0CQKQRZMV',
 'https://www.amazon.in/dp/B0CQKQRZMV',
 'https://m.media-amazon.com/images/I/71sFVYsXpRL._SL1500_.jpg',
 'INR', 69990.00, 79990.00, -10000.00, -12.50, NOW() - INTERVAL '2 hours'),

-- ── Electronics (5) ──────────────────────────────────────────
('33333333-0000-0000-0000-000000000014',
 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black',
 'Industry-leading noise cancellation, 30h battery, Multipoint Connect.',
 'Electronics', 'Amazon', 'B09XS7JWHH',
 'https://www.amazon.in/dp/B09XS7JWHH',
 'https://m.media-amazon.com/images/I/51aXvjzcukL._SL1500_.jpg',
 'INR', 26990.00, 29990.00, -3000.00, -10.00, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000015',
 'Samsung 55" 4K QLED Smart TV QA55Q60DAKXXL',
 '55-inch QLED, Quantum HDR, AirSlim design, Tizen OS.',
 'Electronics', 'Flipkart', 'TVSGVTGNQFHGVHUH',
 'https://www.flipkart.com/samsung-55-qled/p/itmdfe2a7f48b25a',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/television/-original-imagzgxfnkrhuqg8.jpeg',
 'INR', 72990.00, 84990.00, -12000.00, -14.12, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000016',
 'Canon EOS R50 Mirrorless Camera Body Only',
 '24.2MP APS-C sensor, 4K video, eye-tracking AF, compact design.',
 'Electronics', 'Croma', 'CRPH267820',
 'https://www.croma.com/canon-eos-r50/p/267820',
 'https://media.croma.com/image/upload/v1700730080/Croma%20Assets/Cameras/Digital%20Cameras/Images/267820_0.png',
 'INR', 59995.00, 64995.00, -5000.00, -7.69, NOW() - INTERVAL '5 hours'),

('33333333-0000-0000-0000-000000000017',
 'Apple iPad Pro 12.9" M4 256GB WiFi Space Black',
 'Ultra Retina XDR OLED display, M4 chip, Apple Pencil Pro compatible.',
 'Electronics', 'Amazon', 'B0D3J9XDMQ',
 'https://www.amazon.in/dp/B0D3J9XDMQ',
 'https://m.media-amazon.com/images/I/71cN1SB+0OL._SL1500_.jpg',
 'INR', 119900.00, 124900.00, -5000.00, -4.00, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000018',
 'Bose QuietComfort Ultra Earbuds White Smoke',
 'True wireless earbuds with Bose immersive audio and world-class ANC.',
 'Electronics', 'Reliance Digital', 'RD10051234',
 'https://www.reliancedigital.in/bose-quietcomfort-ultra-earbuds/p/10051234',
 'https://media.reliancedigital.in/img/products/bose/10051234_1.jpg',
 'INR', 31990.00, 34990.00, -3000.00, -8.57, NOW() - INTERVAL '6 hours'),

-- ── Gaming (4) ───────────────────────────────────────────────
('33333333-0000-0000-0000-000000000019',
 'Sony PlayStation 5 Disc Edition',
 'PS5 console with 4K gaming, ray tracing, DualSense wireless controller.',
 'Gaming', 'Amazon', 'B0CJBKL2SJ',
 'https://www.amazon.in/dp/B0CJBKL2SJ',
 'https://m.media-amazon.com/images/I/51051FiD9UL._SL1500_.jpg',
 'INR', 54990.00, 54990.00, 0.00, 0.00, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000020',
 'Xbox Series X 1TB Console',
 '12 teraflops of processing power, DirectX ray tracing, 120fps gaming.',
 'Gaming', 'Flipkart', 'GAMGT5YRTGKUQHXQ',
 'https://www.flipkart.com/xbox-series-x/p/itm73c63dad5b6b3',
 'https://rukminim2.flixcart.com/image/832/832/koa4pi80/gaming-console/-original-imagy8zf9h3jhf4m.jpeg',
 'INR', 51990.00, 54990.00, -3000.00, -5.46, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000021',
 'Razer DeathAdder V3 HyperSpeed Wireless Gaming Mouse',
 '90-hour battery life, 26K optical sensor, ultra-lightweight 63g.',
 'Gaming', 'Amazon', 'B0CF5YMBHJ',
 'https://www.amazon.in/dp/B0CF5YMBHJ',
 'https://m.media-amazon.com/images/I/61MkHmpoiIL._SL1500_.jpg',
 'INR', 6999.00, 7999.00, -1000.00, -12.50, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000022',
 'SteelSeries Arctis Nova Pro Wireless Gaming Headset',
 'Infinity power system, dual wireless, premium audio.',
 'Gaming', 'Croma', 'CRPH265555',
 'https://www.croma.com/steelseries-arctis-nova-pro/p/265555',
 'https://media.croma.com/image/upload/v1700730080/Croma%20Assets/Computers%20Peripherals/Gaming/Images/265555_0.png',
 'INR', 27990.00, 29990.00, -2000.00, -6.67, NOW() - INTERVAL '5 hours'),

-- ── Accessories (4) ──────────────────────────────────────────
('33333333-0000-0000-0000-000000000023',
 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
 'S9 chip, double tap gesture, Siri onboard, crash detection.',
 'Accessories', 'Amazon', 'B0CHX3VQBQ',
 'https://www.amazon.in/dp/B0CHX3VQBQ',
 'https://m.media-amazon.com/images/I/71RicufLFcL._SL1500_.jpg',
 'INR', 41900.00, 45900.00, -4000.00, -8.71, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000024',
 'Samsung Galaxy Watch 6 Classic 47mm Black',
 'Physical rotating bezel, advanced health monitoring, Wear OS.',
 'Accessories', 'Flipkart', 'SMWGTAG7HKJY4ZJH',
 'https://www.flipkart.com/samsung-galaxy-watch-6-classic/p/itmf339ac6f61da1',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/-original-imagynsh5vhvqhqt.jpeg',
 'INR', 26999.00, 31999.00, -5000.00, -15.63, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000025',
 'Anker 737 Power Bank 24000mAh 140W',
 'Fast charge 3 devices simultaneously, 140W USB-C, LCD display.',
 'Accessories', 'Amazon', 'B09VPHVT2Z',
 'https://www.amazon.in/dp/B09VPHVT2Z',
 'https://m.media-amazon.com/images/I/71QD5bRMSNL._SL1500_.jpg',
 'INR', 8999.00, 9999.00, -1000.00, -10.00, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000026',
 'Logitech MX Keys S Wireless Keyboard Graphite',
 'Smart backlit keys, multi-device, compatible with Mac and Windows.',
 'Accessories', 'Reliance Digital', 'RD10050987',
 'https://www.reliancedigital.in/logitech-mx-keys-s/p/10050987',
 'https://media.reliancedigital.in/img/products/logitech/10050987_1.jpg',
 'INR', 9495.00, 10495.00, -1000.00, -9.53, NOW() - INTERVAL '6 hours'),

-- ── Home Appliances (4) ───────────────────────────────────────
('33333333-0000-0000-0000-000000000027',
 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner',
 'Laser dust detection, 60-minute runtime, HEPA filtration.',
 'Home Appliances', 'Amazon', 'B09YTYF3PQ',
 'https://www.amazon.in/dp/B09YTYF3PQ',
 'https://m.media-amazon.com/images/I/61P7EXKS3ML._SL1500_.jpg',
 'INR', 62900.00, 67900.00, -5000.00, -7.36, NOW() - INTERVAL '2 hours'),

('33333333-0000-0000-0000-000000000028',
 'Samsung 253L 3 Star Frost Free Double Door Refrigerator',
 'Digital Inverter Technology, All-around Cooling, auto defrost.',
 'Home Appliances', 'Croma', 'CRPH245678',
 'https://www.croma.com/samsung-253l-refrigerator/p/245678',
 'https://media.croma.com/image/upload/v1700730080/Croma%20Assets/Large%20Appliances/Refrigerators/Images/245678_0.png',
 'INR', 28490.00, 31990.00, -3500.00, -10.94, NOW() - INTERVAL '5 hours'),

('33333333-0000-0000-0000-000000000029',
 'LG 7.0 Kg 5 Star Inverter Fully Automatic Top Load Washing Machine',
 'TurboDrum technology, Smart Inverter motor, 6 motion DD.',
 'Home Appliances', 'Flipkart', 'WAMGX9RTQKPNMPZF',
 'https://www.flipkart.com/lg-7-kg-inverter-washing-machine/p/itmd8e83ef7f7ff3',
 'https://rukminim2.flixcart.com/image/832/832/xif0q/washing-machine/-original-imagtfyhgk9pqr8z.jpeg',
 'INR', 22990.00, 25990.00, -3000.00, -11.54, NOW() - INTERVAL '3 hours'),

('33333333-0000-0000-0000-000000000030',
 'Philips Air Fryer HD9252/90 4.1L 1400W',
 'Rapid Air Technology, up to 90% less fat, 7 preset programs.',
 'Home Appliances', 'Amazon', 'B07HLBZMHB',
 'https://www.amazon.in/dp/B07HLBZMHB',
 'https://m.media-amazon.com/images/I/61r76smVvaL._SL1500_.jpg',
 'INR', 8495.00, 9995.00, -1500.00, -15.01, NOW() - INTERVAL '2 hours');

-- ============================================================
-- PRICE HISTORY (110+ records)
-- Each product gets 3-5 historical price points over 30 days
-- ============================================================
INSERT INTO price_history (product_id, price, currency, source, recorded_at) VALUES

-- Samsung Galaxy S24 Ultra (product 1) — 5 records
('33333333-0000-0000-0000-000000000001', 134999.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000001', 131999.00, 'INR', 'Amazon', NOW() - INTERVAL '20 days'),
('33333333-0000-0000-0000-000000000001', 129999.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000001', 126999.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000001', 124999.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- iPhone 15 Pro Max (product 2) — 5 records
('33333333-0000-0000-0000-000000000002', 164900.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000002', 164900.00, 'INR', 'Flipkart', NOW() - INTERVAL '20 days'),
('33333333-0000-0000-0000-000000000002', 162900.00, 'INR', 'Flipkart', NOW() - INTERVAL '10 days'),
('33333333-0000-0000-0000-000000000002', 160900.00, 'INR', 'Flipkart', NOW() - INTERVAL '5 days'),
('33333333-0000-0000-0000-000000000002', 159900.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- OnePlus 12 (product 3) — 4 records
('33333333-0000-0000-0000-000000000003', 69999.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000003', 67999.00, 'INR', 'Amazon', NOW() - INTERVAL '15 days'),
('33333333-0000-0000-0000-000000000003', 65999.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000003', 64999.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Xiaomi 14 (product 4) — 3 records
('33333333-0000-0000-0000-000000000004', 59999.00, 'INR', 'Croma', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000004', 59999.00, 'INR', 'Croma', NOW() - INTERVAL '15 days'),
('33333333-0000-0000-0000-000000000004', 59999.00, 'INR', 'Croma', NOW() - INTERVAL '5 hours'),

-- Google Pixel 8 Pro (product 5) — 4 records
('33333333-0000-0000-0000-000000000005', 109999.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000005', 109999.00, 'INR', 'Flipkart', NOW() - INTERVAL '20 days'),
('33333333-0000-0000-0000-000000000005', 107999.00, 'INR', 'Flipkart', NOW() - INTERVAL '10 days'),
('33333333-0000-0000-0000-000000000005', 106999.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- Realme GT 6T (product 6) — 4 records
('33333333-0000-0000-0000-000000000006', 32999.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000006', 31999.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000006', 30999.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000006', 29999.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Nothing Phone 2a (product 7) — 4 records
('33333333-0000-0000-0000-000000000007', 25999.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000007', 25499.00, 'INR', 'Flipkart', NOW() - INTERVAL '15 days'),
('33333333-0000-0000-0000-000000000007', 24499.00, 'INR', 'Flipkart', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000007', 23999.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- MacBook Air M3 (product 8) — 5 records
('33333333-0000-0000-0000-000000000008', 139900.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000008', 139900.00, 'INR', 'Amazon', NOW() - INTERVAL '20 days'),
('33333333-0000-0000-0000-000000000008', 137900.00, 'INR', 'Amazon', NOW() - INTERVAL '10 days'),
('33333333-0000-0000-0000-000000000008', 135900.00, 'INR', 'Amazon', NOW() - INTERVAL '5 days'),
('33333333-0000-0000-0000-000000000008', 134900.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Dell XPS 15 (product 9) — 4 records
('33333333-0000-0000-0000-000000000009', 199990.00, 'INR', 'Croma', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000009', 194990.00, 'INR', 'Croma', NOW() - INTERVAL '15 days'),
('33333333-0000-0000-0000-000000000009', 192990.00, 'INR', 'Croma', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000009', 189990.00, 'INR', 'Croma', NOW() - INTERVAL '5 hours'),

-- ASUS ROG Zephyrus G14 (product 10) — 4 records
('33333333-0000-0000-0000-000000000010', 114990.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000010', 112990.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000010', 109990.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000010', 104990.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- ThinkPad X1 Carbon (product 11) — 3 records
('33333333-0000-0000-0000-000000000011', 169990.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000011', 169990.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '15 days'),
('33333333-0000-0000-0000-000000000011', 169990.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '6 hours'),

-- HP Spectre x360 (product 12) — 4 records
('33333333-0000-0000-0000-000000000012', 159999.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000012', 157999.00, 'INR', 'Flipkart', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000012', 152999.00, 'INR', 'Flipkart', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000012', 149999.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- Acer Swift Go 16 (product 13) — 4 records
('33333333-0000-0000-0000-000000000013', 79990.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000013', 76990.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000013', 72990.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000013', 69990.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Sony WH-1000XM5 (product 14) — 4 records
('33333333-0000-0000-0000-000000000014', 29990.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000014', 28990.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000014', 27990.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000014', 26990.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Samsung 55" QLED TV (product 15) — 5 records
('33333333-0000-0000-0000-000000000015', 84990.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000015', 82990.00, 'INR', 'Flipkart', NOW() - INTERVAL '20 days'),
('33333333-0000-0000-0000-000000000015', 79990.00, 'INR', 'Flipkart', NOW() - INTERVAL '10 days'),
('33333333-0000-0000-0000-000000000015', 75990.00, 'INR', 'Flipkart', NOW() - INTERVAL '5 days'),
('33333333-0000-0000-0000-000000000015', 72990.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- Canon EOS R50 (product 16) — 4 records
('33333333-0000-0000-0000-000000000016', 64995.00, 'INR', 'Croma', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000016', 62995.00, 'INR', 'Croma', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000016', 61995.00, 'INR', 'Croma', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000016', 59995.00, 'INR', 'Croma', NOW() - INTERVAL '5 hours'),

-- Apple iPad Pro (product 17) — 4 records
('33333333-0000-0000-0000-000000000017', 124900.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000017', 122900.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000017', 120900.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000017', 119900.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Bose QC Ultra Earbuds (product 18) — 3 records
('33333333-0000-0000-0000-000000000018', 34990.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000018', 33490.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000018', 31990.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '6 hours'),

-- PS5 (product 19) — 3 records
('33333333-0000-0000-0000-000000000019', 54990.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000019', 54990.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000019', 54990.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Xbox Series X (product 20) — 4 records
('33333333-0000-0000-0000-000000000020', 54990.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000020', 53990.00, 'INR', 'Flipkart', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000020', 52490.00, 'INR', 'Flipkart', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000020', 51990.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- Razer Mouse (product 21) — 3 records
('33333333-0000-0000-0000-000000000021', 7999.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000021', 7499.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000021', 6999.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- SteelSeries Headset (product 22) — 3 records
('33333333-0000-0000-0000-000000000022', 29990.00, 'INR', 'Croma', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000022', 28990.00, 'INR', 'Croma', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000022', 27990.00, 'INR', 'Croma', NOW() - INTERVAL '5 hours'),

-- Apple Watch Series 9 (product 23) — 4 records
('33333333-0000-0000-0000-000000000023', 45900.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000023', 44900.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000023', 42900.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000023', 41900.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Galaxy Watch 6 (product 24) — 5 records
('33333333-0000-0000-0000-000000000024', 31999.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000024', 30999.00, 'INR', 'Flipkart', NOW() - INTERVAL '20 days'),
('33333333-0000-0000-0000-000000000024', 29499.00, 'INR', 'Flipkart', NOW() - INTERVAL '10 days'),
('33333333-0000-0000-0000-000000000024', 27999.00, 'INR', 'Flipkart', NOW() - INTERVAL '5 days'),
('33333333-0000-0000-0000-000000000024', 26999.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- Anker Power Bank (product 25) — 3 records
('33333333-0000-0000-0000-000000000025', 9999.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000025', 9499.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000025', 8999.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Logitech MX Keys (product 26) — 3 records
('33333333-0000-0000-0000-000000000026', 10495.00, 'INR', 'Reliance Digital', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000026', 9995.00,  'INR', 'Reliance Digital', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000026', 9495.00,  'INR', 'Reliance Digital', NOW() - INTERVAL '6 hours'),

-- Dyson V15 (product 27) — 4 records
('33333333-0000-0000-0000-000000000027', 67900.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000027', 65900.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000027', 63900.00, 'INR', 'Amazon', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000027', 62900.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours'),

-- Samsung Refrigerator (product 28) — 4 records
('33333333-0000-0000-0000-000000000028', 31990.00, 'INR', 'Croma', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000028', 30990.00, 'INR', 'Croma', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000028', 29490.00, 'INR', 'Croma', NOW() - INTERVAL '7 days'),
('33333333-0000-0000-0000-000000000028', 28490.00, 'INR', 'Croma', NOW() - INTERVAL '5 hours'),

-- LG Washing Machine (product 29) — 3 records
('33333333-0000-0000-0000-000000000029', 25990.00, 'INR', 'Flipkart', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000029', 23990.00, 'INR', 'Flipkart', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000029', 22990.00, 'INR', 'Flipkart', NOW() - INTERVAL '3 hours'),

-- Philips Air Fryer (product 30) — 3 records
('33333333-0000-0000-0000-000000000030', 9995.00, 'INR', 'Amazon', NOW() - INTERVAL '30 days'),
('33333333-0000-0000-0000-000000000030', 8995.00, 'INR', 'Amazon', NOW() - INTERVAL '14 days'),
('33333333-0000-0000-0000-000000000030', 8495.00, 'INR', 'Amazon', NOW() - INTERVAL '2 hours');

-- ============================================================
-- Verify counts
-- ============================================================
-- SELECT 'sources'      AS tbl, COUNT(*) FROM sources;
-- SELECT 'products'     AS tbl, COUNT(*) FROM products;
-- SELECT 'price_history' AS tbl, COUNT(*) FROM price_history;
-- SELECT 'scraping_jobs' AS tbl, COUNT(*) FROM scraping_jobs;
