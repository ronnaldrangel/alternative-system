'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User as UserIcon, LayoutDashboard, Settings, Bell, Mail, Shield, Camera, ChevronLeft } from 'lucide-react';

export default function ProfilePage() {
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
            {/* Navbar Minimalista */}
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <ChevronLeft size={20} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-400">Volver al Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/10 shadow-lg shadow-indigo-500/20">
                                <UserIcon size={20} className="text-white" />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Cabecera del Perfil */}
                <div className="relative mb-12">
                    <div className="h-48 w-full bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[32px] overflow-hidden opacity-40 blur-3xl absolute -top-10 -z-10"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 px-6">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-[#0a0a0c] shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                <UserIcon size={48} className="text-white" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 rounded-2xl border-2 border-[#0a0a0c] text-white hover:bg-indigo-500 transition-colors shadow-xl">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                                {user.username}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-tighter">
                                    Miembro Premium
                                </span>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold rounded-full uppercase tracking-tighter">
                                    ID: {user.id}
                                </span>
                            </div>
                        </div>

                        <button className="px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 shadow-xl">
                            Editar Perfil
                        </button>
                    </div>
                </div>

                {/* Información Detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Mail size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Información de Contacto</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Correo Electrónico</label>
                                <p className="text-slate-200 text-lg">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Nombre de Usuario</label>
                                <p className="text-slate-200 text-lg">@{user.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Seguridad y Cuenta</h3>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400">Estado de la Cuenta</span>
                                <span className="text-emerald-400 font-bold">Activa</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400">Verificación en dos pasos</span>
                                <span className="text-slate-500">Desactivada</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-400">Última conexión</span>
                                <span className="text-slate-400">Hoy, hace un momento</span>
                            </div>
                        </div>

                        <button className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-sm font-bold transition-all text-slate-300">
                            Cambiar Contraseña
                        </button>
                    </div>
                </div>

                {/* Sección de Peligro */}
                <div className="mt-12 p-8 border border-red-500/20 bg-red-500/5 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-lg font-bold text-red-400">Zona de Peligro</h4>
                        <p className="text-sm text-slate-500 mt-1">Eliminar tu cuenta es una acción permanente y no se puede deshacer.</p>
                    </div>
                    <button className="px-6 py-3 bg-red-600/10 border border-red-600/30 text-red-500 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                        Eliminar mi cuenta
                    </button>
                </div>
            </main>
        </div>
    );
}
