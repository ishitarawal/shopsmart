import { Link, useNavigate } from 'react-router-dom'
import { Heart, Sparkles, ShoppingBag, ArrowRight, Trash2, ArrowUpRight } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { useShop } from '../context/ShopContext.jsx'

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useShop()
  const navigate = useNavigate()

  if (wishlist.length === 0) {
    return (
      <div className="bg-white min-h-screen py-24">
        <div className="container-page flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-850 text-signal-500 border border-ink-750 shadow-sm">
            <Heart size={30} className="fill-current" />
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-mist-100">
            Your saved finds will appear here.
          </h1>

          <p className="text-sm text-mist-400 font-light leading-relaxed">
            As you explore recommendations or converse with ShopSmart AI, tap the heart icon on any product to curate your personal collection.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/search')}
              className="rounded-full bg-spark-500 hover:bg-spark-600 px-7 py-3 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
            >
              Discover Curated Finds
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Summary metrics for collection
  const totalValue = wishlist.reduce((acc, curr) => acc + curr.price, 0)
  const uniqueCategories = Array.from(new Set(wishlist.map((p) => p.category)))

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Top Header */}
      <div className="border-b border-ink-750 bg-white py-8">
        <div className="container-page flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-signal-500 flex items-center gap-1.5">
              <Heart size={14} className="fill-current" />
              Personal Curated Collection
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100 mt-1">
              Your picks.
            </h1>
            <p className="text-xs sm:text-sm text-mist-400 font-light mt-1">
              {wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'} across {uniqueCategories.length} {uniqueCategories.length === 1 ? 'category' : 'categories'}.
            </p>
          </div>

          {/* Collection Metrics Pill */}
          <div className="flex items-center gap-4 bg-white border border-ink-750 rounded-2xl p-3 sm:px-5 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-mist-400">Collection Value</span>
              <p className="text-base sm:text-lg font-bold text-mist-100">
                ₹{Math.round(totalValue).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="h-8 w-px bg-ink-750" />
            <div>
              <span className="text-[10px] uppercase font-bold text-mist-400">Saved Items</span>
              <p className="text-base sm:text-lg font-bold text-signal-500">
                {wishlist.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="container-page pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
