import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatConcertDate, formatDayMonth } from '../lib/formatDate'
import { resolveParticipants, participantsLabel } from '../lib/participants'
import '../styles/home.css'
import Topbar from '../components/TopBar'
import Countdown from '../components/Countdown'
import type { Participant, Profil } from '../types'

type ConcertRow = {
  id: number
  name: string
  genre: 'kpop' | 'metal' | 'fest'
  status: 'prevu' | 'passe' | 'annule'
  event_date: string
  venue: string
  city: string
  price: number | null
  added_by: string
  is_shared: boolean
}

type ActivityEntry = {
  key: string
  createdAt: string
  authorName: string
  authorAvatarStyle: 'kpop' | 'metal'
  text: string
}

function HomePage() {
  const [concerts, setConcerts] = useState<ConcertRow[]>([])
  const [profils, setProfils] = useState<Profil[]>([])
  const [groupesCount, setGroupesCount] = useState(0)
  const [merchCount, setMerchCount] = useState(0)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHome() {
      const [
        { data: concertRows },
        { data: groupeRows },
        { data: reveRows },
        { data: merchRows },
        { data: profilRows },
      ] = await Promise.all([
        supabase.from('concerts').select('*'),
        supabase.from('groupes').select('id, name, created_at, added_by'),
        supabase.from('reves').select('id, title, created_at, added_by'),
        supabase.from('merch').select('id, name, created_at, owner_id'),
        supabase.from('profils').select('*'),
      ])

      const profilsData = (profilRows ?? []) as Profil[]
      const concertsData = (concertRows ?? []) as ConcertRow[]

      function authorOf(userId: string) {
        const profil = profilsData.find((p) => p.id === userId)
        return {
          authorName: profil?.display_name ?? '?',
          authorAvatarStyle: profil?.avatar_style ?? ('kpop' as const),
        }
      }

      const entries: ActivityEntry[] = [
        ...(groupeRows ?? []).map((r) => ({
          key: `groupe-${r.id}`,
          createdAt: r.created_at,
          text: `a ajouté ${r.name} aux groupes suivis.`,
          ...authorOf(r.added_by),
        })),
        ...concertsData.map((r) => ({
          key: `concert-${r.id}`,
          createdAt: (r as ConcertRow & { created_at: string }).created_at,
          text: `a ajouté ${r.name} aux concerts.`,
          ...authorOf(r.added_by),
        })),
        ...(reveRows ?? []).map((r) => ({
          key: `reve-${r.id}`,
          createdAt: r.created_at,
          text: `a ajouté ${r.title} à la wishlist.`,
          ...authorOf(r.added_by),
        })),
        ...(merchRows ?? []).map((r) => ({
          key: `merch-${r.id}`,
          createdAt: r.created_at,
          text: `a ajouté ${r.name} à l'inventaire merch.`,
          ...authorOf(r.owner_id),
        })),
      ]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 4)

      setConcerts(concertsData)
      setProfils(profilsData)
      setGroupesCount((groupeRows ?? []).length)
      setMerchCount((merchRows ?? []).length)
      setActivity(entries)
      setIsLoading(false)
    }

    loadHome()
  }, [])

  const upcomingConcerts = concerts
    .filter((c) => c.status === 'prevu')
    .sort((a, b) => a.event_date.localeCompare(b.event_date))

  const nextConcert = upcomingConcerts[0]
  const pastConcertsCount = concerts.filter((c) => c.status === 'passe').length

  const nextParticipants: Participant[] = nextConcert
    ? resolveParticipants(profils, nextConcert.added_by, nextConcert.is_shared)
    : []

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Accueil" />
        <p style={{ padding: 24 }}>Chargement...</p>
      </>
    )
  }

  return (
    <>
      <Topbar currentPage="Accueil" />

      <section className="hero">
        <div>
          <h1 className="hero-title">
            NOTRE <span className="gradient">UNIVERS</span><br />
            <span className="outlined">MUSICAL</span>
          </h1>
          <div className="hero-meta">
            <span className="tag metal">🤘 Métal</span>
            <span className="tag kpop">💜 Kpop</span>
            <span className="hero-divider"></span>
            <span className="hero-line">Tracker à 2 voix</span>
          </div>
        </div>
        <div className="hero-right">
          <span>{concerts.length} concerts · {groupesCount} groupes</span>
        </div>
      </section>

      {nextConcert && (
        <>
          <div className="section-head">
            <div className="section-title">Prochain concert</div>
          </div>

          <section className="next-concert">
            <div className="nc-poster">
              <div className="placeholder-tag">Photo · à uploader</div>
              <div className="band-block">
                <div className="band-genre">
                  {nextConcert.genre === 'kpop' ? 'K-Pop' : 'Métal'} · {nextConcert.city}
                </div>
                <div className="band-name">{nextConcert.name.toUpperCase()}</div>
              </div>
            </div>
            <div className="nc-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="nc-label">Date · lieu</div>
                  <div className="nc-value big">{formatConcertDate(nextConcert.event_date)}</div>
                  <div className="nc-value" style={{ marginTop: 6, color: 'var(--text-muted)', fontWeight: 400 }}>
                    {nextConcert.venue} · {nextConcert.city}
                  </div>
                </div>
                <span className="status-badge prevu">Prévu</span>
              </div>

              <div>
                <div className="nc-label">Compte à rebours</div>
                <Countdown targetDate={new Date(nextConcert.event_date)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div className="nc-label">Place</div>
                  <div className="nc-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                    {nextConcert.price ?? 0} €
                  </div>
                </div>
                <div>
                  <div className="nc-label">Compagnie</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <div className="avatars">
                      {nextParticipants.map((p) => (
                        <div key={p.name} className={`avatar ${p.avatarStyle}`}>{p.name[0]}</div>
                      ))}
                    </div>
                    <span style={{ fontSize: 13 }}>{participantsLabel(nextParticipants)}</span>
                  </div>
                </div>
              </div>

              <div className="nc-actions">
                <button className="btn-ghost">Voir le détail</button>
                <button className="btn-ghost primary">Ajouter au calendrier</button>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="stats">
        <div className="stat s-1">
          <div className="stat-head"><div className="stat-ico">🎸</div></div>
          <div className="stat-num">{groupesCount}</div>
          <div className="stat-label">Groupes suivis</div>
        </div>
        <div className="stat s-2">
          <div className="stat-head"><div className="stat-ico">🎫</div></div>
          <div className="stat-num">{pastConcertsCount}</div>
          <div className="stat-label">Concerts vécus</div>
        </div>
        <div className="stat s-3">
          <div className="stat-head"><div className="stat-ico">📍</div></div>
          <div className="stat-num">{upcomingConcerts.length}</div>
          <div className="stat-label">À venir</div>
        </div>
        <div className="stat s-4">
          <div className="stat-head"><div className="stat-ico">👕</div></div>
          <div className="stat-num">{merchCount}<span className="suffix">items</span></div>
          <div className="stat-label">Inventaire merch</div>
        </div>
      </section>

      <section className="bottom">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">À VENIR</div>
            <div className="panel-sub">{upcomingConcerts.length} concert(s) prévu(s)</div>
          </div>
          <div className="timeline">
            {upcomingConcerts.map((concert) => {
              const { day, month } = formatDayMonth(concert.event_date)
              return (
                <div key={concert.id} className="tl-item">
                  <div className="tl-date">
                    <div className="tl-day">{day}</div>
                    <div className="tl-mo">{month}</div>
                  </div>
                  <div>
                    <div className="tl-name">
                      <span className={`dot ${concert.genre}`}></span>{concert.name}
                    </div>
                    <div className="tl-where">
                      {concert.venue} <span className="sep">·</span> {concert.city}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">JOURNAL</div>
            <div className="panel-sub">Activité récente</div>
          </div>
          <div className="activity">
            {activity.map((entry) => (
              <div key={entry.key} className="act">
                <div className={`act-avatar ${entry.authorAvatarStyle}`}>{entry.authorName[0]}</div>
                <div>
                  <div className="act-text"><strong>{entry.authorName}</strong> {entry.text}</div>
                  <div className="act-time">{formatConcertDate(entry.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage