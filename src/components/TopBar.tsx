import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabaseClient'
import '../styles/account-menu.css'

type TopbarProps = {
  currentPage: string
  onAdd?: () => void
}

function Topbar({ currentPage, onAdd }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="topbar">
      <div className="crumbs">
        <span>Univers</span>
        <span className="sep">/</span>
        <span className="here">{currentPage}</span>
      </div>
      <div className="topbar-right">
        <div className="account" ref={menuRef}>
          <button className="user-pill" onClick={() => setMenuOpen((open) => !open)}>
            <div className="avatar kpop">A</div>
            <span className="label">Mon compte</span>
          </button>
          {menuOpen && (
            <div className="account-menu">
              <Link
                to="/parametres"
                className="account-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                Paramètres
              </Link>
              <button
                className="account-menu-item"
                onClick={() => supabase.auth.signOut()}
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
        {onAdd && (
          <button className="btn-add" onClick={onAdd}>
            <span className="plus">+</span>
            Ajouter
          </button>
        )}
      </div>
    </div>
  )
}

export default Topbar