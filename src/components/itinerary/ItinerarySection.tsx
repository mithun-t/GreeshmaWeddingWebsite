import type { WeddingConfig, WeddingEvent } from '../../types/wedding.ts'
import { EventCard } from './EventCard.tsx'

interface ItinerarySectionProps {
  data: WeddingConfig
  onOpenMap: (event?: WeddingEvent) => void
}

export function ItinerarySection({ data, onOpenMap }: ItinerarySectionProps) {
  return (
    <section id="itinerary" className="relative w-full py-16 sm:py-20 px-6 bg-[#FAF6F0]">
      <div className="max-w-md mx-auto flex flex-col items-center text-center">
        {/* Section Tag Badge: THE ITINERARY */}
        <div className="mb-3">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#8B263E]">
            The Itinerary
          </span>
        </div>

        {/* Section Heading: Events */}
        <h2 className="font-serif-title text-4xl sm:text-5xl font-semibold text-[#1F3328] mb-8">
          Events
        </h2>

        {/* Event List with subtle vertical connector line */}
        <div className="w-full flex flex-col divide-y divide-[#8B263E]/10">
          {data.events.map((event) => (
            <EventCard key={event.id} event={event} onOpenMap={onOpenMap} />
          ))}
        </div>
      </div>
    </section>
  )
}
