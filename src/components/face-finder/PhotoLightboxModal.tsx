import { useEffect, useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import type { MatchResult } from '../../types/faceDetection.ts'

interface PhotoLightboxModalProps {
  isOpen: boolean
  onClose: () => void
  matches: MatchResult[]
  initialIndex: number
}

export function PhotoLightboxModal({
  isOpen,
  onClose,
  matches,
  initialIndex,
}: PhotoLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    setCurrentIndex(initialIndex)
    setImageLoaded(false)
  }, [initialIndex, isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' && matches.length > 1) {
        setImageLoaded(false)
        setCurrentIndex((prev) => (prev + 1) % matches.length)
      } else if (e.key === 'ArrowLeft' && matches.length > 1) {
        setImageLoaded(false)
        setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, matches.length, onClose])

  if (!isOpen || !matches.length) return null

  const currentPhoto = matches[currentIndex] || matches[0]
  const matchPercentage = Math.round(currentPhoto.similarity * 100)

  const handlePrev = () => {
    setImageLoaded(false)
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length)
  }

  const handleNext = () => {
    setImageLoaded(false)
    setCurrentIndex((prev) => (prev + 1) % matches.length)
  }

  // Google Drive high resolution image view link
  // Google drive uc?export=view or thumbnail with high width sz=w1600 provides great resolution
  const highResUrl = currentPhoto.thumbnailLink.includes('sz=w300')
    ? currentPhoto.thumbnailLink.replace('sz=w300', 'sz=w1600')
    : currentPhoto.thumbnailLink

  const handleDownload = async () => {
    try {
      const response = await fetch(highResUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentPhoto.fileName || `wedding-match-${currentIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      // Fallback: open webViewLink in a new tab
      window.open(currentPhoto.webViewLink, '_blank')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Matched photo viewer"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between z-20 pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8B263E]/80 text-white border border-white/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{matchPercentage}% Match</span>
          </span>

          <span className="hidden sm:inline-block text-xs text-white/60">
            {currentPhoto.fileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Drive link */}
          <a
            href={currentPhoto.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            title="Open in Google Drive"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Open in Drive</span>
          </a>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
            title="Download photo"
          >
            <Download className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo preview"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer ml-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Photo Display with Navigation Arrows */}
      <div
        className="relative flex-1 w-full max-w-5xl flex items-center justify-center min-h-0 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {matches.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-1 sm:left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 hover:bg-[#8B263E] text-white border border-white/20 backdrop-blur-xs transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Photo Container */}
        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#14100E] border border-white/10 shadow-2xl">
          {/* Skeleton spinner until image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center min-h-[300px] w-[300px] sm:w-[500px]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
            </div>
          )}

          <img
            src={highResUrl}
            alt={currentPhoto.fileName || 'Wedding event photo'}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-xl transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Next Button */}
        {matches.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-1 sm:right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 hover:bg-[#8B263E] text-white border border-white/20 backdrop-blur-xs transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Bottom Control & Filmstrip Area */}
      <div
        className="w-full max-w-4xl flex flex-col items-center gap-2 z-20 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption & Indicator */}
        <div className="flex items-center gap-2 text-xs text-white/75">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {currentPhoto.confidence || 'Matched'} • Photo {currentIndex + 1} of {matches.length}
          </span>
        </div>

        {/* Filmstrip thumbnails if multiple matches */}
        {matches.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
            {matches.map((item, idx) => (
              <button
                key={item.fileName + idx}
                type="button"
                onClick={() => {
                  setImageLoaded(false)
                  setCurrentIndex(idx)
                }}
                className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={item.thumbnailLink}
                  alt={item.fileName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
