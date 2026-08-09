import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { MerchItem, GroupeOption, Profil } from '../types'

type MerchFormProps = {
  item: MerchItem | null
  groupes: GroupeOption[]
  profils: Profil[]
  currentUserId: string
  onClose: () => void
  onSaved: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'tshirt', label: 'T-shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'poster', label: 'Poster' },
  { value: 'cd-album', label: 'CD / Album' },
  { value: 'photocard', label: 'Photocard' },
  { value: 'lightstick', label: 'Lightstick' },
  { value: 'bijou', label: 'Bijou' },
]

const PREVIEW_OPTIONS = [
  { value: 'tee', label: 'T-shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'poster', label: 'Poster' },
  { value: 'cd', label: 'CD' },
  { value: 'vinyl', label: 'Vinyle' },
  { value: 'photocard', label: 'Photocard' },
  { value: 'lightstick', label: 'Lightstick' },
  { value: 'cap', label: 'Bijou' },
]

function MerchForm({ item, groupes, profils, currentUserId, onClose, onSaved }: MerchFormProps) {
  const [form, setForm] = useState(
    item
      ? {
          name: item.name,
          category: item.category as string,
          previewStyle: item.previewStyle as string,
          groupeId: item.groupeId === null ? '' : String(item.groupeId),
          bandNote: item.bandNote,
          price: String(item.price),
          ownerId: item.ownerId,
          isShared: item.isShared,
          anecdote: item.anecdote,
        }
      : {
          name: '',
          category: 'tshirt',
          previewStyle: 'tee',
          groupeId: '',
          bandNote: '',
          price: '',
          ownerId: currentUserId,
          isShared: false,
          anecdote: '',
        }
  )

  const [photoPath, setPhotoPath] = useState(item?.photoPath ?? '')
  const [photoPreview, setPhotoPreview] = useState(item?.photoUrl ?? '')
  const [isUploading, setIsUploading] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setErrorMessage('')

    // Remplacement propre : supprimer l'ancien fichier d'abord, s'il y en a un
    if (photoPath) {
      await supabase.storage.from('merch').remove([photoPath])
    }

    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExtension}`

    const { error: uploadError } = await supabase.storage
      .from('merch')
      .upload(fileName, file)

    if (uploadError) {
      setErrorMessage('Upload impossible : ' + uploadError.message)
      setIsUploading(false)
      return
    }

    // Bucket privé : on stocke le CHEMIN, et on génère une URL signée juste pour l'aperçu
    setPhotoPath(fileName)

    const { data } = await supabase.storage
      .from('merch')
      .createSignedUrl(fileName, 3600)

    if (data) setPhotoPreview(data.signedUrl)
    setIsUploading(false)
  }

  async function handleRemovePhoto() {
    if (!photoPath) return

    await supabase.storage.from('merch').remove([photoPath])
    setPhotoPath('')
    setPhotoPreview('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setIsSaving(true)

    const payload = {
      name: form.name,
      category: form.category,
      preview_style: form.previewStyle,
      groupe_id: form.groupeId === '' ? null : Number(form.groupeId),
      band_note: form.bandNote || null,
      price: form.price === '' ? null : Number(form.price),
      owner_id: form.ownerId,
      is_shared: form.isShared,
      anecdote: form.anecdote || null,
      photo_url: photoPath || null,
    }

    let response

    if (item) {
      response = await supabase.from('merch').update(payload).eq('id', item.id)
    } else {
      response = await supabase.from('merch').insert(payload)
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
          <div className="modal-title">{item ? "Modifier l'item" : 'Nouvel item'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Nom de l'item</label>
            <input
              type="text"
              placeholder="Take Me Back to Eden — Hoodie"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Photo de l'item</label>
            <div className="photo-upload">
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Aperçu" />
                ) : (
                  <span className="photo-placeholder">{form.name || 'Aperçu'}</span>
                )}
              </div>
              <div className="photo-buttons">
                <label className="btn-ghost photo-btn">
                  {isUploading ? 'Envoi...' : photoPath ? 'Changer' : 'Choisir une image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    hidden
                  />
                </label>
                {photoPath && (
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
              <label>Catégorie</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Vignette</label>
              <select value={form.previewStyle} onChange={(e) => updateField('previewStyle', e.target.value)}>
                {PREVIEW_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Groupe</label>
            <select value={form.groupeId} onChange={(e) => updateField('groupeId', e.target.value)}>
              <option value="">— aucun —</option>
              {groupes.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Année / tournée</label>
              <input
                type="text"
                placeholder="Tour 2025"
                value={form.bandNote}
                onChange={(e) => updateField('bandNote', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Prix payé (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Propriétaire</label>
            <select
              value={form.ownerId}
              onChange={(e) => updateField('ownerId', e.target.value)}
              disabled={form.isShared}
            >
              {profils.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
          </div>

          <label className="field-check">
            <input
              type="checkbox"
              checked={form.isShared}
              onChange={(e) => updateField('isShared', e.target.checked)}
            />
            Item commun (à deux)
          </label>

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
              {isSaving ? 'Enregistrement...' : item ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MerchForm