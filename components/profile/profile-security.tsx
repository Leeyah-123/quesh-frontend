"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Loader2, LogOut, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ErrorAlert } from "@/components/ui/error-alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProfileSecurityProps {
  user: User
}

export function ProfileSecurity({ user }: ProfileSecurityProps) {
  const { updatePassword, deleteAccount, logout, toggleTwoFactor } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await deleteAccount(deleteConfirmPassword)
      // Redirect will happen automatically after account deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account")
      setIsLoading(false)
    }
  }

  const handleTwoFactorToggle = async (enabled: boolean) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await toggleTwoFactor(enabled)
      if (enabled && result.qrCode) {
        // In a real app, you would show the QR code for the user to scan
        alert("Two-factor authentication enabled. Scan the QR code with your authenticator app.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update two-factor authentication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass border-slate-700">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {/* Password Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password</h3>

          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)} variant="outline" className="border-slate-700">
              Change Password
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800/50 border-slate-700 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800/50 border-slate-700 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Password must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800/50 border-slate-700 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                    setError(null)
                  }}
                  disabled={isLoading}
                  className="border-slate-700"
                >
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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={user.settings.twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
              disabled={isLoading}
            />
          </div>

          <p className="text-sm text-gray-400">
            {user.settings.twoFactorEnabled
              ? "Two-factor authentication is currently enabled. This adds an extra layer of security to your account."
              : "Enable two-factor authentication to add an extra layer of security to your account."}
          </p>
        </div>

        {/* Account Actions */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <h3 className="text-lg font-medium">Account Actions</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="border-slate-700" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass border-slate-700">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2 py-2">
                  <Label htmlFor="delete-confirm-password">Enter your password to confirm</Label>
                  <Input
                    id="delete-confirm-password"
                    type="password"
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteAccount()
                    }}
                    disabled={isLoading || !deleteConfirmPassword}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <p className="text-sm text-gray-400">
            Deleting your account will remove all of your data from our servers. This action cannot be undone.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
