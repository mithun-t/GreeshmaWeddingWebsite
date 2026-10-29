export interface WeddingEvent {
  id: string
  title: string
  dateLabel: string
  dateIso: string
  timeLabel: string
  venue: string
  city: string
  mapUrl: string
  description?: string
  dressCode?: string
}

export interface GalleryPhoto {
  id: string
  src: string
  alt: string
  title: string
  subtitle?: string
}

export interface WeddingConfig {
  coupleName: string
  groomName: string
  brideName: string
  titleEn: string
  titleRegional: string
  dateLabel: string
  timeLabel: string
  weddingDateIso: string
  venue: string
  city: string
  state: string
  googleMapsUrl: string
  mapEmbedUrl: string
  welcomeQuote: string
  audioSrc: string
  events: WeddingEvent[]
  images: {
    heroBougainvillea: string
    couplePortrait: string
    coupleVideoFrame: string
    couplePicture1?: string
    couplePicture2?: string
  }
  gallery?: GalleryPhoto[]
}

export interface RsvpSubmission {
  id?: string
  guestName: string
  phone?: string
  email?: string
  attending: boolean
  guestCount: number
  eventsAttending: string[]
  message?: string
  submittedAt?: string
}

export interface AdminRsvpStats {
  totalSubmissions: number
  totalAttending: number
  totalDeclined: number
  totalGuestCount: number
  eventBreakdown: Record<string, number>
}

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}
