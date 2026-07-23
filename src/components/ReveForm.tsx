import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Reve } from '../types'

type ReveFormProps = {
  reve: Reve | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  genre: 'kpop',
  priority: 'haute',
  dateValue: '',
  budget: '',
  note: '',
  isWatched: false,
  isShared: false,
}

function ReveForm({ reve, onClose, onSaved }: ReveFormProps) {
  const [form, setForm] = useState(
    reve
      ? {
          title: reve.title,
          subtitle: reve.subtitle,
          genre: reve.genre,
          priority: reve.priority,
          dateValue: reve.dateValue,
          budget: String(reve.budget),
          note: reve.note,
          isWatched: reve.isWatched,
          isShared: reve.isShared,
        }
      : EMPTY_FORM
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field: keyof typeof EMPTY_FORM, value: string | boolean) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setIsSaving(true)

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      genre: form.genre,
      priority: form.priority,
      date_value: form.dateValue || null,
      budget: form.budget === '' ? null : Number(form.budget),
      note: form.note || null,
      is_watched: form.isWatched,
      is_shared: form.isShared,
    }

    let response

    if (reve) {
      response = await supabase.from('reves').update(payload).eq('id', reve.id)
    } else {
      const { data: userData } = await supabase.auth.getUser()
      response = await supabase
        .from('reves')
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
          <div className="modal-title">{reve ? 'Modifier le rêve' : 'Nouveau rêve'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Titre</label>
            <input
              type="text"
              placeholder="BTS · World Tour Reunion"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Sous-titre</label>
            <input
              type="text"
              placeholder="Si jamais ils reviennent. Si jamais Paris."
              value={form.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Priorité</label>
              <select value={form.priority} onChange={(e) => updateField('priority', e.target.value)}>
                <option value="ultime">Rêve ultime</option>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
              </select>
            </div>
            <div className="field">
              <label>Genre</label>
              <select value={form.genre} onChange={(e) => updateField('genre', e.target.value)}>
                <option value="kpop">Kpop</option>
                <option value="metal">Métal</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Date envisagée</label>
              <input
                type="text"
                placeholder="automne 2026"
                value={form.dateValue}
                onChange={(e) => updateField('dateValue', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Budget estimé (€)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.budget}
                onChange={(e) => updateField('budget', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Note</label>
            <input
              type="text"
              placeholder="rêve d'enfance"
              value={form.note}
              onChange={(e) => updateField('note', e.target.value)}
            />
          </div>

          <label className="field-check">
            <input
              type="checkbox"
              checked={form.isWatched}
              onChange={(e) => updateField('isWatched', e.target.checked)}
            />
            À surveiller (dates, billetterie)
          </label>

          <label className="field-check">
            <input
              type="checkbox"
              checked={form.isShared}
              onChange={(e) => updateField('isShared', e.target.checked)}
            />
            On y va à deux
          </label>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-ghost primary" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : reve ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReveForm