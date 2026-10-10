import { useEffect, useState } from 'react'
import type { CountdownTime } from '../types/wedding.ts'

export function useCountdown(targetIsoDate: string): CountdownTime {
  const calculateTime = (): CountdownTime => {
    const target = new Date(targetIsoDate).getTime()
    const now = new Date().getTime()
    const diff = target - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isExpired: false }
  }

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetIsoDate])

  return timeLeft
}
