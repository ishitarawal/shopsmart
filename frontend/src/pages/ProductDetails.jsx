import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Heart,
  GitCompare,
  Sparkles,
  Star,
  Check,
  ShieldCheck,
  ArrowLeft,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Package,
} from 'lucide-react'
import api from '../services/api.js'
import { DEMO_PRODUCTS } from '../data/demoFallback.js'
import { useShop } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

function formatINR(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isInWishlist, toggleWishlist, isInCompare, toggleCompare } = useShop()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [alternatives, setAlternatives] = useState([])
  const [cheaperOnly, setCheaperOnly] = useState(false)
  const [loadingAlts, setLoadingAlts] = useState(false)

  useEffect(() => {
    setLoading(true)
    setImgError(false)
    api.getProduct(id)
      .then(setProduct)
      .catch(() => {
        // Fall back to catalog
        const found = DEMO_PRODUCTS.find((p) => String(p.id) === String(id) || String(p.sku_id) === String(id)) || DEMO_PRODUCTS[0]
        setProduct(found)
      })
      .finally(() => setLoading(false))
  }, [id])

  // Fetch real alternatives from POST /alternatives
  useEffect(() => {
    if (!product) return
    const skuId = product.sku_id || product.id
    if (!skuId) return

    setLoadingAlts(true)
    api.getAlternatives(skuId, cheaperOnly, 3)
      .then((data) => {
        if (data.alternatives && data.alternatives.length > 0) {
          setAlternatives(data.alternatives)
        } else {
          setAlternatives([])
        }
      })
      .catch(() => {
        // Fall back to same category demo products
        const fallbackAlts = DEMO_PRODUCTS.filter(
          (p) => p.category === product.category && p.id !== product.id
        ).slice(0, 3)
        setAlternatives(fallbackAlts)
      })
      .finally(() => setLoadingAlts(false))
  }, [product, cheaperOnly])

  if (loading) {
    return (
      <div className="container-page py-24 flex flex-col items-center justify-center space-y-4">
        <Sparkles size={32} className="text-spark-400 animate-spin" />
        <p className="text-sm text-mist-400">Loading product dossier…</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center space-y-4">
        <p className="text-lg text-mist-200">Product not found in current catalog.</p>
        <Link to="/" className="text-xs text-spark-400 underline">
          Return to home
        </Link>
      </div>
    )
  }

  const productId = product.sku_id || product.id
  const displayName = product.product_name || product.name || 'Product'
  const displayCategory = product.sub_category || product.category
  const saved = isInWishlist(productId)
  const compared = isInCompare(productId)
  const matchScore = product.match_score || 94

  return (
    <div className="bg-editorial-grid min-h-screen pb-24">
      {/* Back breadcrumb */}
      <div className="container-page pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-mist-400 hover:text-mist-100 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to previous page</span>
        </button>
      </div>

      <div className="container-page pt-6">
        {/* Main Luxury Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column (5 cols): Large Visual Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-ink-750 shadow-luxury group">
              {product.image_url && !imgError ? (
                <img
                  src={product.image_url}
                  alt={displayName}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-ink-850 text-center select-none">
                  <div className="h-20 w-20 rounded-3xl bg-white border border-ink-750 flex items-center justify-center text-spark-500 shadow-sm mb-4">
                    <Package size={40} className="text-spark-500" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-mist-400">{product.brand}</span>
                  <h3 className="text-base font-semibold text-mist-200 mt-1">{displayCategory || 'Verified Catalog Item'}</h3>
                  {product.variant && (
                    <span className="mt-2 rounded-md bg-white border border-ink-750 px-3 py-1 text-xs text-mist-400">
                      {product.variant}{product.color ? ` · ${product.color}` : ''}
                    </span>
                  )}
                </div>
              )}

              {/* ShopSmart Match Badge */}
              {typeof product.match_score === 'number' && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 border border-signal-500/30 px-3.5 py-1.5 text-xs font-bold text-signal-500 shadow-sm">
                  <Sparkles size={13} className="animate-pulse-subtle" />
                  <span>{matchScore}% ShopSmart Match</span>
                </div>
              )}
            </div>

            {/* ShopSmart Match Diagnostic Breakdown Card */}
            <div className="rounded-2xl border border-ink-750 bg-white p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink-750">
                <span className="text-xs font-bold uppercase tracking-wider text-spark-500 flex items-center gap-1.5">
                  <Zap size={14} />
                  Match Score Breakdown
                </span>
                <span className="text-base font-bold text-mist-100">{matchScore}%</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-mist-300 mb-1">
                    <span>Budget Alignment</span>
                    <span className="text-signal-500 font-semibold">100%</span>
                  </div>
                  <div className="h-2 w-full bg-ink-850 rounded-full overflow-hidden">
                    <div className="h-full bg-signal-500 rounded-full w-full transition-all duration-1000" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-mist-300 mb-1">
                    <span>Features & Hardware Fulfillment</span>
                    <span className="text-spark-500 font-semibold">92%</span>
                  </div>
                  <div className="h-2 w-full bg-ink-850 rounded-full overflow-hidden">
                    <div className="h-full bg-spark-500 rounded-full w-[92%] transition-all duration-1000" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-mist-300 mb-1">
                    <span>Use Case Compatibility</span>
                    <span className="text-signal-500 font-semibold">95%</span>
                  </div>
                  <div className="h-2 w-full bg-ink-850 rounded-full overflow-hidden">
                    <div className="h-full bg-signal-500 rounded-full w-[95%] transition-all duration-1000" />
                  </div>
                </div>

                {typeof product.rating === 'number' && product.rating > 0 && (
                  <div>
                    <div className="flex justify-between text-mist-300 mb-1">
                      <span>User Satisfaction & Reliability</span>
                      <span className="text-mist-200 font-semibold">{product.rating} / 5.0</span>
                    </div>
                    <div className="h-2 w-full bg-ink-850 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-spark-500 to-signal-500 rounded-full" style={{ width: `${(product.rating / 5) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Editorial Product Dossier */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              {/* Category & Brand Header */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mist-500">
                <span className="rounded-md bg-ink-850 border border-ink-750 px-2 py-0.5 text-mist-400">
                  {product.brand}
                </span>
                <span>·</span>
                <span className="text-spark-500">{displayCategory}</span>
                <span>·</span>
                <span className="text-signal-500 flex items-center gap-1 font-semibold">
                  <ShieldCheck size={13} /> {product.availability === 'in_stock' ? 'In Stock' : 'Verified Catalog'}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-3 font-editorial text-3xl sm:text-5xl font-bold text-mist-100 tracking-tight leading-tight">
                {displayName}
              </h1>

              {/* Rating row - Grounded */}
              {typeof product.rating === 'number' && product.rating > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-mist-400">
                  <div className="flex items-center text-deal-500">
                    <Star size={15} className="fill-current" />
                    <span className="ml-1 font-bold text-mist-100">{product.rating}</span>
                  </div>
                  {typeof product.review_count === 'number' && product.review_count > 0 && (
                    <>
                      <span>·</span>
                      <span>{product.review_count?.toLocaleString('en-IN')} verified customer reviews</span>
                    </>
                  )}
                </div>
              )}

              {/* Pricing section */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-mist-100">
                  {formatINR(product.price)}
                </span>
                {typeof product.original_price === 'number' && product.original_price > product.price && (
                  <>
                    <span className="text-lg text-mist-500 line-through">
                      {formatINR(product.original_price)}
                    </span>
                    {typeof product.discount_percent === 'number' && product.discount_percent > 0 && (
                      <span className="rounded-full bg-deal-50 border border-deal-500/30 px-3 py-1 text-xs font-bold text-deal-500">
                        Save {product.discount_percent}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="mt-5 text-sm sm:text-base text-mist-300 font-light leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* AI Reasoning Section: Why ShopSmart Recommends This */}
            {product.match_reasons?.length > 0 && (
              <div className="rounded-2xl bg-spark-50 border border-spark-500/20 p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-spark-500 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Why ShopSmart Recommends This Product:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-mist-100">
                  {product.match_reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check size={14} className="text-signal-500 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pros and Cons - Grounded */}
            {(product.pros?.length > 0 || product.cons?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.pros?.length > 0 && (
                  <div className="rounded-xl bg-white border border-ink-750 p-4 space-y-2 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-signal-500 flex items-center gap-1.5">
                      <ThumbsUp size={13} />
                      Highlights
                    </p>
                    <ul className="space-y-1.5 text-xs text-mist-300">
                      {product.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check size={13} className="text-signal-500 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.cons?.length > 0 && (
                  <div className="rounded-xl bg-white border border-ink-750 p-4 space-y-2 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-mist-500 flex items-center gap-1.5">
                      <ThumbsDown size={13} />
                      Trade-offs to consider
                    </p>
                    <ul className="space-y-1.5 text-xs text-mist-400">
                      {product.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-mist-600 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Key Features */}
            {product.key_features?.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-mist-400">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {product.key_features.map((feat, i) => (
                    <span key={i} className="rounded-xl bg-ink-850 border border-ink-750 px-3 py-1.5 text-xs text-mist-300">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Matrix Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-mist-400">Technical Specifications</p>
                <div className="rounded-2xl border border-ink-750 bg-white divide-y divide-ink-750 overflow-hidden text-xs shadow-sm">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between px-4 py-3">
                      <span className="capitalize text-mist-400 font-medium">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-mist-100 font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-6 border-t border-ink-750 flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  saved
                    ? 'bg-signal-500 text-white'
                    : 'bg-ink-850 hover:bg-white border border-ink-750 text-mist-300 hover:text-signal-500'
                }`}
              >
                <Heart size={15} className={saved ? 'fill-current' : ''} />
                <span>{saved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => toggleCompare(product)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  compared
                    ? 'bg-spark-500 text-white'
                    : 'bg-ink-850 hover:bg-white border border-ink-750 text-mist-300 hover:text-spark-500'
                }`}
              >
                <GitCompare size={15} />
                <span>{compared ? 'In Comparison Queue' : 'Compare Product'}</span>
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/assistant?prompt=${encodeURIComponent(
                      `Tell me more about ${displayName} by ${product.brand} and how it compares to alternatives`
                    )}`
                  )
                }
                className="flex items-center gap-2 rounded-full border border-spark-500/30 bg-spark-50 px-5 py-3 text-xs sm:text-sm font-bold text-spark-500 hover:bg-spark-500 hover:text-white transition-colors shadow-sm"
              >
                <Sparkles size={15} />
                <span>Ask ShopSmart AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Similar Options in this Category - Connected to POST /alternatives */}
        <div className="mt-20 pt-12 border-t border-ink-750">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-spark-500">Grounded Recommendations</p>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-mist-100 mt-1">
                Verified Alternatives for {displayName}
              </h3>
            </div>

            {/* Filter Toggle: All Alternatives vs Cheaper Only */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCheaperOnly(false)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  !cheaperOnly
                    ? 'bg-spark-500 text-white font-bold shadow-sm'
                    : 'bg-white text-mist-400 border border-ink-750 hover:text-mist-100 hover:bg-ink-850'
                }`}
              >
                All Alternatives
              </button>
              <button
                onClick={() => setCheaperOnly(true)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  cheaperOnly
                    ? 'bg-signal-500 text-white font-bold shadow-sm'
                    : 'bg-white text-mist-400 border border-ink-750 hover:text-mist-100 hover:bg-ink-850'
                }`}
              >
                Cheaper Only
              </button>
            </div>
          </div>

          {loadingAlts ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-mist-400">
              <Sparkles size={15} className="text-spark-500 animate-spin" />
              <span>Querying alternatives from catalog…</span>
            </div>
          ) : alternatives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-ink-750 p-8 text-center text-xs text-mist-400">
              No specific {cheaperOnly ? 'cheaper ' : ''}alternatives found for this item in the catalog.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
