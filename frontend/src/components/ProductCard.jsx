import { useState, useRef } from 'react'
import { Star, Heart, GitCompare, Sparkles, Eye, Check, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext.jsx'

function formatINR(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function ProductCard({
  product,
  onSave,
  onCompareToggle,
  compareSelected,
  showQuickView = true,
}) {
  const {
    id,
    sku_id,
    name,
    product_name,
    brand = 'Brand',
    category,
    sub_category,
    variant,
    color,
    price = 0,
    original_price,
    discount_percent,
    rating,
    review_count,
    image_url,
    match_score,
    match_reasons,
  } = product || {}

  const productId = sku_id || id
  const displayName = product_name || name || 'Product'
  const displayCategory = sub_category || category

  const {
    isInWishlist,
    toggleWishlist,
    isInCompare,
    toggleCompare,
    setQuickViewProduct,
  } = useShop()

  const cardRef = useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  // 3D tilt interaction on hover (respects prefers-reduced-motion)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotX = ((y - centerY) / centerY) * -5
    const rotY = ((x - centerX) / centerX) * 5
    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  // Wishlist handler (uses prop or context)
  const isSaved = onSave ? false : isInWishlist(productId)
  const handleSaveClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onSave) {
      onSave(product)
    } else {
      toggleWishlist(product)
    }
  }

  // Compare handler (uses prop or context)
  const isCompared = typeof compareSelected === 'boolean' ? compareSelected : isInCompare(productId)
  const handleCompareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onCompareToggle) {
      onCompareToggle(product)
    } else {
      toggleCompare(product)
    }
  }

  const handleQuickViewClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewProduct(product)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className="group relative flex flex-col rounded-2xl bg-white border border-ink-750 hover:border-spark-500/60 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:z-10"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-ink-850">
        <Link to={`/product/${productId}`} className="block h-full w-full">
          {image_url && !imgError ? (
            <img
              src={image_url}
              alt={displayName}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-ink-850 text-center select-none group-hover:scale-105 transition-transform duration-500">
              <div className="h-14 w-14 rounded-2xl bg-white border border-ink-750 flex items-center justify-center text-spark-500 shadow-sm mb-3">
                <Package size={26} className="text-spark-500" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-mist-400">
                {brand}
              </span>
              <span className="text-xs font-semibold text-mist-200 line-clamp-1 mt-0.5">
                {displayCategory || 'Verified Catalog Item'}
              </span>
              {variant && (
                <span className="mt-1.5 rounded-md bg-white border border-ink-750 px-2 py-0.5 text-[10px] text-mist-400">
                  {variant}{color ? ` · ${color}` : ''}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Top Badges: ShopSmart Match */}
        {typeof match_score === 'number' && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 border border-signal-500/30 px-2.5 py-1 text-[11px] font-bold text-signal-500 shadow-sm backdrop-blur-sm">
            <Sparkles size={11} className="animate-pulse-subtle" />
            <span>{match_score}% Match</span>
          </div>
        )}

        {/* Top Action: Wishlist button */}
        <button
          onClick={handleSaveClick}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            isSaved
              ? 'bg-signal-500 text-white shadow-sm scale-105'
              : 'bg-white/90 text-mist-400 hover:text-signal-500 hover:bg-white border border-ink-750 hover:scale-110 shadow-sm'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isSaved ? 'In your picks' : 'Save to picks'}
        >
          <Heart size={14} className={isSaved ? 'fill-current' : ''} />
        </button>

        {/* Hover Quick View Trigger Pill */}
        {showQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-white/95 border border-ink-750 px-3.5 py-1.5 text-xs font-semibold text-mist-100 shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-spark-500 hover:text-white hover:border-spark-500"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-mist-500 mb-1">
            <span>{brand}</span>
            {displayCategory && <span className="normal-case font-normal text-mist-400">{displayCategory}</span>}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${productId}`}
            className="line-clamp-2 text-sm sm:text-base font-semibold text-mist-100 group-hover:text-spark-500 transition-colors leading-snug"
          >
            {displayName}
          </Link>

          {/* Star Rating & Review Count - Grounded: Only shown when present in dataset */}
          {typeof rating === 'number' && rating > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-mist-400">
              <div className="flex items-center text-deal-500">
                <Star size={12} className="fill-current" />
                <span className="ml-1 font-semibold text-mist-100">{rating}</span>
              </div>
              {typeof review_count === 'number' && review_count > 0 && (
                <>
                  <span>·</span>
                  <span>{review_count?.toLocaleString('en-IN')} reviews</span>
                </>
              )}
            </div>
          )}

          {/* Pricing Row */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-mist-100">
              {formatINR(price)}
            </span>
            {typeof original_price === 'number' && original_price > price && (
              <>
                <span className="text-xs text-mist-500 line-through">
                  {formatINR(original_price)}
                </span>
                {typeof discount_percent === 'number' && discount_percent > 0 && (
                  <span className="text-[11px] font-bold text-deal-500">
                    {discount_percent}% off
                  </span>
                )}
              </>
            )}
          </div>

          {/* AI Match Explanation Snippet */}
          {match_reasons?.length > 0 && (
            <div className="mt-3 rounded-lg bg-ink-850 border border-ink-750 p-2.5 text-[11px] text-mist-300 flex items-start gap-1.5 leading-relaxed">
              <Check size={13} className="text-signal-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{match_reasons[0]}</span>
            </div>
          )}
        </div>

        {/* Card Footer: Compare Toggle CTA */}
        <div className="mt-4 pt-3 border-t border-ink-750 flex items-center justify-between gap-2">
          <button
            onClick={handleCompareClick}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all ${
              isCompared
                ? 'bg-spark-500 text-white font-bold'
                : 'bg-ink-850 text-mist-400 hover:text-spark-500 hover:bg-white border border-ink-750 hover:border-spark-500/40'
            }`}
          >
            <GitCompare size={13} />
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
          </button>

          <Link
            to={`/product/${productId}`}
            className="flex items-center justify-center rounded-lg bg-ink-850 px-3 py-1.5 text-xs font-semibold text-mist-400 hover:text-spark-500 hover:bg-white hover:border-spark-500/40 transition-colors border border-ink-750"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
