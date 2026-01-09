'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, LayoutDashboard, Settings, Bell, Search } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const jwt = localStorage.getItem('jwt');

        if (!storedUser || !jwt) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <LayoutDashboard size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Dashboard</span>
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
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium leading-none">{user.username}</p>
                                    <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/10 shadow-lg shadow-indigo-500/20">
                                    <UserIcon size={20} className="text-white" />
                                </div>
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
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Bienvenido, {user.username.split('_')[0]} 👋</h1>
                    <p className="text-slate-400 mt-2">Aquí tienes un resumen de tu cuenta premium.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 flex flex-col gap-4">
                        <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-400">
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
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Settings size={80} />
                        </div>
                        <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-purple-400">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mt-4">Configuración</h3>
                        <p className="text-sm text-slate-400 mt-2">Gestiona las preferencias de tu cuenta y notificaciones.</p>
                        <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                            Ir a ajustes
                        </button>
                    </div>

                    <div className="glass p-6 bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/30">
                        <div className="bg-amber-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-amber-400">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mt-4">Novedades</h3>
                        <p className="text-sm text-slate-400 mt-2">No tienes notificaciones pendientes en este momento.</p>
                        <div className="mt-6 bg-white/5 rounded-lg p-3 text-xs text-slate-500 italic">
                            "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
