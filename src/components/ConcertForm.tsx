import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toDateTimeLocalValue } from '../lib/formatDate'
import type { Concert, GroupeOption } from '../types'

type ConcertFormProps = {
  concert: Concert | null
  onClose: () => void
  onSaved: () => void
}

type LineupDraft = {
  mode: 'suivi' | 'libre'
  groupeId: string
  groupeName: string
}

const EMPTY_FORM = {
  name: '',
  type: 'concert',
  genre: 'kpop',
  eventDate: '',
  venue: '',
  city: '',
  status: 'prevu',
  price: '',
  hasTickets: false,
  rating: 0,
  setlist: '',
  anecdote: '',
  isShared: false,
}

// L'URL publique finit par .../concerts/123456.jpg → on extrait "123456.jpg"
function fileNameFromPublicUrl(url: string): string | null {
  const parts = url.split('/concerts/')
  return parts.length === 2 ? parts[1] : null
}

function ConcertForm({ concert, onClose, onSaved }: ConcertFormProps) {
  const [form, setForm] = useState(
    concert
      ? {
          name: concert.name,
          type: concert.type,
          genre: concert.genre,
          eventDate: toDateTimeLocalValue(concert.eventDate),
          venue: concert.venue,
          city: concert.city,
          status: concert.status,
          price: String(concert.price),
          hasTickets: concert.hasTickets,
          rating: concert.rating,
          setlist: concert.setlist ?? '',
          anecdote: concert.anecdote ?? '',
          isShared: concert.isShared,
        }
      : EMPTY_FORM
  )

  const [photoUrl, setPhotoUrl] = useState(concert?.photoUrl ?? '')
  const [isUploading, setIsUploading] = useState(false)

  const [lineup, setLineup] = useState<LineupDraft[]>(
    concert
      ? concert.lineup.map((entry) => ({
          mode: entry.isFollowed ? 'suivi' : 'libre',
          groupeId: entry.groupeId !== null ? String(entry.groupeId) : '',
          groupeName: entry.isFollowed ? '' : entry.groupeName,
        }))
      : []
  )

  const [groupeOptions, setGroupeOptions] = useState<GroupeOption[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadGroupes() {
      const { data } = await supabase.from('groupes').select('id, name').order('name')
      setGroupeOptions((data ?? []) as GroupeOption[])
    }
    loadGroupes()
  }, [])

  function updateField(field: keyof typeof EMPTY_FORM, value: string | number | boolean) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setErrorMessage('')

    // Remplacement propre : supprimer l'ancienne image d'abord, s'il y en a une
    if (photoUrl) {
      const oldName = fileNameFromPublicUrl(photoUrl)
      if (oldName) {
        await supabase.storage.from('concerts').remove([oldName])
      }
    }

    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExtension}`

    const { error: uploadError } = await supabase.storage
      .from('concerts')
      .upload(fileName, file)

    if (uploadError) {
      setErrorMessage('Upload impossible : ' + uploadError.message)
      setIsUploading(false)
      return
    }

    const { data } = supabase.storage.from('concerts').getPublicUrl(fileName)

    setPhotoUrl(data.publicUrl)
    setIsUploading(false)
  }

  async function handleRemovePhoto() {
    if (!photoUrl) return

    const oldName = fileNameFromPublicUrl(photoUrl)
    if (oldName) {
      await supabase.storage.from('concerts').remove([oldName])
    }
    setPhotoUrl('')
  }

  function addLineupRow() {
    setLineup((previous) => [...previous, { mode: 'suivi', groupeId: '', groupeName: '' }])
  }

  function removeLineupRow(index: number) {
    setLineup((previous) => previous.filter((_, i) => i !== index))
  }

  function updateLineupRow(index: number, changes: Partial<LineupDraft>) {
    setLineup((previous) =>
      previous.map((row, i) => (i === index ? { ...row, ...changes } : row))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setIsSaving(true)

    const payload = {
      name: form.name,
      type: form.type,
      genre: form.genre,
      event_date: new Date(form.eventDate).toISOString(),
      venue: form.venue,
      city: form.city,
      status: form.status,
      price: form.price === '' ? null : Number(form.price),
      has_tickets: form.hasTickets,
      rating: form.status === 'passe' ? form.rating : null,
      setlist: form.setlist || null,
      anecdote: form.anecdote || null,
      is_shared: form.isShared,
      photo_url: photoUrl || null,
    }

    let concertId = concert?.id

    if (concert) {
      const { error } = await supabase.from('concerts').update(payload).eq('id', concert.id)
      if (error) { setErrorMessage(error.message); setIsSaving(false); return }
    } else {
      const { data: userData } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('concerts')
        .insert({ ...payload, added_by: userData.user?.id })
        .select('id')
        .single()
      if (error) { setErrorMessage(error.message); setIsSaving(false); return }
      concertId = data.id
    }

    await supabase.from('concert_lineup').delete().eq('concert_id', concertId)

    const lineupRows = lineup
      .filter((row) => (row.mode === 'suivi' ? row.groupeId !== '' : row.groupeName.trim() !== ''))
      .map((row) => ({
        concert_id: concertId,
        groupe_id: row.mode === 'suivi' ? Number(row.groupeId) : null,
        groupe_name: row.mode === 'libre' ? row.groupeName.trim() : null,
      }))

    if (lineupRows.length > 0) {
      const { error: lineupError } = await supabase.from('concert_lineup').insert(lineupRows)
      if (lineupError) { setErrorMessage(lineupError.message); setIsSaving(false); return }
    }

    setIsSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{concert ? 'Modifier' : 'Nouveau concert'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Nom de l'événement</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Photo / affiche</label>
            <div className="photo-upload">
              <div className="photo-preview">
                {photoUrl ? (
                  <img src={photoUrl} alt="Aperçu" />
                ) : (
                  <span className="photo-placeholder">{form.name || 'Aperçu'}</span>
                )}
              </div>
              <div className="photo-buttons">
                <label className="btn-ghost photo-btn">
                  {isUploading ? 'Envoi...' : photoUrl ? 'Changer' : 'Choisir une image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    hidden
                  />
                </label>
                {photoUrl && (
                  <button
                    type="button"
                    className="btn-ghost photo-remove"
                    onClick={handleRemovePhoto}
                    disabled={isUploading}
                  >
                    Retirer
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                <option value="concert">Concert</option>
                <option value="festival">Festival</option>
              </select>
            </div>
            <div className="field">
              <label>Ambiance (couleur)</label>
              <select value={form.genre} onChange={(e) => updateField('genre', e.target.value)}>
                <option value="kpop">Kpop</option>
                <option value="metal">Métal</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Date et heure</label>
            <input
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) => updateField('eventDate', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Salle</label>
              <input
                type="text"
                placeholder="Zénith"
                value={form.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Ville</label>
              <input
                type="text"
                placeholder="Lyon"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Statut</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="prevu">Prévu</option>
                <option value="passe">Passé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
            <div className="field">
              <label>Prix (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
              />
            </div>
          </div>

          {form.status === 'passe' && (
            <div className="field">
              <label>Note souvenir (0 à 5 ★)</label>
              <select
                value={form.rating}
                onChange={(e) => updateField('rating', Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <label className="field-check">
            <input
              type="checkbox"
              checked={form.hasTickets}
              onChange={(e) => updateField('hasTickets', e.target.checked)}
            />
            Billets achetés
          </label>

          <label className="field-check">
            <input
              type="checkbox"
              checked={form.isShared}
              onChange={(e) => updateField('isShared', e.target.checked)}
            />
            On y va à deux
          </label>

          <div className="field">
            <label>Programmation</label>
            {lineup.map((row, index) => (
              <div key={index} className="lineup-row">
                <select
                  value={row.mode}
                  onChange={(e) => updateLineupRow(index, { mode: e.target.value as 'suivi' | 'libre' })}
                >
                  <option value="suivi">Groupe suivi</option>
                  <option value="libre">Nom libre</option>
                </select>

                {row.mode === 'suivi' ? (
                  <select
                    value={row.groupeId}
                    onChange={(e) => updateLineupRow(index, { groupeId: e.target.value })}
                  >
                    <option value="">— choisir —</option>
                    {groupeOptions.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Nom du groupe"
                    value={row.groupeName}
                    onChange={(e) => updateLineupRow(index, { groupeName: e.target.value })}
                  />
                )}

                <button type="button" className="lineup-remove" onClick={() => removeLineupRow(index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-ghost lineup-add" onClick={addLineupRow}>
              + Ajouter un groupe
            </button>
          </div>

          <div className="field">
            <label>Set list</label>
            <textarea
              placeholder="Fearless · Antifragile · Unforgiven"
              value={form.setlist}
              onChange={(e) => updateField('setlist', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Anecdote</label>
            <textarea
              value={form.anecdote}
              onChange={(e) => updateField('anecdote', e.target.value)}
            />
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-ghost primary" disabled={isSaving || isUploading}>
              {isSaving ? 'Enregistrement...' : concert ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConcertForm