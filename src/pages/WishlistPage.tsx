import { useState } from 'react'
import '../styles/wishlist.css'
import Topbar from '../components/TopBar'
import DreamCard from '../components/DreamCard'
import type { Reve } from '../types'

const reves: Reve[] = [
  { id: 1, priority: 'ultime', genre: 'kpop', title: 'BTS · World Tour Reunion', subtitle: "Si jamais ils reviennent. Si jamais Paris.", dateValue: '2026 → 2027', budget: 350, note: "Alison · rêve d'enfance", avatarGenres: ['kpop'] },
  { id: 2, priority: 'ultime', genre: 'metal', title: 'Tool · à Paris', subtitle: 'Une tournée européenne par décennie. Cette fois.', dateValue: 'printemps 2027 ?', budget: 180, note: 'Emeline · obsession 2018', avatarGenres: ['metal'] },
  { id: 3, priority: 'ultime', genre: 'kpop', title: 'aespa · Synk Hyper Line', subtitle: 'Tokyo Dome, voyage compris.', dateValue: 'automne 2026', budget: 1200, note: 'À deux · voyage', avatarGenres: ['kpop', 'metal'] },
  { id: 4, priority: 'ultime', genre: 'metal', title: 'Knotfest Japan', subtitle: 'Festival annuel, line-up dingue chaque année.', dateValue: 'avril 2027', budget: 1800, note: 'Emeline · pour rêver', avatarGenres: ['metal', 'kpop'] },
  { id: 5, priority: 'haute', genre: 'kpop', title: 'ATEEZ · World Tour', subtitle: 'Accor Arena, deux soirs. Faut juste être rapides.', dateValue: '15 nov. 2026', budget: 110, note: 'Alison', avatarGenres: ['kpop'] },
  { id: 6, priority: 'haute', genre: 'metal', title: 'Architects · The Sky', subtitle: 'Olympia, tournée du nouvel album.', dateValue: '04 oct. 2026', budget: 55, note: 'À deux', avatarGenres: ['metal', 'kpop'] },
  { id: 7, priority: 'haute', genre: 'kpop', title: 'IVE · World Tour Show', subtitle: 'Première tournée européenne — Adidas Arena.', dateValue: '22 jan. 2027', budget: 95, note: 'Alison', avatarGenres: ['kpop'] },
  { id: 8, priority: 'haute', genre: 'metal', title: 'Knocked Loose · Pop', subtitle: "L'Élysée Montmartre · ils repassent enfin.", dateValue: '18 fév. 2027', budget: 45, note: 'Emeline', avatarGenres: ['metal'] },
  { id: 9, priority: 'haute', genre: 'kpop', title: 'Babymonster · See You There', subtitle: 'Première tournée — Zénith Paris.', dateValue: '12 déc. 2026', budget: 80, note: 'Alison', avatarGenres: ['kpop'] },
  { id: 10, priority: 'moyenne', genre: 'metal', title: 'Motionless In White', subtitle: 'Bataclan · si le calendrier suit.', dateValue: 'mars 2027', budget: 60, note: 'Emeline', avatarGenres: ['metal'] },
  { id: 11, priority: 'moyenne', genre: 'kpop', title: 'ITZY · Born to Be', subtitle: "Si une date à Paris s'ajoute.", dateValue: 'automne 2026', budget: 75, note: 'Alison', avatarGenres: ['kpop'] },
  { id: 12, priority: 'moyenne', genre: 'metal', title: 'Download Festival', subtitle: "UK · pour l'expérience complète, un jour.", dateValue: 'juin 2027', budget: 350, note: 'À deux · voyage', avatarGenres: ['metal', 'kpop'] },
]

const COLUMNS = [
  { priority: 'ultime' as const, icon: '🌙', label: 'Rêve ultime', unit: 'rêves' },
  { priority: 'haute' as const, icon: '🔥', label: 'Haute', unit: 'envies' },
  { priority: 'moyenne' as const, icon: '💛', label: 'Moyenne', unit: 'envies' },
]

function WishlistPage() {
  const [activeFilter, setActiveFilter] = useState<'toutes' | 'ultime' | 'haute' | 'moyenne'>('toutes')
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <>
      <Topbar currentPage="Wishlist" />

      <div className="page-head">
        <h1 className="page-title"><span className="accent">Wishlist</span></h1>
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
                <DreamCard key={reve.id} reve={reve} />
              ))}
            </div>
          )
        })}
      </section>
    </>
  )
}

export default WishlistPage