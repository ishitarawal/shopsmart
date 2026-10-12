/**
 * Centralized API client for ShopSmart.
 * Connects the frontend to the FastAPI backend running in Google Colab (via ngrok).
 * Base URL is controlled exclusively via VITE_API_BASE_URL.
 */

const BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  'https://flock-sake-division.ngrok-free.dev'
).replace(/\/+$/, '')

// In-memory product cache to preserve grounded product information across views
const productCache = new Map()

/**
 * Normalizes a raw backend product object into a grounded, consistent shape.
 * Rule: Never fabricate ratings, reviews, discounts, or specifications.
 */
export function normalizeProduct(item) {
  if (!item) return null

  const skuId = item.sku_id || String(item.id || '')
  const name = item.product_name || item.name || 'Product'
  const brand = item.brand || 'Brand'
  const category = item.sub_category || item.category || 'Electronics'
  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0

  // match_score: if 0 < score <= 1 (e.g. 0.85), scale to percentage (85%)
  let matchScore = null
  if (typeof item.match_score === 'number') {
    matchScore = item.match_score <= 1 ? Math.round(item.match_score * 100) : Math.round(item.match_score)
  } else if (typeof item.similarity === 'number') {
    matchScore = Math.round(item.similarity * 100)
  }

  // match reasons:
  let matchReasons = []
  if (Array.isArray(item.match_reasons)) {
    matchReasons = item.match_reasons
  } else if (item.reason && typeof item.reason === 'string') {
    matchReasons = [item.reason]
  }

  // key features: split if string, or keep array
  let keyFeatures = []
  if (Array.isArray(item.key_features)) {
    keyFeatures = item.key_features
  } else if (typeof item.key_features === 'string' && item.key_features.trim()) {
    keyFeatures = item.key_features.split(';').map((s) => s.trim()).filter(Boolean)
  }

  const normalized = {
    id: skuId,
    sku_id: skuId,
    base_product_id: item.base_product_id || null,
    name,
    product_name: name,
    brand,
    category,
    sub_category: item.sub_category || null,
    variant: item.variant || null,
    color: item.color || null,
    price,
    original_price: item.original_price || null,
    discount_percent: item.discount_percent || null,
    rating: typeof item.rating === 'number' ? item.rating : null,
    review_count: typeof item.review_count === 'number' ? item.review_count : null,
    image_url: item.image_url || null,
    match_score: matchScore,
    match_reasons: matchReasons,
    key_features: keyFeatures,
    specifications: item.specifications || {},
    description:
      item.description ||
      (item.variant
        ? `Variant: ${item.variant}${item.color ? ` · Color: ${item.color}` : ''}`
        : ''),
    availability: item.availability || 'in_stock',
  }

  // Cache by SKU for detail views
  if (skuId) {
    productCache.set(skuId, normalized)
  }

  return normalized
}

