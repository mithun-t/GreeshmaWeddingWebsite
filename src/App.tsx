import { useState, useEffect } from 'react'
import { weddingData } from './data/weddingData.ts'
import type { WeddingEvent } from './types/wedding.ts'
import { useAudioPlayer } from './hooks/useAudioPlayer.ts'
import { FloatingAudioPlayer } from './components/audio/FloatingAudioPlayer.tsx'
import { HeroSection } from './components/hero/HeroSection.tsx'
import { CelebrationSection } from './components/celebration/CelebrationSection.tsx'
import { CountdownSection } from './components/countdown/CountdownSection.tsx'
import { GallerySection } from './components/gallery/GallerySection.tsx'
import { FaceFinderSection } from './components/face-finder/FaceFinderSection.tsx'
import { ItinerarySection } from './components/itinerary/ItinerarySection.tsx'
import { RsvpSection } from './components/rsvp/RsvpSection.tsx'
import { AdminRsvpModal } from './components/rsvp/AdminRsvpModal.tsx'
import { VenueMapModal } from './components/map/VenueMapModal.tsx'
import { Footer } from './components/layout/Footer.tsx'

export default function App() {
  const { isPlaying, togglePlay } = useAudioPlayer(weddingData.audioSrc)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isAdminRsvpOpen, setIsAdminRsvpOpen] = useState(false)
  const [activeEvent, setActiveEvent] = useState<WeddingEvent | null>(null)

  // Listen for keyboard shortcut (Alt+A) or hash (#admin-rsvp) to open Admin RSVP
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault()
        setIsAdminRsvpOpen((prev) => !prev)
      }
    }

    const checkHash = () => {
      if (window.location.hash === '#admin-rsvp' || window.location.hash === '#rsvp-admin') {
        setIsAdminRsvpOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('hashchange', checkHash)
    checkHash()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('hashchange', checkHash)
    }
  }, [])

  const handleOpenMap = (event?: WeddingEvent) => {
    setActiveEvent(event || null)
    setIsMapOpen(true)
  }

  const handleCloseMap = () => {
    setIsMapOpen(false)
    setActiveEvent(null)
  }

  return (
    <div className="relative min-h-screen w-full bg-[#FAF6F0] selection:bg-[#8B263E]/15 selection:text-[#8B263E]">
      {/* Floating Ambient Audio Player with Equalizer */}
      <FloatingAudioPlayer isPlaying={isPlaying} onToggle={togglePlay} />

      {/* Main Single-Page Invitation Layout */}
      <main className="relative flex flex-col w-full">
        <HeroSection data={weddingData} />
        <CelebrationSection data={weddingData} onOpenMap={() => handleOpenMap()} />
        <CountdownSection data={weddingData} />
        <GallerySection data={weddingData} />
        <FaceFinderSection />
        <ItinerarySection data={weddingData} onOpenMap={handleOpenMap} />
        <RsvpSection data={weddingData} onOpenAdmin={() => setIsAdminRsvpOpen(true)} />
      </main>

      {/* Footer */}
      <Footer data={weddingData} />

      {/* Interactive Venue Map Modal */}
      <VenueMapModal
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        data={weddingData}
        activeEvent={activeEvent}
      />

      {/* Host Admin RSVP Dashboard Modal */}
      <AdminRsvpModal
        isOpen={isAdminRsvpOpen}
        onClose={() => setIsAdminRsvpOpen(false)}
      />
    </div>
  )
}
