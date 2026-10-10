import { useState } from 'react'
import { weddingData } from './data/weddingData.ts'
import type { WeddingEvent } from './types/wedding.ts'
import { useAudioPlayer } from './hooks/useAudioPlayer.ts'
import { FloatingAudioPlayer } from './components/audio/FloatingAudioPlayer.tsx'
import { HeroSection } from './components/hero/HeroSection.tsx'
import { CelebrationSection } from './components/celebration/CelebrationSection.tsx'
import { CountdownSection } from './components/countdown/CountdownSection.tsx'
import { GallerySection } from './components/gallery/GallerySection.tsx'
import { ItinerarySection } from './components/itinerary/ItinerarySection.tsx'
import { RsvpSection } from './components/rsvp/RsvpSection.tsx'
import { VenueMapModal } from './components/map/VenueMapModal.tsx'
import { Footer } from './components/layout/Footer.tsx'

export default function App() {
  const { isPlaying, togglePlay } = useAudioPlayer(weddingData.audioSrc)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [activeEvent, setActiveEvent] = useState<WeddingEvent | null>(null)

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
        <ItinerarySection data={weddingData} onOpenMap={handleOpenMap} />
        <RsvpSection data={weddingData} />
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
    </div>
  )
}
