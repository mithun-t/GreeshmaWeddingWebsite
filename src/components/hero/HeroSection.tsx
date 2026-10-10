import { ChevronDown } from 'lucide-react'
import type { WeddingConfig } from '../../types/wedding.ts'
import { PetalCanvas } from './PetalCanvas.tsx'

interface HeroSectionProps {
  data: WeddingConfig
}

export function HeroSection({ data }: HeroSectionProps) {
  const scrollToNext = () => {
    const target = document.getElementById('celebration')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#FAF6F0]">
      {/* Background Bougainvillea Corner Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={data.images.heroBougainvillea}
          alt="Bougainvillea background"
          className="h-full w-full object-cover object-left-top opacity-95 transition-opacity duration-1000"
        />
        {/* Soft Warm Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF6F0]/40 to-[#FAF6F0]" />
      </div>

      {/* Floating flower petals simulation */}
      <PetalCanvas />

      {/* Top spacing to give room for floral branch */}
      <div className="pt-24 sm:pt-32" />

      {/* Central Typography Block matching reference video exactly */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 my-auto">
        {/* Main English Serif Headline: "Hridayam" */}
        <h1 className="font-serif-title text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-[#1F3328] drop-shadow-xs">
          {data.titleEn}
        </h1>

        {/* Regional Malayalam Calligraphy: "ഹൃദയം" */}
        <p className="font-malayalam text-2xl sm:text-3xl md:text-4xl text-[#8B263E] mt-2 sm:mt-3 font-semibold tracking-wide">
          {data.titleRegional}
        </p>

        {/* Wedding Date in clean tracked style: 20-12-26 */}
        <div className="mt-6 sm:mt-8">
          <p className="font-serif-elegant text-xl sm:text-2xl tracking-[0.3em] font-medium text-[#4A3B32]">
            {data.dateLabel}
          </p>
        </div>
      </div>

      {/* Bottom Cue matching reference video: SCROLL TO DISCOVER with bouncing chevron */}
      <div className="relative z-20 pb-10 flex flex-col items-center text-center">
        <button
          type="button"
          onClick={scrollToNext}
          className="group flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#7A6A60] uppercase">
            Scroll to discover
          </span>
          <ChevronDown className="h-4 w-4 text-[#7A6A60] animate-soft-bounce" />
        </button>
      </div>
    </section>
  )
}
