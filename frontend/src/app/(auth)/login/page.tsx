'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/strapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await loginUser(formData.identifier, formData.password);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('¡Bienvenido de nuevo!');
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
            toast.error('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                    Bienvenido
                </h1>
                <p className="text-balance text-muted-foreground">
                    Ingresa tus credenciales para continuar
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <label htmlFor="identifier" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Usuario o Correo
                    </label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="tu@email.com o usuario"
                            className="pl-10 h-11"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-sm font-medium leading-none">
                            Contraseña
                        </label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">
                            ¿Has olvidado tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-11"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                    </div>
                </div>

                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Iniciando sesión...
                        </>
                    ) : 'Iniciar Sesión'}
                </Button>
            </form>

            <div className="text-center text-sm text-balance">
                ¿No tienes una cuenta?{' '}
                <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                    Regístrate gratis
                </Link>
            </div>
        </div>
    );
}
