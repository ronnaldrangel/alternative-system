'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User as UserIcon, Mail, Shield, Camera, ChevronLeft, BadgeCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
        localStorage.removeItem('currentWorkspace');
        router.push('/login');
        toast.info('Sesión cerrada');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar Minimalista */}
            <nav className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
                            <Link href="/dashboard">
                                <ChevronLeft size={18} />
                                <span>Volver al Dashboard</span>
                            </Link>
                        </Button>

                        <div className="flex items-center gap-4">
                            <Avatar className="h-8 w-8 border border-border/40">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                                <LogOut size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Cabecera del Perfil */}
                <div className="relative mb-12">
                    <div className="h-48 w-full bg-primary/20 rounded-[32px] overflow-hidden blur-3xl absolute -top-10 -z-10"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 px-6">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 rounded-[40px] border-4 border-background shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                                    {user.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button size="icon" className="absolute bottom-0 right-0 rounded-2xl border-2 border-background shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                <Camera size={18} />
                            </Button>
                        </div>

                        <div className="text-center md:text-left flex-1 space-y-3">
                            <div className="space-y-1">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                    {user.username}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                                        <BadgeCheck size={12} />
                                        Miembro Premium
                                    </Badge>
                                    <Badge variant="outline" className="border-border/40 text-muted-foreground">
                                        ID: {user.id}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Button className="rounded-2xl px-8 h-12 shadow-xl">
                            Editar Perfil
                        </Button>
                    </div>
                </div>

                {/* Información Detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-border/40 shadow-sm transition-all hover:shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Contacto</CardTitle>
                                    <CardDescription>Información pública de contacto</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                                <p className="text-foreground font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Usuario</label>
                                <p className="text-foreground font-medium">@{user.username}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 shadow-sm transition-all hover:shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Seguridad</CardTitle>
                                    <CardDescription>Gestión de cuenta y acceso</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Estado</span>
                                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-wider">Activa</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">2FA</span>
                                    <span className="text-muted-foreground/50">Desactivada</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full h-10 border-border/40 mt-2">
                                Cambiar Contraseña
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección de Peligro */}
                <Card className="mt-12 border-destructive/20 bg-destructive/5 rounded-[32px]">
                    <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
                        <div className="text-center md:text-left">
                            <CardTitle className="text-lg font-bold text-destructive flex items-center gap-2 justify-center md:justify-start">
                                <Trash2 size={18} />
                                Zona de Peligro
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Eliminar tu cuenta es una acción permanente y no se puede deshacer.
                            </CardDescription>
                        </div>
                        <Button variant="destructive" className="px-8 h-11 rounded-2xl">
                            Eliminar mi cuenta
                        </Button>
                    </CardHeader>
                </Card>
            </main>
        </div>
    );
}
