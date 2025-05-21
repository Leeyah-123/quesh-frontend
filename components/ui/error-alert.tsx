"use client"

import { AlertCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorAlertProps {
  title?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function ErrorAlert({ title, message, onRetry, onDismiss, className }: ErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      className={cn("bg-red-900/20 border-red-900 text-red-300 flex items-start", className)}
    >
      <AlertCircle className="h-5 w-5 mt-0.5" />
      <div className="flex-1 ml-2">
        {title && <AlertTitle className="mb-1">{title}</AlertTitle>}
        <AlertDescription className="text-red-200">{message}</AlertDescription>
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-xs border-red-700 bg-red-900/20 hover:bg-red-900/40 text-red-300"
              >
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-xs text-red-300 hover:text-red-200 hover:bg-red-900/20"
              >
                Dismiss
              </Button>
            )}
          </div>
        )}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="p-0 h-5 w-5 text-red-300 hover:text-red-200 hover:bg-transparent"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
