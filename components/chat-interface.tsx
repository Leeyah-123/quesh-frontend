"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Lightbulb, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatInterfaceProps {
  documentName: string
}

export function ChatInterface({ documentName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `I've analyzed "${documentName}". What would you like to know about it?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (query: string): string => {
    // Mock AI responses based on query
    if (query.toLowerCase().includes("summary")) {
      return `Here's a summary of "${documentName}": This document discusses the key principles of artificial intelligence and its applications in modern technology. It covers machine learning algorithms, neural networks, and ethical considerations.`
    } else if (query.toLowerCase().includes("author") || query.toLowerCase().includes("who wrote")) {
      return `The author of "${documentName}" is Dr. Jane Smith, a professor of Computer Science at MIT.`
    } else if (query.toLowerCase().includes("conclusion")) {
      return `The conclusion of "${documentName}" states that AI technology will continue to evolve rapidly, but ethical guidelines and human oversight remain essential for responsible development.`
    } else {
      return `Based on my analysis of "${documentName}", I can tell you that the document covers this topic in section 3. The main points are: 1) AI systems require large datasets for training, 2) Neural networks have revolutionized the field, and 3) Ethical considerations should guide development.`
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const suggestedQuestions = [
    "Can you summarize this document?",
    "Who is the author?",
    "What's the main conclusion?",
    "Extract key points from section 2",
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full"
      style={{ display: isMobile && messages.length > 1 ? "flex" : isMobile ? "none" : "flex" }}
    >
      {/* Chat header */}
      <div className="border-b border-slate-800 p-3 bg-slate-900/50 backdrop-blur-sm">
        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
        {/* Messages container */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" ? "bg-blue-500 ml-2" : "bg-purple-500 mr-2"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`relative group ${
                      message.sender === "user" ? "bg-blue-500 text-white" : "bg-slate-800 text-gray-100"
                    } p-3 rounded-lg`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                    <Bot className="h-4 w-4 text-white" />
                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length < 3 && (
          <div className="p-4 border-t border-slate-800">
            <p className="text-xs text-gray-400 mb-2">SUGGESTED QUESTIONS</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-700 bg-slate-800/50"
                  onClick={() => {
                    setInputValue(question)
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-slate-800 p-3 bg-slate-900/50 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about the document..."
              className="bg-slate-800/50 border-slate-700"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="flex-1 flex flex-col p-0 m-0">
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center mb-3">
                <div className="bg-purple-500/20 p-2 rounded-full mr-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="font-medium">Key Concepts</h3>
              </div>

              <ul className="space-y-2">
                {["Artificial Intelligence", "Machine Learning", "Neural Networks", "Ethics in AI", "Data Privacy"].map(
                  (concept, index) => (
                    <li key={index} className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm">{concept}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center mb-3">
                <div className="bg-blue-500/20 p-2 rounded-full mr-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="font-medium">Document Summary</h3>
              </div>

              <p className="text-sm text-gray-300">
                This document provides a comprehensive overview of artificial intelligence and its applications. It
                discusses the evolution of AI technology, current implementations, and ethical considerations for future
                development. The author emphasizes the importance of responsible AI deployment and human oversight.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="font-medium mb-3">Document Structure</h3>

              <div className="space-y-3">
                {[
                  "Introduction to AI",
                  "Historical Context",
                  "Machine Learning Algorithms",
                  "Neural Networks",
                  "Ethical Considerations",
                  "Future Directions",
                  "Conclusion",
                ].map((section, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center mr-2 text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{section}</span>
                    </div>
                    <span className="text-xs text-gray-400">Page {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </motion.div>
  )
}
