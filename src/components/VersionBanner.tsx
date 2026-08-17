import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/version-banner.css'

type Annonce = {
  id: number
  message: string
}

function VersionBanner() {
  const [annonce, setAnnonce] = useState<Annonce | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnnonce() {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id
      if (!uid) return
      setUserId(uid)

      // Toutes les annonces (les plus récentes d'abord)
      const { data: annonces } = await supabase
        .from('annonces')
        .select('id, message')
        .order('created_at', { ascending: false })

      // Les annonces que CET utilisateur a déjà vues
      const { data: vues } = await supabase
        .from('annonce_vues')
        .select('annonce_id')
        .eq('user_id', uid)

      const vuesIds = new Set((vues ?? []).map((v) => v.annonce_id))

      // La première annonce non vue
      const nonVue = (annonces ?? []).find((a) => !vuesIds.has(a.id))
      setAnnonce(nonVue ?? null)
    }
    loadAnnonce()
  }, [])

  async function handleMarkAsRead() {
    if (!annonce || !userId) return

    await supabase
      .from('annonce_vues')
      .insert({ annonce_id: annonce.id, user_id: userId })

    setAnnonce(null)
  }

  if (!annonce) return null

  return (
    <div className="version-banner">
      <span className="version-banner-message">{annonce.message}</span>
      <button className="version-banner-btn" onClick={handleMarkAsRead}>
        Lu
      </button>
    </div>
  )
}

export default VersionBanner