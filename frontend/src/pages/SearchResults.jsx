import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  SearchX,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  DollarSign,
  Briefcase,
  Zap,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductCardSkeleton from '../components/ProductCardSkeleton.jsx'
import api from '../services/api.js'
import { fallbackSearch, CATEGORIES } from '../data/demoFallback.js'

export default function SearchResults() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const rawQuery = params.get('q') || ''
  const categoryParam = params.get('category') || ''
  const activeQuery = rawQuery || (categoryParam ? `category: ${categoryParam}` : '')

  const [loading, setLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState('Understanding your request...')
  const [error, setError] = useState(null)
  const [extracted, setExtracted] = useState(null)
  const [results, setResults] = useState([])
  const [usingFallback, setUsingFallback] = useState(false)
  const [sortBy, setSortBy] = useState('match') // 'match' | 'price_asc' | 'price_desc' | 'rating'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setLoadingStage('Understanding your request...')

    const stageTimer = setTimeout(() => {
      if (!cancelled) {
        setLoadingStage('Finding relevant products...')
      }
    }, 900)

    const queryToRun = activeQuery || 'earbuds under ₹3000'

    // Determine whether to use /recommend or /search
    // Natural language queries or explicit constraints go to /recommend
    // Keyword or category queries can also use /search
    const isCategoryOnly = activeQuery.startsWith('category:')
    const fetchPromise = isCategoryOnly
      ? api.searchProducts(activeQuery.replace('category:', '').trim(), 8)
      : api.recommendProducts(queryToRun, 8)

    fetchPromise
      .then((data) => {
        if (cancelled) return
        // If /recommend returned 0 recommendations on a simple query, try /search as well
        if ((!data.recommendations || data.recommendations.length === 0) && !isCategoryOnly) {
          return api.searchProducts(queryToRun, 8).then((searchData) => {
            if (cancelled) return
            setExtracted(searchData.extracted)
            setResults(searchData.results || [])
            setUsingFallback(false)
          })
        }
        setExtracted(data.extracted)
        setResults(data.recommendations || data.results || [])
        setUsingFallback(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'ShopSmart AI is temporarily unavailable. Please try again in a moment.')
        // Fall back to local intelligent matcher
        const demo = fallbackSearch(queryToRun)
        setExtracted(demo.extracted)
        setResults(demo.results || [])
        setUsingFallback(true)
      })
      .finally(() => {
        clearTimeout(stageTimer)
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      clearTimeout(stageTimer)
    }
  }, [activeQuery])

  const handleNewSearch = (q) => {
    setParams({ q })
  }

  // Sorted results based on user filter
  const sortedResults = useMemo(() => {
    const list = [...results]
    if (sortBy === 'match') {
      return list.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
    }
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating)
    }
    return list
  }, [results, sortBy])

  return (
    <div className="min-h-screen bg-editorial-grid pb-24">
      {/* Top Search & Filter Bar */}
      <div className="border-b border-ink-750 bg-white pt-8 pb-6">
        <div className="container-page space-y-4">
          <div className="max-w-3xl">
            <SearchBar
              onSubmit={handleNewSearch}
              initialValue={rawQuery}
              size="md"
              placeholder="Refine or ask for something else (e.g. lightweight laptop under ₹80,000)…"
            />
          </div>

          {/* Fallback Banner Notice */}
          {usingFallback && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-ink-850 border border-ink-750 px-3 py-1.5 text-xs text-mist-400">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-500" />
              <span>Catalog In-Memory Demo Mode active. Start backend API for live external queries.</span>
            </div>
          )}
        </div>
      </div>

      <div className="container-page pt-8 space-y-8">
        {/* ----------------- AI INTERPRETATION DOSSIER ----------------- */}
        {extracted && !loading && (
          <div className="rounded-2xl border border-ink-750 bg-white p-5 sm:p-7 shadow-luxury animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ink-750">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-spark-500 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  ShopSmart Semantic Interpretation
                </p>
                <h1 className="mt-1 font-editorial text-xl sm:text-2xl font-bold text-mist-100">
                  {rawQuery ? `"${rawQuery}"` : `Category: ${categoryParam || 'Catalog Highlights'}`}
                </h1>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="rounded-full bg-signal-50 border border-signal-500/30 px-3 py-1 text-xs font-bold text-signal-500">
                  {results.length} Ranked Results Found
                </span>
              </div>
            </div>

            {/* Extracted Requirements Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-mist-400 mr-1">Extracted Parameters:</span>

              {extracted.category && (
                <div className="flex items-center gap-1.5 rounded-xl bg-ink-850 border border-ink-750 px-3 py-1.5 text-xs font-medium text-mist-200">
                  <Tag size={13} className="text-spark-500" />
                  <span>Category: <strong className="text-mist-100">{extracted.category}</strong></span>
                </div>
              )}

              {extracted.budget_max && (
                <div className="flex items-center gap-1.5 rounded-xl bg-ink-850 border border-ink-750 px-3 py-1.5 text-xs font-medium text-mist-200">
                  <DollarSign size={13} className="text-deal-500" />
                  <span>Budget: <strong className="text-mist-100">under ₹{Number(extracted.budget_max).toLocaleString('en-IN')}</strong></span>
                </div>
              )}

              {extracted.use_case && (
                <div className="flex items-center gap-1.5 rounded-xl bg-ink-850 border border-ink-750 px-3 py-1.5 text-xs font-medium text-mist-200">
                  <Briefcase size={13} className="text-spark-500" />
                  <span>Use Case: <strong className="text-mist-100">{extracted.use_case}</strong></span>
                </div>
              )}

              {extracted.preferences?.map((pref, idx) => (
                <div key={idx} className="flex items-center gap-1.5 rounded-xl bg-ink-850 border border-ink-750 px-3 py-1.5 text-xs font-medium text-mist-200">
                  <Zap size={13} className="text-signal-500" />
                  <span>Priority: <strong className="text-mist-100">{pref}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TOOLBAR: SORT & FILTERS ----------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Quick Category filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => handleNewSearch('')}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors shrink-0 ${
                !categoryParam && !rawQuery
                  ? 'bg-spark-500 text-white font-bold'
                  : 'bg-white border border-ink-750 text-mist-400 hover:text-mist-100 hover:bg-ink-850'
              }`}
            >
              All Items
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.name}
                onClick={() => setParams({ category: cat.name })}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors shrink-0 ${
                  categoryParam.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-spark-500 text-white font-bold'
                    : 'bg-white border border-ink-750 text-mist-400 hover:text-mist-100 hover:bg-ink-850'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-mist-500 flex items-center gap-1">
              <ArrowUpDown size={13} />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl bg-white border border-ink-750 px-3 py-1.5 text-xs text-mist-100 focus:outline-none focus:border-spark-500"
            >
              <option value="match">ShopSmart Match (Highest)</option>
              <option value="rating">Customer Rating (Highest)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ----------------- PRODUCT RESULTS GRID ----------------- */}
        <div>
          {loading ? (
            <div className="space-y-6">
              {/* Staged Loading Indicator */}
              <div className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-ink-750 shadow-card">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-spark-50 text-spark-500">
                  <Sparkles size={18} className="animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-bold text-mist-100 flex items-center gap-2">
                    <span>{loadingStage}</span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-spark-500 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-signal-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-mist-400 animate-bounce [animation-delay:-0.3s]" />
                    </span>
                  </p>
                  <p className="text-xs text-mist-400 font-light mt-0.5">
                    Querying grounded product catalog & FAISS embeddings
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : sortedResults.length === 0 ? (
            <EmptyState query={rawQuery || categoryParam} onReset={() => handleNewSearch('')} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ query, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-ink-750 bg-white p-12 sm:p-20 text-center shadow-card max-w-xl mx-auto space-y-4 my-12 animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-spark-50 text-spark-500 border border-spark-500/20 shadow-sm">
        <SearchX size={26} />
      </div>

      <h3 className="font-editorial text-2xl font-bold text-mist-100">
        Nothing quite matches those exact parameters.
      </h3>

      <p className="text-sm text-mist-400 leading-relaxed font-light">
        {query
          ? `We couldn't find items that satisfy all criteria for "${query}". Try expanding your budget ceiling or relaxing one of the feature constraints.`
          : 'Enter what kind of product you are searching for to view ranked catalog recommendations.'}
      </p>

      <div className="pt-2 flex flex-wrap gap-2 justify-center">
        <button
          onClick={onReset}
          className="rounded-full bg-spark-500 hover:bg-spark-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
        >
          View All Catalog Items
        </button>
      </div>
    </div>
  )
}
