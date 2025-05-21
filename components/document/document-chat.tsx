"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, MessageSquare, FileText, History, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useSessionStore } from "@/store/session-store"
import { ChatMessage } from "@/components/chat/chat-message"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { useRouter } from "next/navigation"

interface DocumentChatProps {
  documentId: string
}

export function DocumentChat({ documentId }: DocumentChatProps) {
  const router = useRouter()
  const { sessions, getCurrentSession, setCurrentSession, addMessage, updateMessage } = useSessionStore((state) => ({
    sessions: state.sessions,
    getCurrentSession: state.getCurrentSession,
    setCurrentSession: state.setCurrentSession,
    addMessage: state.addMessage,
    updateMessage: state.updateMessage,
  }))

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Set current session on mount
  useEffect(() => {
    setCurrentSession(documentId)

    // If session doesn't exist, redirect to dashboard
    const session = sessions.find((s) => s.id === documentId)
    if (!session) {
      router.push("/dashboard")
    }
  }, [documentId, sessions, setCurrentSession, router])

  // Get current session
  const currentSession = getCurrentSession()

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || !currentSession) return

    // Add user message
    addMessage(currentSession.id, {
      content: inputValue,
      role: "user",
    })

    setInputValue("")
    setIsTyping(true)

    // Focus the input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    // Simulate AI response after a delay
    setTimeout(() => {
      const messageId = addMessage(currentSession.id, {
        content: getAIResponse(inputValue),
        role: "assistant",
        references: getRandomReferences(),
        suggestions: getRandomSuggestions(),
      })

      setIsTyping(false)
    }, 2000)
  }

  const getAIResponse = (query: string): string => {
    // Mock AI responses based on query
    if (query.toLowerCase().includes("summary") || query.toLowerCase().includes("summarize")) {
      return "This research paper explores the applications of artificial intelligence in healthcare settings. The authors present several case studies where machine learning algorithms have been used to improve diagnostic accuracy, predict patient outcomes, and optimize treatment plans. The paper concludes that AI has significant potential to transform healthcare delivery, but also highlights ethical considerations and implementation challenges that need to be addressed."
    } else if (query.toLowerCase().includes("findings") || query.toLowerCase().includes("results")) {
      return "The key findings of this research include:\n\n1. AI-powered diagnostic tools achieved 94% accuracy in identifying certain conditions, compared to 89% for experienced clinicians.\n\n2. Predictive models were able to forecast patient readmissions with 78% accuracy using only routinely collected data.\n\n3. Treatment optimization algorithms reduced adverse drug events by 35% in the study population.\n\n4. Implementation challenges included integration with existing systems, staff training requirements, and initial cost barriers."
    } else if (query.toLowerCase().includes("method") || query.toLowerCase().includes("methodology")) {
      return "The researchers employed a mixed-methods approach combining quantitative analysis of patient outcomes with qualitative assessment of healthcare provider experiences. The study included:\n\n- A retrospective analysis of 50,000 anonymized patient records\n- Deployment of three different machine learning algorithms (Random Forest, Neural Networks, and Gradient Boosting)\n- Structured interviews with 45 healthcare professionals\n- A 12-month implementation period across 5 healthcare facilities\n\nStatistical significance was determined using p-values < 0.05 and confidence intervals were calculated at 95%."
    } else if (query.toLowerCase().includes("author")) {
      return "The paper was authored by:\n\n- Dr. Sarah Chen, PhD (Lead Author) - Stanford Medical AI Lab\n- Dr. Michael Rodriguez, MD - Johns Hopkins Hospital\n- Prof. James Wilson - MIT Computer Science Department\n- Dr. Emily Patel, MD, MPH - Mayo Clinic\n\nThe research was funded by the National Institute of Health (NIH) and the Healthcare Innovation Foundation."
    } else {
      return "Based on my analysis of the document, I can tell you that this research paper explores how artificial intelligence is being applied in healthcare settings. The authors conducted both quantitative and qualitative research across multiple healthcare facilities and found significant improvements in diagnostic accuracy, prediction of patient outcomes, and treatment optimization when using AI-powered tools. They also discuss implementation challenges and ethical considerations that healthcare organizations should address when adopting these technologies."
    }
  }

  const getRandomReferences = () => {
    // Mock references to document sections
    const references = [
      {
        text: "AI-powered diagnostic tools achieved 94% accuracy in identifying certain conditions, compared to 89% for experienced clinicians.",
        page: 12,
      },
      {
        text: "Implementation challenges included integration with existing systems, staff training requirements, and initial cost barriers.",
        page: 27,
      },
      {
        text: "The study included a retrospective analysis of 50,000 anonymized patient records across 5 healthcare facilities.",
        page: 8,
      },
    ]

    // Return 0-2 random references
    return Math.random() > 0.3 ? [references[Math.floor(Math.random() * references.length)]] : []
  }

  const getRandomSuggestions = () => {
    // Mock follow-up suggestions
    const allSuggestions = [
      "Tell me more about the ethical considerations",
      "What were the limitations of this study?",
      "How was the data collected?",
      "What future research is recommended?",
      "Explain the AI algorithms used",
      "What were the patient demographics?",
      "How does this compare to previous studies?",
    ]

    // Shuffle and take 2-4 suggestions
    return [...allSuggestions].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2)
  }

  const handleFeedback = (messageId: string, type: "up" | "down") => {
    if (!currentSession) return
    // In a real app, you would send this feedback to your backend
    console.log(`Feedback for message ${messageId}: ${type}`)
  }

  const handleRetry = (messageId: string) => {
    if (!currentSession) return
    // In a real app, you would retry the API call
    updateMessage(currentSession.id, messageId, { error: false })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    // Focus the input after clicking a suggestion
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  // If no session is found
  if (!currentSession) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Left sidebar */}
      <div className="w-64 border-r border-slate-800 glass flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start neon-border">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center mb-3">
            <div className="bg-slate-800 p-2 rounded mr-2">
              <FileText className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium truncate">{currentSession.documentTitle}</h2>
              <p className="text-xs text-gray-400">
                {currentSession.documentType.toUpperCase()} •
                {currentSession.documentSize
                  ? ` ${(currentSession.documentSize / 1024 / 1024).toFixed(2)} MB`
                  : " From URL"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-3">DOCUMENT SECTIONS</h3>
          <ul className="space-y-1">
            {["Abstract", "Introduction", "Methodology", "Results", "Discussion", "Conclusion", "References"].map(
              (section, index) => (
                <li key={index}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal">
                    <span className="truncate">{section}</span>
                  </Button>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link href="/sessions">
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
              <History className="mr-2 h-4 w-4" />
              Chat History
            </Button>
          </Link>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-slate-800 glass p-4 flex items-center">
          <div className="bg-slate-800 p-2 rounded-full mr-2">
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </div>
          <h1 className="font-medium">Document Chat</h1>
          <div className="ml-auto text-sm text-gray-400">{currentSession.questionCount} questions asked</div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {currentSession.messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                role={message.role}
                references={message.references}
                suggestions={message.suggestions}
                timestamp={message.timestamp}
                error={message.error}
                onRetry={() => handleRetry(message.id)}
                onFeedback={handleFeedback}
                onSuggestionClick={handleSuggestionClick}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t border-slate-800 glass p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about the document..."
              className="bg-slate-800/50 border-slate-700"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
