"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSessionStore } from "@/store/session-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SessionCard } from "@/components/sessions/session-card"
import { ChevronLeft, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SessionsPage() {
  const { sessions, deleteSession } = useSessionStore((state) => ({
    sessions: state.sessions,
    deleteSession: state.deleteSession,
  }))

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "questions">("newest")

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) =>
    session.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort sessions based on sort option
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === "newest") {
      return b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime()
    } else if (sortBy === "oldest") {
      return a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime()
    } else {
      // Sort by question count
      return b.questionCount - a.questionCount
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold neon-text">Your Sessions</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-700">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-slate-700">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="questions">Most Questions</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sessions grid */}
        {sortedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SessionCard session={session} onDelete={() => deleteSession(session.id)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? "No sessions match your search query" : "You haven't created any document sessions yet"}
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/dashboard">Upload a Document</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
