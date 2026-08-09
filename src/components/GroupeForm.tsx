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
}

// Extrait le nom de fichier depuis une URL publique Supabase
// (l'URL finit par .../groupes/123456.jpg → on veut "123456.jpg")
function fileNameFromPublicUrl(url: string): string | null {
  const parts = url.split('/groupes/')
  return parts.length === 2 ? parts[1] : null
}

function GroupeForm({ groupe, profils, onClose, onSaved }: GroupeFormProps) {
  const [form, setForm] = useState(
    groupe
      ? {
          name: groupe.name,
          label: groupe.label,
          genre: groupe.genre,
          country: groupe.country,
        }
      : EMPTY_FORM
  )

  const [photoUrl, setPhotoUrl] = useState(groupe?.photoUrl ?? '')
  const [isUploading, setIsUploading] = useState(false)

  const [seenCounts, setSeenCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const profil of profils) {
      const existing = groupe?.seenEntries.find((e) => e.userId === profil.id)
      initial[profil.id] = existing ? existing.count : 0
    }
    return initial
  })

  const [hypeLevels, setHypeLevels] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const profil of profils) {
      const existing = groupe?.seenEntries.find((e) => e.userId === profil.id)
      initial[profil.id] = existing ? existing.hype : 0
    }
    return initial
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  function updateSeenCount(userId: string, value: number) {
    setSeenCounts((previous) => ({ ...previous, [userId]: value }))
  }

  function updateHype(userId: string, value: number) {
    setHypeLevels((previous) => ({ ...previous, [userId]: value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setErrorMessage('')

    // Remplacement propre : on supprime l'ancienne image d'abord, s'il y en a une
    if (photoUrl) {
      const oldName = fileNameFromPublicUrl(photoUrl)
      if (oldName) {
        await supabase.storage.from('groupes').remove([oldName])
      }
    }

    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExtension}`

    const { error: uploadError } = await supabase.storage
      .from('groupes')
      .upload(fileName, file)

    if (uploadError) {
      setErrorMessage('Upload impossible : ' + uploadError.message)
      setIsUploading(false)
      return
    }

    const { data } = supabase.storage.from('groupes').getPublicUrl(fileName)

    setPhotoUrl(data.publicUrl)
    setIsUploading(false)
  }

  async function handleRemovePhoto() {
    if (!photoUrl) return

    const oldName = fileNameFromPublicUrl(photoUrl)
    if (oldName) {
      await supabase.storage.from('groupes').remove([oldName])
    }
    setPhotoUrl('')
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
      photo_url: photoUrl || null,
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

    const rows = profils.map((profil) => ({
      groupe_id: groupeId,
      user_id: profil.id,
      seen_count: seenCounts[profil.id] ?? 0,
      hype_level: hypeLevels[profil.id] ?? 0,
    }))

    const { error: membreError } = await supabase
      .from('groupe_membres')
      .upsert(rows, { onConflict: 'groupe_id,user_id' })

    setIsSaving(false)

    if (membreError) {
      setErrorMessage(membreError.message)
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
            <label>Photo du groupe</label>
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
            <label>Par personne — hype et concerts vus</label>
            {profils.map((profil) => (
              <div key={profil.id} className="membre-row">
                <span className={`avatar ${profil.avatar_style}`}>{profil.display_name[0]}</span>
                <span className="membre-name">{profil.display_name}</span>
                <select
                  value={hypeLevels[profil.id] ?? 0}
                  onChange={(e) => updateHype(profil.id, Number(e.target.value))}
                  title="Niveau de hype"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} {form.genre === 'kpop' ? '💜' : '🔥'}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  value={seenCounts[profil.id] ?? 0}
                  onChange={(e) => updateSeenCount(profil.id, Number(e.target.value))}
                  title="Nombre de fois vu"
                />
              </div>
            ))}
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-ghost primary" disabled={isSaving || isUploading}>
              {isSaving ? 'Enregistrement...' : groupe ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupeForm