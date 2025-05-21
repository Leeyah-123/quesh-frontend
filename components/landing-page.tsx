"use client"

import { motion } from "framer-motion"
import { ArrowRight, FileText, Search, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HeroBackground } from "@/components/hero-background"
import { useAuth } from "@/contexts/auth-context"
import { TiltCard } from "@/components/tilt-card"

export function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden relative">
      <HeroBackground />

      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Search className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold neon-text">Quesh</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2"
        >
          {isAuthenticated ? (
            <Button asChild variant="outline" className="border-purple-500 text-white hover:bg-purple-500/10">
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="border-purple-500 text-white hover:bg-purple-500/10">
                <Link href="/auth/signup">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </motion.div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 neon-text">Interact with documents intelligently</h2>
          <p className="text-xl text-gray-300 mb-10">
            Upload academic papers, research articles, or class notes and instantly begin an intelligent, chat-based
            exploration of their contents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-purple-500 text-white hover:bg-purple-500/10">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-32"
          id="features"
        >
          <h3 className="text-3xl font-bold text-center mb-16 neon-text">Key Features</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-10 w-10 text-purple-400" />,
                title: "Semantic Search",
                description: "Find information based on meaning, not just keywords. Ask questions in natural language.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-blue-400" />,
                title: "AI-Powered Chat",
                description:
                  "Have a conversation with your documents. Ask follow-up questions and get instant answers.",
              },
              {
                icon: <FileText className="h-10 w-10 text-purple-400" />,
                title: "Smart Summaries",
                description: "Get concise summaries of entire documents or specific sections to save time.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <TiltCard className="glass p-6 rounded-xl hover:border-purple-500/50 transition-all neon-glow h-full">
                  <div className="bg-slate-800/50 p-3 rounded-lg w-fit mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-slate-800 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Quesh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
