import { Heart, CalendarPlus, ExternalLink } from 'lucide-react'
import type { WeddingEvent } from '../../types/wedding.ts'
import { createGoogleCalendarUrl } from '../../lib/calendar.ts'

interface EventCardProps {
  event: WeddingEvent
  onOpenMap: (event: WeddingEvent) => void
}

export function EventCard({ event, onOpenMap }: EventCardProps) {
  const gcalUrl = createGoogleCalendarUrl(event)

  return (
    <div className="relative flex flex-col items-center text-center py-8">
      {/* Circular Heart Icon Header matching reference video */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-[#8B263E]/20 shadow-xs mb-4">
        <Heart className="h-5 w-5 text-[#8B263E]" />
      </div>

      {/* Event Title */}
      <h3 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#1F3328]">
        {event.title}
      </h3>

      {/* Date */}
      <p className="font-serif-elegant text-base sm:text-lg font-medium text-[#8B263E] mt-1">
        {event.dateLabel}
      </p>

      {/* Time */}
      <p className="text-sm font-medium text-[#2D2623] mt-0.5">
        {event.timeLabel}
      </p>

      {/* Venue */}
      <p className="text-xs text-[#7A6A60] mt-0.5">
        {event.venue}
      </p>

      {/* Action Buttons: Open Map & Add to Calendar */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onOpenMap(event)}
          className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#8B263E] uppercase border-b border-[#8B263E] pb-0.5 hover:text-[#5C1929] cursor-pointer"
        >
          <span>Open Map</span>
          <ExternalLink className="h-3 w-3" />
        </button>

        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A6A60] hover:text-[#8B263E] transition-colors"
        >
          <CalendarPlus className="h-3 w-3" />
          <span>Calendar</span>
        </a>
      </div>
    </div>
  )
}
