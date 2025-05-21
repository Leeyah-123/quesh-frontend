"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, File, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TiltCard } from "@/components/tilt-card"

interface DocumentUploaderProps {
  onUploadComplete: (fileName: string) => void
}

export function DocumentUploader({ onUploadComplete }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "complete" | "error">("idle")
  const [fileName, setFileName] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    setFileName(file.name)
    setUploadState("uploading")

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploadState("complete")
        setTimeout(() => {
          onUploadComplete(file.name)
        }, 500)
      }
    }, 100)
  }

  const cancelUpload = () => {
    setUploadState("idle")
    setUploadProgress(0)
    setFileName("")
  }

  return (
    <div className="space-y-4">
      {uploadState === "idle" ? (
        <TiltCard intensity={10} scale={1.03}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50"
            }`}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileChange}
            />

            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="bg-slate-800 p-3 rounded-full mb-4">
                  <Upload className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-sm mb-2">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PDF, DOCX, TXT, MD (max 10MB)</p>
              </div>
            </label>
          </div>
        </TiltCard>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-slate-700 rounded-lg p-4"
        >
          <div className="flex items-center mb-3">
            <div className="bg-slate-800 p-2 rounded mr-3">
              <File className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
            </div>
            {uploadState === "uploading" ? (
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={cancelUpload}>
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <div className="bg-green-500/20 p-1 rounded-full">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-1" />
            <p className="text-xs text-gray-400">
              {uploadState === "uploading" ? `Uploading... ${uploadProgress}%` : "Upload complete"}
            </p>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-gray-400 text-center">
        By uploading, you agree to our{" "}
        <a href="#" className="text-purple-400 hover:underline">
          Terms of Service
        </a>
      </p>
    </div>
  )
}
