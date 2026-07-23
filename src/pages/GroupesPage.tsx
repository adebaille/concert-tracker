import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/groupes.css'
import '../styles/form.css'
import Topbar from '../components/TopBar'
import GroupRow from '../components/GroupRow'
import GroupeForm from '../components/GroupeForm'
import type { Groupe, Profil } from '../types'

function GroupesPage() {
  const [groupes, setGroupes] = useState<Groupe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'tous' | 'metal' | 'kpop'>('tous')
  const [searchQuery, setSearchQuery] = useState('')

  async function loadGroupes() {
    const [{ data: groupeRows }, { data: profilRows }] = await Promise.all([
      supabase.from('groupes').select('*'),
      supabase.from('profils').select('*'),
    ])

    const profils = (profilRows ?? []) as Profil[]

    const formatted: Groupe[] = (groupeRows ?? []).map((row) => {
      const profil = profils.find((p) => p.id === row.added_by)
      return {
        id: row.id,
        name: row.name,
        label: row.label ?? '',
        genre: row.genre,
        country: row.country,
        coverInitials: row.cover_initials,
        loveLevel: row.love_level,
        seen: row.is_seen,
        seenLabel: row.seen_label ?? '',
        addedByName: profil?.display_name ?? '?',
        addedByGenre: profil?.avatar_style ?? 'kpop',
        addedDate: new Date(row.created_at).toLocaleDateString('fr-FR'),
      }
    })

    setGroupes(formatted)
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState après await, donc pas synchrone
    loadGroupes()
  }, [])

  const filteredGroupes = groupes.filter((g) => {
    const matchesGenre = activeFilter === 'tous' || g.genre === activeFilter
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  const metalCount = groupes.filter((g) => g.genre === 'metal').length
  const kpopCount = groupes.filter((g) => g.genre === 'kpop').length
  const seenCount = groupes.filter((g) => g.seen).length
  const seenPercent = groupes.length > 0 ? Math.round((seenCount / groupes.length) * 100) : 0
  const countriesCount = new Set(groupes.map((g) => g.country)).size

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Groupes" />
        <p style={{ padding: 24 }}>Chargement des groupes...</p>
      </>
    )
  }

  return (
    <>
      <Topbar currentPage="Groupes" onAdd={() => setIsFormOpen(true)} />

      <div className="page-head">
        <h1 className="page-title">Groupes <span className="accent">suivis</span></h1>
        <div className="page-sub">
          <span>{groupes.length} au total</span><span className="dot"></span>
          <span>{metalCount} métal</span><span className="dot"></span>
          <span>{kpopCount} kpop</span><span className="dot"></span>
          <span>{seenCount} déjà vus en concert</span>
        </div>
      </div>

      <section className="gr-summary">
        <div className="gr-stat s1">
          <div className="num">{groupes.length}</div>
          <div className="lbl">Suivis au total</div>
        </div>
        <div className="gr-stat s2">
          <div className="num">
            {metalCount} <span style={{ fontSize: 14, color: 'var(--metal)', fontFamily: 'var(--font-mono)' }}>/ {kpopCount}</span>
          </div>
          <div className="lbl">Métal · Kpop</div>
          <div className="ratio-bar">
            <span style={{ width: `${groupes.length > 0 ? (metalCount / groupes.length) * 100 : 0}%`, background: 'var(--grad-metal)' }}></span>
          </div>
        </div>
        <div className="gr-stat s3">
          <div className="num">{seenCount}</div>
          <div className="lbl">Vus en concert</div>
          <div className="sub" style={{ color: 'var(--text-muted)' }}>soit {seenPercent} % du total</div>
        </div>
        <div className="gr-stat s4">
          <div className="num">{countriesCount}</div>
          <div className="lbl">Pays différents</div>
        </div>
      </section>

      <div className="filters">
        <button className={`filter-chip ${activeFilter === 'tous' ? 'active' : ''}`} onClick={() => setActiveFilter('tous')}>
          Tous <span className="count">{groupes.length}</span>
        </button>
        <button className={`filter-chip ${activeFilter === 'metal' ? 'active' : ''}`} onClick={() => setActiveFilter('metal')}>
          Métal <span className="count">{metalCount}</span>
        </button>
        <button className={`filter-chip ${activeFilter === 'kpop' ? 'active' : ''}`} onClick={() => setActiveFilter('kpop')}>
          Kpop <span className="count">{kpopCount}</span>
        </button>
        <div className="filter-sep"></div>
        <div className="filter-search">
          <input
            placeholder="Chercher un groupe…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="gr-table">
        <div className="gr-row head">
          <div>#</div>
          <div>Groupe</div>
          <div>Genre</div>
          <div>Pays</div>
          <div>Niveau d'amour</div>
          <div>Vu</div>
          <div>Ajouté par</div>
        </div>
        {filteredGroupes.map((groupe, index) => (
          <GroupRow key={groupe.id} groupe={groupe} index={index} />
        ))}
      </section>

      {isFormOpen && (
        <GroupeForm
          onClose={() => setIsFormOpen(false)}
          onSaved={loadGroupes}
        />
      )}
    </>
  )
}

export default GroupesPage