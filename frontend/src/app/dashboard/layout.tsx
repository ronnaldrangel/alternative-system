"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"
import WorkspaceManager from "@/components/WorkspaceManager"
import { getWorkspaces } from "@/lib/strapi"

interface Workspace {
    id: number
    name: string
    slug: string
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [isSelectingWorkspace, setIsSelectingWorkspace] = useState(false)
    const [mounted, setMounted] = useState(false)

    const fetchWorkspaces = async (token: string) => {
        try {
            const response = await getWorkspaces(token);
            const wsList = response.data.map((item: any) => {
                if (item.attributes) {
                    return { id: item.id, ...item.attributes };
                }
                return item;
            });
            setWorkspaces(wsList);
        } catch (err) {
            console.error("Error loading workspaces", err);
        }
    }

    useEffect(() => {
        setMounted(true)
        const storedUser = localStorage.getItem("user")
        const storedWorkspace = localStorage.getItem("currentWorkspace")
        const jwt = localStorage.getItem("jwt")

        if (!storedUser || !jwt) {
            router.push("/login")
            return
        }

        try {
            const parsedUser = JSON.parse(storedUser)
            setUser({
                name: parsedUser.username,
                email: parsedUser.email,
                avatar: `https://avatar.vercel.sh/${parsedUser.username}`,
            })

            // Load workspaces
            fetchWorkspaces(jwt);

            if (storedWorkspace) {
                setCurrentWorkspace(JSON.parse(storedWorkspace))
            } else {
                // Auto select first or show manager?
                // For now, let's wait for user to select if not set, or selecting first found in fetch
                // But fetch is async. We'll handle this in the workspace manager check
                setIsSelectingWorkspace(true)
            }
        } catch (error) {
            console.error("Error parsing user data", error)
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        localStorage.removeItem("user")
        localStorage.removeItem("currentWorkspace")
        router.push("/login")
        toast.info("Sesión cerrada")
    }

    const handleWorkspaceChange = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
        localStorage.setItem("currentWorkspace", JSON.stringify(workspace));
        setIsSelectingWorkspace(false);
        toast.success(`Cambiado a ${workspace.name}`);
        window.location.reload(); // Reload to refresh data context
    }

    const handleCreateWorkspace = () => {
        setIsSelectingWorkspace(true);
    }

    if (!mounted) return null

    if (isSelectingWorkspace) {
        return <WorkspaceManager onWorkspaceSelected={handleWorkspaceChange} />
    }

    return (
        <SidebarProvider>
            <AppSidebar
                user={user}
                workspaces={workspaces}
                activeWorkspace={currentWorkspace}
                onWorkspaceChange={handleWorkspaceChange}
                onCreateWorkspace={handleCreateWorkspace}
                onLogout={handleLogout}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentWorkspace?.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
