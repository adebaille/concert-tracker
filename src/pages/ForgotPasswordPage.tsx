import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabaseClient'
import '../styles/auth.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setIsSending(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setIsSending(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setInfoMessage('Si un compte existe pour cet email, un lien de réinitialisation vient d\'être envoyé. Pense à vérifier tes spams.')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-name">MOT DE PASSE <span className="accent">OUBLIÉ</span></div>
          <div className="brand-sub">On t'envoie un lien</div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          {infoMessage && <p className="auth-message">{infoMessage}</p>}

          <button className="btn-ghost primary auth-btn" type="submit" disabled={isSending}>
            {isSending ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <Link to="/" className="auth-link">Retour à la connexion</Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage