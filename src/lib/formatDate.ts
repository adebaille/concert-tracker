export function formatConcertDate(isoDate: string): string {
  const date = new Date(isoDate)
  const datePart = date
    .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase()
  const timePart = date
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'H')
  return `${datePart} · ${timePart}`
}

export function formatDayMonth(isoDate: string): { day: string; month: string } {
  const date = new Date(isoDate)
  return {
    day: date.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase().replace('.', ''),
  }
}

export function toDateTimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}