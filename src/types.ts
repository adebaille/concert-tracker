export type Concert = {
  id: number
  genre: 'kpop' | 'metal' | 'fest'
  status: 'prevu' | 'passe' | 'annule'
  photoLabel: string
  bigBg: string
  date: string
  price: number
  name: string
  venue: string
  city: string
  rating: number
  setlist?: string
  anecdote?: string
}