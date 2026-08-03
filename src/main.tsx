import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './styles/system.css'
import './styles/responsive.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import ConcertsPage from './pages/ConcertsPage.tsx'
import GroupesPage from './pages/GroupesPage.tsx'
import GroupDetailPage from './pages/GroupDetailPage.tsx'
import WishlistPage from './pages/WishlistPage.tsx'
import MerchPage from './pages/MerchPage.tsx'
import ParametresPage from './pages/ParametresPage.tsx'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="concerts" element={<ConcertsPage />} />
          <Route path="groupes" element={<GroupesPage />} />
          <Route path="groupes/:id" element={<GroupDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="merch" element={<MerchPage />} />
          <Route path="parametres" element={<ParametresPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)