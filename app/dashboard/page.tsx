"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <Dashboard />
}
