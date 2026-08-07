import { Heart, Flame } from 'lucide-react'
import { Link } from 'react-router'
import type { Groupe } from '../types'

type GroupRowProps = {
  groupe: Groupe
  index: number
  onEdit: (groupe: Groupe) => void
  onDelete: (groupe: Groupe) => void
}

function GroupRow({ groupe, index, onEdit, onDelete }: GroupRowProps) {
  const variant = ['', '2', '3'][index % 3]
  const coverClass = `${groupe.genre}${variant}`
  const HypeIcon = groupe.genre === 'kpop' ? Heart : Flame

  return (
    <div className="gr-row">
      <div className="col-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="col-name">
        <div className={`band-cover ${coverClass}`}>
          {groupe.photoUrl ? (
            <img src={groupe.photoUrl} alt={groupe.name} className="band-cover-img" />
          ) : (
            <span className="band-cover-fallback">{groupe.name}</span>
          )}
        </div>
        <div className="band-name-cell">
          <Link to={`/groupes/${groupe.id}`} className="name gr-name-link">
            {groupe.name}
          </Link>
          <div className="country">{groupe.label}</div>
          {groupe.concerts.length > 0 && (
            <div className="gr-concerts">
              {groupe.concerts.slice(0, 3).map((c) => (
                <span key={c.concertId} className={`gr-concert-tag ${c.status}`}>
                  {c.concertName}
                </span>
              ))}
              {groupe.concerts.length > 3 && (
                <span className="gr-concert-tag more">
                  +{groupe.concerts.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <span className={`genre-badge ${groupe.genre}`}>
          {groupe.genre === 'kpop' ? 'Kpop' : 'Métal'}
        </span>
      </div>
      <div className="col-style">{groupe.country}</div>
      <div className="hype-detail">
        {groupe.seenEntries.filter((e) => e.hype > 0).length > 0 ? (
          groupe.seenEntries
            .filter((e) => e.hype > 0)
            .map((e) => (
              <span key={e.userId} className="hype-person">
                <span className={`avatar ${e.avatarStyle}`}>{e.name[0]}</span>
                <span className="hype-icons">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <HypeIcon
                      key={n}
                      size={12}
                      className={n <= e.hype ? 'hype-on' : 'hype-off'}
                    />
                  ))}
                </span>
              </span>
            ))
        ) : (
          <span className="seen-no">—</span>
        )}
      </div>
      <div>
        {groupe.seenEntries.some((entry) => entry.count > 0) ? (
          <div className="seen-detail">
            {groupe.seenEntries
              .filter((entry) => entry.count > 0)
              .map((entry) => (
                <span key={entry.userId} className="seen-person">
                  <span className={`avatar ${entry.avatarStyle}`}>{entry.name[0]}</span>
                  ×{entry.count}
                </span>
              ))}
          </div>
        ) : (
          <span className="seen-no">Pas encore</span>
        )}
      </div>
      <div className="col-added">
        <div className={`avatar ${groupe.addedByGenre}`}>{groupe.addedByName[0]}</div>
        <div>
          <div>{groupe.addedByName}</div>
          <div className="date">{groupe.addedDate}</div>
        </div>
      </div>
      <div className="row-actions">
        <button title="Modifier" onClick={() => onEdit(groupe)}>✎</button>
        <button title="Supprimer" onClick={() => onDelete(groupe)}>✕</button>
      </div>
    </div>
  )
}

export default GroupRow