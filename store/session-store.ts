import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  references?: {
    text: string
    page: number
    confidence?: number
  }[]
  suggestions?: string[]
  timestamp: Date
  error?: boolean
}

export interface Session {
  id: string
  documentTitle: string
  documentType: "pdf" | "docx" | "url"
  documentSize?: number
  documentUrl?: string
  createdAt: Date
  lastUpdatedAt: Date
  messages: Message[]
  questionCount: number
}

interface SessionState {
  sessions: Session[]
  currentSessionId: string | null
  createSession: (
    documentTitle: string,
    documentType: "pdf" | "docx" | "url",
    documentSize?: number,
    documentUrl?: string,
  ) => string
  addMessage: (sessionId: string, message: Omit<Message, "id" | "timestamp">) => string
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Omit<Message, "id">>) => void
  setCurrentSession: (sessionId: string | null) => void
  deleteSession: (sessionId: string) => void
  getCurrentSession: () => Session | null
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      createSession: (documentTitle, documentType, documentSize, documentUrl) => {
        const id = `session-${Date.now()}`
        const newSession: Session = {
          id,
          documentTitle,
          documentType,
          documentSize,
          documentUrl,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
          messages: [
            {
              id: `msg-${Date.now()}`,
              content: `I've analyzed "${documentTitle}". What would you like to know about it?`,
              role: "assistant",
              timestamp: new Date(),
              suggestions: [
                "Summarize the main points",
                "What are the key findings?",
                "Explain the methodology",
                "Who are the authors?",
              ],
            },
          ],
          questionCount: 0,
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: id,
        }))

        return id
      },

      addMessage: (sessionId, message) => {
        const messageId = `msg-${Date.now()}`
        const timestamp = new Date()

        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              const isUserMessage = message.role === "user"
              return {
                ...session,
                lastUpdatedAt: timestamp,
                questionCount: isUserMessage ? session.questionCount + 1 : session.questionCount,
                messages: [
                  ...session.messages,
                  {
                    ...message,
                    id: messageId,
                    timestamp,
                  },
                ],
              }
            }
            return session
          })

          return { sessions }
        })

        return messageId
      },

      updateMessage: (sessionId, messageId, updates) => {
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                lastUpdatedAt: new Date(),
                messages: session.messages.map((message) => {
                  if (message.id === messageId) {
                    return {
                      ...message,
                      ...updates,
                    }
                  }
                  return message
                }),
              }
            }
            return session
          })

          return { sessions }
        })
      },

      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },

      deleteSession: (sessionId) => {
        set((state) => {
          const sessions = state.sessions.filter((session) => session.id !== sessionId)
          const currentSessionId =
            state.currentSessionId === sessionId
              ? sessions.length > 0
                ? sessions[0].id
                : null
              : state.currentSessionId

          return { sessions, currentSessionId }
        })
      },

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get()
        if (!currentSessionId) return null
        return sessions.find((session) => session.id === currentSessionId) || null
      },
    }),
    {
      name: "quesh-sessions",
      partialize: (state) => ({
        sessions: state.sessions.map((session) => ({
          ...session,
          messages: session.messages,
          createdAt: session.createdAt.toISOString(),
          lastUpdatedAt: session.lastUpdatedAt.toISOString(),
          messages: session.messages.map((message) => ({
            ...message,
            timestamp: message.timestamp.toISOString(),
          })),
        })),
        currentSessionId: state.currentSessionId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO strings back to Date objects
          state.sessions = state.sessions.map((session) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            lastUpdatedAt: new Date(session.lastUpdatedAt),
            messages: session.messages.map((message) => ({
              ...message,
              timestamp: new Date(message.timestamp),
            })),
          }))
        }
      },
    },
  ),
)
