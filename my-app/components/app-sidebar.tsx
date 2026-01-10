"use client"

import * as React from "react"
import {
  Users,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  LayoutDashboard
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Clientes",
      url: "/dashboard/clientes",
      icon: Users,
      isActive: false,
      items: [],
    },
  ],
  projects: [],
}

import { getWorkspaces, getSelectedWorkspace, setSelectedWorkspace } from "@/lib/workspace-service"

// ... imports remain ... (keep NavMain, NavProjects etc imports)

import { useRouter, usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = React.useState(data.user)
  const [workspaces, setWorkspaces] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const navMainWithActive = React.useMemo(() => data.navMain.map((item) => ({
    ...item,
    isActive: item.url === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.url),
  })), [pathname])

  const fetchWorkspaces = React.useCallback(async () => {
    try {
      const wsData = await getWorkspaces()
      // Map Strapi data to component expected format
      // Assuming Strapi v4/v5 response structure. Adjust as needed.
      // If wsData is just an array:
      const mappedWorkspaces = Array.isArray(wsData) ? wsData.map((ws: any) => ({
        name: ws.name || ws.attributes?.name || "Untitled",
        logo: GalleryVerticalEnd, // Default logo
        plan: ws.plan || ws.attributes?.plan || "Free", // Default plan
        id: ws.id
      })) : []

      // If we have workspaces, set them. Otherwise default to the mock or empty
      if (mappedWorkspaces.length > 0) {
        setWorkspaces(mappedWorkspaces)

        // Ensure active workspace is still valid or set to default
        const currentSaved = getSelectedWorkspace()
        if (currentSaved) {
          const exists = mappedWorkspaces.find((w: any) => w.id === currentSaved.id)
          if (!exists) {
            // Saved workspace no longer exists, default to first
            setSelectedWorkspace(mappedWorkspaces[0])
          }
        } else {
          // No saved workspace, default to first (though this shouldn't happen if forwarded from /workspace)
          setSelectedWorkspace(mappedWorkspaces[0])
        }

      } else {
        // No workspaces found on server, redirect to create one
        setSelectedWorkspace(null)
        router.push("/workspace")
      }

    } catch (error) {
      console.error("Failed to fetch workspaces", error)
      router.push("/workspace")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // Load User
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser({
          name: userData.username || "User",
          email: userData.email || "",
          avatar: "/avatars/shadcn.jpg",
        })
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }

    fetchWorkspaces()
  }, [fetchWorkspaces])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {isLoading ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <div className="bg-muted flex aspect-square size-8 items-center justify-center rounded-lg animate-pulse" />
                <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <TeamSwitcher
            teams={workspaces.length > 0 ? workspaces : data.teams}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
