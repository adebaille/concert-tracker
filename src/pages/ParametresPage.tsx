import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function ParametresPage() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setMessage('Mot de passe mis à jour !')
      setNewPassword('')
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Paramètres</h1>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
        <label className="nc-label">Nouveau mot de passe</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          required
        />
        {message && <p style={{ fontSize: 13 }}>{message}</p>}
        <button className="btn-ghost primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </>
  )
}

export default ParametresPage