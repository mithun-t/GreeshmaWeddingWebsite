import { useState, useEffect } from 'react'
import { Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { WeddingConfig, GalleryPhoto } from '../../types/wedding.ts'

interface GallerySectionProps {
  data: WeddingConfig
}

export function GallerySection({ data }: GallerySectionProps) {
  const gallery = data.gallery ?? []
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null)
      } else if (e.key === 'ArrowRight' && gallery.length > 1) {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : 0))
      } else if (e.key === 'ArrowLeft' && gallery.length > 1) {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0,
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhotoIndex, gallery.length])

  if (!gallery.length) return null

  const activePhoto: GalleryPhoto | null =
    selectedPhotoIndex !== null ? gallery[selectedPhotoIndex] : null

  return (
    <section id="gallery" className="relative w-full py-20 sm:py-28 px-6 bg-[#F5EFEB]/50 border-t border-[#8B263E]/10">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B263E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#8B263E]/30 bg-[#8B263E]/5 mb-4">
          <Sparkles className="h-3 w-3 text-[#8B263E]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B263E]">
            Moments Of Love
          </span>
        </div>

        {/* Section Headline */}
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1F3328] text-center">
          Our Story In Frames
        </h2>

        {/* Section Subtitle */}
        <p className="font-serif-elegant italic text-base sm:text-lg text-[#6E5D53] text-center mt-3 max-w-lg leading-relaxed">
          Glimpses of laughter, quiet affection, and the timeless warmth that brought us here together.
        </p>

        {/* Photo Gallery Grid */}
        <div className="mt-12 sm:mt-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {gallery.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative flex flex-col rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-[#8B263E]/15 hover:shadow-xl hover:border-[#8B263E]/30 transition-all duration-500"
            >
              {/* Photo Frame Container */}
              <div
                onClick={() => setSelectedPhotoIndex(index)}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#FAF6F0] cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Hover Zoom Badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1.5 text-xs font-medium text-[#2D2623] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                  <ZoomIn className="h-3.5 w-3.5 text-[#8B263E]" />
                  <span>View</span>
                </div>
              </div>

              {/* Photo Caption & Context */}
              <div className="mt-4 px-1 flex flex-col text-left">
                <h3 className="font-serif-title text-lg sm:text-xl font-medium text-[#2D2623] group-hover:text-[#8B263E] transition-colors">
                  {photo.title}
                </h3>
                {photo.subtitle && (
                  <p className="font-serif-elegant italic text-sm text-[#7A6A60] mt-1 leading-snug">
                    {photo.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            aria-label="Close photo view"
            className="absolute top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Controls (if multiple images) */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0,
                  )
                }}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev + 1) % gallery.length : 0,
                  )
                }}
                aria-label="Next photo"
                className="absolute right-3 sm:right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Lightbox Content Container */}
          <div
            className="relative max-w-2xl max-h-[90vh] flex flex-col items-center overflow-hidden rounded-2xl bg-[#1A1615] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-auto overflow-hidden">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="w-full p-4 sm:p-5 text-center bg-[#1A1615]/95 border-t border-white/10">
              <h4 className="font-serif-title text-lg sm:text-xl font-medium text-white">
                {activePhoto.title}
              </h4>
              {activePhoto.subtitle && (
                <p className="font-serif-elegant italic text-xs sm:text-sm text-[#C9BFB8] mt-1 max-w-md mx-auto">
                  {activePhoto.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
