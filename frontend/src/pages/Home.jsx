import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  Star,
  Check,
  GitCompare,
  Heart,
  Eye,
  Sliders,
  Compass,
} from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ThreeDOrb from '../components/ThreeDOrb.jsx'
import { CATEGORIES, DEMO_PRODUCTS } from '../data/demoFallback.js'
import { useShop } from '../context/ShopContext.jsx'

const SUGGESTED_SEARCHES = [
  'Find wireless earbuds under ₹3,000 with great battery life for travelling',
  'A lightweight laptop under ₹80,000 for coding and college',
  'Flagship phone with best camera under ₹40,000',
  'Running shoes under ₹5,000 with responsive cushioning',
  'Compact espresso machine for kitchen under ₹8,000',
]

// Interactive Storytelling stages for "How ShopSmart Works"
const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    label: 'Tell us what you need',
    title: 'Natural language input',
    subtitle: 'User describes what they are looking for naturally — no checkboxes or technical jargon.',
    example: '"I need wireless earbuds under ₹3,000 with long battery life for traveling."',
    icon: MessageSquare,
  },
  {
    step: '02',
    label: 'ShopSmart understands',
    title: 'Intelligent extraction',
    subtitle: 'AI identifies preferences, budget, category, and requirements with precision.',
    breakdown: [
      { label: 'Category', value: 'Earbuds', type: 'category' },
      { label: 'Ceiling Budget', value: '₹3,000', type: 'budget' },
      { label: 'Primary Priority', value: 'Battery Life (Travel)', type: 'priority' },
      { label: 'Acoustic Needs', value: 'Noise Isolation / ENC', type: 'feature' },
    ],
    icon: Cpu,
  },
  {
    step: '03',
    label: 'We find the right options',
    title: 'Multi-factor catalog ranking',
    subtitle: 'ShopSmart searches and presents real, verified catalog products.',
    metrics: [
      { label: 'Catalog items evaluated', val: '1,420+' },
      { label: 'Specs cross-referenced', val: '48 attributes' },
      { label: 'Verification latency', val: '< 180ms' },
    ],
    icon: Layers,
  },
  {
    step: '04',
    label: 'You make the decision',
    title: 'Transparent reasoning & comparison',
    subtitle: 'Compare, explore, save favorites, and decide with complete confidence.',
    productPreview: DEMO_PRODUCTS[0],
    icon: Sparkles,
  },
]