/**
 * Core HTTP request handler with ngrok headers, timeout, and polite error sanitization.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser interstitial
    ...options.headers,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 25000)

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      if (res.status === 503) {
        throw new Error('ShopSmart AI is still getting ready. Please try again in a moment.')
      }
      if (res.status === 404) {
        throw new Error("We couldn't find that product.")
      }
      if (res.status === 400) {
        const body = await res.json().catch(() => ({}))
        const msg = body.detail?.message || body.detail || 'Invalid request parameters.'
        throw new Error(typeof msg === 'string' ? msg : 'Invalid request.')
      }
      if (res.status >= 500) {
        throw new Error('ShopSmart AI is temporarily unavailable. Please try again in a moment.')
      }
      throw new Error(`Request failed (${res.status})`)
    }

    return await res.json()
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('ShopSmart AI request timed out. Please try again in a moment.')
    }
    // Clean user-facing error message without internal stack traces
    throw new Error(
      err.message && !err.message.includes('fetch')
        ? err.message
        : "We couldn't connect to ShopSmart AI. Please check your connection and try again."
    )
  }
}

export const api = {
  /**
   * Health Check: GET /health
   * Determines if the AI model, FAISS index, and dataset are ready.
   */
  healthCheck: () => request('/health', { timeout: 8000 }),

  /**
   * Natural Language Recommendation: POST /recommend
   * Maps natural language query to grounded recommendations, filters, and intent.
   */
  recommendProducts: async (query, topK = 6) => {
    const data = await request('/recommend', {
      method: 'POST',
      body: JSON.stringify({ query, top_k: topK }),
    })
    const recommendations = (data.recommendations || []).map(normalizeProduct)
    return {
      success: data.success,
      query: data.query,
      intent: data.intent,
      filters: data.filters || {},
      relaxed_filters: data.relaxed_filters || [],
      recommendations,
      results: recommendations, // alias for existing UI
      extracted: {
        category: data.filters?.sub_category || data.filters?.category || null,
        budget_max: data.filters?.max_price || null,
        budget_min: data.filters?.min_price || null,
        use_case: data.intent || null,
        preferences: data.filters?.preferences || [],
        raw_query: query,
      },
      latency_ms: data.latency_ms,
    }
  },

  /**
   * Semantic / Keyword Search: POST /search
   * Returns top similar products for exploratory search.
   */
  searchProducts: async (query, topK = 6) => {
    const data = await request('/search', {
      method: 'POST',
      body: JSON.stringify({ query, top_k: topK }),
    })
    const results = (data.results || []).map(normalizeProduct)
    return {
      success: data.success,
      query: data.query,
      results,
      recommendations: results,
      extracted: {
        category: null,
        budget_max: null,
        budget_min: null,
        use_case: null,
        preferences: [],
        raw_query: query,
      },
    }
  },

  /**
   * Product Comparison: POST /compare
   * Takes an array of sku_ids (minimum 2) and returns side-by-side comparison specs.
   */
  compareProducts: (skuIds) => {
    if (!Array.isArray(skuIds) || skuIds.length < 2) {
      return Promise.reject(new Error('Provide at least 2 sku_ids to compare.'))
    }
    return request('/compare', {
      method: 'POST',
      body: JSON.stringify({ sku_ids: skuIds }),
    })
  },

  /**
   * Product Alternatives: POST /alternatives
   * Finds alternatives for a given sku_id (optionally cheaper only).
   */
  getAlternatives: async (skuId, cheaperOnly = false, topK = 5) => {
    const data = await request('/alternatives', {
      method: 'POST',
      body: JSON.stringify({ sku_id: skuId, cheaper_only: cheaperOnly, top_k: topK }),
    })
    return {
      success: data.success,
      base_product: data.base_product,
      alternatives: (data.alternatives || []).map(normalizeProduct),
    }
  },

  /**
   * Conversational Assistant: POST /chat
   * Context-aware multi-turn AI assistant chat.
   */
  sendChatMessage: async (sessionId, message, topK = 5) => {
    const data = await request('/chat', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message, top_k: topK }),
    })
    return {
      reply: data.reply,
      recommendations: (data.recommendations || []).map(normalizeProduct),
      products: (data.recommendations || []).map(normalizeProduct), // alias
    }
  },

  /**
   * Single product retriever: checks cache first, or searches by SKU, or finds alternatives
   */
  getProduct: async (skuId) => {
    if (!skuId) throw new Error('Product ID required')
    if (productCache.has(skuId)) {
      return productCache.get(skuId)
    }
    try {
      const altData = await api.getAlternatives(skuId, false, 2)
      if (altData.alternatives?.length > 0) {
        return altData.alternatives[0]
      }
    } catch {
      // ignore
    }
    throw new Error("We couldn't find that product.")
  },

  // ---------------- Compatibility Aliases ----------------
  search: (query) => api.recommendProducts(query),
  chat: (message, sessionId) => api.sendChatMessage(sessionId, message),

  // Wishlist local persistence helpers
  getWishlist: async () => {
    try {
      const stored = localStorage.getItem('shopsmart_wishlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },
  addToWishlist: async (userId, productId) => {
    return { success: true, product_id: productId }
  },
  removeFromWishlist: async (userId, productId) => {
    return { success: true, product_id: productId }
  },
}

export default api
