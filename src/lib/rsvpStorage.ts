import type { RsvpSubmission } from '../types/wedding.ts'

const STORAGE_KEY = 'hridayam_rsvp_submissions'

export async function submitRsvp(submission: RsvpSubmission): Promise<{ success: boolean; message: string }> {
  const payload = {
    ...submission,
    submittedAt: new Date().toISOString(),
  }

  // 1. Always backup to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: RsvpSubmission[] = raw ? JSON.parse(raw) : []
    list.push(payload)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage quota/disabled fallback
  }

  // 2. Send to local Vite dev server endpoint if active
  try {
    const res = await fetch('/api/rsvp', {
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
    // Offline or static preview mode
  }

  return { success: true, message: 'Your RSVP has been saved locally!' }
}

export function getLocalRsvps(): RsvpSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
