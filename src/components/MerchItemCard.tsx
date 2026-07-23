import type { MerchItem as MerchItemData } from '../types'
import { participantsLabel } from '../lib/participants'

type MerchItemCardProps = {
  item: MerchItemData
  onEdit: (item: MerchItemData) => void
  onDelete: (item: MerchItemData) => void
}

const PREVIEW_EMOJI = {
  tee: '👕', hoodie: '🧥', poster: '📜', cd: '💿',
  photocard: '📸', lightstick: '🪄', vinyl: '💿', cap: '🧢',
}

function MerchItemCard({ item, onEdit, onDelete }: MerchItemCardProps) {
  return (
    <article className="mr-item">
      <div className="mr-actions">
        <button title="Modifier" onClick={() => onEdit(item)}>✎</button>
        <button title="Supprimer" onClick={() => onDelete(item)}>✕</button>
      </div>
      <div className={`preview ${item.previewStyle}`}>
        <span className="bg-text">{item.bgText}</span>
        <span className="emoji">{PREVIEW_EMOJI[item.previewStyle]}</span>
      </div>
      <div className="body">
        <div className="cat">{item.details}</div>
        <div className="name">{item.name}</div>
        <div className="band">{item.band} · {item.bandNote}</div>
        <div className="foot">
          <div className="price">{item.price} €</div>
          <div className="owner">
            <div className="avatars">
              {item.participants.map((p) => (
                <div key={p.name} className={`avatar ${p.avatarStyle}`}>{p.name[0]}</div>
              ))}
            </div>
            {participantsLabel(item.participants)}
          </div>
        </div>
      </div>
    </article>
  )
}

export default MerchItemCard