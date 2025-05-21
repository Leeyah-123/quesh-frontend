"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ErrorAlert } from "@/components/ui/error-alert"

interface ProfileSettingsProps {
  user: User
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const { updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    theme: user.settings.theme,
    emailNotifications: user.settings.emailNotifications,
  })
  const [isSaved, setIsSaved] = useState(false)

  const handleThemeChange = (value: string) => {
    setSettings((prev) => ({ ...prev, theme: value as "light" | "dark" | "system" }))
  }

  const handleNotificationChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, emailNotifications: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setIsSaved(false)

    try {
      await updateProfile({
        settings: {
          ...user.settings,
          theme: settings.theme,
          emailNotifications: settings.emailNotifications,
        },
      })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass border-slate-700">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your application experience</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme" className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="glass border-slate-700">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Choose how Quesh appears to you. System setting will follow your device theme.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-xs text-gray-400">Receive email updates about your documents and account</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.emailNotifications}
                onCheckedChange={handleNotificationChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound">Sound Effects</Label>
                <p className="text-xs text-gray-400">Play sound effects when actions are completed</p>
              </div>
              <Switch id="sound" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <p className="text-xs text-gray-400">Enable animations throughout the interface</p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
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
              ) : isSaved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
