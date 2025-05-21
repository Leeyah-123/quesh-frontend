"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
    }[] = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: i % 2 === 0 ? "#8b5cf6" : "#3b82f6", // Purple and blue
        alpha: Math.random() * 0.5 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.alpha * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(139, 92, 246, 0.05)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <>
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent opacity-30" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <motion.div
        className="absolute top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-[100px] opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-40 -right-40 w-80 h-80 bg-blue-600 rounded-full filter blur-[100px] opacity-20"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </>
  )
}
