"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Briefcase, Loader2, ArrowRight } from "lucide-react"
import Image from "next/image"

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
                    <h1 className="text-3xl font-bold tracking-tight">Bienvenido{user?.username ? `, ${user.username}` : ''} 👋</h1>
                    <p className="text-muted-foreground">Seleccione un espacio de trabajo para continuar o crear uno nuevo.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {workspaces.map((workspace) => (
                        <Card
                            key={workspace.id}
                            className="group relative cursor-pointer hover:shadow-lg transition-all border-dashed md:border-solid hover:border-primary/50 text-center"
                            onClick={() => handleSelectWorkspace(workspace)}
                        >
                            <CardHeader className="flex flex-col items-center space-y-2 pb-0">
                                <Image
                                    src="/icons/workspace.webp"
                                    alt="Workspace"
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                                <CardTitle className="text-lg font-medium">
                                    {workspace.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-xs text-muted-foreground">
                                    {workspace.plan} Plan
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
                        <DialogTrigger asChild>
                            <Card className="flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-muted/50 transition-colors min-h-[180px]">
                                <div className="flex flex-col items-center justify-center space-y-2 p-6">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Plus className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Crear espacio de trabajo</h3>
                                </div>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Crear espacio de trabajo</DialogTitle>
                                <DialogDescription>
                                    Dale un nombre a tu espacio de trabajo para empezar.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del espacio de trabajo</Label>
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
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreateTeam} disabled={isCreating || !newTeamName.trim()}>
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        "Crear espacio de trabajo"
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
