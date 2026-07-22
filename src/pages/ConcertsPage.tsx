import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatConcertDate } from '../lib/formatDate'
import { resolveParticipants } from '../lib/participants'
import '../styles/concerts.css'
import Topbar from '../components/TopBar'
import ConcertCard from '../components/ConcertCard'
import type { Concert, Profil } from '../types'

function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'tous' | 'a-venir' | 'passes'>('tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grille' | 'liste'>('grille')

  useEffect(() => {
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

    loadConcerts()
  }, [])

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
      <Topbar currentPage="Concerts & Festivals" />

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
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </section>
    </>
  )
}

export default ConcertsPage