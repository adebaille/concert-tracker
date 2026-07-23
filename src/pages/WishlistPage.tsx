import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { resolveParticipants } from '../lib/participants'
import '../styles/wishlist.css'
import '../styles/form.css'
import Topbar from '../components/TopBar'
import DreamCard from '../components/DreamCard'
import ReveForm from '../components/ReveForm'
import type { Reve, Profil } from '../types'

const COLUMNS = [
  { priority: 'ultime' as const, icon: '🌙', label: 'Rêve ultime', unit: 'rêves' },
  { priority: 'haute' as const, icon: '🔥', label: 'Haute', unit: 'envies' },
  { priority: 'moyenne' as const, icon: '💛', label: 'Moyenne', unit: 'envies' },
]

function WishlistPage() {
  const [reves, setReves] = useState<Reve[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReve, setEditingReve] = useState<Reve | null>(null)
  const [activeFilter, setActiveFilter] = useState<'toutes' | 'ultime' | 'haute' | 'moyenne'>('toutes')
  const [searchQuery, setSearchQuery] = useState('')

  async function loadReves() {
    const [{ data: reveRows }, { data: profilRows }] = await Promise.all([
      supabase.from('reves').select('*'),
      supabase.from('profils').select('*'),
    ])

    const profils = (profilRows ?? []) as Profil[]

    const formatted: Reve[] = (reveRows ?? []).map((row) => ({
      id: row.id,
      priority: row.priority,
      genre: row.genre,
      title: row.title,
      subtitle: row.subtitle ?? '',
      dateValue: row.date_value ?? '',
      budget: row.budget ?? 0,
      note: row.note ?? '',
      isWatched: row.is_watched,
      isShared: row.is_shared,
      participants: resolveParticipants(profils, row.added_by, row.is_shared),
    }))

    setReves(formatted)
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState après await, donc pas synchrone
    loadReves()
  }, [])

  function openCreateForm() {
    setEditingReve(null)
    setIsFormOpen(true)
  }

  function openEditForm(reve: Reve) {
    setEditingReve(reve)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingReve(null)
  }

  async function handleDelete(reve: Reve) {
    const confirmed = window.confirm(
      `Supprimer « ${reve.title} » ? Cette action est définitive.`
    )
    if (!confirmed) return

    const { error } = await supabase.from('reves').delete().eq('id', reve.id)

    if (error) {
      window.alert('Suppression impossible : ' + error.message)
      return
    }

    loadReves()
  }

  const searchedReves = reves.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ultimeCount = reves.filter((r) => r.priority === 'ultime').length
  const hauteCount = reves.filter((r) => r.priority === 'haute').length
  const moyenneCount = reves.filter((r) => r.priority === 'moyenne').length
  const totalBudget = reves.reduce((total, r) => total + r.budget, 0)

  const visibleColumns = COLUMNS.filter(
    (col) => activeFilter === 'toutes' || activeFilter === col.priority
  )

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Wishlist" />
        <p style={{ padding: 24 }}>Chargement de la wishlist...</p>
      </>
    )
  }

  return (
    <>
      <Topbar currentPage="Wishlist" onAdd={openCreateForm} />

      <div className="page-head">
        <h1 className="page-title"><span className="accent">Wishlist</span> · les rêves</h1>
        <div className="page-sub">
          <span>{reves.length} concerts rêvés</span><span className="dot"></span>
          <span>{ultimeCount} rêves ultimes</span><span className="dot"></span>
          <span>{hauteCount} hautes priorités</span><span className="dot"></span>
          <span>{moyenneCount} envies modérées</span>
        </div>
      </div>

      <section className="wl-summary">
        <div className="wl-stat">
          <div className="ico-circle">🌙</div>
          <div className="body">
            <div className="v">{String(ultimeCount).padStart(2, '0')}</div>
            <div className="l">Rêves ultimes</div>
          </div>
        </div>
        <div className="wl-stat">
          <div className="ico-circle">🔥</div>
          <div className="body">
            <div className="v">{String(hauteCount).padStart(2, '0')}</div>
            <div className="l">Priorité haute</div>
          </div>
        </div>
        <div className="wl-stat">
          <div className="ico-circle">💛</div>
          <div className="body">
            <div className="v">{String(moyenneCount).padStart(2, '0')}</div>
            <div className="l">Priorité moyenne</div>
          </div>
        </div>
        <div className="wl-stat">
          <div className="ico-circle">💸</div>
          <div className="body">
            <div className="v">{totalBudget.toLocaleString('fr-FR')} €</div>
            <div className="l">Budget rêvé total</div>
          </div>
        </div>
      </section>

      <div className="filters">
        <button className={`filter-chip ${activeFilter === 'toutes' ? 'active' : ''}`} onClick={() => setActiveFilter('toutes')}>
          Toutes <span className="count">{reves.length}</span>
        </button>
        <button className={`filter-chip ${activeFilter === 'ultime' ? 'active' : ''}`} onClick={() => setActiveFilter('ultime')}>
          Rêve ultime <span className="count">{ultimeCount}</span>
        </button>
        <button className={`filter-chip ${activeFilter === 'haute' ? 'active' : ''}`} onClick={() => setActiveFilter('haute')}>
          Haute <span className="count">{hauteCount}</span>
        </button>
        <button className={`filter-chip ${activeFilter === 'moyenne' ? 'active' : ''}`} onClick={() => setActiveFilter('moyenne')}>
          Moyenne <span className="count">{moyenneCount}</span>
        </button>
        <div className="filter-sep"></div>
        <div className="filter-search">
          <input
            placeholder="Chercher un rêve…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="wl-board">
        {visibleColumns.map((col) => {
          const columnReves = searchedReves.filter((r) => r.priority === col.priority)
          return (
            <div key={col.priority} className={`wl-col ${col.priority}`}>
              <div className="wl-col-head">
                <div className="wl-col-title">
                  <div className="icon-circle">{col.icon}</div>
                  {col.label}
                </div>
                <div className="wl-col-count">
                  {String(columnReves.length).padStart(2, '0')} {col.unit}
                </div>
              </div>
              {columnReves.map((reve) => (
                <DreamCard
                  key={reve.id}
                  reve={reve}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        })}
      </section>

      {isFormOpen && (
        <ReveForm
          reve={editingReve}
          onClose={closeForm}
          onSaved={loadReves}
        />
      )}
    </>
  )
}

export default WishlistPage