import { useState } from 'react'
import { Send, CheckCircle2, Heart } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { WeddingConfig } from '../../types/wedding.ts'
import { submitRsvp } from '../../lib/rsvpStorage.ts'

interface RsvpSectionProps {
  data: WeddingConfig
}

export function RsvpSection({ data }: RsvpSectionProps) {
  const [guestName, setGuestName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(true)
  const [guestCount, setGuestCount] = useState(1)
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    data.events.map((e) => e.title),
  )
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const toggleEvent = (title: string) => {
    setSelectedEvents((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim()) return

    setIsSubmitting(true)

    const res = await submitRsvp({
      guestName: guestName.trim(),
      attending: attending ?? true,
      guestCount,
      eventsAttending: selectedEvents,
      message: message.trim(),
    })

    setIsSubmitting(false)

    if (res.success) {
      setIsSuccess(true)
      // Confetti burst for celebrating RSVP
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8B263E', '#C5A059', '#1F382B', '#E892A2'],
      })
    }
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

        {/* Card Form matching reference video */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#8B263E]/10">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F382B]/10 text-[#1F382B] mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#1F382B]" />
              </div>
              <h3 className="font-serif-title text-2xl font-semibold text-[#1F3328]">
                Thank You, {guestName}!
              </h3>
              <p className="text-sm text-[#7A6A60] mt-2 max-w-xs">
                Your RSVP response has been joyfully received. We cannot wait to celebrate with you!
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false)
                  setGuestName('')
                  setMessage('')
                }}
                className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#8B263E] border-b border-[#8B263E] pb-0.5 cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Guest Name */}
              <div>
                <label
                  htmlFor="guestName"
                  className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6A60] mb-2"
                >
                  Guest Name
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

              {/* Attendance Toggle (Yes / No) matching reference video */}
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
                    Yes
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
                    No
                  </button>
                </div>
              </div>

              {/* Guest Count (if attending) */}
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
                    <option value={4}>4+ Family Members</option>
                  </select>
                </div>
              )}

              {/* Event Attendance Checkboxes (if attending) */}
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

              {/* Submit Button matching reference video (dark green button with paper plane icon) */}
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
      </div>
    </section>
  )
}
