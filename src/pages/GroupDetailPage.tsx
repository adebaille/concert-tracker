import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { Heart, Flame } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatConcertDate } from '../lib/formatDate'
import { resolveParticipants, participantsLabel } from '../lib/participants'
import '../styles/groupes.css'
import '../styles/group-detail.css'
import Topbar from '../components/TopBar'
import type { Profil, Participant } from '../types'

type MembreEntry = {
  userId: string
  name: string
  avatarStyle: 'kpop' | 'metal'
  count: number
  hype: number
}

type GroupeConcert = {
  concertId: number
  concertName: string
  venue: string
  city: string
  date: string
  status: 'prevu' | 'passe' | 'annule'
}

type GroupeMerch = {
  id: number
  name: string
  bandNote: string
  price: number
  participants: Participant[]
}

type GroupeReve = {
  id: number
  title: string
  subtitle: string
  priority: 'ultime' | 'haute' | 'moyenne'
}

type GroupeDetail = {
  id: number
  name: string
  label: string
  genre: 'kpop' | 'metal'
  country: string
  coverInitials: string
  membres: MembreEntry[]
  concerts: GroupeConcert[]
  merch: GroupeMerch[]
  reves: GroupeReve[]
}

function GroupDetailPage() {
  const { id } = useParams()
  const [groupe, setGroupe] = useState<GroupeDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadGroupe() {
      const groupeId = Number(id)

      const [
        { data: groupeData },
        { data: profilRows },
        { data: membreRows },
        { data: lineupRows },
        { data: merchRows },
        { data: reveRows },
      ] = await Promise.all([
        supabase.from('groupes').select('*').eq('id', groupeId).single(),
        supabase.from('profils').select('*'),
        supabase.from('groupe_membres').select('*').eq('groupe_id', groupeId),
        supabase.from('concert_lineup').select('*').eq('groupe_id', groupeId),
        supabase.from('merch').select('*').eq('groupe_id', groupeId),
        supabase.from('reves').select('id, title, subtitle, priority').eq('groupe_id', groupeId),
      ])

      if (!groupeData) {
        setIsLoading(false)
        return
      }

      const profils = (profilRows ?? []) as Profil[]

      const membres: MembreEntry[] = (membreRows ?? []).map((m) => {
        const p = profils.find((profil) => profil.id === m.user_id)
        return {
          userId: m.user_id,
          name: p?.display_name ?? '?',
          avatarStyle: p?.avatar_style ?? 'kpop',
          count: m.seen_count,
          hype: m.hype_level,
        }
      })

      const lineup = lineupRows ?? []
      let concerts: GroupeConcert[] = []

      if (lineup.length > 0) {
        const concertIds = lineup.map((l) => l.concert_id)
        const { data: concertRows } = await supabase
          .from('concerts')
          .select('id, name, venue, city, event_date, status')
          .in('id', concertIds)

        concerts = (concertRows ?? [])
          .map((c) => ({
            concertId: c.id,
            concertName: c.name,
            venue: c.venue,
            city: c.city,
            date: formatConcertDate(c.event_date),
            status: c.status,
          }))
          .sort((a, b) => b.date.localeCompare(a.date))
      }

      const merch: GroupeMerch[] = (merchRows ?? []).map((m) => ({
        id: m.id,
        name: m.name,
        bandNote: m.band_note ?? '',
        price: m.price ?? 0,
        participants: resolveParticipants(profils, m.owner_id, m.is_shared),
      }))

      const reves: GroupeReve[] = (reveRows ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle ?? '',
        priority: r.priority,
      }))

      setGroupe({
        id: groupeData.id,
        name: groupeData.name,
        label: groupeData.label ?? '',
        genre: groupeData.genre,
        country: groupeData.country,
        coverInitials: groupeData.cover_initials,
        membres,
        concerts,
        merch,
        reves,
      })
      setIsLoading(false)
    }

    loadGroupe()
  }, [id])

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Groupe" />
        <p style={{ padding: 24 }}>Chargement...</p>
      </>
    )
  }

  if (!groupe) {
    return (
      <>
        <Topbar currentPage="Groupe" />
        <div className="gd-notfound">
          <p>Ce groupe n'existe pas ou plus.</p>
          <Link to="/groupes" className="btn-ghost">← Retour aux groupes</Link>
        </div>
      </>
    )
  }

  const HypeIcon = groupe.genre === 'kpop' ? Heart : Flame

  return (
    <>
      <Topbar currentPage={groupe.name} />

      <Link to="/groupes" className="gd-back">← Tous les groupes</Link>

      <header className="gd-header">
        <div className={`band-cover ${groupe.genre}`}>{groupe.coverInitials}</div>
        <div className="gd-header-info">
          <h1 className="gd-name">{groupe.name}</h1>
          <div className="gd-meta">
            {groupe.label && <span>{groupe.label}</span>}
            {groupe.label && <span className="dot"></span>}
            <span>{groupe.country}</span>
            <span className="dot"></span>
            <span className={`genre-badge ${groupe.genre}`}>
              {groupe.genre === 'kpop' ? 'Kpop' : 'Métal'}
            </span>
          </div>
        </div>
      </header>

      <section className="gd-section">
        <h2 className="gd-section-title">Notre ressenti</h2>
        <div className="gd-membres">
          {groupe.membres.map((m) => (
            <div key={m.userId} className="gd-membre-card">
              <div className="gd-membre-head">
                <span className={`avatar ${m.avatarStyle}`}>{m.name[0]}</span>
                <span className="gd-membre-name">{m.name}</span>
              </div>
              <div className="gd-membre-row">
                <span className="gd-membre-label">Hype</span>
                <span className="hype-icons">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <HypeIcon
                      key={n}
                      size={14}
                      className={n <= m.hype ? 'hype-on' : 'hype-off'}
                    />
                  ))}
                </span>
              </div>
              <div className="gd-membre-row">
                <span className="gd-membre-label">Vu en concert</span>
                <span className="gd-membre-value">
                  {m.count > 0 ? `${m.count} fois` : 'Pas encore'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="gd-section">
        <h2 className="gd-section-title">
          Concerts {groupe.concerts.length > 0 && `· ${groupe.concerts.length}`}
        </h2>
        {groupe.concerts.length > 0 ? (
          <div className="gd-concert-list">
            {groupe.concerts.map((c) => (
              <Link key={c.concertId} to="/concerts" className={`gd-concert-item ${c.status}`}>
                <div className="gd-concert-main">
                  <span className="gd-concert-name">{c.concertName}</span>
                  <span className="gd-concert-place">{c.venue} · {c.city}</span>
                </div>
                <div className="gd-concert-side">
                  <span className="gd-concert-date">{c.date}</span>
                  <span className={`gd-concert-status ${c.status}`}>
                    {c.status === 'prevu' ? 'À venir' : c.status === 'passe' ? 'Vécu' : 'Annulé'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="gd-empty">Aucun concert enregistré pour ce groupe.</p>
        )}
      </section>

      <section className="gd-section">
        <h2 className="gd-section-title">
          Merch {groupe.merch.length > 0 && `· ${groupe.merch.length}`}
        </h2>
        {groupe.merch.length > 0 ? (
          <div className="gd-merch-list">
            {groupe.merch.map((m) => (
              <Link key={m.id} to="/merch" className="gd-merch-item">
                <div className="gd-merch-main">
                  <span className="gd-merch-name">{m.name}</span>
                  {m.bandNote && <span className="gd-merch-note">{m.bandNote}</span>}
                </div>
                <div className="gd-merch-side">
                  <div className="gd-merch-owner">
                    <div className="avatars">
                      {m.participants.map((p) => (
                        <div key={p.name} className={`avatar ${p.avatarStyle}`}>{p.name[0]}</div>
                      ))}
                    </div>
                    <span className="gd-merch-owner-label">{participantsLabel(m.participants)}</span>
                  </div>
                  <span className="gd-merch-price">{m.price} €</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="gd-empty">Aucun merch de ce groupe dans l'inventaire.</p>
        )}
      </section>

      <section className="gd-section">
        <h2 className="gd-section-title">
          Wishlist {groupe.reves.length > 0 && `· ${groupe.reves.length}`}
        </h2>
        {groupe.reves.length > 0 ? (
          <div className="gd-reve-list">
            {groupe.reves.map((r) => (
              <Link key={r.id} to="/wishlist" className={`gd-reve-item ${r.priority}`}>
                <span className="gd-reve-title">{r.title}</span>
                {r.subtitle && <span className="gd-reve-subtitle">{r.subtitle}</span>}
                <span className={`gd-reve-priority ${r.priority}`}>
                  {r.priority === 'ultime' ? 'Rêve ultime' : r.priority === 'haute' ? 'Haute' : 'Moyenne'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="gd-empty">Aucun rêve associé à ce groupe.</p>
        )}
      </section>
    </>
  )
}

export default GroupDetailPage