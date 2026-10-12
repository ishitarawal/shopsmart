export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-ink-900 border border-ink-800 shadow-card overflow-hidden animate-pulse">
      {/* Aspect square image placeholder */}
      <div className="relative aspect-square w-full bg-ink-850">
        <div className="absolute top-3 left-3 h-5 w-20 rounded-full bg-ink-800" />
        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-ink-800" />
      </div>

      {/* Content lines */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
        <div>
          <div className="h-3 w-16 rounded bg-ink-800" />
          <div className="mt-2 h-4 w-5/6 rounded bg-ink-800" />
          <div className="mt-1 h-4 w-3/4 rounded bg-ink-800" />

          <div className="mt-3 flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-ink-800" />
            <div className="h-3 w-24 rounded bg-ink-800" />
          </div>

          <div className="mt-3 h-6 w-28 rounded bg-ink-800" />

          <div className="mt-3 h-7 w-full rounded bg-ink-850" />
        </div>

        <div className="pt-3 border-t border-ink-800/80 flex gap-2">
          <div className="h-8 flex-1 rounded-lg bg-ink-800" />
          <div className="h-8 w-16 rounded-lg bg-ink-800" />
        </div>
      </div>
    </div>
  )
}
