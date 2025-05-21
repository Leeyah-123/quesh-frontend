"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfilePlan } from "@/components/profile/profile-plan"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileSecurity } from "@/components/profile/profile-security"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorAlert } from "@/components/ui/error-alert"

export function ProfilePage() {
  const { user, isLoading, error } = useAuth()
  const [activeTab, setActiveTab] = useState("info")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-8">
        <ErrorAlert
          title="Failed to load profile"
          message={error}
          onRetry={() => window.location.reload()}
          className="max-w-md mx-auto"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your profile.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold neon-text">Your Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="info">Account</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="info" className="mt-0">
                  <ProfileInfo user={user} />
                </TabsContent>

                <TabsContent value="plan" className="mt-0">
                  <ProfilePlan user={user} />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <ProfileSettings user={user} />
                </TabsContent>

                <TabsContent value="stats" className="mt-0">
                  <ProfileStats />
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <ProfileSecurity user={user} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
