import { useState } from 'react'
import '../styles/merch.css'
import Topbar from '../components/TopBar'
import MerchItemCard from '../components/MerchItemCard'
import { merchItems } from '../data/merch'

const CATEGORIES = [
  { key: 'tshirt' as const, label: 'T-shirts', icon: '👕' },
  { key: 'hoodie' as const, label: 'Hoodies', icon: '🧥' },
  { key: 'poster' as const, label: 'Posters', icon: '📜' },
  { key: 'cd-album' as const, label: 'CDs / Albums', icon: '💿' },
  { key: 'photocard' as const, label: 'Photocards', icon: '📸' },
  { key: 'lightstick' as const, label: 'Lightsticks', icon: '🪄' },
  { key: 'casquette' as const, label: 'Casquettes', icon: '🧢' },
]

function MerchPage() {
  const [ownerFilter, setOwnerFilter] = useState<'tout' | 'alison' | 'emeline'>('tout')
  const [categoryFilter, setCategoryFilter] = useState<string>('toutes')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = merchItems.filter((item) => {
    const matchesOwner = ownerFilter === 'tout' || item.owner === ownerFilter
    const matchesCategory = categoryFilter === 'toutes' || item.category === categoryFilter
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(query) || item.band.toLowerCase().includes(query)
    return matchesOwner && matchesCategory && matchesSearch
  })

  const alisonItems = merchItems.filter((item) => item.owner === 'alison')
  const emelineItems = merchItems.filter((item) => item.owner === 'emeline')
  const alisonTotal = alisonItems.reduce((total, item) => total + item.price, 0)
  const emelineTotal = emelineItems.reduce((total, item) => total + item.price, 0)
  const totalPrice = merchItems.reduce((total, item) => total + item.price, 0)
  const bandsCount = new Set(merchItems.map((item) => item.band)).size

  return (
    <>
      <Topbar currentPage="Inventaire Merch" />

      <div className="page-head">
        <h1 className="page-title">Inventaire <span className="accent">merch</span></h1>
        <div className="page-sub">
          <span>{merchItems.length} items</span><span className="dot"></span>
          <span>{alisonItems.length} Alison · {emelineItems.length} Emeline</span><span className="dot"></span>
          <span>{totalPrice} € au total</span>
        </div>
      </div>

      <section className="mr-summary">
        <div className="mr-stat split">
          <div className="l" style={{ marginBottom: 8 }}>Répartition par propriétaire</div>
          <div className="split-rows">
            <div className="split-row">
              <div className="name">
                <div className="avatar kpop">A</div>
                <span>Alison</span>
              </div>
              <div className="qty">{alisonItems.length} · {alisonTotal} €</div>
            </div>
            <div className="split-row">
              <div className="name">
                <div className="avatar metal">E</div>
                <span>Emeline</span>
              </div>
              <div className="qty">{emelineItems.length} · {emelineTotal} €</div>
            </div>
          </div>
          <div className="bar">
            <span style={{ width: `${(alisonItems.length / merchItems.length) * 100}%`, background: 'var(--grad-primary)' }}></span>
          </div>
        </div>
        <div className="mr-stat">
          <div className="v">{merchItems.length}</div>
          <div className="l">Items collectionnés</div>
        </div>
        <div className="mr-stat">
          <div className="v">{totalPrice} €</div>
          <div className="l">Investissement total</div>
        </div>
        <div className="mr-stat">
          <div className="v">{bandsCount}</div>
          <div className="l">Groupes représentés</div>
        </div>
      </section>

      <div className="filters">
        <button className={`filter-chip ${ownerFilter === 'tout' ? 'active' : ''}`} onClick={() => setOwnerFilter('tout')}>
          Tout <span className="count">{merchItems.length}</span>
        </button>
        <button className={`filter-chip ${ownerFilter === 'alison' ? 'active' : ''}`} onClick={() => setOwnerFilter('alison')}>
          Alison <span className="count">{alisonItems.length}</span>
        </button>
        <button className={`filter-chip ${ownerFilter === 'emeline' ? 'active' : ''}`} onClick={() => setOwnerFilter('emeline')}>
          Emeline <span className="count">{emelineItems.length}</span>
        </button>
        <div className="filter-sep"></div>
        <div className="filter-search">
          <input
            placeholder="Chercher un item, un groupe…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="cat-pill-row" style={{ marginBottom: 24 }}>
        <button
          className={`cat-pill ${categoryFilter === 'toutes' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('toutes')}
        >
          <span className="e">🌐</span> Toutes les catégories · {merchItems.length}
        </button>
        {CATEGORIES.map((cat) => {
          const count = merchItems.filter((item) => item.category === cat.key).length
          return (
            <button
              key={cat.key}
              className={`cat-pill ${categoryFilter === cat.key ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat.key)}
            >
              <span className="e">{cat.icon}</span> {cat.label} · {count}
            </button>
          )
        })}
      </div>

      <section className="mr-gallery">
        {filteredItems.map((item) => (
          <MerchItemCard key={item.id} item={item} />
        ))}
      </section>
    </>
  )
}

export default MerchPage