import { Link } from 'react-router-dom'
import { Sparkles, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-ink-750 bg-ink-850 pt-16 pb-12 mt-auto">
      <div className="container-page">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-ink-750">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-spark-50 text-spark-500 border border-spark-500/30">
                <Sparkles size={16} />
              </span>
              <span className="font-editorial text-2xl font-bold tracking-tight text-mist-100">
                ShopSmart
              </span>
            </Link>

            <p className="max-w-md text-sm text-mist-400 leading-relaxed font-light">
              Natural Language Shopping Assistant. Tell us what you need in plain, human words — we extract requirements, rank real products, and help you decide with transparent AI reasoning.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-mist-500">
              <span className="flex items-center gap-1.5 text-signal-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-signal-500 animate-pulse" />
                AI Inference Ready
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} /> Demo & Live API Mode
              </span>
            </div>
          </div>

          {/* Column: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-mist-100">Platform Experience</p>
            <ul className="space-y-2 text-sm text-mist-400 font-medium">
              <li>
                <Link to="/" className="hover:text-spark-500 transition-colors">
                  Overview & Showcase
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-spark-500 transition-colors">
                  Conversational Search
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-spark-500 transition-colors flex items-center gap-1">
                  ShopSmart AI Assistant
                  <Sparkles size={12} className="text-signal-500" />
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-spark-500 transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-spark-500 transition-colors">
                  Your Picks & Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-spark-500 transition-colors">
                  User Preferences & Budget
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Popular Categories */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-mist-100">Catalog Categories</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-mist-400 font-medium">
              <Link to="/search?category=Earbuds" className="hover:text-spark-500 transition-colors">
                Wireless Earbuds
              </Link>
              <Link to="/search?category=Laptops" className="hover:text-spark-500 transition-colors">
                Laptops & Ultrabooks
              </Link>
              <Link to="/search?category=Smartphones" className="hover:text-spark-500 transition-colors">
                Smartphones
              </Link>
              <Link to="/search?category=Headphones" className="hover:text-spark-500 transition-colors">
                Studio Headphones
              </Link>
              <Link to="/search?category=Smartwatches" className="hover:text-spark-500 transition-colors">
                Fitness Smartwatches
              </Link>
              <Link to="/search?category=Shoes" className="hover:text-spark-500 transition-colors">
                Running Shoes
              </Link>
              <Link to="/search?category=Home%20%26%20Kitchen" className="hover:text-spark-500 transition-colors">
                Home & Kitchen
              </Link>
              <Link to="/search?category=Fashion" className="hover:text-spark-500 transition-colors">
                Apparel & Fashion
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mist-400">
          <p>© {new Date().getFullYear()} ShopSmart Inc. Engineered with modern editorial commerce aesthetics.</p>
          <div className="flex items-center gap-6">
            <span>Powered by FastAPI & React 18</span>
            <span>·</span>
            <span>Zero Tracking Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
