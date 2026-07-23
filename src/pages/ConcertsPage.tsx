import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatConcertDate } from '../lib/formatDate'
import { resolveParticipants } from '../lib/participants'
import '../styles/concerts.css'
import '../styles/form.css'
import Topbar from '../components/TopBar'
import ConcertCard from '../components/ConcertCard'
import ConcertForm from '../components/ConcertForm'
import type { Concert, Profil } from '../types'

function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null)
  const [activeFilter, setActiveFilter] = useState<'tous' | 'a-venir' | 'passes'>('tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grille' | 'liste'>('grille')

  async function loadConcerts() {
    const [{ data: concertRows }, { data: profilRows }] = await Promise.all([
      supabase.from('concerts').select('*'),
      supabase.from('profils').select('*'),
    ])

    const profils = (profilRows ?? []) as Profil[]

    const formatted: Concert[] = (concertRows ?? []).map((row) => ({
      id: row.id,
      genre: row.genre,
      status: row.status,
      type: row.type,
      eventDate: row.event_date,
      hasTickets: row.has_tickets,
      isShared: row.is_shared,
      photoLabel: `Photo · ${row.name}`,
      bigBg: row.name.toUpperCase(),
      date: formatConcertDate(row.event_date),
      price: row.price ?? 0,
      name: row.name,
      venue: row.venue,
      city: row.city,
      rating: row.rating ?? 0,
      participants: resolveParticipants(profils, row.added_by, row.is_shared),
      setlist: row.setlist ?? undefined,
      anecdote: row.anecdote ?? undefined,
    }))

    setConcerts(formatted)
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState après await, donc pas synchrone
    loadConcerts()
  }, [])

  function openCreateForm() {
    setEditingConcert(null)
    setIsFormOpen(true)
  }

  function openEditForm(concert: Concert) {
    setEditingConcert(concert)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingConcert(null)
  }

  async function handleDelete(concert: Concert) {
    const confirmed = window.confirm(
      `Supprimer « ${concert.name} » ? Cette action est définitive.`
    )
    if (!confirmed) return

    const { error } = await supabase.from('concerts').delete().eq('id', concert.id)

    if (error) {
      window.alert('Suppression impossible : ' + error.message)
      return
    }

    loadConcerts()
  }

  const filteredConcerts = concerts.filter((concert) => {
    const matchesStatusFilter =
      activeFilter === 'tous' ||
      (activeFilter === 'a-venir' && concert.status === 'prevu') ||
      (activeFilter === 'passes' && concert.status === 'passe')

    const query = searchQuery.toLowerCase()
    const matchesSearch =
      concert.name.toLowerCase().includes(query) ||
      concert.venue.toLowerCase().includes(query) ||
      concert.city.toLowerCase().includes(query)

    return matchesStatusFilter && matchesSearch
  })

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Concerts & Festivals" />
        <p style={{ padding: 24 }}>Chargement des concerts...</p>
      </>
    )
  }

  return (
    <>
      <Topbar currentPage="Concerts & Festivals" onAdd={openCreateForm} />

      <div className="page-head">
        <h1 className="page-title">Concerts <span className="accent">& Festivals</span></h1>
        <div className="page-sub">
          <span>{concerts.length} enregistrés</span><span className="dot"></span>
          <span>{concerts.filter((c) => c.status === 'passe').length} vécus</span><span className="dot"></span>
          <span>{concerts.filter((c) => c.status === 'prevu').length} à venir</span>
        </div>
      </div>

      <div className="filters">
        <button
          className={`filter-chip ${activeFilter === 'tous' ? 'active' : ''}`}
          onClick={() => setActiveFilter('tous')}
        >
          Tous <span className="count">{concerts.length}</span>
        </button>
        <button
          className={`filter-chip ${activeFilter === 'a-venir' ? 'active' : ''}`}
          onClick={() => setActiveFilter('a-venir')}
        >
          À venir <span className="count">{concerts.filter((c) => c.status === 'prevu').length}</span>
        </button>
        <button
          className={`filter-chip ${activeFilter === 'passes' ? 'active' : ''}`}
          onClick={() => setActiveFilter('passes')}
        >
          Passés <span className="count">{concerts.filter((c) => c.status === 'passe').length}</span>
        </button>

        <div className="filter-sep"></div>

        <div className="filter-search">
          <input
            placeholder="Chercher un groupe, un lieu…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === 'grille' ? 'active' : ''}
            title="Grille"
            onClick={() => setViewMode('grille')}
          >
            ⛶
          </button>
          <button
            className={viewMode === 'liste' ? 'active' : ''}
            title="Liste"
            onClick={() => setViewMode('liste')}
          >
            ☰
          </button>
        </div>
      </div>

      <section className={`concerts-grid ${viewMode === 'liste' ? 'view-liste' : ''}`}>
        {filteredConcerts.map((concert) => (
          <ConcertCard
            key={concert.id}
            concert={concert}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ))}
      </section>

      {isFormOpen && (
        <ConcertForm
          concert={editingConcert}
          onClose={closeForm}
          onSaved={loadConcerts}
        />
      )}
    </>
  )
}

export default ConcertsPage