import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Sliders,
  Check,
  Sparkles,
  DollarSign,
  Shield,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { CATEGORIES } from '../data/demoFallback.js'
import { useShop } from '../context/ShopContext.jsx'

export default function Profile() {
  const navigate = useNavigate()
  const { addToast } = useShop()

  const [name] = useState('Guest Shopper')
  const [preferred, setPreferred] = useState(() => {
    try {
      const stored = localStorage.getItem('shopsmart_preferred_cats')
      return stored ? JSON.parse(stored) : ['Earbuds', 'Laptops']
    } catch {
      return ['Earbuds', 'Laptops']
    }
  })
  const [budgetMax, setBudgetMax] = useState(() => {
    return localStorage.getItem('shopsmart_budget_max') || '50000'
  })
  const [saved, setSaved] = useState(false)

  const toggleCategory = (catName) => {
    setPreferred((prev) =>
      prev.includes(catName) ? prev.filter((x) => x !== catName) : [...prev, catName]
    )
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('shopsmart_preferred_cats', JSON.stringify(preferred))
      localStorage.setItem('shopsmart_budget_max', budgetMax)
    } catch (err) {
      console.warn('Could not save profile locally:', err)
    }
    setSaved(true)
    addToast('Preferences saved successfully', 'success')
  }

  const handleSearchWithPreferences = () => {
    const cats = preferred.join(' or ') || 'technology'
    const query = `Find me top ${cats} under ₹${Number(budgetMax || 50000).toLocaleString('en-IN')}`
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="border-b border-ink-750 bg-white py-8">
        <div className="container-page max-w-3xl flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-spark-50 text-spark-500 border border-spark-500/20 shadow-sm">
            <User size={24} />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-signal-500 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-mist-100">
                {name}
              </h1>
              <span className="rounded-full bg-ink-850 border border-ink-750 px-2.5 py-0.5 text-[10px] font-mono text-mist-400">
                LOCAL PROFILE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-mist-400 font-light mt-0.5">
              Personalize default budget ceilings and preferred categories for faster AI recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="container-page max-w-3xl pt-10">
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-ink-750 bg-white p-6 sm:p-10 shadow-sm space-y-8"
        >
          {/* Section: Category Preferences */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-wider text-mist-100 flex items-center gap-2">
                <Layers size={15} className="text-spark-500" />
                <span>Preferred Product Categories</span>
              </label>
              <span className="text-xs text-mist-400">{preferred.length} selected</span>
            </div>

            <p className="text-xs text-mist-400 font-light">
              Tap to highlight items you shop for most frequently. ShopSmart weights these when you ask open-ended questions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {CATEGORIES.map((c) => {
                const isSelected = preferred.includes(c.name)
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => toggleCategory(c.name)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-spark-500 text-white border-spark-500 shadow-sm'
                        : 'bg-ink-850 border-ink-750 text-mist-400 hover:text-mist-100 hover:bg-white'
                    }`}
                  >
                    <span>{c.name}</span>
                    {isSelected && <Check size={13} className="text-white shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section: Budget Ceiling */}
          <div className="space-y-3 pt-6 border-t border-ink-750">
            <label
              htmlFor="budget"
              className="text-sm font-bold uppercase tracking-wider text-mist-100 flex items-center gap-2"
            >
              <DollarSign size={15} className="text-deal-500" />
              <span>Typical Budget Ceiling</span>
            </label>

            <p className="text-xs text-mist-400 font-light">
              Maximum expenditure threshold used when no specific budget is stated in your conversational prompt.
            </p>

            <div className="relative max-w-sm pt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-mist-400">
                ₹
              </span>
              <input
                id="budget"
                type="number"
                min="500"
                step="500"
                value={budgetMax}
                onChange={(e) => {
                  setBudgetMax(e.target.value)
                  setSaved(false)
                }}
                placeholder="50000"
                className="w-full rounded-2xl border border-ink-750 bg-white py-3.5 pl-9 pr-4 text-base font-bold text-mist-100 placeholder:text-mist-400 focus:border-spark-500 focus:outline-none focus:ring-2 focus:ring-spark-500/20"
              />
            </div>
          </div>

          {/* Save & Run Action Buttons */}
          <div className="pt-6 border-t border-ink-750 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-spark-500 hover:bg-spark-600 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-95"
            >
              Save Preferences
            </button>

            <button
              type="button"
              onClick={handleSearchWithPreferences}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-spark-500 hover:text-spark-600 transition-colors"
            >
              <Zap size={14} />
              <span>Search using these saved settings</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {saved && (
            <div className="rounded-xl bg-spark-50 border border-spark-500/30 p-3 text-xs font-semibold text-spark-500 flex items-center gap-2 animate-fade-in">
              <Check size={14} />
              <span>Preferences successfully updated in local inference profile.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
