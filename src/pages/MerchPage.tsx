import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { resolveParticipants } from '../lib/participants'
import '../styles/merch.css'
import Topbar from '../components/TopBar'
import MerchItemCard from '../components/MerchItemCard'
import type { MerchItem, Profil } from '../types'

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
  const [merchItems, setMerchItems] = useState<MerchItem[]>([])
  const [profils, setProfils] = useState<Profil[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ownerFilter, setOwnerFilter] = useState<string>('tout')
  const [categoryFilter, setCategoryFilter] = useState<string>('toutes')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadMerch() {
      const [{ data: merchRows }, { data: profilRows }, { data: groupeRows }] = await Promise.all([
        supabase.from('merch').select('*'),
        supabase.from('profils').select('*'),
        supabase.from('groupes').select('id, name'),
      ])

      const profilsData = (profilRows ?? []) as Profil[]
      const groupes = groupeRows ?? []
      setProfils(profilsData)

      const formatted: MerchItem[] = (merchRows ?? []).map((row) => {
        const groupe = groupes.find((g) => g.id === row.groupe_id)

        return {
          id: row.id,
          previewStyle: row.preview_style,
          category: row.category,
          bgText: row.name.toUpperCase(),
          details: `${row.category} · ${row.preview_style}`,
          name: row.name,
          band: groupe?.name ?? '—',
          bandNote: row.band_note ?? '',
          price: row.price ?? 0,
          ownerId: row.owner_id,
          isShared: row.is_shared,
          participants: resolveParticipants(profilsData, row.owner_id, row.is_shared),
        }
      })

      setMerchItems(formatted)
      setIsLoading(false)
    }

    loadMerch()
  }, [])

  const filteredItems = merchItems.filter((item) => {
    const matchesOwner =
      ownerFilter === 'tout' ||
      (ownerFilter === 'partage'
        ? item.isShared
        : item.ownerId === ownerFilter && !item.isShared)

    const matchesCategory = categoryFilter === 'toutes' || item.category === categoryFilter

    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(query) || item.band.toLowerCase().includes(query)

    return matchesOwner && matchesCategory && matchesSearch
  })

  const sharedItems = merchItems.filter((item) => item.isShared)
  const totalPrice = merchItems.reduce((total, item) => total + item.price, 0)
  const bandsCount = new Set(merchItems.map((item) => item.band)).size

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Inventaire Merch" />
        <p style={{ padding: 24 }}>Chargement de l'inventaire...</p>
      </>
    )
  }

  return (
    <>
      <Topbar currentPage="Inventaire Merch" />

      <div className="page-head">
        <h1 className="page-title">Inventaire <span className="accent">merch</span></h1>
        <div className="page-sub">
          <span>{merchItems.length} items</span><span className="dot"></span>
          <span>{totalPrice} € au total</span>
        </div>
      </div>

      <section className="mr-summary">
        <div className="mr-stat split">
          <div className="l" style={{ marginBottom: 8 }}>Répartition par propriétaire</div>
          <div className="split-rows">
            {profils.map((profil) => {
              const items = merchItems.filter(
                (item) => item.ownerId === profil.id && !item.isShared
              )
              const total = items.reduce((sum, item) => sum + item.price, 0)
              return (
                <div key={profil.id} className="split-row">
                  <div className="name">
                    <div className={`avatar ${profil.avatar_style}`}>{profil.display_name[0]}</div>
                    <span>{profil.display_name}</span>
                  </div>
                  <div className="qty">{items.length} · {total} €</div>
                </div>
              )
            })}
            <div className="split-row">
              <div className="name">
                <div className="avatar kpop">2</div>
                <span>À deux</span>
              </div>
              <div className="qty">
                {sharedItems.length} · {sharedItems.reduce((sum, i) => sum + i.price, 0)} €
              </div>
            </div>
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
        {profils.map((profil) => (
          <button
            key={profil.id}
            className={`filter-chip ${ownerFilter === profil.id ? 'active' : ''}`}
            onClick={() => setOwnerFilter(profil.id)}
          >
            {profil.display_name}{' '}
            <span className="count">
              {merchItems.filter((item) => item.ownerId === profil.id && !item.isShared).length}
            </span>
          </button>
        ))}
        <button
          className={`filter-chip ${ownerFilter === 'partage' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('partage')}
        >
          À deux <span className="count">{sharedItems.length}</span>
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