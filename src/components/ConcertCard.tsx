import type { Concert } from "../types";
import { participantsLabel } from "../lib/participants";
import { buildConcertICS, downloadICS } from "../lib/calendar";

type ConcertCardProps = {
  concert: Concert;
  isFocused?: boolean;
  onEdit: (concert: Concert) => void;
  onDelete: (concert: Concert) => void;
};

const STATUS_LABELS = {
  prevu: "Prévu",
  passe: "Passé",
  annule: "Annulé",
};

function ConcertCard({ concert, isFocused, onEdit, onDelete }: ConcertCardProps) {
  function handleAddToCalendar() {
    const content = buildConcertICS(concert);
    downloadICS(`${concert.name}.ics`, content);
  }

  // Photo en poster seulement si UN seul groupe est à l'affiche ET qu'il est suivi
  // avec une photo. Sinon (plusieurs groupes, festival, nom libre) : nom + vignettes.
  const soloEntry = concert.lineup.length === 1 ? concert.lineup[0] : null;
  const soloGroupPhoto =
    soloEntry && soloEntry.isFollowed ? soloEntry.groupePhotoUrl : null;
  const posterPhoto = concert.photoUrl ?? soloGroupPhoto;

  return (
    <article
      id={`concert-${concert.id}`}
      className={`concert-card ${isFocused ? "is-focused" : ""}`}
    >
      <div className="card-actions">
        {concert.status === "prevu" && (
          <button title="Ajouter à l'agenda" onClick={handleAddToCalendar}>
            📅
          </button>
        )}
        <button title="Modifier" onClick={() => onEdit(concert)}>
          ✎
        </button>
        <button title="Supprimer" onClick={() => onDelete(concert)}>
          ✕
        </button>
      </div>
      <div className={`cc-poster ${concert.genre} ${posterPhoto ? "has-photo" : ""}`}>
        {posterPhoto ? (
          <img src={posterPhoto} alt={concert.name} className="cc-poster-img" />
        ) : (
          <>
            <div className="big-bg">{concert.bigBg}</div>
          </>
        )}
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

        {concert.lineup.length > 0 && (
          <div className="cc-lineup">
            {concert.lineup.map((entry) => (
              <span
                key={entry.id}
                className={`lineup-tag ${entry.isFollowed ? "followed" : ""} ${
                  entry.groupePhotoUrl ? "has-photo" : ""
                }`}>
                {entry.groupePhotoUrl && (
                  <span className="lineup-tag-photo">
                    <img src={entry.groupePhotoUrl} alt={entry.groupeName} />
                  </span>
                )}
                {entry.groupeName}
              </span>
            ))}
          </div>
        )}

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
                <div key={p.name} className={`avatar ${p.avatarStyle}`}>
                  {p.name[0]}
                </div>
              ))}
            </div>
            <span className="label-mono">
              {participantsLabel(concert.participants)}
            </span>
          </div>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= concert.rating ? "on" : ""}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ConcertCard;