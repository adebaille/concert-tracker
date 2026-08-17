import type { Reve } from '../types'
import { participantsLabel } from '../lib/participants'
import { Ticket } from 'lucide-react'

type DreamCardProps = {
  reve: Reve
  isFocused?: boolean
  onEdit: (reve: Reve) => void
  onDelete: (reve: Reve) => void
  onConvert: (reve: Reve) => void
}

function DreamCard({ reve, isFocused, onEdit, onDelete, onConvert }: DreamCardProps) {
  const dateLabel = reve.priority === 'haute' ? 'Date estimée' : 'Date possible'
  const budgetLabel = reve.priority === 'haute' ? 'Budget rêvé' : 'Budget'

  const footLabel = reve.note
    ? `${participantsLabel(reve.participants)} · ${reve.note}`
    : participantsLabel(reve.participants)

  return (
    <article id={`reve-${reve.id}`} className={`wl-card ${reve.priority} ${isFocused ? 'is-focused' : ''}`}>
      <div className="wl-card-head">
        <div className="band">
          <span className={`badge-genre ${reve.genre}`}>
            {reve.genre === 'kpop' ? 'Kpop' : 'Métal'}
          </span>
          {reve.isWatched && <span className="label-mono">👀 à surveiller</span>}
        </div>
      </div>
      <div>
        <div className="title">{reve.title}</div>
        <div className="sub-title">{reve.subtitle}</div>
      </div>
      <div className="wl-card-meta">
        <div className="wl-meta-cell">
          <div className="wl-meta-label">{dateLabel}</div>
          <div className="wl-meta-value mono">{reve.dateValue}</div>
        </div>
        <div className="wl-meta-cell">
          <div className="wl-meta-label">{budgetLabel}</div>
          <div className="wl-meta-value mono">~ {reve.budget} €</div>
        </div>
      </div>
      <div className="wl-card-foot">
        <div className="by">
          <div className="avatars">
            {reve.participants.map((p) => (
              <div key={p.name} className={`avatar ${p.avatarStyle}`}>{p.name[0]}</div>
            ))}
          </div>
          <span className="label-mono">{footLabel}</span>
        </div>
        <div className="actions">
          <button title="Billets pris → créer le concert" onClick={() => onConvert(reve)}>
            <Ticket size={15} />
          </button>
          <button title="Modifier" onClick={() => onEdit(reve)}>✎</button>
          <button title="Supprimer" onClick={() => onDelete(reve)}>✕</button>
        </div>
      </div>
    </article>
  )
}

export default DreamCard