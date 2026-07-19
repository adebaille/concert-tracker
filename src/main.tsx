import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './styles/system.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import ConcertsPage from './pages/ConcertsPage.tsx'
import GroupesPage from './pages/GroupesPage.tsx'
import WishlistPage from './pages/WishlistPage.tsx'
import MerchPage from './pages/MerchPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="concerts" element={<ConcertsPage />} />
          <Route path="groupes" element={<GroupesPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="merch" element={<MerchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)