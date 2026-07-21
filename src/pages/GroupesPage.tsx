import { useState } from 'react'
import '../styles/groupes.css'
import Topbar from '../components/TopBar'
import GroupRow from '../components/GroupRow'
import { groupes } from '../data/groupes'

function GroupesPage() {
  const [activeFilter, setActiveFilter] = useState<'tous' | 'metal' | 'kpop'>('tous')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGroupes = groupes.filter((g) => {
    const matchesGenre = activeFilter === 'tous' || g.genre === activeFilter
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  const metalCount = groupes.filter((g) => g.genre === 'metal').length
  const kpopCount = groupes.filter((g) => g.genre === 'kpop').length
  const seenCount = groupes.filter((g) => g.seen).length
  const seenPercent = Math.round((seenCount / groupes.length) * 100)
  const countriesCount = new Set(groupes.map((g) => g.country)).size

  return (
    <>
      <Topbar currentPage="Groupes" />

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
            <span style={{ width: `${(metalCount / groupes.length) * 100}%`, background: 'var(--grad-metal)' }}></span>
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
    </>
  )
}

export default GroupesPage