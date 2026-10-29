import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  Camera,
  Upload,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
  ZoomIn,
  Image as ImageIcon,
} from 'lucide-react'
import { recognizeFace, FaceDetectionError } from '../../services/faceDetectionService.ts'
import type { MatchResult, FaceFinderStatus } from '../../types/faceDetection.ts'
import { PhotoLightboxModal } from './PhotoLightboxModal.tsx'

export function FaceFinderSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<FaceFinderStatus>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Dynamic progress text during scanning
  useEffect(() => {
    if (status !== 'scanning') return

    const messages = [
      'Detecting facial contours...',
      'Generating facial embedding with AI...',
      'Searching Google Drive wedding albums...',
      'Matching smiles and candid moments...',
    ]

    let step = 0
    setStatusMessage(messages[0])

    const interval = setInterval(() => {
      step = (step + 1) % messages.length
      setStatusMessage(messages[step])
    }, 1800)

    return () => clearInterval(interval)
  }, [status])

  const handleFileSelect = (file: File) => {
    if (!file) return

    // Revoke previous URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setStatus('selected')
    setErrorMessage('')
    setMatches([])
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setStatus('idle')
    setErrorMessage('')
    setMatches([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleStartScan = async () => {
    if (!selectedFile) return

    setStatus('scanning')
    setErrorMessage('')

    try {
      const response = await recognizeFace(selectedFile)

      if (response.success && response.matches && response.matches.length > 0) {
        setMatches(response.matches)
        setStatus('success')

        // Celebratory confetti burst!
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B263E', '#C5A059', '#1C3326', '#FAF6F0'],
          })
        } catch {
          // Ignore if confetti fails
        }

        // Scroll to results smoothly
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      } else {
        setStatus('no-match')
      }
    } catch (err) {
      if (err instanceof FaceDetectionError) {
        if (err.isNoFace) {
          setStatus('no-face')
          setErrorMessage(
            err.message || 'No face was detected in your photo. Please upload a clear front-facing portrait.',
          )
        } else if (err.isCacheEmpty) {
          setStatus('cache-empty')
          setErrorMessage(
            'The wedding photo library is currently being indexed. Please check back shortly!',
          )
        } else {
          setStatus('error')
          setErrorMessage(err.message)
        }
      } else {
        setStatus('error')
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while searching for photos. Please try again.',
        )
      }
    }
  }

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setLightboxOpen(true)
  }

  return (
    <section
      id="find-photos"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF6F0] border-t border-[#8B263E]/10 overflow-hidden"
    >
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#8B263E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#8B263E]/30 bg-[#8B263E]/5 mb-4 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#8B263E]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B263E]">
            AI Photo Finder
          </span>
        </div>

        {/* Section Headline */}
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1F3328] text-center">
          Find Your Moments With Us
        </h2>

        {/* Section Subtitle */}
        <p className="font-serif-elegant italic text-base sm:text-lg text-[#6E5D53] text-center mt-3 max-w-xl leading-relaxed">
          Upload a selfie or portrait to instantly discover candid moments, laughter, and
          celebrations featuring you from our wedding gallery.
        </p>

        {/* Main Interactive Box */}
        <div className="mt-10 sm:mt-12 w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#8B263E]/15 polaroid-shadow transition-all">
          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={onFileInputChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={onFileInputChange}
          />

          {/* State 1: No file selected yet */}
          {!previewUrl && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragOver
                  ? 'border-[#8B263E] bg-[#8B263E]/5 scale-[1.01]'
                  : 'border-[#8B263E]/25 hover:border-[#8B263E]/60 bg-[#FAF6F0]/50 hover:bg-[#FAF6F0]'
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8B263E]/10 text-[#8B263E] mb-4 group-hover:scale-110 transition-transform">
                <Camera className="h-8 w-8" />
              </div>

              <h3 className="font-serif-title text-lg sm:text-xl font-medium text-[#2D2623]">
                Upload or Take a Selfie
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6A60] mt-1 max-w-sm">
                Drag and drop your photo here, or select from your gallery or camera.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8B263E] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#6D1E31] transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose Photo</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    cameraInputRef.current?.click()
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#8B263E]/30 bg-white px-5 py-2.5 text-xs font-semibold text-[#8B263E] hover:bg-[#8B263E]/5 transition-colors cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Selfie</span>
                </button>
              </div>

              <span className="mt-4 text-[11px] text-[#A89C94]">
                Supported: JPG, PNG, WebP (Max 10 MB)
              </span>
            </div>
          )}

          {/* State 2: File previewed (Ready to scan or currently scanning) */}
          {previewUrl && (
            <div className="flex flex-col items-center">
              {/* Preview with optional scanning beam */}
              <div className="relative h-60 w-60 sm:h-72 sm:w-72 rounded-2xl overflow-hidden border-2 border-[#8B263E]/30 bg-[#FAF6F0] shadow-md">
                <img
                  src={previewUrl}
                  alt="Your uploaded portrait"
                  className="h-full w-full object-cover object-center"
                />

                {/* Animated Scanning Beam & Overlay */}
                {status === 'scanning' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[#8B263E]/15 animate-pulse" />
                    {/* Laser Bar */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_15px_#fde047] animate-[softBounce_1.8s_ease-in-out_infinite]" />
                    {/* Target reticle */}
                    <div className="absolute inset-4 border border-dashed border-amber-300/40 rounded-xl" />
                  </div>
                )}
              </div>

              {/* Status Message during scanning */}
              {status === 'scanning' ? (
                <div className="mt-6 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#8B263E]">
                    <RefreshCw className="h-4 w-4 animate-spin text-[#8B263E]" />
                    <span>{statusMessage}</span>
                  </div>
                  <p className="text-xs text-[#7A6A60] mt-1">
                    Analyzing facial landmarks and searching Google Drive...
                  </p>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleStartScan}
                    className="inline-flex items-center gap-2 rounded-full bg-[#8B263E] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#6D1E31] transition-all cursor-pointer transform active:scale-95"
                  >
                    <Search className="h-4 w-4 text-amber-300" />
                    <span>Search My Photos</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#8B263E]/20 bg-white px-4 py-2.5 text-xs font-medium text-[#7A6A60] hover:text-[#8B263E] hover:bg-[#8B263E]/5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Upload Another</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Privacy Assurance Banner */}
          <div className="mt-8 pt-5 border-t border-[#8B263E]/10 flex items-center justify-center gap-2 text-[11px] text-[#7A6A60]">
            <Lock className="h-3.5 w-3.5 text-[#C5A059] shrink-0" />
            <span>
              <strong>Privacy Assurance:</strong> Your photo is processed strictly in-memory for
              real-time matching and is never saved or shared.
            </span>
          </div>
        </div>

        {/* Feedback / Alert Cards */}
        {status === 'no-face' && (
          <div className="mt-6 w-full max-w-2xl rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-5 flex items-start gap-3 text-amber-900 shadow-sm animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Tip: Please use a front-facing selfie with good lighting. Avoid heavy sunglasses,
                hats, or extreme blur so our AI can accurately capture your smile!
              </p>
            </div>
          </div>
        )}

        {status === 'no-match' && (
          <div className="mt-6 w-full max-w-2xl rounded-2xl bg-[#F5EFEB] border border-[#8B263E]/20 p-5 text-center shadow-sm animate-in fade-in">
            <ImageIcon className="h-7 w-7 text-[#8B263E]/70 mx-auto mb-2" />
            <h4 className="font-serif-title text-base sm:text-lg font-medium text-[#2D2623]">
              No Matching Photos Found Yet
            </h4>
            <p className="text-xs sm:text-sm text-[#7A6A60] mt-1 max-w-md mx-auto leading-relaxed">
              We couldn't find photos with high facial similarity in our current event album. Our
              photographer might still be processing candid shots from the evening, or you can try
              uploading another selfie with different lighting.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#8B263E]/30 bg-white px-4 py-2 text-xs font-semibold text-[#8B263E] hover:bg-[#8B263E]/5 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Another Photo</span>
            </button>
          </div>
        )}

        {status === 'cache-empty' && (
          <div className="mt-6 w-full max-w-2xl rounded-2xl bg-blue-50 border border-blue-200 p-4 sm:p-5 flex items-start gap-3 text-blue-900 shadow-sm animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Event Gallery Being Prepared</p>
              <p className="text-xs text-blue-700 mt-1">
                The Google Drive photo index is being refreshed. Please check back in a few minutes
                once the photos have finished indexing.
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 w-full max-w-2xl rounded-2xl bg-red-50 border border-red-200 p-4 sm:p-5 flex items-start gap-3 text-red-900 shadow-sm animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Unable to Complete Search</p>
              <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
              <button
                type="button"
                onClick={handleStartScan}
                className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-950 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {status === 'success' && matches.length > 0 && (
          <div ref={resultsRef} className="mt-12 w-full flex flex-col items-center animate-in fade-in">
            {/* Success Summary Pill */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C3326] text-white shadow-md mb-8">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-medium">
                Found {matches.length} matching {matches.length === 1 ? 'photo' : 'photos'} of you!
              </span>
            </div>

            {/* Matched Photos Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {matches.map((photo, index) => {
                const matchPct = Math.round(photo.similarity * 100)
                return (
                  <div
                    key={photo.fileName + index}
                    className="group relative flex flex-col rounded-2xl bg-white p-3.5 shadow-sm border border-[#8B263E]/15 hover:shadow-xl hover:border-[#8B263E]/30 transition-all duration-300"
                  >
                    {/* Photo Container */}
                    <div
                      onClick={() => openLightbox(index)}
                      className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#FAF6F0] cursor-pointer"
                    >
                      <img
                        src={photo.thumbnailLink}
                        alt={photo.fileName}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Top Match Tag */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                        <Sparkles className="h-3 w-3 text-amber-300" />
                        <span>{matchPct}% Match</span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-3.5 py-1.5 text-xs font-semibold text-[#8B263E] shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <ZoomIn className="h-3.5 w-3.5" />
                          <span>View Full Photo</span>
                        </div>
                      </div>
                    </div>

                    {/* Photo Details & Action Links */}
                    <div className="mt-3 flex items-center justify-between text-left px-1">
                      <div className="truncate mr-2">
                        <p className="text-xs font-medium text-[#2D2623] truncate">
                          {photo.fileName}
                        </p>
                        <p className="text-[11px] text-[#7A6A60]">
                          {photo.confidence || 'Matched'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={photo.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open original on Google Drive"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF6F0] text-[#7A6A60] hover:text-[#8B263E] hover:bg-[#8B263E]/10 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-[#8B263E]/30 bg-white px-5 py-2.5 text-xs font-semibold text-[#8B263E] hover:bg-[#8B263E]/5 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Search With Another Photo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal with Full Controls */}
      <PhotoLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        matches={matches}
        initialIndex={selectedPhotoIndex}
      />
    </section>
  )
}
