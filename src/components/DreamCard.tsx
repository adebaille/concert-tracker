import type { Reve } from '../types'

type DreamCardProps = {
  reve: Reve
}

function DreamCard({ reve }: DreamCardProps) {
  const dateLabel = reve.priority === 'ultime' ? 'Date estimée' : 'Date possible'
  const budgetLabel = reve.priority === 'ultime' ? 'Budget rêvé' : 'Budget'

  return (
    <article className={`wl-card ${reve.priority}`}>
      <div className="wl-card-head">
        <div className="band">
          <span className={`badge-genre ${reve.genre}`}>
            {reve.genre === 'kpop' ? 'Kpop' : 'Métal'}
          </span>
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
            {reve.avatarGenres.map((genre, i) => (
              <div key={i} className={`avatar ${genre}`}>{genre === 'kpop' ? 'A' : 'E'}</div>
            ))}
          </div>
          <span className="label-mono">{reve.note}</span>
        </div>
      </div>
    </article>
  )
}

export default DreamCard