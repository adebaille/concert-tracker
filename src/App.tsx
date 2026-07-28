import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Home, Ticket, Music, Star, ShoppingBag } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import LoginPage from './pages/LoginPage'

const NAV_ITEMS = [
  { id: 'accueil', label: 'Accueil', to: '/', icon: Home },
  { id: 'concerts', label: 'Concerts & Festivals', to: '/concerts', icon: Ticket },
  { id: 'groupes', label: 'Groupes', to: '/groupes', icon: Music },
  { id: 'wishlist', label: 'Wishlist', to: '/wishlist', icon: Star },
  { id: 'merch', label: 'Merch', to: '/merch', icon: ShoppingBag },
]

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsCheckingSession(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (isCheckingSession) {
    return null
  }

  if (!session) {
    return <LoginPage />
  }

  return (
    <>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"></div>
            <div>
              <div className="brand-name">NOTRE UNIVERS</div>
              <div className="brand-sub">Musical · v1.0</div>
            </div>
          </div>

          <div className="nav-label">Sections</div>
          <nav className="nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="ico" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-spacer"></div>

          <div className="duo">
            <div className="duo-row">
              <div className="avatars">
                <div className="avatar metal" title="Emeline">E</div>
                <div className="avatar kpop" title="Alison">A</div>
              </div>
              <div className="duo-text">
                <div className="who">Alison &amp; Emeline</div>
                <div className="since">DEPUIS 2024</div>
              </div>
              <div className="status-dot" title="Connectée"></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="ico" />
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default App