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

export type Groupe = {
  id: number
  name: string
  label: string
  genre: 'kpop' | 'metal'
  country: string
  coverInitials: string
  loveLevel: number
  seen: boolean
  seenLabel: string
  addedByName: string
  addedByGenre: 'kpop' | 'metal'
  addedDate: string
}