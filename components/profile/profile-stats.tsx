"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { documentApi, type DocumentStats } from "@/services/api"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Skeleton } from "@/components/ui/skeleton-loader"

export function ProfileStats() {
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await documentApi.getDocumentStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Mock data for charts
  const activityData = [
    { name: "Mon", documents: 2, questions: 12 },
    { name: "Tue", documents: 1, questions: 8 },
    { name: "Wed", documents: 3, questions: 15 },
    { name: "Thu", documents: 0, questions: 5 },
    { name: "Fri", documents: 2, questions: 10 },
    { name: "Sat", documents: 1, questions: 7 },
    { name: "Sun", documents: 0, questions: 3 },
  ]

  const documentTypeData = [
    { name: "PDF", value: 65 },
    { name: "DOCX", value: 25 },
    { name: "URL", value: 10 },
  ]

  const COLORS = ["#8b5cf6", "#3b82f6", "#06b6d4"]

  if (isLoading) {
    return (
      <Card className="glass border-slate-700">
        <CardHeader>
          <CardTitle>Document Statistics</CardTitle>
          <CardDescription>Overview of your document usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="glass border-slate-700">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-slate-700">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>

            <Card className="glass border-slate-700">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass border-slate-700">
        <CardHeader>
          <CardTitle>Document Statistics</CardTitle>
          <CardDescription>Overview of your document usage</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAlert
            message={error}
            onRetry={() => {
              setIsLoading(true)
              setError(null)
              documentApi
                .getDocumentStats()
                .then(setStats)
                .catch((err) => setError(err instanceof Error ? err.message : "Failed to load document statistics"))
                .finally(() => setIsLoading(false))
            }}
          />
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100

  return (
    <Card className="glass border-slate-700">
      <CardHeader>
        <CardTitle>Document Statistics</CardTitle>
        <CardDescription>Overview of your document usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-slate-700">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-1">Total Documents</p>
              <p className="text-3xl font-bold">{stats.totalDocuments}</p>
            </CardContent>
          </Card>

          <Card className="glass border-slate-700">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-1">Total Questions</p>
              <p className="text-3xl font-bold">{stats.totalQuestions}</p>
            </CardContent>
          </Card>

          <Card className="glass border-slate-700">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-1">Total Sessions</p>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </CardContent>
          </Card>

          <Card className="glass border-slate-700">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-1">Storage Used</p>
              <p className="text-3xl font-bold">{(stats.storageUsed / (1024 * 1024)).toFixed(1)} MB</p>
              <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {storagePercentage.toFixed(1)}% of {(stats.storageLimit / (1024 * 1024)).toFixed(0)} MB
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Bar dataKey="documents" name="Documents" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="questions" name="Questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Document Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={documentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {documentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.375rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
