"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a video file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 70MB limit.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);

      if (response.status === 200) {
        router.push("/videos");
      } else {
        alert("Upload failed. Try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        Upload Video
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-8 space-y-6">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full bg-slate-800 border border-slate-700 
                       rounded-xl px-4 py-3 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            className="w-full bg-slate-800 border border-slate-700 
                       rounded-xl px-4 py-3 
                       resize-none
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition-all"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Video File</label>

          <div className="flex items-center justify-between 
                          bg-slate-800 border border-slate-700 
                          rounded-xl px-4 py-3">

            <span className="text-sm text-gray-400 truncate">
              {file ? file.name : "No file selected"}
            </span>

            <label className="cursor-pointer 
                              bg-indigo-600 hover:bg-indigo-500
                              text-white text-sm font-medium
                              px-4 py-2 rounded-lg transition-all">
              Choose File
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <p className="text-xs text-gray-500">
            Maximum file size: 70MB
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-gradient-to-r 
                     from-indigo-600 to-violet-600
                     hover:opacity-90 
                     transition-all
                     py-3 rounded-xl 
                     font-medium shadow-md
                     disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>

      </div>
    </div>
  );
}

export default VideoUpload;