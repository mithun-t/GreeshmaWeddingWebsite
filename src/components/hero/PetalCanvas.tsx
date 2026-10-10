import { useEffect, useRef } from 'react'

interface Petal {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

export function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Generate bougainvillea pink petals
    const petalCount = Math.min(22, Math.floor(width / 35))
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.9 + 0.4,
      speedX: Math.random() * 0.6 - 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.35,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (const petal of petals) {
        petal.y += petal.speedY
        petal.x += petal.speedX + Math.sin(petal.y * 0.008) * 0.4
        petal.rotation += petal.rotationSpeed

        if (petal.y > height + 20) {
          petal.y = -20
          petal.x = Math.random() * width
        }

        ctx.save()
        ctx.translate(petal.x, petal.y)
        ctx.rotate(petal.rotation)
        ctx.beginPath()

        // Petal shape (bougainvillea oval/teardrop)
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(
          petal.size * 0.8,
          -petal.size * 0.5,
          petal.size * 0.8,
          petal.size * 0.5,
          0,
          petal.size,
        )
        ctx.bezierCurveTo(
          -petal.size * 0.8,
          petal.size * 0.5,
          -petal.size * 0.8,
          -petal.size * 0.5,
          0,
          0,
        )

        // Pink/magenta bougainvillea gradient
        ctx.fillStyle = `rgba(219, 39, 119, ${petal.opacity})`
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-70"
    />
  )
}
