import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'
import { DEMO_PRODUCTS } from '../data/demoFallback.js'

const ShopContext = createContext()

const DEMO_USER_ID = 1

export function ShopProvider({ children }) {
  // Wishlist state initialized from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('shopsmart_wishlist')
      return stored ? JSON.parse(stored) : [DEMO_PRODUCTS[0], DEMO_PRODUCTS[3]]
    } catch {
      return [DEMO_PRODUCTS[0], DEMO_PRODUCTS[3]]
    }
  })

  // Compare state (up to 4 products)
  const [compareList, setCompareList] = useState(() => {
    try {
      const stored = localStorage.getItem('shopsmart_compare')
      return stored ? JSON.parse(stored) : [DEMO_PRODUCTS[0], DEMO_PRODUCTS[1]]
    } catch {
      return [DEMO_PRODUCTS[0], DEMO_PRODUCTS[1]]
    }
  })

  // Active product for quick view modal
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Floating compare tray collapsed/expanded
  const [compareTrayOpen, setCompareTrayOpen] = useState(false)

  // Backend health status from GET /health
  const [backendHealth, setBackendHealth] = useState({
    checked: false,
    healthy: false,
    modelLoaded: false,
    datasetLoaded: false,
    productsIndexed: 0,
    error: null,
  })

  // Toast notifications
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  // Periodic/initial health check of Colab backend via GET /health
  useEffect(() => {
    let cancelled = false
    api.healthCheck()
      .then((data) => {
        if (cancelled) return
        setBackendHealth({
          checked: true,
          healthy: data.status === 'healthy',
          modelLoaded: Boolean(data.model_loaded),
          datasetLoaded: Boolean(data.dataset_loaded),
          productsIndexed: data.products_indexed || 0,
          error: null,
        })
      })
      .catch((err) => {
        if (cancelled) return
        setBackendHealth({
          checked: true,
          healthy: false,
          modelLoaded: false,
          datasetLoaded: false,
          productsIndexed: 0,
          error: 'ShopSmart AI is temporarily unavailable. Please try again in a moment.',
        })
      })
    return () => { cancelled = true }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shopsmart_wishlist', JSON.stringify(wishlist))
    } catch (e) {
      console.warn('Could not persist wishlist:', e)
    }
  }, [wishlist])

  useEffect(() => {
    try {
      localStorage.setItem('shopsmart_compare', JSON.stringify(compareList))
    } catch (e) {
      console.warn('Could not persist compare list:', e)
    }
  }, [compareList])

  // Sync with backend wishlist if possible
  useEffect(() => {
    let cancelled = false
    api.getWishlist(DEMO_USER_ID)
      .then((items) => {
        if (!cancelled && Array.isArray(items) && items.length > 0) {
          setWishlist(items)
        }
      })
      .catch(() => {
        // Backend offline or demo mode: keep localStorage state
      })
    return () => { cancelled = true }
  }, [])

  // Wishlist toggling - Grounded SKU ID matching
  const toggleWishlist = async (product) => {
    const pId = product.sku_id || product.id
    const pName = product.product_name || product.name || 'Product'
    const exists = wishlist.some((p) => (p.sku_id || p.id) === pId || p.id === pId || p.sku_id === pId)
    if (exists) {
      setWishlist((prev) => prev.filter((p) => (p.sku_id || p.id) !== pId && p.id !== pId && p.sku_id !== pId))
      addToast(`Removed "${pName}" from your picks`, 'default')
      api.removeFromWishlist(DEMO_USER_ID, pId).catch(() => {})
    } else {
      setWishlist((prev) => [product, ...prev])
      addToast(`Saved "${pName}" to your picks`, 'success')
      api.addToWishlist(DEMO_USER_ID, pId).catch(() => {})
    }
  }

  const isInWishlist = (productId) =>
    wishlist.some((p) => (p.sku_id || p.id) === productId || p.id === productId || p.sku_id === productId)

  // Compare toggling - Grounded SKU ID matching
  const toggleCompare = (product) => {
    const pId = product.sku_id || product.id
    const pName = product.product_name || product.name || 'Product'
    const exists = compareList.some((p) => (p.sku_id || p.id) === pId || p.id === pId || p.sku_id === pId)
    if (exists) {
      setCompareList((prev) => prev.filter((p) => (p.sku_id || p.id) !== pId && p.id !== pId && p.sku_id !== pId))
      addToast(`Removed "${pName}" from comparison`, 'default')
    } else {
      if (compareList.length >= 4) {
        addToast('You can compare up to 4 items at once. Remove one first.', 'warning')
        return
      }
      setCompareList((prev) => [...prev, product])
      setCompareTrayOpen(true)
      addToast(`Added "${pName}" to compare (${compareList.length + 1}/4)`, 'success')
    }
  }

  const removeFromCompare = (productId) => {
    setCompareList((prev) =>
      prev.filter((p) => (p.sku_id || p.id) !== productId && p.id !== productId && p.sku_id !== productId)
    )
  }

  const clearCompare = () => {
    setCompareList([])
    setCompareTrayOpen(false)
  }

  const isInCompare = (productId) =>
    compareList.some((p) => (p.sku_id || p.id) === productId || p.id === productId || p.sku_id === productId)

  return (
    <ShopContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        quickViewProduct,
        setQuickViewProduct,
        compareTrayOpen,
        setCompareTrayOpen,
        toasts,
        addToast,
        backendHealth,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}
