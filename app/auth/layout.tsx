import type React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Suspense } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
              <Search className="h-4 w-4 text-white" />
            </Suspense>
          </div>
          <h1 className="text-xl font-bold neon-text">Quesh</h1>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background elements */}
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-purple-600/20 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-blue-600/20 rounded-full filter blur-[100px]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="container mx-auto py-4 px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Quesh. All rights reserved.</p>
      </footer>
    </div>
  )
}
