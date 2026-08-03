export type Profil = {
  id: string
  display_name: string
  avatar_style: 'kpop' | 'metal'
}

export type Participant = {
  name: string
  avatarStyle: 'kpop' | 'metal'
}

export type LineupEntry = {
  id: number
  groupeId: number | null
  groupeName: string
  isFollowed: boolean
}

export type GroupeConcert = {
  concertId: number
  concertName: string
  date: string
  status: 'prevu' | 'passe' | 'annule'
}

export type Concert = {
  id: number
  genre: 'kpop' | 'metal'
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
  lineup: LineupEntry[]
  setlist?: string
  anecdote?: string
}

export type SeenEntry = {
  userId: string
  name: string
  avatarStyle: 'kpop' | 'metal'
  count: number
  hype: number
}

export type Groupe = {
  id: number
  name: string
  label: string
  genre: 'kpop' | 'metal'
  country: string
  coverInitials: string
  addedByName: string
  addedByGenre: 'kpop' | 'metal'
  addedDate: string
  seenEntries: SeenEntry[]
  concerts: GroupeConcert[]
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
  groupeId: number | null
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
  category: 'tshirt' | 'hoodie' | 'poster' | 'cd-album' | 'photocard' | 'lightstick' | 'bijou'
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