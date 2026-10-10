import { X, MapPin, Navigation, ExternalLink } from 'lucide-react'
import type { WeddingConfig, WeddingEvent } from '../../types/wedding.ts'

interface VenueMapModalProps {
  isOpen: boolean
  onClose: () => void
  data: WeddingConfig
  activeEvent?: WeddingEvent | null
}

export function VenueMapModal({ isOpen, onClose, data, activeEvent }: VenueMapModalProps) {
  if (!isOpen) return null

  const targetVenue = activeEvent?.venue || data.venue
  const targetCity = activeEvent?.city || `${data.city}, ${data.state}`
  const mapLink = activeEvent?.mapUrl || data.googleMapsUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#8B263E]/10 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF6F0] text-[#7A6A60] hover:text-[#2D2623] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B263E]/10 text-[#8B263E]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif-title text-xl font-semibold text-[#1F3328]">
              {targetVenue}
            </h3>
            <p className="text-xs text-[#7A6A60]">{targetCity}</p>
          </div>
        </div>

        {/* Embedded Map Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-[#E8DFD7] bg-[#F5EFEB]">
          <iframe
            src={data.mapEmbedUrl}
            title="Venue Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Directions & External Links */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#7A6A60] text-center sm:text-left">
            Fort Kochi scenic coastal route, 45 mins from Cochin Airport (COK).
          </p>

          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8B263E] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#66182B] transition-colors shrink-0"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
