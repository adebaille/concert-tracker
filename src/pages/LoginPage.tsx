import { useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabaseClient'
import '../styles/auth.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMessage('Email ou mot de passe incorrect.')
    }
    setIsLoading(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-name">CONCERT <span className="accent">TRACKER</span></div>
          <div className="brand-sub">Connexion</div>
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
          <div>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button className="btn-ghost primary auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <Link to="/mot-de-passe-oublie" className="auth-link">
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  )
}

export default LoginPage