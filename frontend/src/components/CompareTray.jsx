import { Link } from 'react-router-dom'
import { GitCompare, X, ChevronUp, ChevronDown, Sparkles } from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'

export default function CompareTray() {
  const { compareList, removeFromCompare, clearCompare, compareTrayOpen, setCompareTrayOpen } = useShop()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl">
      <div className="rounded-2xl border border-ink-750 bg-white/95 backdrop-blur-xl shadow-luxury p-3 sm:p-4 text-mist-100 transition-all">
        <div className="flex items-center justify-between pb-2 border-b border-ink-750">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-spark-50 text-spark-500">
              <GitCompare size={13} />
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-mist-100">
              Comparison Queue ({compareList.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareTrayOpen(!compareTrayOpen)}
              className="text-xs text-mist-400 hover:text-mist-100 flex items-center gap-1 transition-colors"
            >
              {compareTrayOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              <span className="hidden sm:inline">{compareTrayOpen ? 'Minimize' : 'Expand'}</span>
            </button>
            <button
              onClick={clearCompare}
              className="text-xs text-mist-400 hover:text-signal-500 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {compareTrayOpen && (
          <div className="py-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative group flex items-center gap-2 rounded-lg bg-ink-850 p-2 border border-ink-750"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-10 h-10 rounded-md object-cover shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-mist-100 truncate">{product.name}</p>
                  <p className="text-[10px] text-spark-500 font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-ink-800 text-mist-400 hover:bg-signal-500 hover:text-white flex items-center justify-center text-xs transition-colors"
                  aria-label="Remove from compare"
                >
                  <X size={10} />
                </button>
              </div>
            ))}

            {Array.from({ length: 4 - compareList.length }).map((_, i) => (
              <div
                key={i}
                className="hidden sm:flex items-center justify-center rounded-lg border border-dashed border-ink-750 p-2 text-center text-xs text-mist-400"
              >
                + Add item
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 pt-2 flex items-center justify-between gap-4">
          <p className="text-[11px] text-mist-400 hidden sm:block">
            {compareList.length < 2
              ? 'Select at least 1 more product to compare side by side'
              : 'Ready to evaluate specifications, pricing, and ratings'}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <Link
              to="/compare"
              className="flex items-center gap-2 rounded-full bg-spark-500 hover:bg-spark-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
            >
              <Sparkles size={13} />
              Compare {compareList.length} items
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
