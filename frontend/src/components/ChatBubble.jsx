import { Sparkles, User } from 'lucide-react'

export function ChatBubble({ role, children, timestamp }) {
  const isUser = role === 'user'

  return (
    <div className={`flex items-start gap-3 sm:gap-3.5 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
      {/* Avatar Icon */}
      <div
        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform ${
          isUser
            ? 'bg-spark-50 text-spark-500 border-spark-500/30'
            : 'bg-ink-850 text-signal-500 border-signal-500/30 shadow-sm'
        }`}
      >
        {isUser ? <User size={15} /> : <Sparkles size={16} />}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[78%]`}>
        <div
          className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-[15px] leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'rounded-tr-sm bg-spark-500 text-white font-medium'
              : 'rounded-tl-sm bg-ink-850 border border-ink-750 text-mist-100'
          }`}
        >
          {children}
        </div>

        {/* Timestamp / Role Label */}
        <span className="mt-1 px-1 text-[10px] text-mist-500 font-medium tracking-wider uppercase">
          {isUser ? 'You' : 'ShopSmart AI'}
        </span>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 sm:gap-3.5 animate-fade-in-up">
      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-ink-850 text-signal-500 border border-signal-500/30 shadow-sm">
        <Sparkles size={16} className="animate-spin text-signal-500 [animation-duration:4s]" />
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-ink-850 border border-ink-750 px-4 py-3.5 shadow-sm">
        <span className="text-xs text-mist-400 font-medium mr-2">ShopSmart is thinking</span>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal-500 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-spark-500 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist-400" />
      </div>
    </div>
  )
}
