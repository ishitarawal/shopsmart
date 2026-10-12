/**
 * TypeScript Type Definitions for ShopSmart FastAPI AI Backend
 */

export interface HealthResponse {
  status: 'healthy' | 'starting' | 'error'
  model_loaded: boolean
  dataset_loaded: boolean
  products_indexed: number
}

export interface GroundedProduct {
  sku_id: string
  base_product_id?: string | null
  product_name: string
  brand: string
  category: string
  sub_category?: string | null
  variant?: string | null
  color?: string | null
  price: number
  key_features?: string | string[]
  match_score?: number | null
  reason?: string | null
  // Grounded UI optional fields (never fabricated if missing)
  original_price?: number | null
  discount_percent?: number | null
  rating?: number | null
  review_count?: number | null
  image_url?: string | null
}

export interface RecommendationRequest {
  query: string
  top_k?: number
}

export interface RecommendationResponse {
  success: boolean
  query: string
  intent?: string | null
  filters?: {
    category?: string
    sub_category?: string
    max_price?: number
    min_price?: number
    preferences?: string[]
    [key: string]: unknown
  }
  relaxed_filters?: string[]
  recommendations: GroundedProduct[]
  latency_ms?: number
}

export interface SearchRequest {
  query: string
  top_k?: number
}

export interface SearchResultItem {
  sku_id: string
  product_name: string
  brand: string
  price: number
  similarity?: number
}

export interface SearchResponse {
  success: boolean
  query: string
  results: SearchResultItem[]
}

export interface CompareRequest {
  sku_ids: string[]
}

export interface CompareResponse {
  success: boolean
  comparison: Record<string, Record<string, string | number>>
}

export interface AlternativesRequest {
  sku_id: string
  cheaper_only?: boolean
  top_k?: number
}

export interface AlternativesResponse {
  success: boolean
  base_product: string
  alternatives: GroundedProduct[]
}

export interface ChatRequest {
  session_id: string
  message: string
  top_k?: number
}

export interface ChatResponse {
  reply: string
  recommendations: GroundedProduct[]
}
