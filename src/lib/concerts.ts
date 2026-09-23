import { supabase } from './supabaseClient'

type ConcertStatusRow = {
  id: number
  status: 'prevu' | 'passe' | 'annule'
  event_date: string
}

// Bascule en base les concerts "prevu" dont la date est depassee,
// et renvoie la liste avec les statuts a jour (pas besoin de recharger).
export async function syncPastConcerts<T extends ConcertStatusRow>(
  concerts: T[]
): Promise<T[]> {
  const now = new Date()
  const idsToUpdate = concerts
    .filter((c) => c.status === 'prevu' && new Date(c.event_date) < now)
    .map((c) => c.id)

  if (idsToUpdate.length === 0) return concerts

  await supabase.from('concerts').update({ status: 'passe' }).in('id', idsToUpdate)

  return concerts.map((c) =>
    idsToUpdate.includes(c.id) ? { ...c, status: 'passe' as const } : c
  )
}