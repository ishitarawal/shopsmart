import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GitCompare,
  X,
  Plus,
  Star,
  Sparkles,
  Check,
  CheckCircle2,
  DollarSign,
  Heart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Package,
} from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'
import api from '../services/api.js'

function formatINR(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare, toggleWishlist, isInWishlist } = useShop()
  const navigate = useNavigate()
  const [highlightDifferences, setHighlightDifferences] = useState(true)
  const [comparisonData, setComparisonData] = useState({})
  const [loadingCompare, setLoadingCompare] = useState(false)
  const [compareError, setCompareError] = useState(null)

  // Fetch real comparison matrix from backend when >= 2 products are in queue
  useEffect(() => {
    const skuIds = compareList.map((p) => p.sku_id || p.id).filter(Boolean)
    if (skuIds.length < 2) {
      setComparisonData({})
      setCompareError(null)
      return
    }

    setLoadingCompare(true)
    setCompareError(null)

    api.compareProducts(skuIds)
      .then((data) => {
        if (data.comparison) {
          setComparisonData(data.comparison)
        }
      })
      .catch((err) => {
        // Polite user-facing error; preserve existing comparison view
        setCompareError(err.message || 'ShopSmart AI is temporarily unavailable. Please try again in a moment.')
      })
      .finally(() => setLoadingCompare(false))
  }, [compareList])

  // Extract all dynamic spec attributes returned by backend
  const comparisonAttributeKeys = useMemo(() => {
    const keys = new Set()
    Object.values(comparisonData).forEach((obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((k) => {
          // Omit name, brand, price as they have dedicated formatted rows
          if (k !== 'Product Name' && k !== 'Brand' && !k.toLowerCase().includes('price')) {
            keys.add(k)
          }
        })
      }
    })
    return Array.from(keys)
  }, [comparisonData])

  if (compareList.length === 0) {
    return (
      <div className="bg-white min-h-screen py-24">
        <div className="container-page flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-850 text-spark-500 border border-ink-750 shadow-sm">
            <GitCompare size={30} />
          </div>
          <h1 className="font-editorial text-3xl font-bold text-mist-100">
            Choose products to compare.
          </h1>
          <p className="text-sm text-mist-400 font-light leading-relaxed">
            Select "Compare" on products from search results, category pages, or the AI assistant to evaluate their specifications, price, and ShopSmart Match scores side by side.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/search')}
              className="rounded-full bg-spark-500 hover:bg-spark-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all"
            >
              Explore Catalog to Compare
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate winner metrics
  const minPrice = Math.min(...compareList.map((p) => p.price))
  const maxScore = Math.max(...compareList.map((p) => p.match_score || 0))
  const hasRatings = compareList.some((p) => typeof p.rating === 'number' && p.rating > 0)
  const maxRating = hasRatings ? Math.max(...compareList.map((p) => p.rating || 0)) : 0
  const hasProsCons = compareList.some((p) => p.pros?.length > 0 || p.cons?.length > 0)

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Top Header */}
      <div className="border-b border-ink-750 bg-white py-8">
        <div className="container-page flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-spark-500 flex items-center gap-1.5">
              <GitCompare size={14} />
              Side-by-Side Analysis
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-mist-100 mt-1">
              Product Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-mist-400 font-light mt-1">
              Comparing {compareList.length} {compareList.length === 1 ? 'product' : 'products'} across price, hardware specs, and AI recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-mist-100 bg-ink-850 border border-ink-750 rounded-xl px-3 py-2">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded accent-spark-500 cursor-pointer"
              />
              <span>Highlight Best Values</span>
            </label>

            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-mist-400 hover:text-signal-500 transition-colors px-3 py-2"
            >
              Clear Queue
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table Grid */}
      <div className="container-page pt-8 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header Row: Products Cards (Sticky) */}
          <div className="grid grid-cols-12 gap-4 pb-6 border-b border-ink-750">
            <div className="col-span-3 flex flex-col justify-end p-4">
              <p className="font-editorial text-lg font-bold text-mist-100">Attribute</p>
              <p className="text-xs text-mist-400">Cross-verified parameters</p>
              {loadingCompare && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-spark-500">
                  <Sparkles size={12} className="animate-spin" />
                  <span>Loading API matrix…</span>
                </div>
              )}
            </div>

            {compareList.map((product) => {
              const productId = product.sku_id || product.id
              const saved = isInWishlist(productId)
              return (
                <div
                  key={productId}
                  className="col-span-3 rounded-2xl bg-white border border-ink-750 p-4 relative group shadow-sm flex flex-col justify-between"
                >
                  <button
                    onClick={() => removeFromCompare(productId)}
                    className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-ink-850 text-mist-400 hover:bg-signal-500 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Remove from comparison"
                  >
                    <X size={12} />
                  </button>

                  <div className="space-y-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name || product.name}
                        className="w-full h-32 rounded-xl object-cover bg-ink-850"
                      />
                    ) : (
                      <div className="w-full h-32 rounded-xl bg-ink-850 border border-ink-750 flex flex-col items-center justify-center p-3 text-center">
                        <Package size={22} className="text-spark-500 mb-1" />
                        <span className="text-[10px] text-mist-400 uppercase font-bold">{product.brand}</span>
                        <span className="text-[11px] text-mist-100 line-clamp-1">{product.sub_category || product.category}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] uppercase font-bold text-mist-400">{product.brand}</span>
                      <h3 className="font-semibold text-sm text-mist-100 line-clamp-1">
                        {product.product_name || product.name}
                      </h3>
                      <p className="text-sm font-bold text-mist-100 mt-1">
                        {formatINR(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`flex-1 rounded-lg py-1.5 px-2 text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                        saved
                          ? 'bg-signal-500 text-white'
                          : 'bg-ink-850 text-mist-400 hover:text-signal-500 border border-ink-750'
                      }`}
                    >
                      <Heart size={12} className={saved ? 'fill-current' : ''} />
                      <span>{saved ? 'Saved' : 'Wishlist'}</span>
                    </button>

                    <Link
                      to={`/product/${productId}`}
                      className="rounded-lg bg-ink-850 hover:bg-white border border-ink-750 py-1.5 px-2.5 text-xs font-semibold text-mist-400 hover:text-spark-500 transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              )
            })}

            {/* Empty Slot if less than 4 */}
            {compareList.length < 4 && (
              <div
                onClick={() => navigate('/search')}
                className="col-span-3 rounded-2xl border-2 border-dashed border-ink-750 hover:border-spark-500/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-ink-850/50"
              >
                <div className="h-10 w-10 rounded-full bg-white text-mist-400 group-hover:text-spark-500 flex items-center justify-center transition-colors shadow-sm">
                  <Plus size={18} />
                </div>
                <p className="text-xs font-semibold text-mist-400 group-hover:text-mist-100 mt-2">
                  Add another product
                </p>
                <span className="text-[10px] text-mist-400">Compare up to 4</span>
              </div>
            )}
          </div>

          {/* Metric Row: ShopSmart Match */}
          <div className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-center">
            <div className="col-span-3 font-semibold text-xs text-mist-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-spark-500" />
              <span className="text-mist-100 font-semibold">ShopSmart Match</span>
            </div>
            {compareList.map((p) => {
              const score = p.match_score || 85
              const isBest = highlightDifferences && score === maxScore
              return (
                <div key={p.id} className="col-span-3">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      isBest
                        ? 'bg-spark-50 text-spark-500 border border-spark-500/30'
                        : 'bg-ink-850 text-mist-400 border border-ink-750'
                    }`}
                  >
                    <span>{score}% Match</span>
                    {isBest && <CheckCircle2 size={13} />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Metric Row: Price & Value */}
          <div className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-center">
            <div className="col-span-3 font-semibold text-xs text-mist-400 flex items-center gap-1.5">
              <DollarSign size={13} className="text-deal-500" />
              <span className="text-mist-100 font-semibold">Catalog Price</span>
            </div>
            {compareList.map((p) => {
              const isLowest = highlightDifferences && p.price === minPrice
              return (
                <div key={p.id} className="col-span-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-base font-bold ${isLowest ? 'text-deal-500' : 'text-mist-100'}`}>
                      {formatINR(p.price)}
                    </span>
                    {isLowest && (
                      <span className="rounded-full bg-deal-500/10 text-deal-500 text-[10px] font-bold px-2 py-0.5">
                        Lowest Price
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dynamic Backend Attributes from POST /compare */}
          {comparisonAttributeKeys.map((attr) => (
            <div key={attr} className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-start">
              <div className="col-span-3 font-semibold text-xs text-mist-100">
                {attr}
              </div>
              {compareList.map((p) => {
                const skuId = p.sku_id || p.id
                const val = comparisonData[skuId]?.[attr] ?? p[attr] ?? p.specifications?.[attr] ?? '—'
                return (
                  <div key={p.id} className="col-span-3 text-xs text-mist-100 leading-relaxed font-light">
                    {String(val)}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Metric Row: Rating - Only shown if present in dataset */}
          {hasRatings && (
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-center">
              <div className="col-span-3 font-semibold text-xs text-mist-400 flex items-center gap-1.5">
                <Star size={13} className="text-deal-500 fill-deal-500" />
                <span className="text-mist-100 font-semibold">Customer Rating</span>
              </div>
              {compareList.map((p) => {
                const isHighest = highlightDifferences && p.rating === maxRating
                return (
                  <div key={p.id} className="col-span-3">
                    {typeof p.rating === 'number' && p.rating > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-mist-100">
                        <Star size={12} className="fill-deal-500 text-deal-500" />
                        <span className="font-bold text-mist-100">{p.rating}</span>
                        {typeof p.review_count === 'number' && p.review_count > 0 && (
                          <span className="text-mist-400">({p.review_count?.toLocaleString('en-IN')})</span>
                        )}
                        {isHighest && (
                          <span className="rounded-full bg-deal-500/10 text-deal-500 text-[10px] font-bold px-1.5 py-0.5">
                            Top Rated
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-mist-400">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Metric Row: Primary Key Features (if not already rendered by backend compare) */}
          {!comparisonAttributeKeys.includes('Key Features') && (
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-start">
              <div className="col-span-3 font-semibold text-xs text-mist-100">
                Key Features
              </div>
              {compareList.map((p) => (
                <div key={p.id} className="col-span-3 space-y-1 text-xs text-mist-400">
                  {p.key_features?.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check size={12} className="text-deal-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Metric Row: Strengths (Pros) - Grounded */}
          {hasProsCons && (
            <>
              <div className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-start">
                <div className="col-span-3 font-semibold text-xs text-deal-500">
                  Key Strengths
                </div>
                {compareList.map((p) => (
                  <div key={p.id} className="col-span-3 space-y-1 text-xs text-mist-100">
                    {p.pros?.slice(0, 2).map((pro, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-deal-500 font-bold">•</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-4 py-4 border-b border-ink-750 items-start">
                <div className="col-span-3 font-semibold text-xs text-mist-400">
                  Trade-offs
                </div>
                {compareList.map((p) => (
                  <div key={p.id} className="col-span-3 space-y-1 text-xs text-mist-400">
                    {p.cons?.slice(0, 2).map((con, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-mist-400 font-bold">•</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
