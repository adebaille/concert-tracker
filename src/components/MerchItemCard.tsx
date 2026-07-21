import type { MerchItem as MerchItemData } from '../types'

type MerchItemCardProps = {
  item: MerchItemData
}

const PREVIEW_EMOJI = {
  tee: '👕', hoodie: '🧥', poster: '📜', cd: '💿',
  photocard: '📸', lightstick: '🪄', vinyl: '💿', cap: '🧢',
}

const OWNER_INFO = {
  alison: { name: 'Alison', avatarClass: 'kpop' },
  emeline: { name: 'Emeline', avatarClass: 'metal' },
}

function MerchItemCard({ item }: MerchItemCardProps) {
  const owner = OWNER_INFO[item.owner]

  return (
    <article className="mr-item">
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
            <div className={`avatar ${owner.avatarClass}`}>{owner.name[0]}</div>
            {owner.name}
          </div>
        </div>
      </div>
    </article>
  )
}

export default MerchItemCard