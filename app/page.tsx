export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Welcome to <span className="text-purple-500">AiSaaS Studio</span>
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Upload, compress and manage your videos using Cloudinary.
          Built with Next.js, Prisma and Clerk.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/video-upload"
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            Upload Video
          </a>

          <a
            href="/home"
            className="px-6 py-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-all duration-200 font-medium"
          >
            View Videos
          </a>
        </div>

      </div>
    </div>
  )
}