"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-slate-800 bg-slate-900/50",
        className,
      )}
    >
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
