import { useState } from 'react'
import '../styles/groupes.css'
import Topbar from '../components/TopBar'
import GroupRow from '../components/GroupRow'
import type { Groupe } from '../types'

const groupes: Groupe[] = [
  { id: 1, name: 'Stray Kids', label: 'JYP · Seoul', genre: 'kpop', country: '🇰🇷 Corée', coverInitials: 'SK', loveLevel: 5, seen: true, seenLabel: '3 fois', addedByName: 'Alison', addedByGenre: 'kpop', addedDate: '03·09·2024' },
  { id: 2, name: 'Sleep Token', label: 'RCA · Londres', genre: 'metal', country: '🇬🇧 UK', coverInitials: 'ST', loveLevel: 5, seen: false, seenLabel: 'Bientôt', addedByName: 'Emeline', addedByGenre: 'metal', addedDate: '14·07·2024' },
  { id: 3, name: 'Le Sserafim', label: 'Source Music', genre: 'kpop', country: '🇰🇷 Corée', coverInitials: 'LS', loveLevel: 4, seen: false, seenLabel: 'Prochainement', addedByName: 'Alison', addedByGenre: 'kpop', addedDate: '12·11·2024' },
  { id: 4, name: 'Bring Me The Horizon', label: 'RCA · Sheffield', genre: 'metal', country: '🇬🇧 UK', coverInitials: 'BM', loveLevel: 4, seen: true, seenLabel: '1 fois', addedByName: 'Emeline', addedByGenre: 'metal', addedDate: '22·02·2024' },
  { id: 5, name: 'Aespa', label: 'SM Entertainment', genre: 'kpop', country: '🇰🇷 Corée', coverInitials: 'AE', loveLevel: 3, seen: true, seenLabel: '1 fois', addedByName: 'Alison', addedByGenre: 'kpop', addedDate: '16·05·2026' },
  { id: 6, name: 'Lorna Shore', label: 'Century Media', genre: 'metal', country: '🇺🇸 USA', coverInitials: 'LS', loveLevel: 4, seen: true, seenLabel: '2 fois', addedByName: 'Emeline', addedByGenre: 'metal', addedDate: '04·01·2024' },
  { id: 7, name: '(G)I-DLE', label: 'Cube Entertainment', genre: 'kpop', country: '🇰🇷 Corée', coverInitials: 'GI', loveLevel: 5, seen: true, seenLabel: '1 fois', addedByName: 'Alison', addedByGenre: 'kpop', addedDate: '19·08·2023' },
  { id: 8, name: 'Spiritbox', label: 'Pale Chord · Rise', genre: 'metal', country: '🇨🇦 Canada', coverInitials: 'SP', loveLevel: 5, seen: false, seenLabel: 'Pas encore', addedByName: 'Emeline', addedByGenre: 'metal', addedDate: '11·06·2024' },
  { id: 9, name: 'TXT (Tomorrow X Together)', label: 'BIGHIT Music', genre: 'kpop', country: '🇰🇷 Corée', coverInitials: 'TX', loveLevel: 3, seen: false, seenLabel: 'Pas encore', addedByName: 'Alison', addedByGenre: 'kpop', addedDate: '27·03·2025' },
  { id: 10, name: 'Bad Omens', label: 'Sumerian Records', genre: 'metal', country: '🇺🇸 USA', coverInitials: 'BO', loveLevel: 4, seen: false, seenLabel: 'Hellfest 26', addedByName: 'Emeline', addedByGenre: 'metal', addedDate: '08·12·2023' },
  { id: 11, name: 'NewJeans', label: 'ADOR', genre: 'kpop', country: '🇰🇷 Corée', coverInitials: 'NJ', loveLevel: 2, seen: false, seenLabel: 'Pas encore', addedByName: 'Alison', addedByGenre: 'kpop', addedDate: '15·06·2024' },
  { id: 12, name: 'Polyphia', label: 'Rise Records · Texas', genre: 'metal', country: '🇺🇸 USA', coverInitials: 'PE', loveLevel: 3, seen: true, seenLabel: '1 fois', addedByName: 'Emeline', addedByGenre: 'metal', addedDate: '21·10·2024' },
]

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