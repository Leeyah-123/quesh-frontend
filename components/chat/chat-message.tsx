"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TiltCard } from "@/components/tilt-card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

export interface Reference {
  text: string
  page: number
  confidence?: number
}

export interface ChatMessageProps {
  id: string
  content: string
  role: "user" | "assistant"
  isStreaming?: boolean
  references?: Reference[]
  suggestions?: string[]
  timestamp: Date
  error?: boolean
  onRetry?: () => void
  onFeedback?: (messageId: string, type: "up" | "down") => void
  onSuggestionClick?: (suggestion: string) => void
}

export function ChatMessage({
  id,
  content,
  role,
  isStreaming = false,
  references = [],
  suggestions = [],
  timestamp,
  error = false,
  onRetry,
  onFeedback,
  onSuggestionClick,
}: ChatMessageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  // Scroll into view when streaming starts or ends
  useEffect(() => {
    if (isStreaming) {
      messageRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [isStreaming])

  // Copy message content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Handle feedback
  const handleFeedback = (type: "up" | "down") => {
    setFeedbackGiven(type)
    if (onFeedback) {
      onFeedback(id, type)
    }
  }

  // Format timestamp
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(timestamp)

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex", role === "user" ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex max-w-[80%]", role === "user" ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
            role === "user" ? "bg-blue-500 ml-2" : "bg-purple-500 mr-2",
          )}
        >
          {role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
        </div>

        <div className="space-y-2">
          <Card
            className={cn(
              "relative group",
              role === "user"
                ? "bg-blue-500 border-blue-600 text-white"
                : error
                  ? "bg-red-900/20 border-red-900/50 text-gray-100"
                  : "glass border-slate-700 text-gray-100",
            )}
          >
            <CardContent className="p-3 text-sm">
              {/* Markdown content */}
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>

              {/* Error retry button */}
              {error && onRetry && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="text-xs border-red-700 bg-red-900/20 hover:bg-red-900/40 text-red-300"
                  >
                    <RefreshCcw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </div>
              )}

              {/* Copy button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={copyToClipboard}
                >
                  {copiedId === id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-1 right-2 text-xs text-gray-400 opacity-50">{formattedTime}</div>
            </CardContent>
          </Card>

          {/* References section */}
          <AnimatePresence>
            {references.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {references.map((ref, index) => (
                  <TiltCard
                    key={index}
                    intensity={5}
                    scale={1.01}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-3"
                  >
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 p-1 rounded mr-2 mt-0.5">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-300">{ref.text}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">Page {ref.page}</p>
                          {ref.confidence && (
                            <p className="text-xs text-gray-500">Confidence: {Math.round(ref.confidence * 100)}%</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          <AnimatePresence>
            {!isStreaming && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <p className="text-xs text-gray-400 ml-1">SUGGESTED FOLLOW-UPS</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs border-slate-700 bg-slate-800/50 hover:bg-purple-500/20 hover:border-purple-500/50"
                      onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback buttons (only for AI messages) */}
          {role === "assistant" && !isStreaming && !error && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0",
                  feedbackGiven === "up" ? "text-green-500" : "text-gray-500 hover:text-gray-300",
                )}
                onClick={() => handleFeedback("up")}
                disabled={feedbackGiven !== null}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0",
                  feedbackGiven === "down" ? "text-red-500" : "text-gray-500 hover:text-gray-300",
                )}
                onClick={() => handleFeedback("down")}
                disabled={feedbackGiven !== null}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
