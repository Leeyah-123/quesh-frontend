"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="w-full max-w-md flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-6 md:p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2 neon-text">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your Quesh account</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
