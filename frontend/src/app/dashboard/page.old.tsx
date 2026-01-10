'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User as UserIcon, LayoutDashboard, Settings, Bell, Search, Layout, ChevronDown, Rocket, Users, Plus } from 'lucide-react';
import WorkspaceManager from '@/components/WorkspaceManager';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface Workspace {
    id: number;
    name: string;
    slug: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [isSelectingWorkspace, setIsSelectingWorkspace] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const jwt = localStorage.getItem('jwt');
        const storedWorkspace = localStorage.getItem('currentWorkspace');

        if (!storedUser || !jwt) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
            if (storedWorkspace) {
                setCurrentWorkspace(JSON.parse(storedWorkspace));
            } else {
                setIsSelectingWorkspace(true);
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('currentWorkspace');
        router.push('/login');
        toast.info('Sesión cerrada');
    };

    const handleWorkspaceSelected = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
        localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
        setIsSelectingWorkspace(false);
        toast.success(`Cambiado a ${workspace.name}`);
    };

    if (!user) return null;

    if (isSelectingWorkspace) {
        return (
            <>
                <WorkspaceManager onWorkspaceSelected={handleWorkspaceSelected} />
                <Toaster richColors position="top-center" />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Toaster richColors position="top-right" />

            {/* Navbar */}
            <nav className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary p-2 rounded-lg">
                                    <LayoutDashboard size={20} className="text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">App</span>
                            </div>

                            <div className="h-6 w-[1px] bg-border/40 hidden sm:block"></div>

                            {/* Workspace Switcher */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 group px-3 border border-border/40 bg-secondary/50">
                                        <Layout size={16} className="text-primary" />
                                        <span className="text-sm font-medium">
                                            {currentWorkspace?.name || 'Seleccionar Workspace'}
                                        </span>
                                        <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[200px]">
                                    <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setIsSelectingWorkspace(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Gestionar Workspaces
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    placeholder="Buscar..."
                                    className="w-full bg-secondary/50 rounded-full pl-10 h-9 border-border/40 focus:ring-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                            </Button>

                            <div className="h-8 w-[1px] bg-border/40 mx-2"></div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-0 h-10 w-10 rounded-full hover:scale-105 transition-transform active:scale-95">
                                        <Avatar className="h-10 w-10 border border-border/40 shadow-sm">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {user.username.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Ajustes
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                                Workspace: {currentWorkspace?.name}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Bienvenido, {user.username.split('_')[0]} 👋
                        </h1>
                        <p className="text-muted-foreground mt-1">Aquí tienes un resumen de lo que está pasando en este workspace.</p>
                    </div>
                    <Button className="gap-2">
                        <Rocket size={18} />
                        Acción Rápida
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:border-primary/50 transition-all cursor-pointer group">
                        <CardHeader>
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
                                <Users size={24} />
                            </div>
                            <CardTitle>Usuarios</CardTitle>
                            <CardDescription>Gestión de usuarios del workspace</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Activos:</span>
                                    <span className="font-semibold">12</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Nuevos (hoy):</span>
                                    <span className="text-primary font-semibold">+2</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-primary/50 transition-all cursor-pointer group">
                        <CardHeader>
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
                                <Settings size={24} />
                            </div>
                            <CardTitle>Configuración</CardTitle>
                            <CardDescription>Ajustes generales del workspace</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Modifica el nombre, el slug y los permisos generales para este espacio.
                            </p>
                            <Button variant="outline" className="w-full mt-4 h-9">Editar configuración</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader>
                            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                                <Rocket size={24} />
                            </div>
                            <CardTitle className="text-white">Plan Premium</CardTitle>
                            <CardDescription className="text-white/80">Tu cuenta tiene acceso a todas las funciones</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 bg-white/10 rounded-lg text-xs italic">
                                "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
                            </div>
                            <Button variant="secondary" className="w-full mt-4 h-9">Ver beneficios</Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
