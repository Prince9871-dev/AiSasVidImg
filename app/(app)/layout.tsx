"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Share2,
  Upload,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/social-share", label: "Social Share", icon: Share2 },
  { href: "/video-upload", label: "Video Upload", icon: Upload },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-gray-100">

      {/* Sidebar */}
      <aside className="w-72 bg-[#0F1629] border-r border-white/5 flex flex-col">

        <div className="h-20 flex items-center px-8 text-xl font-semibold tracking-tight border-b border-white/5">
          AiSaaS Studio
        </div>

        <nav className="flex-1 px-6 py-8 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0F1629]/50 backdrop-blur-md">
          
          <h2 className="text-lg font-medium tracking-tight">
            Cloudinary Showcase
          </h2>

          <div className="flex items-center gap-6">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-14">
          {children}
        </main>
      </div>
    </div>
  );
}