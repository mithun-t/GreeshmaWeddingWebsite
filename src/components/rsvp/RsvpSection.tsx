import { useState } from 'react'
import { Send, CheckCircle2, Phone, Mail, Lock } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { WeddingConfig } from '../../types/wedding.ts'
import { submitRsvp } from '../../lib/rsvpStorage.ts'

interface RsvpSectionProps {
  data: WeddingConfig
  onOpenAdmin?: () => void
}

export function RsvpSection({ data, onOpenAdmin }: RsvpSectionProps) {
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [attending, setAttending] = useState<boolean | null>(true)
  const [guestCount, setGuestCount] = useState(1)
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    data.events.map((e) => e.title),
  )
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleEvent = (title: string) => {
    setSelectedEvents((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim()) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const res = await submitRsvp({
        guestName: guestName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        attending: attending ?? true,
        guestCount: attending ? guestCount : 0,
        eventsAttending: attending ? selectedEvents : [],
        message: message.trim(),
      })

      if (res.success) {
        setIsSuccess(true)
        // Confetti burst for celebrating RSVP
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8B263E', '#C5A059', '#1F382B', '#E892A2'],
        })
      } else {
        setErrorMessage(res.message || 'Could not record RSVP. Please try again.')
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong while sending your RSVP. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSuccess(false)
    setGuestName('')
    setPhone('')
    setEmail('')
    setMessage('')
    setAttending(true)
    setGuestCount(1)
    setSelectedEvents(data.events.map((e) => e.title))
    setErrorMessage('')
  }

  return (
    <section id="rsvp" className="relative w-full py-16 sm:py-24 px-6 bg-[#FAF6F0]">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif-title text-4xl sm:text-5xl font-semibold text-[#1F3328]">
            RSVP
          </h2>
          <p className="font-serif-elegant italic text-lg text-[#7A6A60] mt-2">
            Please let us know if you can make it.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#8B263E]/10">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F382B]/10 text-[#1F382B] mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#1F382B]" />
              </div>
              <h3 className="font-serif-title text-2xl font-semibold text-[#1F3328]">
                Thank You, {guestName}!
              </h3>
              <p className="text-sm text-[#7A6A60] mt-2 max-w-xs">
                {attending
                  ? `Your RSVP for ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'} has been joyfully recorded. We cannot wait to celebrate with you!`
                  : `Your warm wishes have been received with love. We will miss you on our special day!`}
              </p>

              {attending && selectedEvents.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DFD7] text-xs text-[#2D2623] w-full text-left">
                  <span className="font-bold text-[#1C3326] block mb-1">
                    Confirmed Events:
                  </span>
                  <ul className="list-disc list-inside text-[#5C4D44] space-y-0.5">
                    {selectedEvents.map((ev) => (
                      <li key={ev}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#8B263E] border-b border-[#8B263E] pb-0.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Guest Name */}
              <div>
                <label
                  htmlFor="guestName"
                  className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2"
                >
                  Guest Name <span className="text-[#8B263E]">*</span>
                </label>
                <input
                  id="guestName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded-xl border border-[#D5CBC2] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D2623] placeholder-[#A89C94] focus:border-[#8B263E] focus:outline-hidden transition-colors"
                />
              </div>

              {/* Contact Information (Phone & Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="guestPhone"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89C94]" />
                    <input
                      id="guestPhone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#D5CBC2] bg-[#FDFBF7] pl-10 pr-3 py-3 text-sm text-[#2D2623] placeholder-[#A89C94] focus:border-[#8B263E] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="guestEmail"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89C94]" />
                    <input
                      id="guestEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#D5CBC2] bg-[#FDFBF7] pl-10 pr-3 py-3 text-sm text-[#2D2623] placeholder-[#A89C94] focus:border-[#8B263E] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Toggle (Yes / No) */}
              <div>
                <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2">
                  Will You Attend?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      attending === true
                        ? 'bg-[#1C3326] text-white shadow-xs'
                        : 'bg-[#FDFBF7] text-[#5C4D44] border border-[#D5CBC2] hover:bg-white'
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      attending === false
                        ? 'bg-[#8B263E] text-white shadow-xs'
                        : 'bg-[#FDFBF7] text-[#5C4D44] border border-[#D5CBC2] hover:bg-white'
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Guest Count (only if attending) */}
              {attending && (
                <div>
                  <label
                    htmlFor="guestCount"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2"
                  >
                    Number of Guests
                  </label>
                  <select
                    id="guestCount"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#D5CBC2] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D2623] focus:border-[#8B263E] focus:outline-hidden"
                  >
                    <option value={1}>1 Guest (Just me)</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5+ Family Members</option>
                  </select>
                </div>
              )}

              {/* Event Attendance Checkboxes (only if attending) */}
              {attending && (
                <div>
                  <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2">
                    Events You Will Attend
                  </span>
                  <div className="flex flex-col gap-2">
                    {data.events.map((ev) => (
                      <label
                        key={ev.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#E8DFD7] bg-[#FDFBF7] text-xs font-medium text-[#2D2623] cursor-pointer hover:bg-white transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(ev.title)}
                          onChange={() => toggleEvent(ev.title)}
                          className="h-4 w-4 rounded accent-[#8B263E]"
                        />
                        <span>{ev.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Blessings / Note */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2"
                >
                  Warm Wishes or Note
                </label>
                <textarea
                  id="message"
                  rows={2}
                  placeholder={`Send a heartfelt message to ${data.coupleName}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#D5CBC2] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D2623] placeholder-[#A89C94] focus:border-[#8B263E] focus:outline-hidden transition-colors resize-none"
                />
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C3326] px-6 py-3.5 text-sm font-semibold tracking-wider text-white shadow-md transition-all hover:bg-[#132219] hover:shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send RSVP'}</span>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          )}
        </div>

        {/* Discreet Host Access Link */}
        {onOpenAdmin && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#A89C94] hover:text-[#8B263E] transition-colors cursor-pointer"
            >
              <Lock className="h-3 w-3" />
              <span>Host RSVP Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
