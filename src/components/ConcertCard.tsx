import type { Concert } from '../types'
import { participantsLabel } from '../lib/participants'

type ConcertCardProps = {
  concert: Concert
  onEdit: (concert: Concert) => void
  onDelete: (concert: Concert) => void
}

const STATUS_LABELS = {
  prevu: 'Prévu',
  passe: 'Passé',
  annule: 'Annulé',
}

function ConcertCard({ concert, onEdit, onDelete }: ConcertCardProps) {
  return (
    <article className="concert-card">
      <div className="card-actions">
        <button title="Modifier" onClick={() => onEdit(concert)}>✎</button>
        <button title="Supprimer" onClick={() => onDelete(concert)}>✕</button>
      </div>
      <div className={`cc-poster ${concert.genre}`}>
        <div className="placeholder-line">{concert.photoLabel}</div>
        <div className="big-bg">{concert.bigBg}</div>
        <span className={`status-badge ${concert.status}`}>
          {STATUS_LABELS[concert.status]}
        </span>
      </div>
      <div className="cc-body">
        <div className="cc-head">
          <div className="cc-date">{concert.date}</div>
          <div className="cc-price">{concert.price} €</div>
        </div>
        <div className="cc-name">{concert.name}</div>
        <div className="cc-where">
          {concert.venue} <span className="sep">·</span> {concert.city}
        </div>

        {concert.setlist && (
          <div className="cc-bands">
            <strong>Set list :</strong> {concert.setlist}
          </div>
        )}
        {concert.anecdote && (
          <div className="cc-anecdote">{concert.anecdote}</div>
        )}

        <div className="cc-foot">
          <div className="cc-foot-left">
            <div className="avatars">
              {concert.participants.map((p) => (
                <div key={p.name} className={`avatar ${p.avatarStyle}`}>{p.name[0]}</div>
              ))}
            </div>
            <span className="label-mono">{participantsLabel(concert.participants)}</span>
          </div>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= concert.rating ? 'on' : ''}>★</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ConcertCard