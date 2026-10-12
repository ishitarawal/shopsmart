import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Sparkles, RefreshCw, Zap, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble.jsx'
import ProductCard from '../components/ProductCard.jsx'
import api from '../services/api.js'
import { DEMO_PRODUCTS } from '../data/demoFallback.js'

const STARTER_PROMPTS = [
  'I need wireless earbuds under ₹3,000 with long battery life for traveling',
  'A lightweight laptop under ₹80,000 for coding and college',
  'Flagship camera smartphone under ₹40,000',
  'Running shoes under ₹5,000 with responsive cushioning',
]

function getOrCreateSessionId() {
  try {
    let sid = sessionStorage.getItem('shopsmart_chat_session_id')
    if (!sid) {
      sid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `session_${Math.random().toString(36).slice(2)}_${Date.now()}`
      sessionStorage.setItem('shopsmart_chat_session_id', sid)
    }
    return sid
  } catch {
    return `session_${Math.random().toString(36).slice(2)}_${Date.now()}`
  }
}

// Local mock assistant fallback (used only if backend cannot be reached)
function mockAssistantReply(message, known) {
  const text = message.toLowerCase()
  const merged = { ...known }

  if (!merged.category) {
    if (text.includes('earbud') || text.includes('tws') || text.includes('airpod')) merged.category = 'earbuds'
    else if (text.includes('laptop') || text.includes('macbook') || text.includes('notebook')) merged.category = 'laptops'
    else if (text.includes('shoe') || text.includes('sneaker') || text.includes('runner')) merged.category = 'shoes'
    else if (text.includes('headphone')) merged.category = 'headphones'
    else if (text.includes('phone') || text.includes('mobile')) merged.category = 'smartphones'
    else if (text.includes('watch')) merged.category = 'smartwatches'
  }

  const budgetMatch = text.match(/(?:under|below|budget|within|₹|rs\.?)\s*(\d{3,6})/i) || text.match(/(\d{3,6})/)
  if (!merged.budget && budgetMatch) merged.budget = Number(budgetMatch[1])
  if (!merged.preferences) merged.preferences = []

  ;['battery life', 'battery', 'lightweight', 'noise cancellation', 'anc', 'bass', 'camera', 'coding', 'gym', 'travel'].forEach((p) => {
    if (text.includes(p) && !merged.preferences.includes(p)) merged.preferences.push(p)
  })

  // Filter relevant demo products
  let matched = DEMO_PRODUCTS
  if (merged.category) {
    const catLower = merged.category.toLowerCase()
    matched = DEMO_PRODUCTS.filter((p) => p.category.toLowerCase().includes(catLower.slice(0, 4)))
  }
  if (merged.budget) {
    const budgetFiltered = matched.filter((p) => p.price <= merged.budget * 1.15)
    if (budgetFiltered.length > 0) matched = budgetFiltered
  }

  if (merged.category && merged.budget) {
    return {
      reply: `Understood! I identified your requirements: ${merged.category} under ₹${merged.budget.toLocaleString('en-IN')}${
        merged.preferences.length ? ' prioritizing ' + merged.preferences.join(', ') : ''
      }. Here are the highest-ranked verified options from our catalog:`,
      requirements: merged,
      needsClarification: false,
      suggestions: ['Compare these options', 'Show me something cheaper', 'What about battery life?'],
      products: matched.slice(0, 3),
    }
  }

  if (!merged.category) {
    return {
      reply: "Hello! I'm your ShopSmart shopping concierge. What product category are you looking for today? (e.g. Wireless earbuds, ultrabook laptop, running shoes, etc.)",
      requirements: merged,
      needsClarification: true,
      suggestions: ['Wireless Earbuds', 'Coding Laptop', 'Smartwatch', 'Running Shoes'],
      products: [],
    }
  }

  return {
    reply: `Excellent choice. What is your preferred budget ceiling for these ${merged.category}?`,
    requirements: merged,
    needsClarification: true,
    suggestions: ['Under ₹3,000', 'Under ₹5,000', 'Under ₹30,000', 'Under ₹80,000'],
    products: [],
  }
}

