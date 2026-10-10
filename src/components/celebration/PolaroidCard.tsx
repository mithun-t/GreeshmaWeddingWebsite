import { Heart } from 'lucide-react'
import type { WeddingConfig } from '../../types/wedding.ts'

interface PolaroidCardProps {
  data: WeddingConfig
}

export function PolaroidCard({ data }: PolaroidCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md px-4 py-8">
      {/* Polaroid Container with realistic paper texture & shadow */}
      <div className="group relative rounded-sm bg-white p-4 sm:p-5 pb-8 sm:pb-10 polaroid-shadow transition-all duration-500 hover:-translate-y-1 hover:rotate-1">
        {/* Photo Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-[#F5EFEB]">
          <img
            src={data.images.couplePortrait}
            alt={data.coupleName}
            className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Polaroid Bottom Caption matching video */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center justify-center gap-1 text-center">
          <Heart className="h-3.5 w-3.5 fill-[#8B263E] text-[#8B263E] animate-pulse" />
          <p className="font-serif-elegant italic text-2xl sm:text-3xl font-medium tracking-wide text-[#2D2623]">
            {data.coupleName}
          </p>
        </div>
      </div>
    </div>
  )
}
