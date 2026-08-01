import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabaseClient'
import '../styles/auth.css'

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsReady(true)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setIsSaving(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    setIsSaving(false)

    if (error) {
      setMessage('Erreur : ' + error.message)
      return
    }

    setMessage('Mot de passe mis à jour ! Redirection...')
    setTimeout(() => navigate('/'), 1500)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-name">NOUVEAU <span className="accent">MOT DE PASSE</span></div>
          <div className="brand-sub">Presque fini</div>
        </div>

        {!isReady ? (
          <p className="auth-message">
            Ouvre le lien reçu par email pour réinitialiser ton mot de passe.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="btn-ghost primary auth-btn" type="submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Valider'}
            </button>
          </form>
        )}

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  )
}

export default ResetPasswordPage