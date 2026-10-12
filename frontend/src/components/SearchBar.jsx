import { useState, useEffect, useRef } from 'react'
import { Sparkles, ArrowRight, CornerDownLeft, X, Search, Zap } from 'lucide-react'

const PROMPT_SUGGESTIONS = [
  'Find me wireless earbuds under ₹3,000 with long battery life',
  'A lightweight laptop under ₹80,000 for coding and college',
  'Flagship camera smartphone under ₹40,000 with fast charging',
  'Responsive running shoes under ₹5,000',
  'Compact espresso machine for my kitchen under ₹8,000',
]

export default function SearchBar({
  onSubmit,
  placeholder,
  initialValue = '',
  size = 'lg',
  showSuggestionsDropdown = true,
}) {
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Typewriter effect for placeholder if none provided
  useEffect(() => {
    if (placeholder || value) return

    const currentPrompt = PROMPT_SUGGESTIONS[placeholderIndex]
    const typingSpeed = isDeleting ? 25 : 55
    const pauseTime = isDeleting ? 400 : 2500

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typingText.length < currentPrompt.length) {
          setTypingText(currentPrompt.slice(0, typingText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (typingText.length > 0) {
          setTypingText(currentPrompt.slice(0, typingText.length - 1))
        } else {
          setIsDeleting(false)
          setPlaceholderIndex((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [typingText, isDeleting, placeholderIndex, placeholder, value])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const query = value.trim() || typingText
    if (query) {
      onSubmit(query)
      setIsFocused(false)
    }
  }

  const handleSelectSuggestion = (prompt) => {
    setValue(prompt)
    onSubmit(prompt)
    setIsFocused(false)
  }

  const isLarge = size === 'lg'

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={`relative z-20 flex items-center gap-3 rounded-2xl transition-all duration-300 transform-gpu group ${
          isLarge
            ? 'p-2 sm:p-2.5 pl-4 sm:pl-6'
            : 'p-1.5 pl-3 sm:pl-4'
        } ${
          isFocused
            ? 'bg-white border-2 border-spark-500 shadow-glow ring-2 ring-spark-500/20 scale-[1.01] -translate-y-0.5'
            : 'bg-white border border-ink-750 shadow-card hover:border-spark-500/60 hover:shadow-glow hover:-translate-y-0.5'
        }`}
      >
        {/* AI Sparkle Icon with responsive glow and hover state */}
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            isLarge ? 'h-10 w-10' : 'h-8 w-8'
          } ${
            isFocused
              ? 'bg-spark-50 text-spark-500 rotate-12 scale-110 shadow-sm'
              : 'bg-ink-850 text-mist-400 group-hover:text-spark-500 group-hover:bg-spark-50 group-hover:scale-105'
          }`}
        >
          <Sparkles size={isLarge ? 18 : 15} className="transition-transform duration-300" />
        </div>

        {/* Input Field with Dynamic Typewriter or custom placeholder */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder || (typingText ? `${typingText}|` : 'Describe what you need in plain words…')}
            className={`w-full bg-transparent text-mist-100 font-medium placeholder:text-mist-400 focus:outline-none ${
              isLarge ? 'py-2.5 text-base sm:text-lg' : 'py-1.5 text-sm'
            }`}
          />
        </div>

        {/* Clear Button if text exists */}
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="p-1 rounded-full text-mist-400 hover:text-mist-100 transition-colors"
            aria-label="Clear query"
          >
            <X size={15} />
          </button>
        )}

        {/* Search Submit Action Button */}
        <button
          type="submit"
          className={`flex shrink-0 items-center gap-2 rounded-xl font-bold tracking-wide transition-all duration-200 active:scale-95 ${
            isLarge
              ? 'px-5 sm:px-7 py-3 text-xs sm:text-sm bg-spark-500 hover:bg-spark-600 text-white shadow-sm'
              : 'px-4 py-2 text-xs bg-spark-500 hover:bg-spark-600 text-white shadow-sm'
          }`}
        >
          <span>Find</span>
          <ArrowRight size={isLarge ? 15 : 13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      {/* Focus Transformation: Suggestion Drawer */}
      {showSuggestionsDropdown && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 rounded-xl bg-white border border-ink-750 shadow-luxury p-3 sm:p-4 animate-fade-in-up">
          <div className="flex items-center justify-between pb-2 border-b border-ink-750 text-xs font-semibold text-mist-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-spark-500">
              <Zap size={13} />
              Intelligent Prompt Suggestions
            </span>
            <span className="text-[11px] text-mist-500 font-normal">Press Enter ↵ to search</span>
          </div>

          <div className="mt-2 space-y-1">
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onMouseDown={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm text-mist-300 hover:bg-ink-850 hover:text-spark-500 flex items-center justify-between group transition-colors"
              >
                <span className="truncate pr-2">"{suggestion}"</span>
                <CornerDownLeft size={13} className="text-mist-400 group-hover:text-spark-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
