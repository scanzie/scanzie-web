"use client"
import { Home, Settings, BarChart3, Zap, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { authClient } from "@/lib/auth/client"
import { useEffect, useState } from "react"
import { User } from "better-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { getInitials } from "@/utils/general"

// Updated menu items to match the SEO analytics theme
const dashboardMenus = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analysis",
    url: "/dashboard/analysis",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: session } = await authClient.getSession()
        setUser(session?.user)
        console.log(session?.user)
      } catch (err) {
        console.log("An error occurred", err)
      }
    }

    fetchSession()
  }, [])

  return (
    <Sidebar className="border-r-0 shadow-xl bg-white">
      <SidebarContent className="bg-white">
        {/* Header Section */}
        <div className="p-5 border-b flex items-center gap-4">
          <Image src="/favicon.png" alt="Logo" height={24} width={24} className="w-1/3"/>
          <div className=" border-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Scanzie</h1>
            <p className="text-sm text-gray-500">SEO Analytics Platform</p>
          </div>
        </div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {dashboardMenus.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.url

                return (
                  <Link href={item.url} key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={`relative px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-gray-50 ${
                          isActive
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-r-4 border-blue-500"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <div className="w-full flex items-center">
                          <Icon
                            className={`w-5 h-5 mr-3 transition-colors ${
                              isActive
                                ? "text-blue-500"
                                : "text-gray-400 group-hover:text-gray-500"
                            }`}
                          />
                          <span className="font-medium text-sm">{item.title}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Action Card */}
        <div className="mx-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center mb-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold text-sm">Boost Your SEO</h4>
                <p className="text-blue-100 text-xs">Get optimization tips</p>
              </div>
            </div>
            <Link href="/dashboard/analysis/new">
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-all duration-200 hover:scale-105">
                Start Analysis →
              </button>
            </Link>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={user?.image as string} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 flex items-center">
                Free Plan
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Upgrade
                </span>
              </p>
            </div>
            <Link href="/dashboard/settings"  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}