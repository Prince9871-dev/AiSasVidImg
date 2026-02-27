import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/wasm";

const prisma  = new PrismaClient()

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {


  // Upload logic will go here
    try {
            //todo to check user
            const { userId } = await auth()

if (!userId) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  )
}

  if(
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
    ) {
        return NextResponse.json({ error: "Missing environment variables" }, { status: 500 })
    }
//backend receives rqusest from frontend and then we need to extract the file from the request
//request.formData() reads the incoming request body and converts it into a FormData object.
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const originalSize = formData.get("originalSize") as string | null;

    if (!file) {
        return NextResponse.json(
        { error: "File not found" },
        { status: 400 }
        );
    }

    // Convert file to buffer
    //
    // Cloudinary's Node.js SDK doesn't support direct file uploads in Next.js API routes,
    // so we need to convert the file to a buffer and use a stream to upload.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {   resource_type: "video",
                folder: "video-uploads",
                transformation: [{
                    quality: "auto",
                    fetch_format: "mp4"
                }]
             },
            (error: Error | null, result: CloudinaryUploadResult | undefined) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result as CloudinaryUploadResult);
                }
            }
        );
        uploadStream.end(buffer);
    });

    const video = await prisma.video.create({
        data: {
            title: title || "",
            description: description || null,
            publicId: uploadResult.public_id,
            originalSize: originalSize || "0",
            compressedSize: uploadResult.bytes.toString(),
            duration: (uploadResult.duration || 0).toString(),
        },
    });

    return NextResponse.json(video, { status: 200 });

    } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
    );
    }finally {
        await prisma.$disconnect()
    }
}