"use client"

import { useEffect, useState } from "react"
import { Rocket, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Workspace {
  id: number
  name: string
  slug: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedWorkspace = localStorage.getItem("currentWorkspace")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedWorkspace) {
      setCurrentWorkspace(JSON.parse(storedWorkspace))
    }
  }, [])

  if (!user || !currentWorkspace) {
    // Return a skeleton or null while client-side hydration happens.
    // Layout already handles redirect if missing credentials.
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Main Content Area */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-none shadow-none flex p-0">
          <CardContent className="p-6 flex flex-col justify-center w-full text-center">
            <h3 className="text-lg font-bold">Bienvenido, {user.username?.split('_')[0]}</h3>
            <p className="text-sm text-muted-foreground">{currentWorkspace.name}</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-none shadow-none">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-background rounded-md">
                <Users className="h-5 w-5 opacity-70" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Usuarios Activos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-none shadow-none">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-background rounded-md">
                <Rocket className="h-5 w-5 opacity-70" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Proyectos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Resumen General</h2>
            <p className="text-muted-foreground">Vista general de tu espacio de trabajo.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento</CardTitle>
              <CardDescription>Métricas de la última semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full bg-primary/5 rounded-md flex items-center justify-center text-muted-foreground border border-dashed border-primary/20">
                Gráfico Placeholder
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Log de eventos del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="font-medium">Nuevo usuario registrado</span>
                  <span className="ml-auto text-muted-foreground text-xs">2m</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Proyecto 'Alpha' actualizado</span>
                  <span className="ml-auto text-muted-foreground text-xs">1h</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Alerta de almacenamiento</span>
                  <span className="ml-auto text-muted-foreground text-xs">4h</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
