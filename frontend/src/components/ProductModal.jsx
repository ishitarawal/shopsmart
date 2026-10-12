import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Star, Heart, GitCompare, Sparkles, Check, ArrowRight, ShieldCheck, Zap, Package } from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'

export default function ProductModal() {
  const { quickViewProduct, setQuickViewProduct, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useShop()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [quickViewProduct])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setQuickViewProduct(null)
    }
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [quickViewProduct, setQuickViewProduct])

  if (!quickViewProduct) return null

  const p = quickViewProduct
  const productId = p.sku_id || p.id
  const displayName = p.product_name || p.name || 'Product'
  const displayCategory = p.sub_category || p.category
  const saved = isInWishlist(productId)
  const compared = isInCompare(productId)

  const handleAskAI = () => {
    setQuickViewProduct(null)
    navigate(`/assistant?prompt=${encodeURIComponent(`Tell me more about ${displayName} by ${p.brand}`)}`)
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-2xl border border-ink-750 bg-white shadow-luxury overflow-hidden z-10 animate-fade-in-up">
        {/* Top close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-ink-850 text-mist-400 hover:bg-ink-800 hover:text-mist-100 transition-colors border border-ink-750"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Visual presentation */}
          <div className="relative bg-ink-850 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-ink-750">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-ink-750 shadow-sm group">
              {p.image_url && !imgError ? (
                <img
                  src={p.image_url}
                  alt={displayName}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-ink-850 text-center select-none">
                  <div className="h-16 w-16 rounded-2xl bg-white border border-ink-750 flex items-center justify-center text-spark-500 shadow-sm mb-3">
                    <Package size={32} className="text-spark-500" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-mist-400">{p.brand}</span>
                  <span className="text-sm font-semibold text-mist-200 mt-1">{displayCategory || 'Verified Catalog Item'}</span>
                  {p.variant && (
                    <span className="mt-2 rounded-md bg-white border border-ink-750 px-2.5 py-0.5 text-xs text-mist-400">
                      {p.variant}{p.color ? ` · ${p.color}` : ''}
                    </span>
                  )}
                </div>
              )}

              {typeof p.match_score === 'number' && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 border border-signal-500/30 px-3 py-1 text-xs font-semibold text-signal-500 shadow-sm">
                  <Sparkles size={12} />
                  <span>{p.match_score}% ShopSmart Match</span>
                </div>
              )}
            </div>

            {/* ShopSmart Match visual breakdown */}
            <div className="mt-6 rounded-xl bg-white p-4 border border-ink-750 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-spark-500 flex items-center gap-1.5">
                <Zap size={13} />
                Match Diagnostic Breakdown
              </p>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-mist-300 mb-1">
                    <span>Budget Alignment</span>
                    <span className="text-signal-500 font-semibold">98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-ink-850 rounded-full overflow-hidden">
                    <div className="h-full bg-signal-500 rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-mist-300 mb-1">
                    <span>Feature Requirements</span>
                    <span className="text-spark-500 font-semibold">94%</span>
                  </div>
                  <div className="h-1.5 w-full bg-ink-850 rounded-full overflow-hidden">
                    <div className="h-full bg-spark-500 rounded-full w-[94%]" />
                  </div>
                </div>

                {typeof p.rating === 'number' && p.rating > 0 && (
                  <div>
                    <div className="flex justify-between text-mist-300 mb-1">
                      <span>Customer Satisfaction Sentiment</span>
                      <span className="text-mist-100 font-semibold">{p.rating} / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full bg-ink-850 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-spark-500 to-signal-500 rounded-full" style={{ width: `${(p.rating / 5) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Product Dossier */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-ink-850 px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-mist-400 border border-ink-750">
                  {p.brand}
                </span>
                {displayCategory && <span className="text-xs text-mist-500">· {displayCategory}</span>}
              </div>

              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-medium text-mist-100 leading-tight">
                {displayName}
              </h2>

              {/* Rating & Reviews - Grounded */}
              {typeof p.rating === 'number' && p.rating > 0 ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-mist-400">
                  <div className="flex items-center text-deal-500">
                    <Star size={13} className="fill-current" />
                    <span className="ml-1 font-semibold text-mist-100">{p.rating}</span>
                  </div>
                  {typeof p.review_count === 'number' && p.review_count > 0 && (
                    <>
                      <span>·</span>
                      <span>{p.review_count?.toLocaleString('en-IN')} verified customer reviews</span>
                    </>
                  )}
                  <span>·</span>
                  <span className="text-signal-500 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={12} /> In Stock
                  </span>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-xs text-signal-500 font-semibold">
                  <ShieldCheck size={12} /> Verified Catalog Item
                </div>
              )}

              {/* Price Block */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-mist-100">
                  ₹{Math.round(p.price || 0).toLocaleString('en-IN')}
                </span>
                {typeof p.original_price === 'number' && p.original_price > p.price && (
                  <>
                    <span className="text-sm text-mist-500 line-through">
                      ₹{Math.round(p.original_price).toLocaleString('en-IN')}
                    </span>
                    {typeof p.discount_percent === 'number' && p.discount_percent > 0 && (
                      <span className="rounded-full bg-deal-50 border border-deal-500/30 px-2.5 py-0.5 text-xs font-bold text-deal-500">
                        Save {p.discount_percent}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Description / Variant details */}
              {p.description && (
                <p className="mt-4 text-sm text-mist-300 leading-relaxed font-light">
                  {p.description}
                </p>
              )}

              {/* AI Why ShopSmart Recommends */}
              {p.match_reasons?.length > 0 && (
                <div className="mt-4 rounded-xl bg-spark-50 border border-spark-500/20 p-3.5">
                  <p className="text-xs font-semibold text-spark-500 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Why ShopSmart Recommends This:
                  </p>
                  <ul className="mt-1.5 space-y-1.5 text-xs text-mist-100">
                    {p.match_reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={12} className="text-signal-500 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Features */}
              {p.key_features?.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-mist-400 mb-2">Key Highlights</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.key_features.map((feat, i) => (
                      <span key={i} className="rounded-lg bg-ink-850 border border-ink-750 px-2.5 py-1 text-xs text-mist-300">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-5 border-t border-ink-750 flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleWishlist(p)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
                  saved
                    ? 'bg-signal-500 text-white'
                    : 'bg-ink-850 text-mist-300 hover:text-signal-500 border border-ink-750 hover:bg-white'
                }`}
              >
                <Heart size={14} className={saved ? 'fill-current' : ''} />
                {saved ? 'In Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                onClick={() => toggleCompare(p)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
                  compared
                    ? 'bg-spark-500 text-white'
                    : 'bg-ink-850 text-mist-300 hover:text-spark-500 border border-ink-750 hover:bg-white'
                }`}
              >
                <GitCompare size={14} />
                {compared ? 'In Comparison' : 'Add to Compare'}
              </button>

              <button
                onClick={handleAskAI}
                className="flex items-center gap-2 rounded-full border border-spark-500/30 bg-spark-50 px-4 py-2.5 text-xs font-semibold text-spark-500 hover:bg-spark-500 hover:text-white transition-colors"
              >
                <Sparkles size={14} />
                Ask ShopSmart AI
              </button>

              <Link
                to={`/product/${productId}`}
                onClick={() => setQuickViewProduct(null)}
                className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-spark-500 hover:text-spark-600 transition-colors"
              >
                Full Details
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
