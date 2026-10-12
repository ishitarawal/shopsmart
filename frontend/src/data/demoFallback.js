/**
 * Frontend-only fallback content & intelligent local matching engine.
 * Used when exploring the UI standalone or when backend is unreachable.
 * Once the backend is running, live API data is used automatically.
 */

export const CATEGORIES = [
  { name: 'Earbuds', icon: '🎧', tagline: 'True wireless & active noise cancellation', count: 3, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
  { name: 'Laptops', icon: '💻', tagline: 'Engineered for coding, creative work & travel', count: 3, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' },
  { name: 'Smartphones', icon: '📱', tagline: 'OLED displays, telephoto lenses & endurance', count: 3, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Headphones', icon: '🎵', tagline: 'Studio acoustics and adaptive silence', count: 2, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Smartwatches', icon: '⌚', tagline: 'Biometrics, GPS tracking & always-on AMOLED', count: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { name: 'Shoes', icon: '👟', tagline: 'Responsive running cushioning & casual silhouettes', count: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Home & Kitchen', icon: '☕', tagline: 'Precision espresso makers & smart appliances', count: 1, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fashion', icon: '🧥', tagline: 'Breathable organic apparel & minimalist essentials', count: 1, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
]

export const DEMO_PRODUCTS = [
  // ---------------- Earbuds ----------------
  {
    id: 1,
    name: 'AeroFit Pro ANC',
    brand: 'Noiseline',
    category: 'Earbuds',
    description: 'ANC earbuds built for frequent flyers and commuters, featuring adaptive 35dB noise cancellation and an aerospace travel case.',
    price: 2899,
    original_price: 3999,
    discount_percent: 27,
    rating: 4.5,
    review_count: 8210,
    image_url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      battery: '7 hrs (ANC on) + 28 hrs (case)',
      anc: 'Adaptive, up to 35dB',
      bluetooth: '5.3 Multipoint',
      microphone: '4-mic ENC with wind filter',
      weight: '5.4g per bud',
      water_resistance: 'IPX4 Splash Resistant',
    },
    key_features: ['Adaptive ANC up to 35dB', 'Multipoint dual-device pairing', 'Transparency mode & custom EQ app'],
    pros: ['Best-in-class ANC under ₹3,000', 'Ergonomic seal for all-day comfort', 'Clean, balanced audio profile'],
    cons: ['Case is slightly larger than minimal designs', 'ANC slightly reduces listening time'],
    match_score: 95,
    match_reasons: ['Within your ₹3,000 budget', 'Matches: adaptive noise cancellation & long travel battery'],
  },
  {
    id: 2,
    name: 'PulseBuds Air 2',
    brand: 'Boult',
    category: 'Earbuds',
    description: 'True wireless earbuds tuned for marathon road trips and daily listening, with an exceptional 40-hour combined battery reserve.',
    price: 1799,
    original_price: 2999,
    discount_percent: 40,
    rating: 4.3,
    review_count: 12840,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      battery: '10 hrs (earbuds) + 30 hrs (case)',
      anc: 'Passive noise isolation + ENC',
      bluetooth: '5.3',
      microphone: 'Dual ENC microphone',
      weight: '4.5g per bud',
      water_resistance: 'IPX5 Sweatproof',
    },
    key_features: ['40-hour total battery marathon', 'Low-latency gaming mode (45ms)', 'IPX5 sweat & splash resistant'],
    pros: ['Exceptional battery for under ₹2,000', 'Super comfortable featherlight fit', 'Rich vocal clarity'],
    cons: ['No active noise cancellation', 'Low-end bass lacks sub-bass thump'],
    match_score: 91,
    match_reasons: ['Within your ₹3,000 budget', 'Exceptional 40-hour battery life rating'],
  },
  {
    id: 3,
    name: 'EchoBeat SX',
    brand: 'Zsynk',
    category: 'Earbuds',
    description: 'Budget-friendly everyday earbuds engineered with 12mm oversized titanium bass drivers and ultra-fast charging.',
    price: 999,
    original_price: 1499,
    discount_percent: 33,
    rating: 4.0,
    review_count: 15600,
    image_url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      battery: '6 hrs + 24 hrs case',
      anc: 'No',
      bluetooth: '5.1',
      microphone: 'Single omni mic',
      weight: '4.2g per bud',
      water_resistance: 'IPX4',
    },
    key_features: ['12mm dynamic titanium drivers', 'Instant pairing open-case', 'Fast charge: 10 mins = 60 mins audio'],
    pros: ['Incredible sub-₹1,000 price point', 'Deep, punchy bass for workouts'],
    cons: ['Call quality in crowded areas is average', 'No smartphone companion app'],
    match_score: 84,
    match_reasons: ['High affordability', 'Great bass profile'],
  },

  // ---------------- Laptops ----------------
  {
    id: 4,
    name: 'CodeBook 14 Slim',
    brand: 'Vireon',
    category: 'Laptops',
    description: 'A light 14-inch laptop purpose-built for software engineers and college students, delivering a full 12-hour workday battery.',
    price: 68990,
    original_price: 76990,
    discount_percent: 10,
    rating: 4.4,
    review_count: 3210,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      cpu: 'Intel Core i5-1335U (10 Cores, up to 4.6GHz)',
      ram: '16GB LPDDR5 5200MHz',
      storage: '512GB PCIe Gen 4 SSD',
      display: '14" FHD IPS Anti-glare, 300 nits',
      battery: '57Wh, up to 12 hours',
      weight: '1.29 kg unibody',
    },
    key_features: ['16GB high-speed RAM for Docker & IDEs', '1.29kg featherweight aluminum chassis', 'Backlit tactile keyboard with 1.4mm travel'],
    pros: ['Ultra-portable for everyday commuting', 'Quiet fan curves under compile load', 'Smooth multi-tasking performance'],
    cons: ['Integrated Intel Iris Xe graphics only', 'Downward firing speakers'],
    match_score: 96,
    match_reasons: ['Within your ₹80,000 budget', 'Matches: lightweight, 16GB RAM for coding, 12hr battery'],
  },
  {
    id: 5,
    name: 'ForgeBook Dev 15',
    brand: 'Kastel',
    category: 'Laptops',
    description: 'A high-output developer workstation with 8-core processing power, 1TB NVMe storage, and 100% sRGB color fidelity.',
    price: 78990,
    original_price: 84990,
    discount_percent: 7,
    rating: 4.6,
    review_count: 1540,
    image_url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      cpu: 'AMD Ryzen 7 7730U (8 Cores, 16 Threads)',
      ram: '16GB DDR4 (Expandable to 32GB)',
      storage: '1TB M.2 NVMe SSD',
      display: '15.6" FHD IPS, 100% sRGB, 350 nits',
      battery: '65Wh, up to 9 hours',
      weight: '1.65 kg',
    },
    key_features: ['8-core Ryzen 7 powerhouse', '1TB vast SSD storage', '100% sRGB color-accurate display for UI design'],
    pros: ['Terrific multi-threaded compile speed', 'Spacious screen estate & numpad', 'Expandable RAM slot'],
    cons: ['Heavier than 13-14 inch ultrabooks', 'Standard 60Hz refresh rate'],
    match_score: 93,
    match_reasons: ['Within your ₹80,000 budget', 'Matches: heavy-duty development & 1TB storage'],
  },
  {
    id: 6,
    name: 'Vireon Air X13',
    brand: 'Vireon',
    category: 'Laptops',
    description: 'Ultraportable 13.3-inch laptop designed for nomadic students who prioritize featherlight back carry and all-day typing.',
    price: 54990,
    original_price: 61990,
    discount_percent: 11,
    rating: 4.2,
    review_count: 2110,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      cpu: 'Intel Core i3-1315U (6 Cores)',
      ram: '8GB LPDDR5',
      storage: '512GB NVMe SSD',
      display: '13.3" FHD IPS Slim Bezel',
      battery: 'Up to 10 hours',
      weight: '1.1 kg',
    },
    key_features: ['1.1kg razor-thin form factor', 'Instant fingerprint unlock', 'USB-C fast charge support'],
    pros: ['Effortless portability in backpacks', 'Outstanding value under ₹55,000'],
    cons: ['8GB RAM soldered (not upgradeable)', 'Lacks HDMI port (requires dongle)'],
    match_score: 87,
    match_reasons: ['Well under budget', 'Extreme lightweight build (1.1kg)'],
  },

  // ---------------- Smartphones ----------------
  {
    id: 7,
    name: 'Nova X50',
    brand: 'Halion',
    category: 'Smartphones',
    description: 'A camera-first mid-range marvel featuring a 50MP Sony OIS sensor, 120Hz curved AMOLED, and 67W Turbo charging.',
    price: 27999,
    original_price: 31999,
    discount_percent: 12,
    rating: 4.3,
    review_count: 9820,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      display: '6.67" 1.5K AMOLED, 120Hz, Dolby Vision',
      processor: 'Snapdragon 7s Gen 2 (4nm)',
      ram: '8GB RAM + 8GB Virtual RAM',
      storage: '128GB UFS 2.2',
      battery: '5000mAh, 67W SuperCharge',
      camera: '50MP OIS Sony IMX + 8MP Ultrawide',
    },
    key_features: ['50MP OIS NightScape camera', '120Hz vibrant AMOLED screen', '67W charger included in box'],
    pros: ['Stunning low-light portraits', 'Sleek curved ergonomic glass back', 'Zero bloatware UI'],
    cons: ['No wireless charging', 'Plastic frame rails'],
    match_score: 94,
    match_reasons: ['Within your ₹30,000 budget', 'Matches: exceptional camera with OIS'],
  },
  {
    id: 8,
    name: 'Halion Prime 12',
    brand: 'Halion',
    category: 'Smartphones',
    description: 'Flagship-grade camera phone with a dedicated 64MP OIS periscope telephoto lens and an ultra-fast 144Hz HDR10+ panel.',
    price: 38999,
    original_price: 42999,
    discount_percent: 9,
    rating: 4.5,
    review_count: 6110,
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      display: '6.7" Quad-curved AMOLED 144Hz, 2600 nits',
      processor: 'MediaTek Dimensity 8300 Ultra',
      ram: '12GB LPDDR5X',
      storage: '256GB UFS 4.0',
      battery: '5200mAh, 80W FlashCharge',
      camera: '64MP OIS Main + 12MP Telephoto + 8MP Macro',
    },
    key_features: ['64MP OIS optical zoom telephoto', '80W wired charging (100% in 32 mins)', '144Hz cinematic display'],
    pros: ['Best portrait and telephoto zoom in class', 'Blazing smooth gaming performance', 'Solid 2-day battery life'],
    cons: ['Heavier in hand at 204g', 'No IP68 water rating (IP54 only)'],
    match_score: 97,
    match_reasons: ['Within your ₹40,000 budget', 'Class-leading telephoto camera & fast 80W charging'],
  },
  {
    id: 9,
    name: 'Rin Play 40',
    brand: 'Rin',
    category: 'Smartphones',
    description: 'A dependable everyday phone with a massive 5000mAh battery, crisp 90Hz fluid display, and clean stock Android.',
    price: 13999,
    original_price: 15999,
    discount_percent: 12,
    rating: 4.0,
    review_count: 21200,
    image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      display: '6.5" FHD+ 90Hz IPS Display',
      processor: 'Snapdragon 4 Gen 2 (4nm)',
      ram: '6GB RAM',
      storage: '128GB (Expandable 1TB)',
      battery: '5000mAh, 33W Fast Charge',
      camera: '50MP AI Dual Camera',
    },
    key_features: ['5000mAh 2-day battery endurance', 'Clean stock Android with zero ads', 'Fast side-mounted fingerprint sensor'],
    pros: ['Superb battery life', 'Reliable daily performance for browsing and streaming'],
    cons: ['Speaker output lacks deep bass', 'Night camera requires steady hands'],
    match_score: 86,
    match_reasons: ['Unbeatable budget value', 'Matches: massive battery & clean software'],
  },

  // ---------------- Headphones ----------------
  {
    id: 10,
    name: 'SilentSpace ANC 700',
    brand: 'Noiseline',
    category: 'Headphones',
    description: 'Over-ear acoustic headphones engineered with hybrid adaptive noise cancellation for international flights and focused studio work.',
    price: 8999,
    original_price: 12999,
    discount_percent: 30,
    rating: 4.6,
    review_count: 4310,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      battery: '40 hrs (ANC on), 60 hrs (ANC off)',
      anc: 'Hybrid 4-mic Active Cancellation up to 38dB',
      weight: '254g plush memory foam',
      bluetooth: '5.2 with LDAC High-Res',
      microphone: 'Beamforming noise-rejecting array',
    },
    key_features: ['40-hour battery with ANC active', 'Audiophile 40mm titanium drivers', 'Plush memory foam circumaural earcups'],
    pros: ['Flagship-grade acoustic cancellation', 'Incredible cloud-soft comfort for 8+ hour sessions', 'High-res LDAC audio codec support'],
    cons: ['Included travel case is somewhat bulky', 'Bass is tuned flat/neutral (requires EQ for hip-hop)'],
    match_score: 98,
    match_reasons: ['Within your budget', 'Matches: maximum noise cancellation, travel comfort & 40hr battery'],
  },
  {
    id: 11,
    name: 'BassLine 200',
    brand: 'Zynk',
    category: 'Headphones',
    description: 'Pivoting on-ear wireless headphones with bass boost tuning, lightweight folding arms, and 20 hours of wireless playback.',
    price: 1499,
    original_price: 2199,
    discount_percent: 31,
    rating: 3.9,
    review_count: 7600,
    image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      battery: '20 hrs playback',
      anc: 'Passive isolation',
      weight: '180g ultralight',
      bluetooth: '5.0',
      microphone: 'Single mic with hands-free calling',
    },
    key_features: ['Deep Bass EQ acoustic chamber', 'Fold-flat design for backpacks', 'Physical tactile media buttons'],
    pros: ['Accessible price point', 'Lightweight and easy to travel with'],
    cons: ['On-ear clamp pressure after 3 hours', 'No active noise cancellation'],
    match_score: 83,
    match_reasons: ['High budget friendliness', 'Energetic bass profile'],
  },

  // ---------------- Smartwatches ----------------
  {
    id: 12,
    name: 'PulseFit Watch 3',
    brand: 'Boult',
    category: 'Smartwatches',
    description: 'Everyday lifestyle & fitness smartwatch with a 1.96-inch curved AMOLED display, 100+ sports tracking modes, and 14 days of battery.',
    price: 2499,
    original_price: 3999,
    discount_percent: 37,
    rating: 4.1,
    review_count: 18300,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      display: '1.96" Curved AMOLED Always-On (600 nits)',
      battery: 'Up to 14 days normal use',
      water_resistance: '5 ATM (50m water resistant)',
      sensors: '24/7 SpO2, Heart Rate, Sleep cycle, 110+ sports',
    },
    key_features: ['14-day battery reserve', 'Bluetooth phone calling with speaker', 'Premium zinc alloy aerospace frame'],
    pros: ['Crisp and vivid AMOLED display in direct sunlight', 'Great battery longevity', 'Smooth UI transitions'],
    cons: ['Uses connected GPS through phone', 'Companion app has occasional sync delays'],
    match_score: 92,
    match_reasons: ['Within your ₹3,000 budget', 'Matches: AMOLED display, fitness biometrics & 14-day battery'],
  },

  // ---------------- Shoes ----------------
  {
    id: 13,
    name: 'StrideMax Runner',
    brand: 'Kastel',
    category: 'Shoes',
    description: 'Lightweight marathon and everyday training runner engineered with high-rebound Nitrogen EVA cushioning and breathable engineered mesh.',
    price: 3499,
    original_price: 4999,
    discount_percent: 30,
    rating: 4.4,
    review_count: 5230,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      type: 'Neutral Road Running',
      weight: '240g (Size 9)',
      sole: 'Nitrogen-infused EVA foam with carbon rubber outsole',
      closure: 'Lace-up ergonomic lock',
    },
    key_features: ['Responsive 32mm stack rebound foam', 'Breathable monofilament upper mesh', 'Reflective 3M safety accents for evening road runs'],
    pros: ['Excellent energy return and shock absorption', 'Breathable keeping feet cool in heat', 'True-to-size fit'],
    cons: ['Not waterproof for rainy conditions', 'Sole is tuned for tarmac rather than rugged trails'],
    match_score: 95,
    match_reasons: ['Within your ₹5,000 budget', 'Matches: responsive running cushioning & lightweight daily trainer'],
  },
  {
    id: 14,
    name: 'Rin Street Low',
    brand: 'Rin',
    category: 'Shoes',
    description: 'Timeless casual court sneakers tailored in genuine vegan micro-leather with a cushioned cupsole for all-day city walks.',
    price: 2199,
    original_price: 2999,
    discount_percent: 26,
    rating: 4.2,
    review_count: 9040,
    image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      type: 'Casual Lifestyle',
      weight: '300g',
      sole: 'Vulcanized rubber grip cupsole',
      closure: 'Lace-up with padded tongue',
    },
    key_features: ['Memory foam footbed', 'Water-resistant vegan synthetic upper', 'Classic minimalist profile'],
    pros: ['Versatile with denim, trousers, and shorts', 'Instant out-of-the-box comfort with zero break-in period'],
    cons: ['Not designed for running or intense workouts', 'White outsole requires regular cleaning'],
    match_score: 89,
    match_reasons: ['Within your budget', 'Matches: stylish everyday casual sneaker'],
  },

  // ---------------- Home & Kitchen ----------------
  {
    id: 15,
    name: 'BrewPress Mini',
    brand: 'Halion',
    category: 'Home & Kitchen',
    description: 'Compact 15-bar Italian pump espresso machine designed for small apartment counters, home offices, and artisanal coffee enthusiasts.',
    price: 5999,
    original_price: 7999,
    discount_percent: 25,
    rating: 4.0,
    review_count: 2130,
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      capacity: '1.0L detachable water reservoir',
      pressure: '15-bar Italian pressure pump',
      power: '1050W Fast Thermoblock heater',
      dimensions: '22 x 15 x 30 cm compact footprint',
    },
    key_features: ['15-bar high pressure crema extraction', 'Pre-infusion technology for rich espresso flavor', 'Detachable drip tray for tall mugs'],
    pros: ['Quick 45-second heating time', 'Fits comfortably on narrow countertops', 'Rich crema extraction'],
    cons: ['Steam wand takes practice to master microfoam', 'Small water tank needs frequent refilling for dinner parties'],
    match_score: 91,
    match_reasons: ['Under ₹10,000 budget', 'Matches: compact footprint & authentic 15-bar espresso crema'],
  },

  // ---------------- Fashion ----------------
  {
    id: 16,
    name: 'Everyday Flex Tee',
    brand: 'Rin',
    category: 'Fashion',
    description: 'Premium organic combed cotton and elastane blend t-shirt with tailored drape, anti-pilling weave, and breathable airflow.',
    price: 599,
    original_price: 899,
    discount_percent: 33,
    rating: 4.1,
    review_count: 3410,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    availability: 'in_stock',
    specifications: {
      material: '95% Combed Organic Cotton, 5% Spandex',
      fit: 'Modern Tailored Regular Fit',
      weight: '190 GSM mid-weight jersey',
    },
    key_features: ['4-way flexible stretch', 'Pre-shrunk silicone washed fabric', 'Reinforced collar that never sags'],
    pros: ['Ultra-soft against the skin', 'Maintains shape and color after 30+ washes'],
    cons: ['Fitted sleeve cuffs might feel snug on larger biceps'],
    match_score: 88,
    match_reasons: ['Under ₹1,000 price point', 'Matches: premium everyday breathable cotton comfort'],
  },
]

