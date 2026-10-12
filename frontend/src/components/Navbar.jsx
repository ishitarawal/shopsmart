import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Sparkles, Heart, User, GitCompare, Menu, X, ArrowUpRight, Search } from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Explore & Search' },
  { to: '/assistant', label: 'AI Assistant', highlight: true },
  { to: '/compare', label: 'Compare' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { wishlist, compareList, backendHealth } = useShop()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-ink-750 shadow-sm py-2.5'
            : 'bg-white/90 backdrop-blur-md border-b border-ink-750/80 py-3.5'
        }`}
      >
        <div className="container-page flex items-center justify-between">
          {/* Brand Logo & Health Status */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-spark-50 text-spark-500 border border-spark-500/30 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-spark-500">
                <Sparkles size={17} className="transition-transform duration-500 group-hover:rotate-12" />
                <span className="absolute -inset-0.5 rounded-xl bg-spark-500/10 blur-sm pointer-events-none group-hover:bg-spark-500/20" />
              </span>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-bold tracking-tight text-mist-100 group-hover:text-spark-500 transition-colors">
                  ShopSmart
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-spark-500/80 -mt-1 hidden sm:block">
                  AI Shopping Assistant
                </span>
              </div>
            </Link>

            {backendHealth?.checked && (
              <div
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-ink-850 border-ink-750"
                title={backendHealth.healthy ? 'ShopSmart AI backend is active & healthy' : 'ShopSmart AI is temporarily unavailable'}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    backendHealth.healthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className={backendHealth.healthy ? 'text-mist-200' : 'text-rose-500'}>
                  {backendHealth.healthy ? 'AI Live' : 'AI Offline'}
                </span>
              </div>
            )}
          </div>

          {/* Centered Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-ink-850 border border-ink-750 p-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-spark-500 text-white shadow-sm font-bold'
                      : link.highlight
                      ? 'text-signal-500 hover:text-signal-600 hover:bg-white'
                      : 'text-mist-400 hover:text-mist-100 hover:bg-white'
                  }`
                }
              >
                {link.highlight && <Sparkles size={11} className="inline -mt-0.5 text-current animate-pulse-subtle" />}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons: Compare, Wishlist, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare shortcut */}
            <Link
              to="/compare"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink-850 border border-ink-750 text-mist-400 hover:text-spark-500 hover:border-spark-500/40 hover:bg-white transition-all"
              aria-label="Compare"
              title="Product Comparison"
            >
              <GitCompare size={16} />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-spark-500 px-1 text-[10px] font-bold text-white">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Wishlist shortcut */}
            <Link
              to="/wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink-850 border border-ink-750 text-mist-400 hover:text-signal-500 hover:border-signal-500/40 hover:bg-white transition-all"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart size={16} className={wishlist.length > 0 ? 'text-signal-500 fill-signal-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-signal-500 px-1 text-[10px] font-bold text-white animate-scale-in">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Profile shortcut */}
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-850 border border-ink-750 text-mist-400 hover:text-mist-100 hover:border-mist-500 hover:bg-white transition-all"
              aria-label="Profile and preferences"
              title="User preferences"
            >
              <User size={16} />
            </Link>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-ink-850 border border-ink-750 text-mist-300 hover:text-spark-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[61px] z-40 bg-white/98 backdrop-blur-xl md:hidden animate-fade-in flex flex-col p-6 border-b border-ink-750">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-spark-500 text-white font-bold'
                      : 'text-mist-200 hover:bg-ink-850 hover:text-spark-500'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  {link.highlight && <Sparkles size={16} className="text-signal-500" />}
                  {link.label}
                </span>
                <ArrowUpRight size={16} className="opacity-50" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-ink-750 flex justify-between items-center text-xs text-mist-500">
            <span>ShopSmart Natural Language AI</span>
            <Link to="/profile" className="text-spark-500 font-semibold hover:underline">
              Preferences
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
