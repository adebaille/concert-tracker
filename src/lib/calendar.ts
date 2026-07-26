import type { Concert } from '../types'

function toICSDate(isoDate: string): string {
  // Format attendu par le standard iCalendar : 20260914T193000Z (UTC, sans tirets ni deux-points)
  return new Date(isoDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeICS(text: string): string {
  // Le format .ics réserve quelques caractères : virgule, point-virgule, backslash
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export function buildConcertICS(concert: Concert): string {
  const start = toICSDate(concert.eventDate)
  // On suppose une durée de 3 h, faute d'heure de fin dans nos données
  const endDate = new Date(new Date(concert.eventDate).getTime() + 3 * 60 * 60 * 1000)
  const end = toICSDate(endDate.toISOString())

  const location = escapeICS(`${concert.venue}, ${concert.city}`)
  const summary = escapeICS(concert.name)
  const description = escapeICS(
    concert.setlist ? `Set list : ${concert.setlist}` : 'Concert suivi via Notre Univers Musical'
  )

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Notre Univers Musical//FR',
    'BEGIN:VEVENT',
    `UID:concert-${concert.id}@univers-musical`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}