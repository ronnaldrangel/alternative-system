'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User as UserIcon, LayoutDashboard, Settings, Bell, Search, Layout, ChevronDown } from 'lucide-react';
import WorkspaceManager from '@/components/WorkspaceManager';

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
    };

    const handleWorkspaceSelected = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
        localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
        setIsSelectingWorkspace(false);
    };

    if (!user) return null;

    if (isSelectingWorkspace) {
        return <WorkspaceManager onWorkspaceSelected={handleWorkspaceSelected} />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-600 p-2 rounded-lg">
                                    <LayoutDashboard size={20} className="text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">Dashboard</span>
                            </div>

                            <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

                            {/* Workspace Switcher */}
                            <button
                                onClick={() => setIsSelectingWorkspace(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <Layout size={16} className="text-indigo-400" />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                                    {currentWorkspace?.name || 'Seleccionar Workspace'}
                                </span>
                                <ChevronDown size={14} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0a0a0c]"></span>
                            </button>

                            <div className="h-8 w-[1px] bg-white/10"></div>

                            <div className="flex items-center gap-3">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium leading-none">{user.username}</p>
                                    <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                                </div>
                                <Link href="/dashboard/profile" className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/10 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                                    <UserIcon size={20} className="text-white" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                Workspace: {currentWorkspace?.name}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white leading-tight">
                            Bienvenido, {user.username.split('_')[0]} 👋
                        </h1>
                        <p className="text-slate-400 mt-1">Aquí tienes un resumen de lo que está pasando en este workspace.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/dashboard/profile" className="glass p-6 flex flex-col gap-4 hover:border-indigo-500/50 transition-all group cursor-pointer transition-all duration-300">
                        <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <UserIcon size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-200">Perfil del Usuario</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">ID de Usuario:</span>
                                    <span className="font-mono text-indigo-400">{user.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Email:</span>
                                    <span className="text-slate-300">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="glass p-6 border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Settings size={80} />
                        </div>
                        <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-purple-400">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mt-4">Configuración de Workspace</h3>
                        <p className="text-sm text-slate-400 mt-2">Gestiona las preferencias de "{currentWorkspace?.name}" y notificaciones.</p>
                        <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                            Ir a ajustes
                        </button>
                    </div>

                    <div className="glass p-6 bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/30 transition-all duration-300">
                        <div className="bg-amber-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-amber-400">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mt-4">Novedades</h3>
                        <p className="text-sm text-slate-400 mt-2">No tienes notificaciones pendientes en este workspace.</p>
                        <div className="mt-6 bg-white/5 rounded-lg p-3 text-xs text-slate-500 italic">
                            "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
