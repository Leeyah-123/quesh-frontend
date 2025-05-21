"use client"

import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
      <div className="flex">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center mr-2">
          <Bot className="h-4 w-4 text-white" />
        </div>

        <Card className="glass border-slate-700">
          <CardContent className="p-3">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
