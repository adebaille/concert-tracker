import type { Reve } from '../types'
import { participantsLabel } from '../lib/participants'

type DreamCardProps = {
  reve: Reve
  onEdit: (reve: Reve) => void
  onDelete: (reve: Reve) => void
}

function DreamCard({ reve, onEdit, onDelete }: DreamCardProps) {
  const dateLabel = reve.priority === 'ultime' ? 'Date estimée' : 'Date possible'
  const budgetLabel = reve.priority === 'ultime' ? 'Budget rêvé' : 'Budget'

  const footLabel = reve.note
    ? `${participantsLabel(reve.participants)} · ${reve.note}`
    : participantsLabel(reve.participants)

  return (
    <article className={`wl-card ${reve.priority}`}>
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
          <button title="Modifier" onClick={() => onEdit(reve)}>✎</button>
          <button title="Supprimer" onClick={() => onDelete(reve)}>✕</button>
        </div>
      </div>
    </article>
  )
}

export default DreamCard