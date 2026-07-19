import { Link, Outlet } from 'react-router'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '16px', padding: '20px' }}>
        <Link to="/">Accueil</Link>
        <Link to="/concerts">Concerts</Link>
        <Link to="/groupes">Groupes</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/merch">Merch</Link>
      </nav>
      <Outlet />
    </>
  )
}

export default App