import type { WeddingConfig } from '../../types/wedding.ts'
import { useCountdown } from '../../hooks/useCountdown.ts'

interface CountdownSectionProps {
  data: WeddingConfig
}

export function CountdownSection({ data }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(data.weddingDateIso)

  const padZero = (n: number) => n.toString().padStart(2, '0')

  const items = [
    { label: 'DAYS', value: padZero(days) },
    { label: 'HOURS', value: padZero(hours) },
    { label: 'MINS', value: padZero(minutes) },
    { label: 'SECS', value: padZero(seconds) },
  ]

  return (
    <section className="relative w-full py-16 px-6 bg-[#FAF6F0] flex flex-col items-center text-center">
      {/* Tag Badge: COUNTING DOWN */}
      <div className="mb-6">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#8B263E]">
          Counting Down
        </span>
      </div>

      {/* 4-Column Grid matching reference video */}
      <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-md w-full">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/80 border border-[#8B263E]/10 shadow-xs"
          >
            <span className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1F3328] tracking-tight">
              {item.value}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#7A6A60] mt-1 sm:mt-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
