"use client"

import type React from "react"
import { useCardTilt } from "@/hooks/use-card-tilt"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  perspective?: number
  scale?: number
}

export function TiltCard({
  children,
  className = "",
  intensity = 15,
  perspective = 1000,
  scale = 1.05,
}: TiltCardProps) {
  const { cardRef, tiltStyle, isHovering } = useCardTilt(intensity, perspective, scale)

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden`} style={tiltStyle}>
      {children}

      {/* Highlight effect on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: isHovering ? 1 : 0 }}
      />

      {/* Shadow effect */}
      <div className={`tilt-card-shadow ${isHovering ? "active" : ""}`} />

      {/* Shine effect */}
      <div
        className={`tilt-card-shine ${isHovering ? "active" : ""}`}
        style={{
          transform: isHovering
            ? `translateX(${tiltStyle.transform.includes("rotateY") ? Number.parseInt(tiltStyle.transform.split("rotateY(")[1].split("deg")[0]) * 10 : 0}px)`
            : "translateX(0px)",
        }}
      />
    </div>
  )
}
