import type { RsvpSubmission, AdminRsvpStats } from '../types/wedding.ts'

const STORAGE_KEY = 'hridayam_rsvp_submissions'

/**
 * Gets configured RSVP API URL (Google Apps Script Web App or custom backend endpoint)
 */
export function getRsvpApiUrl(): string {
  const envUrl = import.meta.env.VITE_RSVP_API_URL
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim()
  }
  return ''
}

/**
 * Submits an RSVP response.
 * - Always backs up to browser localStorage.
 * - Sends to Google Apps Script / VITE_RSVP_API_URL if configured.
 * - If not configured, attempts local Vite server endpoint (/api/rsvp).
 */
export async function submitRsvp(
  submission: Omit<RsvpSubmission, 'id' | 'submittedAt'>,
): Promise<{ success: boolean; message: string }> {
  const payload: RsvpSubmission = {
    ...submission,
    id: 'rsvp_' + Date.now(),
    submittedAt: new Date().toISOString(),
  }

  // 1. Always backup immediately to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: RsvpSubmission[] = raw ? JSON.parse(raw) : []
    list.unshift(payload)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage quota or private browsing mode fallback
  }

  const remoteUrl = getRsvpApiUrl()

  // 2. If remote API URL is configured (e.g., Google Apps Script)
  if (remoteUrl) {
    try {
      // Note: text/plain prevents CORS preflight triggers on Google Apps Script Web Apps
      const res = await fetch(remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        return { success: true, message: 'Your RSVP has been joyfully recorded in our wedding guestbook!' }
      }
    } catch {
      // In case of CORS redirection or offline, the response was already secured in localStorage
    }
    return {
      success: true,
      message: 'Your RSVP has been joyfully received! We cannot wait to celebrate with you.',
    }
  }

  // 3. Local dev server fallback
  const basePath = import.meta.env.BASE_URL || '/'
  const endpoints = ['/api/rsvp', `${basePath.replace(/\/+$/, '')}/api/rsvp`]

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        return { success: true, message: 'Your RSVP has been recorded with love!' }
      }
    } catch {
      // Try next or fall through
    }
  }

  return { success: true, message: 'Your RSVP has been saved locally!' }
}

/**
 * Retrieves all stored RSVPs from localStorage
 */
export function getLocalRsvps(): RsvpSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Fetches all RSVPs: merges remote API (if configured/available),
 * local Vite endpoint (if in dev), and localStorage backups.
 */
export async function fetchAllRsvps(): Promise<RsvpSubmission[]> {
  const localList = getLocalRsvps()
  const remoteUrl = getRsvpApiUrl()
  const itemsMap = new Map<string, RsvpSubmission>()

  // Populate from localStorage first
  for (const item of localList) {
    const key = item.id || `${item.guestName}_${item.phone || ''}_${item.submittedAt || ''}`
    itemsMap.set(key, item)
  }

  // Try remote URL if configured
  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl, { method: 'GET' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          for (const item of data) {
            const key = item.id || `${item.guestName}_${item.phone || ''}_${item.submittedAt || ''}`
            itemsMap.set(key, item)
          }
        }
      }
    } catch {
      // Ignore network errors and rely on local
    }
  } else {
    // Try local dev server endpoint
    const basePath = import.meta.env.BASE_URL || '/'
    const endpoints = ['/api/rsvp', `${basePath.replace(/\/+$/, '')}/api/rsvp`]

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, { method: 'GET' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            for (const item of data) {
              const key = item.id || `${item.guestName}_${item.phone || ''}_${item.submittedAt || ''}`
              itemsMap.set(key, item)
            }
            break
          }
        }
      } catch {
        // Continue
      }
    }
  }

  const allItems = Array.from(itemsMap.values())
  // Sort descending by submittedAt
  allItems.sort((a, b) => {
    const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
    const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
    return timeB - timeA
  })

  return allItems
}

/**
 * Calculates summary metrics for the Admin Dashboard
 */
export function calculateRsvpStats(submissions: RsvpSubmission[]): AdminRsvpStats {
  let totalAttending = 0
  let totalDeclined = 0
  let totalGuestCount = 0
  const eventBreakdown: Record<string, number> = {}

  for (const sub of submissions) {
    if (sub.attending) {
      totalAttending += 1
      const count = Number(sub.guestCount) || 1
      totalGuestCount += count

      if (Array.isArray(sub.eventsAttending)) {
        for (const ev of sub.eventsAttending) {
          eventBreakdown[ev] = (eventBreakdown[ev] || 0) + count
        }
      }
    } else {
      totalDeclined += 1
    }
  }

  return {
    totalSubmissions: submissions.length,
    totalAttending,
    totalDeclined,
    totalGuestCount,
    eventBreakdown,
  }
}

/**
 * Exports submissions array to a downloadable CSV file
 */
export function exportRsvpsToCsv(submissions: RsvpSubmission[]): void {
  const headers = [
    'Submitted At',
    'Guest Name',
    'Phone',
    'Email',
    'Attending',
    'Guest Count',
    'Events Attending',
    'Warm Wishes / Note',
  ]

  const rows = submissions.map((sub) => {
    const dateStr = sub.submittedAt
      ? new Date(sub.submittedAt).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : ''

    const eventsStr = Array.isArray(sub.eventsAttending)
      ? sub.eventsAttending.join(', ')
      : ''

    return [
      `"${dateStr.replace(/"/g, '""')}"`,
      `"${(sub.guestName || '').replace(/"/g, '""')}"`,
      `"${(sub.phone || '').replace(/"/g, '""')}"`,
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      sub.attending ? 'Yes' : 'No',
      sub.attending ? (sub.guestCount ?? 1) : 0,
      `"${eventsStr.replace(/"/g, '""')}"`,
      `"${(sub.message || '').replace(/"/g, '""')}"`,
    ].join(',')
  })

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const dateStamp = new Date().toISOString().slice(0, 10)

  link.setAttribute('href', url)
  link.setAttribute('download', `wedding_rsvps_${dateStamp}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
