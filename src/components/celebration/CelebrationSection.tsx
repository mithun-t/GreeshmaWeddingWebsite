import { Calendar, MapPin, ExternalLink, CalendarPlus } from 'lucide-react'
import type { WeddingConfig } from '../../types/wedding.ts'
import { PolaroidCard } from './PolaroidCard.tsx'
import { createGoogleCalendarUrl } from '../../lib/calendar.ts'

interface CelebrationSectionProps {
  data: WeddingConfig
  onOpenMap: () => void
}

export function CelebrationSection({ data, onOpenMap }: CelebrationSectionProps) {
  const mainEvent = data.events[data.events.length - 1]
  const gcalUrl = createGoogleCalendarUrl(mainEvent)

  return (
    <section id="celebration" className="relative w-full py-16 sm:py-24 px-6 bg-[#FAF6F0]">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Tag Pill: THE CELEBRATION matching video */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#8B263E]/30 bg-[#8B263E]/5 mb-6">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B263E]">
            The Celebration
          </span>
        </div>

        {/* Couple Headline: Nithya & Arun */}
        <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1F3328]">
          {data.coupleName}
        </h2>

        {/* Poetic Message */}
        <p className="font-serif-elegant text-lg sm:text-xl text-[#5C4D44] leading-relaxed mt-6 max-w-lg font-normal">
          {data.welcomeQuote}
        </p>

        {/* Date & Location Summary Cards */}
        <div className="w-full mt-12 flex flex-col gap-6 text-left">
          {/* Date Row */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/70 border border-[#8B263E]/10 shadow-xs backdrop-blur-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B263E]/10 text-[#8B263E]">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B263E]">
                Date
              </span>
              <p className="font-serif-title text-xl font-medium text-[#2D2623] mt-0.5">
                {data.dateLabel}
              </p>
              <p className="text-xs text-[#7A6A60] mt-0.5">{data.timeLabel}</p>
            </div>
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 self-center text-xs font-semibold text-[#8B263E] hover:underline"
            >
              <CalendarPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </a>
          </div>

          {/* Location Row */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/70 border border-[#8B263E]/10 shadow-xs backdrop-blur-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B263E]/10 text-[#8B263E]">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B263E]">
                Location
              </span>
              <p className="font-serif-title text-xl font-medium text-[#2D2623] mt-0.5">
                {data.venue}
              </p>
              <p className="text-xs text-[#7A6A60] mt-0.5">{data.city}, {data.state}</p>
            </div>
            <button
              type="button"
              onClick={onOpenMap}
              className="inline-flex items-center gap-1 self-center text-xs font-bold tracking-wider text-[#8B263E] uppercase border-b border-[#8B263E] pb-0.5 hover:text-[#5C1929] cursor-pointer"
            >
              <span>Open Map</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Couple Polaroid Card Section */}
      <div className="mt-8">
        <PolaroidCard data={data} />
      </div>
    </section>
  )
}
