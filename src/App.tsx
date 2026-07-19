import { NavLink, Outlet } from 'react-router'

const NAV_ITEMS = [
  { id: 'accueil', label: 'Accueil', to: '/' },
  { id: 'concerts', label: 'Concerts & Festivals', to: '/concerts' },
  { id: 'groupes', label: 'Groupes', to: '/groupes' },
  { id: 'wishlist', label: 'Wishlist', to: '/wishlist' },
  { id: 'merch', label: 'Inventaire Merch', to: '/merch' },
]

function App() {
  return (
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="duo">
          <div className="duo-row">
            <div className="avatars">
              <div className="avatar metal" title="Alison">A</div>
              <div className="avatar kpop" title="Emeline">E</div>
            </div>
            <div className="duo-text">
              <div className="who">Alison &amp; Emeline</div>
            </div>
            <div className="status-dot" title="Alison est en ligne"></div>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default App