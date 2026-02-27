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

  // max file size of 70 mb
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
        alert("Video uploaded successfully!");
        router.push("/videos");
      } else {
        alert("Failed to upload video. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      {/* Title Input */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          className="w-full border rounded p-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
        />
      </div>

      {/* File Input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Video</label>
        <input
          type="file"
          accept="video/*"
          className="w-full"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <p className="text-sm text-gray-500 mt-1">
          Maximum file size: 70MB
        </p>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}

export default VideoUpload;