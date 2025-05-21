"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="auth-label">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="auth-label">
            Password
          </Label>
          <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="auth-button auth-button-primary">
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-slate-900 text-gray-400">or continue with</span>
        </div>
      </div>

      <SocialLoginButtons />
    </form>
  )
}
