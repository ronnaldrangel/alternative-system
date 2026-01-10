"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Briefcase, Loader2, ArrowRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getWorkspaces, createWorkspace, setSelectedWorkspace } from "@/lib/workspace-service"
import { getToken } from "@/lib/auth-service"

export default function WorkspacePage() {
    const router = useRouter()
    const [workspaces, setWorkspaces] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [newTeamName, setNewTeamName] = React.useState("")
    const [isCreating, setIsCreating] = React.useState(false)
    const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)

    const fetchWorkspaces = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const wsData = await getWorkspaces()
            // Map Strapi data if needed, or just use as is if it matches
            const mappedWorkspaces = Array.isArray(wsData) ? wsData.map((ws: any) => ({
                name: ws.name || ws.attributes?.name || "Untitled",
                id: ws.id,
                plan: ws.plan || ws.attributes?.plan || "Free",
            })) : []
            setWorkspaces(mappedWorkspaces)
        } catch (error) {
            console.error("Failed to fetch workspaces", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        const token = getToken()
        if (!token) {
            router.push("/login")
            return
        }

        // Load User
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                setUser(JSON.parse(userStr))
            } catch (e) {
                console.error("Failed to parse user", e)
            }
        }

        fetchWorkspaces()
    }, [fetchWorkspaces, router])

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) return

        setIsCreating(true)
        try {
            await createWorkspace(newTeamName)
            setNewTeamName("")
            setShowNewTeamDialog(false)
            fetchWorkspaces() // Refresh list
        } catch (error) {
            console.error("Failed to create workspace", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleSelectWorkspace = (workspace: any) => {
        setSelectedWorkspace(workspace)
        router.push("/dashboard")
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back{user?.username ? `, ${user.username}` : ''}</h1>
                    <p className="text-muted-foreground">Select a workspace to continue or create a new one.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {workspaces.map((workspace) => (
                        <Card
                            key={workspace.id}
                            className="group relative cursor-pointer hover:shadow-lg transition-all border-dashed md:border-solid hover:border-primary/50"
                            onClick={() => handleSelectWorkspace(workspace)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">
                                    {workspace.name}
                                </CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    {workspace.plan} Plan
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between group-hover:bg-primary/5 group-hover:text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSelectWorkspace(workspace)
                                    }}
                                >
                                    Enter Workspace <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
                        <DialogTrigger asChild>
                            <Card className="flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-muted/50 transition-colors min-h-[180px]">
                                <div className="flex flex-col items-center justify-center space-y-2 p-6">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Plus className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Create Workspace</h3>
                                    <p className="text-sm text-muted-foreground text-center">Add a new workspace to manage your projects.</p>
                                </div>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Workspace</DialogTitle>
                                <DialogDescription>
                                    Give your workspace a name to get started. You can change this later.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Workspace Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="My Awesome Project"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateTeam} disabled={isCreating || !newTeamName.trim()}>
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Workspace"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
