"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Search, Home, Settings, History, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentUploader } from "@/components/document/document-uploader"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/auth-context"

export function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(true)
  const isMobile = useMobile()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold neon-text">Quesh</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-2 hidden md:inline-block">{user?.name || "User"}</span>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        {(showSidebar || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -280 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-64 border-r border-slate-800 glass flex flex-col h-full"
          >
            <div className="p-4">
              <Button variant="outline" className="w-full justify-start neon-border" asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </a>
              </Button>
            </div>

            <nav className="p-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-gray-400 mb-3">RECENT DOCUMENTS</h3>
              <ul className="space-y-1">
                {["Research Paper.pdf", "Lecture Notes.pdf", "Article.pdf"].map((doc, index) => (
                  <li key={index}>
                    <Button variant="ghost" className="w-full justify-start text-sm font-normal" asChild>
                      <a href={`/document/doc-${index}`}>
                        <FileText className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="truncate">{doc}</span>
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto p-4 border-t border-slate-800">
              <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </div>
          </motion.aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 neon-text">Upload a Document</h2>
                <p className="text-gray-400">Upload a document or paste a URL to start analyzing</p>
              </div>

              <DocumentUploader />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
