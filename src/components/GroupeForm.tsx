import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Groupe } from '../types'

type GroupeFormProps = {
  groupe: Groupe | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM = {
  name: '',
  label: '',
  genre: 'kpop',
  country: '',
  loveLevel: 3,
  isSeen: false,
  seenLabel: '',
}

function GroupeForm({ groupe, onClose, onSaved }: GroupeFormProps) {
  const [form, setForm] = useState(
    groupe
      ? {
          name: groupe.name,
          label: groupe.label,
          genre: groupe.genre,
          country: groupe.country,
          loveLevel: groupe.loveLevel,
          isSeen: groupe.seen,
          seenLabel: groupe.seenLabel,
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
      label: form.label || null,
      genre: form.genre,
      country: form.country,
      cover_initials: form.name.slice(0, 2).toUpperCase(),
      love_level: form.loveLevel,
      is_seen: form.isSeen,
      seen_label: form.seenLabel || null,
    }

    let response

    if (groupe) {
      response = await supabase.from('groupes').update(payload).eq('id', groupe.id)
    } else {
      const { data: userData } = await supabase.auth.getUser()
      response = await supabase
        .from('groupes')
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
          <div className="modal-title">{groupe ? 'Modifier le groupe' : 'Nouveau groupe'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Nom du groupe</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Label · ville</label>
            <input
              type="text"
              placeholder="JYP · Seoul"
              value={form.label}
              onChange={(e) => updateField('label', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Genre</label>
              <select value={form.genre} onChange={(e) => updateField('genre', e.target.value)}>
                <option value="kpop">Kpop</option>
                <option value="metal">Métal</option>
              </select>
            </div>
            <div className="field">
              <label>Pays</label>
              <input
                type="text"
                placeholder="🇰🇷 Corée"
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Niveau d'amour (0 à 5)</label>
            <select
              value={form.loveLevel}
              onChange={(e) => updateField('loveLevel', Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <label className="field-check">
            <input
              type="checkbox"
              checked={form.isSeen}
              onChange={(e) => updateField('isSeen', e.target.checked)}
            />
            Déjà vu en concert
          </label>

          <div className="field">
            <label>Mention « vu »</label>
            <input
              type="text"
              placeholder={form.isSeen ? '3 fois' : 'Pas encore'}
              value={form.seenLabel}
              onChange={(e) => updateField('seenLabel', e.target.value)}
            />
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-ghost primary" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : groupe ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupeForm