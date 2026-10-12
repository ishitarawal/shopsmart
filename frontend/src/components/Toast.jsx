import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'

export default function Toast() {
  const { toasts } = useShop()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-ink-750 text-mist-100 shadow-luxury backdrop-blur-xl animate-fade-in-up transition-all max-w-sm"
        >
          {t.type === 'success' && <CheckCircle2 size={16} className="text-signal-500 shrink-0" />}
          {t.type === 'warning' && <AlertCircle size={16} className="text-deal-500 shrink-0" />}
          {t.type === 'default' && <Info size={16} className="text-mist-400 shrink-0" />}
          {t.type === 'info' && <Sparkles size={16} className="text-spark-500 shrink-0" />}
          <p className="text-xs sm:text-sm font-medium tracking-wide">{t.message}</p>
        </div>
      ))}
    </div>
  )
}
