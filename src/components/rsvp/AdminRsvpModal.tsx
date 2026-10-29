import { useState, useEffect, useMemo } from 'react'
import {
  X,
  Lock,
  Download,
  RefreshCw,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react'
import type { RsvpSubmission } from '../../types/wedding.ts'
import {
  fetchAllRsvps,
  calculateRsvpStats,
  exportRsvpsToCsv,
} from '../../lib/rsvpStorage.ts'

interface AdminRsvpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminRsvpModal({ isOpen, onClose }: AdminRsvpModalProps) {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinError, setPinError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined'>('all')
  const [copiedSummary, setCopiedSummary] = useState(false)

  const adminPin = import.meta.env.VITE_ADMIN_PIN || '2027'

  // Load RSVPs when opened & authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData()
    }
  }, [isOpen, isAuthenticated])

  // Reset PIN on open/close
  useEffect(() => {
    if (!isOpen) {
      setPin('')
      setPinError('')
      setSearchQuery('')
    }
  }, [isOpen])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAllRsvps()
      setSubmissions(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.trim() === adminPin) {
      setIsAuthenticated(true)
      setPinError('')
      loadData()
    } else {
      setPinError('Invalid PIN code. Please try again.')
    }
  }

  const stats = useMemo(() => calculateRsvpStats(submissions), [submissions])

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Filter by attendance status
      if (statusFilter === 'attending' && !item.attending) return false
      if (statusFilter === 'declined' && item.attending) return false

      // Search query filter
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const name = (item.guestName || '').toLowerCase()
      const phone = (item.phone || '').toLowerCase()
      const email = (item.email || '').toLowerCase()
      const msg = (item.message || '').toLowerCase()
      const events = Array.isArray(item.eventsAttending)
        ? item.eventsAttending.join(' ').toLowerCase()
        : ''

      return (
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        msg.includes(q) ||
        events.includes(q)
      )
    })
  }, [submissions, statusFilter, searchQuery])

  const handleCopySummary = () => {
    let text = `*Hridayam • Wedding RSVP Summary*\n`
    text += `Total Responses: ${stats.totalSubmissions}\n`
    text += `Confirmed Attending: ${stats.totalAttending} (${stats.totalGuestCount} total guests)\n`
    text += `Declined: ${stats.totalDeclined}\n\n`
    text += `*Event Breakdown:*\n`
    for (const [event, count] of Object.entries(stats.eventBreakdown)) {
      text += `• ${event}: ${count} guests\n`
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 2000)
    })
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#FAF6F0] shadow-2xl border border-[#8B263E]/20 overflow-hidden text-[#2D2623]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD7] bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C3326]/10 text-[#1C3326]">
              {isAuthenticated ? (
                <ShieldCheck className="h-5 w-5 text-[#1C3326]" />
              ) : (
                <Lock className="h-5 w-5 text-[#8B263E]" />
              )}
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#1C3326]">
                RSVP Host Dashboard
              </h3>
              <p className="text-xs text-[#7A6A60]">
                {isAuthenticated
                  ? `${submissions.length} Total Response${submissions.length === 1 ? '' : 's'}`
                  : 'Host Authorization Required'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DFD7]/50 text-[#7A6A60] hover:bg-[#8B263E] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        {!isAuthenticated ? (
          /* PIN Entry State */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8B263E]/10 text-[#8B263E] mb-4">
              <Lock className="h-7 w-7" />
            </div>
            <h4 className="font-serif-title text-2xl font-bold text-[#1F3328] mb-1">
              Enter Host PIN
            </h4>
            <p className="text-xs text-[#7A6A60] max-w-xs mb-6">
              Please enter your host PIN code to manage guest RSVPs and export attendee lists.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs flex flex-col gap-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Enter PIN (Default: 2027)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setPinError('')
                }}
                className="w-full text-center tracking-widest text-lg font-semibold rounded-xl border border-[#D5CBC2] bg-[#FDFBF7] px-4 py-3 text-[#2D2623] focus:border-[#8B263E] focus:outline-hidden"
              />
              {pinError && (
                <p className="text-xs font-medium text-rose-600">{pinError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1C3326] text-white text-sm font-semibold tracking-wider hover:bg-[#132219] transition-all cursor-pointer shadow-sm"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard State */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Overview Stats Cards */}
            <div className="p-4 sm:p-6 bg-white border-b border-[#E8DFD7] flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#E8DFD7] bg-[#FAF6F0] p-3 text-center">
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-[#7A6A60]">
                    Total RSVPs
                  </span>
                  <span className="font-serif-title text-2xl font-bold text-[#1C3326]">
                    {stats.totalSubmissions}
                  </span>
                </div>

                <div className="rounded-xl border border-[#1C3326]/20 bg-[#1C3326]/5 p-3 text-center">
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-[#1C3326]">
                    Attending Guests
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="font-serif-title text-2xl font-bold text-[#1C3326]">
                      {stats.totalGuestCount}
                    </span>
                    <span className="text-[11px] text-[#7A6A60]">
                      ({stats.totalAttending} RSVPs)
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center">
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-rose-700">
                    Declined
                  </span>
                  <span className="font-serif-title text-2xl font-bold text-rose-800">
                    {stats.totalDeclined}
                  </span>
                </div>

                <div className="rounded-xl border border-[#C5A059]/30 bg-[#FDFBF7] p-3 text-center flex flex-col justify-center">
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-[#8B6B2E]">
                    Actions
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => exportRsvpsToCsv(submissions)}
                      disabled={submissions.length === 0}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#8B263E] text-white text-xs font-semibold hover:bg-[#721F33] transition-colors disabled:opacity-50 cursor-pointer"
                      title="Download responses as CSV spreadsheet"
                    >
                      <Download className="h-3 w-3" />
                      <span>CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      disabled={submissions.length === 0}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C3326] text-white text-xs font-semibold hover:bg-[#132219] transition-colors disabled:opacity-50 cursor-pointer"
                      title="Copy summary text"
                    >
                      {copiedSummary ? (
                        <Check className="h-3 w-3 text-emerald-300" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Attendance Badges */}
              {Object.keys(stats.eventBreakdown).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6A60] mr-1">
                    Per Event:
                  </span>
                  {Object.entries(stats.eventBreakdown).map(([event, count]) => (
                    <span
                      key={event}
                      className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] px-3 py-1 text-xs font-semibold text-[#1C3326] border border-[#E8DFD7]"
                    >
                      <Calendar className="h-3 w-3 text-[#8B263E]" />
                      <span>{event}:</span>
                      <strong className="text-[#8B263E]">{count}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="px-4 sm:px-6 py-3 bg-[#FAF6F0] border-b border-[#E8DFD7] flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89C94]" />
                <input
                  type="text"
                  placeholder="Search by name, phone, email, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#D5CBC2] bg-white text-xs text-[#2D2623] placeholder-[#A89C94] focus:border-[#8B263E] focus:outline-hidden"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#E8DFD7]/60 p-0.5 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-[#1C3326] font-semibold shadow-xs'
                      : 'text-[#7A6A60] hover:text-[#2D2623]'
                  }`}
                >
                  All ({submissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('attending')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'attending'
                      ? 'bg-white text-[#1C3326] font-semibold shadow-xs'
                      : 'text-[#7A6A60] hover:text-[#2D2623]'
                  }`}
                >
                  Attending ({stats.totalAttending})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('declined')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'declined'
                      ? 'bg-white text-rose-800 font-semibold shadow-xs'
                      : 'text-[#7A6A60] hover:text-[#2D2623]'
                  }`}
                >
                  Declined ({stats.totalDeclined})
                </button>
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5CBC2] bg-white text-xs font-semibold text-[#5C4D44] hover:bg-[#FDFBF7] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Guest Submissions List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3">
              {filteredSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-10 w-10 text-[#A89C94] mb-2" />
                  <p className="font-serif-title text-lg font-semibold text-[#5C4D44]">
                    No RSVP records found
                  </p>
                  <p className="text-xs text-[#7A6A60] mt-1 max-w-xs">
                    {searchQuery
                      ? 'Try adjusting your search criteria.'
                      : 'When guests submit their RSVPs on the website, they will appear here.'}
                  </p>
                </div>
              ) : (
                filteredSubmissions.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#E8DFD7] bg-white hover:border-[#8B263E]/30 transition-all shadow-xs"
                  >
                    {/* Left: Guest Details */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif-title text-base sm:text-lg font-bold text-[#1C3326]">
                          {sub.guestName}
                        </span>
                        {sub.attending ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Attending ({sub.guestCount} {sub.guestCount === 1 ? 'Guest' : 'Guests'})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                            <XCircle className="h-3 w-3 text-rose-500" />
                            Declined
                          </span>
                        )}
                      </div>

                      {/* Contact Badges */}
                      <div className="flex items-center gap-3 text-xs text-[#7A6A60] flex-wrap mt-0.5">
                        {sub.phone && (
                          <a
                            href={`tel:${sub.phone}`}
                            className="inline-flex items-center gap-1 text-[#1C3326] hover:underline"
                          >
                            <Phone className="h-3 w-3 text-[#8B263E]" />
                            <span>{sub.phone}</span>
                          </a>
                        )}
                        {sub.email && (
                          <a
                            href={`mailto:${sub.email}`}
                            className="inline-flex items-center gap-1 text-[#1C3326] hover:underline"
                          >
                            <Mail className="h-3 w-3 text-[#8B263E]" />
                            <span>{sub.email}</span>
                          </a>
                        )}
                        {sub.submittedAt && (
                          <span className="text-[11px] text-[#A89C94]">
                            {new Date(sub.submittedAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        )}
                      </div>

                      {/* Selected Events */}
                      {sub.attending && Array.isArray(sub.eventsAttending) && sub.eventsAttending.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className="text-[11px] font-medium text-[#7A6A60]">Events:</span>
                          {sub.eventsAttending.map((ev) => (
                            <span
                              key={ev}
                              className="rounded-md bg-[#FAF6F0] px-2 py-0.5 text-[11px] font-medium text-[#2D2623] border border-[#E8DFD7]"
                            >
                              {ev}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Warm Wishes Quote */}
                      {sub.message && (
                        <p className="mt-1.5 text-xs italic text-[#5C4D44] bg-[#FDFBF7] p-2.5 rounded-lg border border-[#E8DFD7]/60">
                          “{sub.message}”
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
