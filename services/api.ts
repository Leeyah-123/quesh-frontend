import axios, { type AxiosError, type AxiosRequestConfig } from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
})

// Types
export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
  settings: {
    theme: "light" | "dark" | "system"
    emailNotifications: boolean
    twoFactorEnabled: boolean
  }
}

export interface DocumentStats {
  totalDocuments: number
  totalQuestions: number
  totalSessions: number
  storageUsed: number
  storageLimit: number
}

export interface Session {
  id: string
  documentTitle: string
  documentType: "pdf" | "docx" | "url"
  documentSize?: number
  documentUrl?: string
  createdAt: string
  lastUpdatedAt: string
  questionCount: number
}

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
  timestamp: string
}

export interface UploadDocumentResponse {
  documentId: string
  sessionId: string
  documentTitle: string
  documentType: "pdf" | "docx"
  documentSize: number
}

export interface SubmitUrlResponse {
  documentId: string
  sessionId: string
  documentTitle: string
  documentUrl: string
}

export interface AskQuestionResponse {
  messageId: string
  answer: string
  references?: {
    text: string
    page: number
    confidence?: number
  }[]
  suggestions?: string[]
}

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || "An unexpected error occurred",
      status: error.response?.status,
    }

    // Handle specific error responses from the API
    if (error.response?.data) {
      const data = error.response.data as any
      apiError.message = data.message || apiError.message
      apiError.code = data.code
      apiError.details = data.details
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token")
      window.location.href = "/auth/login"
    }

    return Promise.reject(apiError)
  },
)

// API functions
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post<{ token: string; user: User }>("/auth/login", { email, password })
    return response.data
  },

  signup: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post<{ token: string; user: User }>("/auth/signup", { name, email, password })
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
    localStorage.removeItem("auth_token")
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me")
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>("/auth/profile", data)
    return response.data
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post("/auth/password", { currentPassword, newPassword })
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.post("/auth/delete", { password })
    localStorage.removeItem("auth_token")
  },

  toggleTwoFactor: async (enable: boolean): Promise<{ secret?: string; qrCode?: string }> => {
    const response = await api.post<{ secret?: string; qrCode?: string }>("/auth/two-factor", { enable })
    return response.data
  },
}

export const documentApi = {
  uploadDocument: async (file: File, onProgress?: (progress: number) => void): Promise<UploadDocumentResponse> => {
    const formData = new FormData()
    formData.append("file", file)

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    }

    const response = await api.post<UploadDocumentResponse>("/documents/upload", formData, config)
    return response.data
  },

  submitUrl: async (url: string): Promise<SubmitUrlResponse> => {
    const response = await api.post<SubmitUrlResponse>("/documents/url", { url })
    return response.data
  },

  getDocumentStats: async (): Promise<DocumentStats> => {
    const response = await api.get<DocumentStats>("/documents/stats")
    return response.data
  },
}

export const sessionApi = {
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get<Session[]>("/sessions")
    return response.data
  },

  getSession: async (sessionId: string): Promise<{ session: Session; messages: Message[] }> => {
    const response = await api.get<{ session: Session; messages: Message[] }>(`/sessions/${sessionId}`)
    return response.data
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/sessions/${sessionId}`)
  },

  askQuestion: async (
    sessionId: string,
    question: string,
    onChunk?: (chunk: string) => void,
  ): Promise<AskQuestionResponse> => {
    // For streaming responses, we need to handle differently
    if (onChunk) {
      const response = await api.post<ReadableStream>(
        `/sessions/${sessionId}/ask`,
        { question },
        { responseType: "stream" },
      )

      const reader = response.data.getReader()
      const decoder = new TextDecoder()
      let result: AskQuestionResponse = {
        messageId: "",
        answer: "",
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        onChunk(chunk)

        try {
          // The last chunk should be the complete response
          result = JSON.parse(chunk)
        } catch (e) {
          // Not a complete JSON yet, continue
        }
      }

      return result
    } else {
      // Non-streaming response
      const response = await api.post<AskQuestionResponse>(`/sessions/${sessionId}/ask`, { question })
      return response.data
    }
  },

  provideFeedback: async (sessionId: string, messageId: string, feedback: "up" | "down"): Promise<void> => {
    await api.post(`/sessions/${sessionId}/feedback`, { messageId, feedback })
  },
}

export default api
