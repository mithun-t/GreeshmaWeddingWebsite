import { Heart, Share2, ArrowUp } from 'lucide-react'
import type { WeddingConfig } from '../../types/wedding.ts'
import { createWhatsAppShareUrl } from '../../lib/calendar.ts'

interface FooterProps {
  data: WeddingConfig
}

export function Footer({ data }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const shareWhatsApp = () => {
    const url = createWhatsAppShareUrl(data.coupleName, data.dateLabel)
    window.open(url, '_blank')
  }

  return (
    <footer className="relative w-full py-12 px-6 bg-[#FAF6F0] border-t border-[#8B263E]/10 flex flex-col items-center text-center">
      {/* Title & Tagline matching reference video */}
      <h3 className="font-serif-title text-base sm:text-lg font-semibold tracking-[0.25em] text-[#2D2623] uppercase">
        {data.coupleName} • {new Date(data.weddingDateIso).getFullYear()}
      </h3>

      <p className="font-serif-elegant italic text-sm text-[#7A6A60] mt-1.5">
        A Journey of Love
      </p>

      {/* Share and Back to Top actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#8B263E]/20 bg-white px-4 py-2 text-xs font-medium text-[#8B263E] hover:bg-[#8B263E]/5 transition-colors cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Invitation</span>
        </button>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8B263E]/20 bg-white text-[#7A6A60] hover:text-[#8B263E] transition-colors cursor-pointer"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-1 text-[11px] text-[#A89C94]">
        <span>Made with</span>
        <Heart className="h-3 w-3 fill-[#8B263E] text-[#8B263E]" />
        <span>for family &amp; friends</span>
      </div>
    </footer>
  )
}
