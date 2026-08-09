import { Shirt, Layers, ScrollText, Disc3, Image, Sparkles, Gem } from 'lucide-react'
import type { MerchItem as MerchItemData } from '../types'
import { participantsLabel } from '../lib/participants'

type MerchItemCardProps = {
  item: MerchItemData
  isFocused?: boolean
  onEdit: (item: MerchItemData) => void
  onDelete: (item: MerchItemData) => void
}

const PREVIEW_ICON = {
  tee: Shirt,
  hoodie: Layers,
  poster: ScrollText,
  cd: Disc3,
  vinyl: Disc3,
  photocard: Image,
  lightstick: Sparkles,
  cap: Gem,
}

function MerchItemCard({ item, isFocused, onEdit, onDelete }: MerchItemCardProps) {
  const Icon = PREVIEW_ICON[item.previewStyle]

  return (
    <article id={`merch-${item.id}`} className={`mr-item ${isFocused ? 'is-focused' : ''}`}>
      <div className="mr-actions">
        <button title="Modifier" onClick={() => onEdit(item)}>✎</button>
        <button title="Supprimer" onClick={() => onDelete(item)}>✕</button>
      </div>
      <div className={`preview ${item.previewStyle} ${item.photoUrl ? 'has-photo' : ''}`}>
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.name} className="preview-img" />
        ) : (
          <>
            <span className="bg-text">{item.bgText}</span>
            <Icon className="preview-icon" size={34} />
          </>
        )}
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