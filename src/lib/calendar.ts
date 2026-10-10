import type { WeddingEvent } from '../types/wedding.ts'

export function createGoogleCalendarUrl(event: WeddingEvent): string {
  const startDate = new Date(event.dateIso)
  // End date default 4 hours later
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)

  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const title = encodeURIComponent(`${event.title} • Nithya & Arun Wedding`)
  const details = encodeURIComponent(
    `${event.description || 'Wedding Celebration'} | Dress Code: ${event.dressCode || 'Ethnic Festive'}`,
  )
  const location = encodeURIComponent(`${event.venue}, ${event.city}`)
  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`
}

export function downloadIcsFile(event: WeddingEvent): void {
  const startDate = new Date(event.dateIso)
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hridayam//Wedding Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@wedding.invite`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${event.title} - Nithya & Arun Wedding`,
    `DESCRIPTION:${event.description || 'Wedding Celebration'}`,
    `LOCATION:${event.venue}, ${event.city}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `${event.id}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function createWhatsAppShareUrl(couple: string, weddingDate: string): string {
  const text = encodeURIComponent(
    `You are cordially invited to celebrate the wedding of ${couple} on ${weddingDate} at Sea View Resort, Kochi! 💕 View invitation: ${window.location.href}`,
  )
  return `https://wa.me/?text=${text}`
}
