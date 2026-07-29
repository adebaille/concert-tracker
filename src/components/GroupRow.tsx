import type { Groupe } from '../types'

type GroupRowProps = {
  groupe: Groupe
  index: number
  onEdit: (groupe: Groupe) => void
  onDelete: (groupe: Groupe) => void
}

const LOVE_EMOJI = { kpop: '💜', metal: '🔥' }

function GroupRow({ groupe, index, onEdit, onDelete }: GroupRowProps) {
  const variant = ['', '2', '3'][index % 3]
  const coverClass = `${groupe.genre}${variant}`

  return (
    <div className="gr-row">
      <div className="col-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="col-name">
        <div className={`band-cover ${coverClass}`}>{groupe.coverInitials}</div>
        <div className="band-name-cell">
          <div className="name">{groupe.name}</div>
          <div className="country">{groupe.label}</div>
        </div>
      </div>
      <div>
        <span className={`genre-badge ${groupe.genre}`}>
          {groupe.genre === 'kpop' ? 'Kpop' : 'Métal'}
        </span>
      </div>
      <div className="col-style">{groupe.country}</div>
      <div className="love">{LOVE_EMOJI[groupe.genre].repeat(groupe.loveLevel)}</div>
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