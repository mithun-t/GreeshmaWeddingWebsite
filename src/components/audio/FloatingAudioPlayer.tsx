import { Volume2, VolumeX } from 'lucide-react'

interface FloatingAudioPlayerProps {
  isPlaying: boolean
  onToggle: () => void
}

export function FloatingAudioPlayer({ isPlaying, onToggle }: FloatingAudioPlayerProps) {
  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 border border-[#8B263E]/15 cursor-pointer"
      >
        {isPlaying ? (
          /* Animated Equalizer Wave Bars matching reference video */
          <div className="flex items-end justify-center gap-1 h-5 w-5">
            <span className="w-1 rounded-full bg-[#8B263E] animate-bar-1" />
            <span className="w-1 rounded-full bg-[#8B263E] animate-bar-2" />
            <span className="w-1 rounded-full bg-[#8B263E] animate-bar-3" />
          </div>
        ) : (
          <VolumeX className="h-5 w-5 text-[#8B263E]/70 transition-colors group-hover:text-[#8B263E]" />
        )}

        {/* Pulse ring when playing */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full border border-[#8B263E]/20 animate-ping pointer-events-none opacity-50" />
        )}
      </button>
    </div>
  )
}
