export type Profil = {
  id: string
  display_name: string
  avatar_style: 'kpop' | 'metal'
}

export type Participant = {
  name: string
  avatarStyle: 'kpop' | 'metal'
}

export type Concert = {
  id: number
  genre: 'kpop' | 'metal' | 'fest'
  status: 'prevu' | 'passe' | 'annule'
  type: 'concert' | 'festival'
  eventDate: string
  hasTickets: boolean
  isShared: boolean
  photoLabel: string
  bigBg: string
  date: string
  price: number
  name: string
  venue: string
  city: string
  rating: number
  participants: Participant[]
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

export type Reve = {
  id: number
  priority: 'ultime' | 'haute' | 'moyenne'
  genre: 'kpop' | 'metal'
  title: string
  subtitle: string
  dateValue: string
  budget: number
  note: string
  isWatched: boolean
  isShared: boolean
  participants: Participant[]
}

export type GroupeOption = {
  id: number
  name: string
}

export type MerchItem = {
  id: number
  previewStyle: 'tee' | 'hoodie' | 'poster' | 'cd' | 'photocard' | 'lightstick' | 'vinyl' | 'cap'
  category: 'tshirt' | 'hoodie' | 'poster' | 'cd-album' | 'photocard' | 'lightstick' | 'casquette'
  bgText: string
  details: string
  name: string
  band: string
  bandNote: string
  groupeId: number | null
  price: number
  ownerId: string
  isShared: boolean
  anecdote: string
  participants: Participant[]
}