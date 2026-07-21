import '../styles/home.css'
import Topbar from '../components/TopBar'
import { concerts } from '../data/concerts'
import { groupes } from '../data/groupes'
import { merchItems } from '../data/merch'

type ActivityEntry = {
  id: number
  authorName: string
  authorGenre: 'kpop' | 'metal'
  text: string
  time: string
}

const activityLog: ActivityEntry[] = [
  { id: 1, authorName: 'Emeline', authorGenre: 'metal', text: "a ajouté Sleep Token à la wishlist.", time: 'IL Y A 2 H' },
  { id: 2, authorName: 'Alison', authorGenre: 'kpop', text: 'a ajouté aespa aux groupes suivis.', time: 'HIER · 23H44' },
  { id: 3, authorName: 'Emeline', authorGenre: 'metal', text: 'a ajouté le hoodie Bring Me The Horizon à l\'inventaire.', time: '18 MAI · 18H03' },
  { id: 4, authorName: 'Alison', authorGenre: 'kpop', text: 'a noté Stray Kids · dominATE World Tour ★★★★★.', time: '16 MAI · 09H12' },
]

function HomePage() {
  const nextConcert = concerts.find((c) => c.status === 'prevu')
  const upcomingConcerts = concerts.filter((c) => c.status === 'prevu')
  const pastConcertsCount = concerts.filter((c) => c.status === 'passe').length

  return (
    <>
      <Topbar currentPage="Accueil" />

      <section className="hero">
        <div>
          <h1 className="hero-title">
            <span className="gradient">CONCERTS</span><br />
            <span className="outlined">TRACKER</span>
          </h1>
          <div className="hero-meta">
            <span className="tag metal">🤘 Métal</span>
            <span className="tag kpop">💜 Kpop</span>
            <span className="hero-divider"></span>
            <span className="hero-line">Tracker à 2 voix</span>
          </div>
        </div>
        <div className="hero-right">
          <span>{concerts.length} concerts · {groupes.length} groupes</span>
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
                  <div className="nc-value big">{nextConcert.date}</div>
                  <div className="nc-value" style={{ marginTop: 6, color: 'var(--text-muted)', fontWeight: 400 }}>
                    {nextConcert.venue} · {nextConcert.city}
                  </div>
                </div>
                <span className="status-badge prevu">Prévu</span>
              </div>

              <div>
                <div className="nc-label">Compte à rebours</div>
                {/* Chiffres figés pour l'instant — deviendra vivant avec useEffect + de vraies dates Supabase */}
                <div className="countdown">
                  <div className="cd-cell"><div className="cd-num">13</div><div className="cd-label">jours</div></div>
                  <div className="cd-cell"><div className="cd-num">04</div><div className="cd-label">heures</div></div>
                  <div className="cd-cell"><div className="cd-num">22</div><div className="cd-label">min</div></div>
                  <div className="cd-cell"><div className="cd-num">47</div><div className="cd-label">sec</div></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div className="nc-label">Place</div>
                  <div className="nc-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                    {nextConcert.price} €
                  </div>
                </div>
                <div>
                  <div className="nc-label">Compagnie</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <div className="avatars">
                      <div className="avatar metal">E</div>
                      <div className="avatar kpop">A</div>
                    </div>
                    <span style={{ fontSize: 13 }}>À deux</span>
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
          <div className="stat-num">{groupes.length}</div>
          <div className="stat-label">Groupes suivis</div>
          <div className="stat-bars">
            <span style={{ height: '30%' }}></span><span style={{ height: '50%' }}></span><span style={{ height: '45%' }}></span>
            <span style={{ height: '70%' }}></span><span style={{ height: '60%' }}></span><span style={{ height: '85%' }}></span>
            <span style={{ height: '100%' }}></span>
          </div>
        </div>
        <div className="stat s-2">
          <div className="stat-head"><div className="stat-ico">🎫</div></div>
          <div className="stat-num">{pastConcertsCount}</div>
          <div className="stat-label">Concerts vécus</div>
          <div className="stat-bars">
            <span style={{ height: '40%' }}></span><span style={{ height: '60%' }}></span><span style={{ height: '55%' }}></span>
            <span style={{ height: '90%' }}></span><span style={{ height: '75%' }}></span><span style={{ height: '80%' }}></span>
            <span style={{ height: '100%' }}></span>
          </div>
        </div>
        <div className="stat s-3">
          <div className="stat-head"><div className="stat-ico">📍</div></div>
          <div className="stat-num">{upcomingConcerts.length}</div>
          <div className="stat-label">À venir</div>
          <div className="stat-bars">
            <span style={{ height: '20%' }}></span><span style={{ height: '30%' }}></span><span style={{ height: '60%' }}></span>
            <span style={{ height: '45%' }}></span><span style={{ height: '70%' }}></span><span style={{ height: '55%' }}></span>
            <span style={{ height: '90%' }}></span>
          </div>
        </div>
        <div className="stat s-4">
          <div className="stat-head"><div className="stat-ico">👕</div></div>
          <div className="stat-num">{merchItems.length}<span className="suffix">items</span></div>
          <div className="stat-label">Inventaire merch</div>
          <div className="stat-bars">
            <span style={{ height: '50%' }}></span><span style={{ height: '65%' }}></span><span style={{ height: '70%' }}></span>
            <span style={{ height: '60%' }}></span><span style={{ height: '80%' }}></span><span style={{ height: '75%' }}></span>
            <span style={{ height: '100%' }}></span>
          </div>
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
              const [day, month] = concert.date.split(' ')
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
            {activityLog.map((entry) => (
              <div key={entry.id} className="act">
                <div className={`act-avatar ${entry.authorGenre}`}>{entry.authorName[0]}</div>
                <div>
                  <div className="act-text"><strong>{entry.authorName}</strong> {entry.text}</div>
                  <div className="act-time">{entry.time}</div>
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