// Scenarios for the Live AI Assistant Showcase
const AI_CONVERSATION_SCENARIOS = [
  {
    id: 'headphones',
    tabLabel: 'Travel Headphones',
    userMessage: 'I need headphones for long flights.',
    aiReply:
      'Here are options with strong battery life (up to 40 hours), comfortable cloud-soft circumaural fit, and active noise cancellation (up to 38dB):',
    products: [DEMO_PRODUCTS[9], DEMO_PRODUCTS[0]], // SilentSpace ANC 700 & AeroFit Pro ANC
  },
  {
    id: 'laptop',
    tabLabel: 'Coding Laptop',
    userMessage: 'Find me a lightweight laptop under ₹80,000 for coding and college.',
    aiReply:
      'Identified top developer ultrabooks with 16GB high-speed RAM, 1.29kg unibody aluminum weight, and 12-hour full workday battery:',
    products: [DEMO_PRODUCTS[3], DEMO_PRODUCTS[4]], // CodeBook 14 Slim & ForgeBook Dev 15
  },
  {
    id: 'shoes',
    tabLabel: 'Running Shoes',
    userMessage: 'Running shoes under ₹5,000 with responsive cushioning.',
    aiReply:
      'Selected high-rebound Nitrogen EVA runners with high energy return, breathable monofilament mesh, and true-to-size neutral road fit:',
    products: [DEMO_PRODUCTS[12], DEMO_PRODUCTS[13]], // StrideMax Runner & Rin Street Low
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { setQuickViewProduct, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useShop()

  // How ShopSmart Works active stage
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // AI Assistant living demonstration scenario
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0)
  const [aiIsTyping, setAiIsTyping] = useState(false)
  const [displayedReply, setDisplayedReply] = useState(AI_CONVERSATION_SCENARIOS[0].aiReply)

  // Auto-advance the "How ShopSmart Works" sequence
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  // Handle switching AI scenario with animated typing response
  const handleScenarioChange = (idx) => {
    if (idx === selectedScenarioIdx) return
    setSelectedScenarioIdx(idx)
    setAiIsTyping(true)
    setDisplayedReply('')
    setTimeout(() => {
      setDisplayedReply(AI_CONVERSATION_SCENARIOS[idx].aiReply)
      setAiIsTyping(false)
    }, 450)
  }

  const goSearch = (query) => navigate(`/search?q=${encodeURIComponent(query)}`)

  // Spotlight featured product
  const spotlightProduct = DEMO_PRODUCTS[0] // AeroFit Pro ANC
  const trendingSubProducts = [DEMO_PRODUCTS[3], DEMO_PRODUCTS[7], DEMO_PRODUCTS[9]]

  const currentScenario = AI_CONVERSATION_SCENARIOS[selectedScenarioIdx]

  return (
    <div className="relative overflow-hidden bg-editorial-grid">
      {/* Ambient background blur elements */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-r from-spark-500/10 via-signal-500/10 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[550px] h-[400px] bg-gradient-to-l from-spark-500/8 via-signal-500/6 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* ----------------- 1. CINEMATIC HERO SECTION ----------------- */}
      <section className="relative min-h-[92vh] sm:min-h-[94vh] flex flex-col justify-center container-page pt-12 sm:pt-16 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Conversational Search */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 z-10">
            {/* Small label / Pill */}
            <div className="animate-hero-1 inline-flex items-center gap-2 rounded-full bg-white border border-ink-750 px-3.5 py-1.5 text-xs text-mist-400 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-spark-500 animate-pulse" />
              <span className="font-bold text-spark-500">ShopSmart 2.0</span>
              <span className="text-mist-500">·</span>
              <span className="text-mist-300">Natural Language Shopping Assistant</span>
            </div>

            {/* Main Headline */}
            <div className="animate-hero-2 space-y-2">
              <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-mist-100 leading-[1.03]">
                Shopping made <br className="hidden sm:inline" />
                <span className="italic font-display font-normal text-spark-500">smarter.</span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="animate-hero-3 max-w-xl text-base sm:text-xl text-mist-400 font-light leading-relaxed">
              Tell us what you need. We'll help you find what fits — no endless dropdown filters, just plain human conversation.
            </p>

            {/* AI Search Bar — Hero Centerpiece */}
            <div className="animate-hero-4 pt-2 max-w-2xl relative z-30">
              <SearchBar
                onSubmit={goSearch}
                size="lg"
                showSuggestionsDropdown={true}
              />
            </div>

            {/* Suggested Prompts / Chips */}
            <div className="animate-hero-5 flex flex-wrap items-center gap-2 pt-1 text-xs relative z-10">
              <span className="text-mist-500 font-medium mr-1 flex items-center gap-1">
                <Zap size={12} className="text-spark-500" />
                Try asking:
              </span>
              {SUGGESTED_SEARCHES.slice(0, 3).map((query) => (
                <button
                  key={query}
                  onClick={() => goSearch(query)}
                  className="rounded-full bg-white border border-ink-750 px-3.5 py-1.5 text-mist-400 hover:text-spark-500 hover:border-spark-500/40 hover:bg-ink-850 transition-all text-left truncate max-w-xs shadow-sm"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Premium 3D Motion Element & Living Preview */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]">
            {/* 3D Canvas Visual Element — doubled size to cover maximum blank area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[140%] sm:w-[170%] lg:w-[200%] aspect-square max-w-[840px]">
                <ThreeDOrb className="w-full h-full" />
              </div>
            </div>

            {/* Floating Holographic Product Node Card */}
            <div
              onClick={() => setQuickViewProduct(spotlightProduct)}
              className="relative z-10 w-[92%] sm:w-[85%] max-w-[380px] rounded-2xl border border-ink-750 bg-white/95 backdrop-blur-xl p-4 shadow-luxury hover:border-spark-500/70 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
                <div className="flex items-center justify-between pb-3 border-b border-ink-750">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-spark-50 text-spark-500">
                      <Sparkles size={13} />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-mist-300">
                      Active AI Match
                    </span>
                  </div>
                  <span className="rounded-full bg-signal-50 border border-signal-500/30 px-2 py-0.5 text-[10px] font-bold text-signal-500">
                    95% Match
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={spotlightProduct.image_url}
                    alt={spotlightProduct.name}
                    className="w-14 h-14 rounded-xl object-cover bg-ink-850 border border-ink-750"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-mist-500">
                      {spotlightProduct.brand}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-mist-100 truncate group-hover:text-spark-500 transition-colors">
                      {spotlightProduct.name}
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xs font-bold text-mist-100">
                        ₹{spotlightProduct.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-mist-500 line-through">
                        ₹{spotlightProduct.original_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-ink-750 flex items-center justify-between text-[11px] text-mist-400">
                  <span className="flex items-center gap-1 text-signal-500 font-medium">
                    <Check size={12} /> Adaptive ANC & 35hr battery
                  </span>
                  <span className="text-spark-500 font-semibold group-hover:underline">
                    Quick Inspect →
                  </span>
                </div>
              </div>
            </div>
          </div>

        {/* Scroll indicator prompt */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-mist-500 pt-8">
          <div className="h-4 w-px bg-spark-500/40 animate-bounce" />
          <span>Scroll to explore the visual story</span>
        </div>
      </section>

      {/* ----------------- 2. LIVE AI ASSISTANT CONVERSATIONAL SHOWCASE ----------------- */}
      <section className="container-page py-16 sm:py-24 border-t border-ink-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-signal-500 flex items-center gap-1.5">
              <Sparkles size={14} />
              AI Shopping Assistant Experience
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100 mt-1">
              Conversational intelligence in action.
            </h2>
            <p className="text-sm text-mist-400 font-light mt-1 max-w-xl">
              Describe your lifestyle, constraints, and environment. ShopSmart AI asks intelligent follow-ups and returns ranked product cards inline.
            </p>
          </div>

          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-ink-850 border border-ink-750 px-5 py-2.5 text-xs font-bold text-mist-100 hover:text-spark-500 transition-all shadow-sm self-start md:self-auto"
          >
            <span>Launch Full Assistant</span>
            <ArrowRight size={14} className="text-spark-500" />
          </Link>
        </div>

        {/* Scenario Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-mist-500 font-medium mr-1 hidden sm:inline">Test Scenario:</span>
          {AI_CONVERSATION_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(idx)}
              className={`rounded-full px-4 py-2 font-semibold transition-all shrink-0 ${
                selectedScenarioIdx === idx
                  ? 'bg-spark-500 text-white shadow-sm font-bold scale-[1.02]'
                  : 'bg-white border border-ink-750 text-mist-400 hover:text-mist-100 hover:bg-ink-850'
              }`}
            >
              {sc.tabLabel}
            </button>
          ))}
        </div>

        {/* Interactive Chat Stream & Recommendations Container */}
        <div className="mt-6 rounded-3xl border border-ink-750 bg-white p-6 sm:p-10 shadow-luxury">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* User Speech Bubble */}
            <div className="flex items-start gap-3 justify-end animate-fade-in">
              <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
                <div className="rounded-2xl rounded-tr-sm bg-spark-500 p-4 sm:p-4.5 text-white font-medium shadow-sm text-sm sm:text-base leading-relaxed">
                  "{currentScenario.userMessage}"
                </div>
                <span className="mt-1 px-1 text-[10px] text-mist-500 font-semibold tracking-wider uppercase">
                  You
                </span>
              </div>
            </div>

            {/* AI Response Stream with Typing Simulation */}
            <div className="flex items-start gap-3 sm:gap-4 animate-fade-in">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-850 text-signal-500 border border-signal-500/30 shadow-sm">
                <Sparkles size={16} />
              </div>

              <div className="flex flex-col items-start max-w-[90%] sm:max-w-[85%] space-y-4">
                <div className="rounded-2xl rounded-tl-sm bg-ink-850 border border-ink-750 p-4 sm:p-5 text-mist-100 shadow-sm text-sm sm:text-base leading-relaxed">
                  {aiIsTyping ? (
                    <div className="flex items-center gap-2 text-xs text-mist-400">
                      <span>ShopSmart AI is thinking</span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal-500" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-spark-500 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist-400" />
                    </div>
                  ) : (
                    <p>{displayedReply}</p>
                  )}
                </div>

                {/* Inline Product Recommendation Cards */}
                {!aiIsTyping && (
                  <div className="w-full pt-1 space-y-2 animate-fade-in-up">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-spark-500 flex items-center gap-1.5">
                      <Zap size={13} />
                      Curated Inline Recommendations ({currentScenario.products.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentScenario.products.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-2xl bg-white border border-ink-750 p-4 flex flex-col justify-between hover:border-spark-500/60 transition-all duration-300 shadow-sm group"
                        >
                          <div className="flex gap-3.5">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover bg-ink-850 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-mist-500">
                                  {product.brand}
                                </span>
                                <span className="text-[10px] font-bold text-signal-500">
                                  {product.match_score}% Match
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-semibold text-mist-100 truncate group-hover:text-spark-500 transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-xs font-bold text-mist-100 mt-0.5">
                                ₹{product.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-ink-750 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setQuickViewProduct(product)}
                              className="text-[11px] font-semibold text-mist-400 hover:text-spark-500 flex items-center gap-1 transition-colors"
                            >
                              <Eye size={12} /> Quick Inspect
                            </button>
                            <button
                              onClick={() => toggleCompare(product)}
                              className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                                isInCompare(product.id)
                                  ? 'text-spark-500'
                                  : 'text-mist-400 hover:text-mist-200'
                              }`}
                            >
                              <GitCompare size={12} />
                              {isInCompare(product.id) ? 'In Compare' : 'Compare'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 3. "HOW SHOPSMART WORKS" (EDITORIAL STORYTELLING) ----------------- */}
      <section className="container-page py-16 sm:py-24 border-t border-ink-750">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold tracking-widest uppercase text-spark-500 flex items-center gap-1.5">
            <Cpu size={14} />
            Editorial Storytelling
          </p>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100">
            How ShopSmart works.
          </h2>
          <p className="text-sm sm:text-base text-mist-400 font-light">
            Instead of making you dig through 50 filter checkboxes, our engine translates plain conversation into structured requirements, verified catalog searches, and transparent recommendations.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HOW_IT_WORKS_STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = activeStep === idx
            return (
              <button
                key={s.step}
                onClick={() => {
                  setActiveStep(idx)
                  setIsAutoPlaying(false)
                }}
                className={`relative flex flex-col text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-white border-spark-500 shadow-sm'
                    : 'bg-ink-850 border-ink-750 hover:border-ink-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span
                    className={`font-editorial text-sm font-bold ${
                      isActive ? 'text-spark-500' : 'text-mist-400'
                    }`}
                  >
                    {s.step}
                  </span>
                  <Icon
                    size={16}
                    className={isActive ? 'text-signal-500' : 'text-mist-400'}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-mist-100">{s.label}</span>
                <span className="text-[11px] text-mist-500 mt-1 line-clamp-1">{s.title}</span>

                {/* Progress bar active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-spark-500 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Dynamic Thinking Stage Showcase */}
        <div className="mt-6 rounded-2xl border border-ink-750 bg-white p-6 sm:p-8 shadow-card min-h-[220px]">
          {activeStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-spark-500">
                <MessageSquare size={14} />
                <span>01 · Tell Us What You Need</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-mist-100 font-medium">
                "I need wireless earbuds under ₹3,000 with long battery life for traveling."
              </h3>
              <p className="text-sm text-mist-400 max-w-2xl font-light">
                Express your real-world situation. Mention your commute, your budget constraints, your work setup, or features you dislike.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-ink-850 border border-ink-750 px-3 py-1 text-mist-400">
                  Zero keyword formatting needed
                </span>
                <span className="rounded-full bg-ink-850 border border-ink-750 px-3 py-1 text-mist-400">
                  Handles budget ceilings in ₹ INR
                </span>
                <span className="rounded-full bg-ink-850 border border-ink-750 px-3 py-1 text-mist-400">
                  Infers use cases (flight, gym, work, college)
                </span>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal-500">
                <Cpu size={14} />
                <span>02 · ShopSmart Understands</span>
              </div>
              <h3 className="font-display text-2xl text-mist-100 font-medium">
                ShopSmart breaks your sentence into verified mathematical filters:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {HOW_IT_WORKS_STEPS[1].breakdown.map((item, i) => (
                  <div key={i} className="rounded-xl bg-ink-850 border border-ink-750 p-4">
                    <p className="text-[11px] uppercase font-bold text-mist-500">{item.label}</p>
                    <p className="text-base font-bold text-mist-100 mt-1">{item.value}</p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-signal-500 font-semibold">
                      parsed_attribute: valid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-spark-500">
                <Layers size={14} />
                <span>03 · We Find the Right Options</span>
              </div>
              <h3 className="font-display text-2xl text-mist-100 font-medium">
                Simultaneously querying database specs, user ratings, and real prices:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {HOW_IT_WORKS_STEPS[2].metrics.map((m, i) => (
                  <div key={i} className="rounded-xl bg-ink-850 border border-ink-750 p-4 text-center">
                    <p className="font-editorial text-3xl font-bold text-mist-100">{m.val}</p>
                    <p className="text-xs text-mist-400 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal-500">
                <Sparkles size={14} />
                <span>04 · You Make the Decision</span>
              </div>
              <h3 className="font-display text-2xl text-mist-100 font-medium">
                95% ShopSmart Match — AeroFit Pro ANC
              </h3>
              <p className="text-sm text-mist-400 font-light">
                Why this product? "Within your ₹3,000 budget (₹2,899) and matches your travel requirement with 35dB adaptive active noise cancellation and 35hr battery."
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => setQuickViewProduct(HOW_IT_WORKS_STEPS[3].productPreview)}
                  className="rounded-full bg-spark-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-spark-600 transition-colors shadow-sm"
                >
                  Inspect Recommended Match
                </button>
                <button
                  onClick={() => goSearch('wireless earbuds under ₹3000')}
                  className="text-xs font-semibold text-mist-400 hover:text-spark-500 flex items-center gap-1 transition-colors"
                >
                  View full search results <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ----------------- 4. EXISTING FEATURES EDITORIAL SHOWCASE ----------------- */}
      <section className="container-page py-16 sm:py-24 border-t border-ink-750">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-spark-500">Platform Architecture</p>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100">
            Engineered for effortless discovery.
          </h2>
          <p className="text-xs sm:text-sm text-mist-400 font-light">
            Every feature on ShopSmart works in harmony to guide you from vague intention to the perfect product decision.
          </p>
        </div>

        {/* 4 Feature Columns with Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl bg-white border border-ink-750 p-6 flex flex-col justify-between hover:border-spark-500/50 transition-all shadow-card group">
            <div className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spark-50 text-spark-500 border border-spark-500/20">
                <MessageSquare size={18} />
              </span>
              <h3 className="font-editorial text-lg font-bold text-mist-100">
                Natural-Language Search
              </h3>
              <p className="text-xs text-mist-400 leading-relaxed font-light">
                Type sentences just like speaking to a knowledgeable sales consultant. Budget, category, and must-haves are parsed in milliseconds.
              </p>
            </div>
            <Link
              to="/search"
              className="mt-6 flex items-center gap-1 text-xs font-semibold text-spark-500 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Explore Search</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl bg-white border border-ink-750 p-6 flex flex-col justify-between hover:border-signal-500/50 transition-all shadow-card group">
            <div className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-50 text-signal-500 border border-signal-500/20">
                <Sparkles size={18} />
              </span>
              <h3 className="font-editorial text-lg font-bold text-mist-100">
                Transparent Match Scores
              </h3>
              <p className="text-xs text-mist-400 leading-relaxed font-light">
                ShopSmart assigns an objective compatibility percentage with plain-language bullet points explaining why each item was selected.
              </p>
            </div>
            <Link
              to="/assistant"
              className="mt-6 flex items-center gap-1 text-xs font-semibold text-signal-500 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Ask ShopSmart AI</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl bg-white border border-ink-750 p-6 flex flex-col justify-between hover:border-spark-500/50 transition-all shadow-card group">
            <div className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spark-50 text-spark-500 border border-spark-500/20">
                <GitCompare size={18} />
              </span>
              <h3 className="font-editorial text-lg font-bold text-mist-100">
                Side-by-Side Comparison
              </h3>
              <p className="text-xs text-mist-400 leading-relaxed font-light">
                Queue up to 4 items in your comparison dock. Highlight hardware differentials, battery reserves, and value benchmarks.
              </p>
            </div>
            <Link
              to="/compare"
              className="mt-6 flex items-center gap-1 text-xs font-semibold text-spark-500 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Open Comparison Matrix</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl bg-white border border-ink-750 p-6 flex flex-col justify-between hover:border-signal-500/50 transition-all shadow-card group">
            <div className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-50 text-signal-500 border border-signal-500/20">
                <Heart size={18} />
              </span>
              <h3 className="font-editorial text-lg font-bold text-mist-100">
                "Your Picks" Wishlist
              </h3>
              <p className="text-xs text-mist-400 leading-relaxed font-light">
                Bookmark top recommendations with one tap. Organize your shortlist and track price points across sessions.
              </p>
            </div>
            <Link
              to="/wishlist"
              className="mt-6 flex items-center gap-1 text-xs font-semibold text-signal-500 group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Saved Finds</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- 5. CURATED CATEGORIES EDITORIAL SHOWCASE ----------------- */}
      <section className="container-page py-16 sm:py-24 border-t border-ink-750">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-spark-500">Editorial Taxonomy</p>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100 mt-1">
              Curated categories.
            </h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-spark-500 hover:text-spark-600 transition-colors"
          >
            Explore all categories <ArrowRight size={14} />
          </Link>
        </div>

        {/* Asymmetrical Category Visual Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Large Hero Category Block: Audio */}
          <div
            onClick={() => navigate('/search?category=Earbuds')}
            className="md:col-span-8 group relative rounded-2xl overflow-hidden bg-ink-850 border border-ink-750 p-6 sm:p-10 cursor-pointer min-h-[300px] sm:min-h-[380px] flex flex-col justify-between shadow-card hover:border-spark-500/50 transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"
              alt="Audio & Earbuds"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-25 group-hover:opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/90 border border-ink-750 px-3 py-1 text-xs font-semibold text-mist-100 backdrop-blur-md">
                Acoustic Hardware
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-mist-400 group-hover:text-spark-500 group-hover:bg-white transition-all shadow-sm">
                <ArrowUpRight size={16} />
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-spark-500">Audio Category</span>
              <h3 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100">
                Earbuds & Studio Headphones
              </h3>
              <p className="text-xs sm:text-sm text-mist-400 max-w-lg font-light leading-relaxed">
                Active noise cancellation, audiophile titanium drivers, and true-wireless battery longevity.
              </p>
            </div>
          </div>

          {/* Side Column: Laptops */}
          <div
            onClick={() => navigate('/search?category=Laptops')}
            className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-ink-850 border border-ink-750 p-6 sm:p-8 cursor-pointer min-h-[300px] sm:min-h-[380px] flex flex-col justify-between shadow-card hover:border-spark-500/50 transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
              alt="Laptops"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-25 group-hover:opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/90 border border-ink-750 px-3 py-1 text-xs font-semibold text-mist-100 backdrop-blur-md">
                Computing
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-mist-400 group-hover:text-spark-500 transition-all shadow-sm">
                <ArrowUpRight size={16} />
              </span>
            </div>

            <div className="relative z-10 space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-spark-500">Portable Workstations</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-mist-100">
                Laptops for Devs & Students
              </h3>
              <p className="text-xs text-mist-400 font-light">
                High-RAM configurations, 12-hour batteries, and lightweight unibody designs.
              </p>
            </div>
          </div>

          {/* Row 2: Smartphones, Smartwatches, Running Shoes */}
          <div
            onClick={() => navigate('/search?category=Smartphones')}
            className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-ink-850 border border-ink-750 p-6 cursor-pointer min-h-[220px] flex flex-col justify-between shadow-card hover:border-spark-500/50 transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
              alt="Smartphones"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent" />
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-xs font-semibold text-mist-400">Flagships & Mid-Rangers</span>
              <ArrowUpRight size={15} className="text-mist-400 group-hover:text-spark-500" />
            </div>
            <div className="relative z-10">
              <h4 className="font-editorial text-xl font-bold text-mist-100">Smartphones</h4>
              <p className="text-xs text-mist-400 mt-1">OLED 144Hz, OIS cameras & fast charging</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/search?category=Smartwatches')}
            className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-ink-850 border border-ink-750 p-6 cursor-pointer min-h-[220px] flex flex-col justify-between shadow-card hover:border-spark-500/50 transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
              alt="Smartwatches"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent" />
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-xs font-semibold text-mist-400">Wearable Tech</span>
              <ArrowUpRight size={15} className="text-mist-400 group-hover:text-spark-500" />
            </div>
            <div className="relative z-10">
              <h4 className="font-editorial text-xl font-bold text-mist-100">Smartwatches</h4>
              <p className="text-xs text-mist-400 mt-1">Curved AMOLED, SpO2 & 14-day endurance</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/search?category=Shoes')}
            className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-ink-850 border border-ink-750 p-6 cursor-pointer min-h-[220px] flex flex-col justify-between shadow-card hover:border-spark-500/50 transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
              alt="Shoes"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent" />
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-xs font-semibold text-mist-400">Footwear</span>
              <ArrowUpRight size={15} className="text-mist-400 group-hover:text-spark-500" />
            </div>
            <div className="relative z-10">
              <h4 className="font-editorial text-xl font-bold text-mist-100">Running & Sneakers</h4>
              <p className="text-xs text-mist-400 mt-1">Rebound EVA nitrogen foam & daily trainers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 6. EDITORIAL PRODUCT SHOWCASE ----------------- */}
      <section className="container-page py-16 sm:py-24 border-t border-ink-750">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-signal-500 flex items-center gap-1.5">
              <TrendingUp size={14} />
              Editorial Product Showcase
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100 mt-1">
              Top-ranked catalog picks.
            </h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-spark-500 hover:text-spark-600 transition-colors"
          >
            View full catalog <ArrowRight size={14} />
          </Link>
        </div>

        {/* Editorial Layout: Featured Spotlight Card + Supporting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Spotlight Hero Product */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-ink-750 hover:border-spark-500/60 p-6 sm:p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-ink-850 border border-ink-750">
              <img
                src={spotlightProduct.image_url}
                alt={spotlightProduct.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 border border-signal-500/30 px-3 py-1 text-xs font-bold text-signal-500 shadow-sm backdrop-blur-sm">
                <Sparkles size={12} />
                <span>#1 Editor's Match · {spotlightProduct.match_score}%</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-mist-500">
                <span className="uppercase font-bold tracking-wider">{spotlightProduct.brand}</span>
                <span>{spotlightProduct.category}</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-mist-100 leading-tight">
                {spotlightProduct.name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-mist-400">
                <div className="flex items-center text-deal-500">
                  <Star size={13} className="fill-current" />
                  <span className="ml-1 font-semibold text-mist-100">{spotlightProduct.rating}</span>
                </div>
                <span>·</span>
                <span>{spotlightProduct.review_count?.toLocaleString('en-IN')} verified reviews</span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-mist-100">
                  ₹{spotlightProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-mist-500 line-through">
                  ₹{spotlightProduct.original_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-deal-500">
                  {spotlightProduct.discount_percent}% off
                </span>
              </div>

              <p className="text-xs sm:text-sm text-mist-400 font-light leading-relaxed">
                {spotlightProduct.description}
              </p>

              {/* Match reasons checklist */}
              <div className="rounded-xl bg-ink-850 border border-ink-750 p-3 space-y-1.5 text-xs text-mist-300">
                {spotlightProduct.match_reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={13} className="text-signal-500 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setQuickViewProduct(spotlightProduct)}
                  className="flex-1 rounded-xl bg-spark-500 py-3 text-xs sm:text-sm font-bold text-white hover:bg-spark-600 transition-colors shadow-sm"
                >
                  Quick Inspect
                </button>
                <Link
                  to={`/product/${spotlightProduct.id}`}
                  className="rounded-xl border border-ink-750 bg-ink-850 px-4 py-3 text-xs font-semibold text-mist-400 hover:text-spark-500 hover:bg-white hover:border-spark-500/30 transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>

          {/* Supporting Trio Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {trendingSubProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- 7. CINEMATIC CLOSING BANNER ----------------- */}
      <section className="container-page pb-20 sm:pb-28">
        <div className="relative rounded-3xl overflow-hidden border border-ink-750 bg-ink-850 p-8 sm:p-14 text-center shadow-card">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-spark-500/30 px-3.5 py-1 text-xs font-bold text-spark-500 shadow-sm">
              <Sparkles size={13} /> Ready to experience intelligent shopping?
            </span>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-mist-100 tracking-tight leading-tight">
              Describe it once. <br />
              <span className="italic font-display font-normal text-spark-500">We'll find the rest.</span>
            </h2>

            <p className="text-xs sm:text-base text-mist-400 font-light leading-relaxed">
              Start with a single sentence. ShopSmart handles the catalog parsing, rating validation, and rank-ordering from there.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/assistant')}
                className="w-full sm:w-auto rounded-full bg-spark-500 hover:bg-spark-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Talk to ShopSmart AI</span>
              </button>

              <button
                onClick={() => navigate('/search')}
                className="w-full sm:w-auto rounded-full bg-white hover:bg-ink-800 border border-ink-750 px-6 py-3.5 text-xs sm:text-sm font-semibold text-mist-400 hover:text-spark-500 transition-all"
              >
                Browse Full Catalog
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