/**
 * Intelligent client-side search engine matching category, budget, keywords, and features.
 */
export function fallbackSearch(query) {
  const q = (query || '').toLowerCase().trim()
  
  // Extract category
  let matchedCategory = null
  const categoryNames = CATEGORIES.map((c) => c.name)
  for (const cat of categoryNames) {
    if (q.includes(cat.toLowerCase().slice(0, -1)) || q.includes(cat.toLowerCase())) {
      matchedCategory = cat
      break
    }
  }

  // Common synonym mappings
  if (!matchedCategory) {
    if (q.includes('earphone') || q.includes('tws') || q.includes('airpod') || q.includes('buds')) matchedCategory = 'Earbuds'
    else if (q.includes('laptop') || q.includes('macbook') || q.includes('notebook') || q.includes('computer')) matchedCategory = 'Laptops'
    else if (q.includes('phone') || q.includes('mobile') || q.includes('smartphone')) matchedCategory = 'Smartphones'
    else if (q.includes('headphone') || q.includes('headset')) matchedCategory = 'Headphones'
    else if (q.includes('watch') || q.includes('band') || q.includes('tracker')) matchedCategory = 'Smartwatches'
    else if (q.includes('shoe') || q.includes('sneaker') || q.includes('runner') || q.includes('trainers')) matchedCategory = 'Shoes'
    else if (q.includes('coffee') || q.includes('espresso') || q.includes('kitchen') || q.includes('maker')) matchedCategory = 'Home & Kitchen'
    else if (q.includes('shirt') || q.includes('tee') || q.includes('cloth') || q.includes('apparel')) matchedCategory = 'Fashion'
  }

  // Extract budget
  const budgetMatch = q.match(/(?:under|below|budget|within|less than|rs\.?|inr|₹)\s*(\d{1,3}(?:,\d{3})*|\d{3,7})/i) || q.match(/(\d{3,7})/)
  let budgetMax = null
  if (budgetMatch && budgetMatch[1]) {
    budgetMax = Number(budgetMatch[1].replace(/,/g, ''))
  }

  // Extract use cases & preferences
  let useCase = null
  const preferences = []
  if (q.includes('coding') || q.includes('developer') || q.includes('programming')) {
    useCase = 'Coding & Development'
    preferences.push('High RAM / Performance')
  } else if (q.includes('travel') || q.includes('commute') || q.includes('flight')) {
    useCase = 'Travel & Commuting'
    preferences.push('Portability & Battery')
  } else if (q.includes('gym') || q.includes('workout') || q.includes('fitness') || q.includes('run')) {
    useCase = 'Sports & Fitness'
    preferences.push('Sweat resistance & Durability')
  } else if (q.includes('college') || q.includes('student') || q.includes('school')) {
    useCase = 'College & Productivity'
    preferences.push('Lightweight chassis')
  }

  if (q.includes('battery')) preferences.push('Long battery life')
  if (q.includes('anc') || q.includes('noise cancel')) preferences.push('Active Noise Cancellation')
  if (q.includes('bass')) preferences.push('Deep bass')
  if (q.includes('lightweight') || q.includes('light') || q.includes('slim')) preferences.push('Lightweight')
  if (q.includes('camera') || q.includes('photo')) preferences.push('Flagship camera sensor')

  // Filter & Rank products
  let matched = DEMO_PRODUCTS.slice()

  if (matchedCategory) {
    matched = matched.filter((p) => p.category.toLowerCase() === matchedCategory.toLowerCase())
  }

  // Calculate tailored score for each product
  const ranked = matched.map((product) => {
    let score = 75
    const reasons = []

    // Budget check
    if (budgetMax) {
      if (product.price <= budgetMax) {
        score += 15
        reasons.push(`Within your ₹${budgetMax.toLocaleString('en-IN')} budget (₹${product.price.toLocaleString('en-IN')})`)
      } else {
        const overPercent = ((product.price - budgetMax) / budgetMax) * 100
        if (overPercent < 15) {
          score += 5
          reasons.push(`Slightly above budget (+${Math.round(overPercent)}%), but high value match`)
        } else {
          score -= 20
        }
      }
    } else {
      reasons.push('High performance-to-price ratio in category')
    }

    // Keyword & preference alignment
    preferences.forEach((pref) => {
      const pLower = pref.toLowerCase()
      const hasInSpecs = JSON.stringify(product.specifications).toLowerCase().includes(pLower.split(' ')[0])
      const hasInFeatures = product.key_features.some((f) => f.toLowerCase().includes(pLower.split(' ')[0]))
      const hasInDesc = product.description.toLowerCase().includes(pLower.split(' ')[0])
      if (hasInSpecs || hasInFeatures || hasInDesc) {
        score += 6
        reasons.push(`Matches requirement: ${pref}`)
      }
    })

    // Rating boost
    if (product.rating >= 4.4) {
      score += 4
      reasons.push(`Top-rated (${product.rating}★) with ${product.review_count?.toLocaleString('en-IN')} reviews`)
    }

    // Clamp score
    const finalScore = Math.min(99, Math.max(68, score))

    return {
      ...product,
      match_score: finalScore,
      match_reasons: reasons.slice(0, 3),
    }
  })

  // Sort descending by match score
  ranked.sort((a, b) => b.match_score - a.match_score)

  // If no category matched and no filter, return top ranked products
  const finalResults = ranked.length > 0 ? ranked : DEMO_PRODUCTS.slice(0, 6)

  return {
    extracted: {
      category: matchedCategory,
      budget_max: budgetMax,
      budget_min: null,
      use_case: useCase,
      preferences: preferences,
      raw_query: query,
    },
    results: finalResults,
    result_count: finalResults.length,
  }
}
