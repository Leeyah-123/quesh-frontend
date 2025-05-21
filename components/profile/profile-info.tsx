"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Check, Loader2, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ErrorAlert } from "@/components/ui/error-alert"

interface ProfileInfoProps {
  user: User
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const { updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would upload the avatar file first
      // and then update the profile with the avatar URL
      await updateProfile({
        name: formData.name,
        email: formData.email,
        // avatar: avatarUrl from upload
      })
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setFormData({
      name: user.name,
      email: user.email,
    })
    setAvatarFile(null)
    setAvatarPreview(null)
    setError(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="glass border-slate-700">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} className="mb-6" />}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-slate-700">
                  <AvatarImage src={avatarPreview || user.avatar} />
                  <AvatarFallback className="text-lg bg-purple-600">{getInitials(user.name)}</AvatarFallback>
                </Avatar>

                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>

              <p className="text-sm text-gray-400 mt-2">{isEditing ? "Click to change avatar" : "Profile picture"}</p>
            </div>

            {/* Form fields */}
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <p className="text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={isLoading}
                      className="border-slate-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
