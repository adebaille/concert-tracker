import type { Groupe } from '../types'

type GroupRowProps = {
  groupe: Groupe
  index: number
}

const LOVE_EMOJI = { kpop: '💜', metal: '🔥' }

function GroupRow({ groupe, index }: GroupRowProps) {
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
        <span className={groupe.seen ? 'seen-yes' : 'seen-no'}>{groupe.seenLabel}</span>
      </div>
      <div className="col-added">
        <div className={`avatar ${groupe.addedByGenre}`}>{groupe.addedByName[0]}</div>
        <div>
          <div>{groupe.addedByName}</div>
          <div className="date">{groupe.addedDate}</div>
        </div>
      </div>
    </div>
  )
}

export default GroupRow