export default function AIAssistant() {
  const [params] = useSearchParams()
  const initialPrompt = params.get('prompt') || ''

  const [sessionId, setSessionId] = useState(getOrCreateSessionId)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Welcome to ShopSmart AI. I'm your conversational shopping co-pilot. Tell me what you're looking to purchase — your budget, environment, or specific must-haves.",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [suggestions, setSuggestions] = useState(STARTER_PROMPTS)
  const [usingFallback, setUsingFallback] = useState(false)
  const knownRef = useRef({})
  const endRef = useRef(null)
  const promptSentRef = useRef(false)

  // Auto scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Handle URL prompt if provided (e.g. from ProductDetails "Ask ShopSmart AI")
  useEffect(() => {
    if (initialPrompt && !promptSentRef.current) {
      promptSentRef.current = true
      send(initialPrompt)
    }
  }, [initialPrompt])

  const send = async (text) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setSuggestions([])

    try {
      // Connect to POST /chat
      const data = await api.sendChatMessage(sessionId, text, 5)
      setUsingFallback(false)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: data.reply,
          products: data.recommendations || data.products || [],
        },
      ])
      setSuggestions(['Show more like this', 'Compare top options', 'What about something cheaper?'])
    } catch {
      // If /chat threw an error (e.g. LLM runtime exception on Colab), gracefully query /recommend
      try {
        const recData = await api.recommendProducts(text, 3)
        if (recData.recommendations && recData.recommendations.length > 0) {
          setUsingFallback(false)
          setMessages((m) => [
            ...m,
            {
              role: 'assistant',
              text: `Here are grounded catalog options matching your request "${text}":`,
              products: recData.recommendations,
            },
          ])
          setSuggestions(['Compare these', 'Show something cheaper', 'Adjust budget'])
          return
        }
      } catch {
        // Fall through to polite local assistant
      }

      setUsingFallback(true)
      const mock = mockAssistantReply(text, knownRef.current)
      knownRef.current = mock.requirements
      // Add natural typing latency
      await new Promise((r) => setTimeout(r, 650))
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: mock.reply,
          products: mock.products || [],
        },
      ])
      setSuggestions(mock.suggestions || [])
    } finally {
      setTyping(false)
    }
  }

  const handleResetChat = () => {
    const newSid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `session_${Math.random().toString(36).slice(2)}_${Date.now()}`
    try {
      sessionStorage.setItem('shopsmart_chat_session_id', newSid)
    } catch {}
    setSessionId(newSid)
    knownRef.current = {}
    setMessages([
      {
        role: 'assistant',
        text: "New conversation initiated. What would you like to discover today?",
      },
    ])
    setSuggestions(STARTER_PROMPTS)
  }

  return (
    <div className="container-page flex flex-col h-[calc(100vh-5rem)] py-4 sm:py-6">
      {/* Top Header Card */}
      <div className="flex items-center justify-between border-b border-ink-750 bg-white rounded-2xl p-4 mb-4 border shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spark-50 text-spark-500 border border-spark-500/30 shadow-sm">
            <Sparkles size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-base sm:text-lg font-bold text-mist-100">
                ShopSmart AI Concierge
              </h1>
              <span className="rounded-full bg-signal-50 border border-signal-500/30 px-2 py-0.5 text-[10px] font-bold text-signal-500">
                {usingFallback ? 'Demo Mode' : 'Online'}
              </span>
            </div>
            <p className="text-xs text-mist-400 font-light">
              Autonomous requirement extraction & multi-factor recommendation engine
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 rounded-xl border border-ink-750 bg-ink-850 px-3 py-1.5 text-xs text-mist-400 hover:text-spark-500 hover:bg-white hover:border-spark-500/30 transition-colors"
          title="Start fresh session"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>

      {/* Conversation Thread Stream */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin">
        {messages.map((m, idx) => (
          <div key={idx} className="space-y-4">
            <ChatBubble role={m.role}>{m.text}</ChatBubble>

            {/* Inline Product Recommendations Grid */}
            {m.products?.length > 0 && (
              <div className="pl-12 sm:pl-14">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-spark-500 flex items-center gap-1.5">
                  <Zap size={13} />
                  Recommended Match Options ({m.products.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {m.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Suggested Follow-up Prompts Pills */}
      {suggestions.length > 0 && !typing && (
        <div className="pt-3 pb-2 flex flex-wrap gap-2 animate-fade-in">
          <span className="text-[11px] font-semibold text-mist-500 self-center hidden sm:inline">
            Suggested:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => send(s)}
              className="rounded-full bg-white border border-ink-750 px-3.5 py-1.5 text-xs text-mist-300 hover:text-spark-500 hover:border-spark-500/40 hover:bg-ink-850 transition-all text-left shadow-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Message Composer Input Form */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="relative flex items-center gap-2 rounded-2xl bg-white border border-ink-750 p-2 pl-4 sm:pl-5 shadow-card focus-within:border-spark-500 focus-within:ring-2 focus-within:ring-spark-500/20 transition-all"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your requirements (e.g. 'I want noise cancelling earbuds under ₹3,000')…"
            className="flex-1 bg-transparent py-2.5 text-sm sm:text-base text-mist-100 placeholder:text-mist-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-spark-500 hover:bg-spark-600 text-white font-bold transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
