import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@/app/generated/prisma"

export const runtime = "nodejs"
export const maxDuration = 60
export const dynamic = "force-dynamic" // ✅ Valid App Router export

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  bytes: number
  duration?: number
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Read raw body first, then parse manually
    const contentType = request.headers.get("content-type") || ""

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    const formData = await request.formData()

    const file = formData.get("file") as File | null
    const title = formData.get("title") as string | null
    const description = formData.get("description") as string | null
    const originalSize = formData.get("originalSize") as string | null

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video-uploads",
          transformation: [{ quality: "auto", fetch_format: "mp4" }],
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as CloudinaryUploadResult)
        }
      )
      uploadStream.end(buffer)
    })

    const video = await prisma.video.create({
      data: {
        title: title || "",
        description: description || null,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalSize: originalSize || "0",
        compressedSize: uploadResult.bytes.toString(),
        duration: uploadResult.duration || 0,
      },
    })

    return NextResponse.json(video)

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}