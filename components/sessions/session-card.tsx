"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/tilt-card"
import { FileText, MessageSquare, Calendar, Trash2, MoreVertical, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Session } from "@/store/session-store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SessionCardProps {
  session: Session
  onDelete: () => void
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Format date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(session.lastUpdatedAt)

  // Get document type icon
  const getDocumentTypeIcon = () => {
    switch (session.documentType) {
      case "pdf":
        return <div className="text-red-400 text-xs font-medium">PDF</div>
      case "docx":
        return <div className="text-blue-400 text-xs font-medium">DOCX</div>
      case "url":
        return <div className="text-green-400 text-xs font-medium">URL</div>
      default:
        return <div className="text-gray-400 text-xs font-medium">DOC</div>
    }
  }

  // Get preview of last message
  const getLastMessagePreview = () => {
    const lastMessage = session.messages.filter((m) => m.role === "assistant").pop()
    if (!lastMessage) return "No messages yet"

    // Truncate message to 100 characters
    return lastMessage.content.length > 100 ? lastMessage.content.substring(0, 100) + "..." : lastMessage.content
  }

  return (
    <>
      <TiltCard intensity={10} scale={1.03} className="h-full">
        <Card className="glass border-slate-700 h-full flex flex-col">
          <CardContent className="p-5 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-slate-800 p-2 rounded mr-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium line-clamp-1">{session.documentTitle}</h3>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    {getDocumentTypeIcon()}
                    {session.documentSize && (
                      <span className="ml-2">{(session.documentSize / 1024 / 1024).toFixed(2)} MB</span>
                    )}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-slate-700">
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  {session.documentUrl && (
                    <DropdownMenuItem asChild>
                      <a href={session.documentUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Source
                      </a>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-gray-300 line-clamp-3 mb-4">{getLastMessagePreview()}</p>

            <div className="flex items-center text-xs text-gray-400 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                <span>{session.questionCount} questions</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0 mt-auto">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href={`/document/${session.id}`}>Continue Chat</Link>
            </Button>
          </CardFooter>
        </Card>
      </TiltCard>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
