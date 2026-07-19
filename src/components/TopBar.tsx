type TopbarProps = {
  currentPage: string
}

function Topbar({ currentPage }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="crumbs">
        <span>Univers</span>
        <span className="sep">/</span>
        <span className="here">{currentPage}</span>
      </div>
      <div className="topbar-right">
        <div className="user-pill">
          <div className="avatar kpop">A</div>
          <span className="label">Connectée</span>
          <span className="name">Alison</span>
        </div>
        <button className="btn-add">
          <span className="plus">+</span>
          Ajouter
        </button>
      </div>
    </div>
  )
}

export default Topbar