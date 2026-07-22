import type { Participant, Profil } from '../types'

function toParticipant(profil: Profil): Participant {
  return { name: profil.display_name, avatarStyle: profil.avatar_style }
}

export function resolveParticipants(
  profils: Profil[],
  ownerId: string,
  isShared: boolean
): Participant[] {
  if (isShared) return profils.map(toParticipant)
  const owner = profils.find((p) => p.id === ownerId)
  return owner ? [toParticipant(owner)] : []
}

export function participantsLabel(participants: Participant[]): string {
  if (participants.length === 0) return '—'
  if (participants.length === 1) return participants[0].name
  return 'À deux'
}