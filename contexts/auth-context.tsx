"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth-service"

export type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGithub: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("auth_token")

        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        // Clear invalid token to prevent redirect loops
        localStorage.removeItem("auth_token")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authService.login(email, password)
      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authService.signup(name, email, password)
      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      const userData = await authService.loginWithGoogle()
      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGithub = async () => {
    setIsLoading(true)
    try {
      const userData = await authService.loginWithGithub()
      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithGithub,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
