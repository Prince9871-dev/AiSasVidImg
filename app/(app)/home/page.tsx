"use client"

import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Videocard from "@/app/components/Videocard"
import { Video } from "@/types"

function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos")

      if (Array.isArray(response.data)) {
        setVideos(response.data)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      console.log(error)
      setError("Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", title)
    link.setAttribute("target", "_blank")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // 🔥 Loading State (Professional Skeleton)
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="h-8 w-40 bg-white/10 rounded mb-8 animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-10">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Your Videos
        </h1>
        <span className="text-sm text-gray-400">
          {videos.length} total
        </span>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-xl text-gray-400 mb-3">
            No videos available
          </div>
          <p className="text-sm text-gray-500">
            Upload your first video to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Videocard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home