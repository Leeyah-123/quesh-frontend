import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({ className, variant = "text", width, height, animation = "pulse" }: SkeletonProps) {
  const baseClasses = "bg-slate-700/50"

  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 bg-[length:400%_100%]",
    none: "",
  }

  const style: React.CSSProperties = {}

  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width
  }

  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], animationClasses[animation], className)} style={style} />
  )
}
