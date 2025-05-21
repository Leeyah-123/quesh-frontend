"use client"

import { useState, useRef, useEffect } from "react"

interface TiltValues {
  rotateX: number
  rotateY: number
  translateZ: number
}

export function useCardTilt(intensity = 15, perspective = 1000, scale = 1.05) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<TiltValues>({ rotateX: 0, rotateY: 0, translateZ: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return

      const rect = card.getBoundingClientRect()

      // Calculate mouse position relative to the card center
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX
      const mouseY = e.clientY

      // Calculate rotation based on mouse position
      // Invert Y axis for natural tilt (moving mouse to top tilts card forward)
      const rotateY = ((mouseX - centerX) / (rect.width / 2)) * intensity
      const rotateX = -((mouseY - centerY) / (rect.height / 2)) * intensity

      setTilt({
        rotateX,
        rotateY,
        translateZ: 50,
      })
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setTilt({ rotateX: 0, rotateY: 0, translateZ: 0 })
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [intensity, isHovering])

  const tiltStyle = {
    transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(${tilt.translateZ}px) scale(${isHovering ? scale : 1})`,
    transition: isHovering ? "transform 0.1s ease" : "transform 0.5s ease",
  }

  return { cardRef, tiltStyle, isHovering }
}
