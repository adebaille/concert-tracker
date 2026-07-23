import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toDateTimeLocalValue } from '../lib/formatDate'
import type { Concert } from '../types'

type ConcertFormProps = {
  concert: Concert | null
  onClose: () => void
  onSaved: () => void
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
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field: keyof typeof EMPTY_FORM, value: string | number | boolean) {
    setForm((previous) => ({ ...previous, [field]: value }))
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
    }

    let response

    if (concert) {
      response = await supabase.from('concerts').update(payload).eq('id', concert.id)
    } else {
      const { data: userData } = await supabase.auth.getUser()
      response = await supabase
        .from('concerts')
        .insert({ ...payload, added_by: userData.user?.id })
    }

    setIsSaving(false)

    if (response.error) {
      setErrorMessage(response.error.message)
      return
    }

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
                <option value="fest">Festival</option>
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
            <button type="submit" className="btn-ghost primary" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : concert ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConcertForm