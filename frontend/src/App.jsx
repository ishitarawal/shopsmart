import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import SearchResults from './pages/SearchResults.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Compare from './pages/Compare.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Profile from './pages/Profile.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import Toast from './components/Toast.jsx'
import CompareTray from './components/CompareTray.jsx'
import ProductModal from './components/ProductModal.jsx'

export default function App() {
  return (
    <ShopProvider>
      <div className="flex min-h-screen flex-col bg-ink-950 text-mist-100 selection:bg-spark-500/25 selection:text-spark-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
        <CompareTray />
        <ProductModal />
        <Toast />
      </div>
    </ShopProvider>
  )
}
