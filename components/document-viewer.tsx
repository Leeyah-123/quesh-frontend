"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Search, Download, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"

interface DocumentViewerProps {
  documentName: string
  onClose: () => void
}

export function DocumentViewer({ documentName, onClose }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10 // Mock value
  const isMobile = useMobile()

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-1/2 border-r border-slate-800 flex flex-col h-full"
      style={{ width: isMobile ? "100%" : "50%" }}
    >
      {/* Document header */}
      <div className="border-b border-slate-800 p-3 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
            <X className="h-4 w-4" />
          </Button>
          <h3 className="font-medium truncate">{documentName}</h3>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-slate-800 p-3 bg-slate-900/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search in document..." className="pl-9 bg-slate-800/50 border-slate-700" />
        </div>
      </div>

      {/* Document content */}
      <div className="flex-1 overflow-auto p-6 bg-slate-950/50">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Mock document content */}
          <div className="p-8 text-black min-h-[800px]">
            <h1 className="text-2xl font-bold mb-6">Sample Document Content</h1>
            <p className="mb-4">
              This is a placeholder for the document content. In a real implementation, this would display the actual
              PDF or document content.
            </p>
            <p className="mb-4">
              Page {currentPage} of {totalPages}
            </p>

            {/* Mock paragraphs */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Section {index + 1}</h2>
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
                  sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla
                  enim.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="border-t border-slate-800 p-3 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="border-slate-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="border-slate-700"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  )
}
