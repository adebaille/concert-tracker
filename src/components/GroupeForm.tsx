import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Groupe, Profil } from '../types'

type GroupeFormProps = {
  groupe: Groupe | null
  profils: Profil[]
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM = {
  name: '',
  label: '',
  genre: 'kpop',
  country: '',
  loveLevel: 3,
}

function GroupeForm({ groupe, profils, onClose, onSaved }: GroupeFormProps) {
  const [form, setForm] = useState(
    groupe
      ? {
          name: groupe.name,
          label: groupe.label,
          genre: groupe.genre,
          country: groupe.country,
          loveLevel: groupe.loveLevel,
        }
      : EMPTY_FORM
  )

  // Un compteur par profil, indexé par user_id : { "uuid-alison": 3, "uuid-emeline": 1 }
  const [seenCounts, setSeenCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const profil of profils) {
      const existing = groupe?.seenEntries.find((e) => e.userId === profil.id)
      initial[profil.id] = existing ? existing.count : 0
    }
    return initial
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field: keyof typeof EMPTY_FORM, value: string | number) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  function updateSeenCount(userId: string, value: number) {
    setSeenCounts((previous) => ({ ...previous, [userId]: value }))
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
    }

    let groupeId = groupe?.id

    if (groupe) {
      const { error } = await supabase.from('groupes').update(payload).eq('id', groupe.id)
      if (error) { setErrorMessage(error.message); setIsSaving(false); return }
    } else {
      const { data: userData } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('groupes')
        .insert({ ...payload, added_by: userData.user?.id })
        .select('id')
        .single()
      if (error) { setErrorMessage(error.message); setIsSaving(false); return }
      groupeId = data.id
    }

    // Enregistrer les vues : une ligne par personne, dans groupe_vues
    const rows = profils.map((profil) => ({
      groupe_id: groupeId,
      user_id: profil.id,
      seen_count: seenCounts[profil.id] ?? 0,
    }))

    const { error: seenError } = await supabase
      .from('groupe_vues')
      .upsert(rows, { onConflict: 'groupe_id,user_id' })

    setIsSaving(false)

    if (seenError) {
      setErrorMessage(seenError.message)
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

          <div className="field">
            <label>Vu en concert — nombre de fois par personne</label>
            {profils.map((profil) => (
              <div key={profil.id} className="seen-input-row">
                <span className={`avatar ${profil.avatar_style}`}>{profil.display_name[0]}</span>
                <span className="seen-input-name">{profil.display_name}</span>
                <input
                  type="number"
                  min="0"
                  value={seenCounts[profil.id] ?? 0}
                  onChange={(e) => updateSeenCount(profil.id, Number(e.target.value))}
                />
              </div>
            ))}
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