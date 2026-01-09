'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/strapi';

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
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                    Bienvenido
                </h1>
                <p className="text-slate-400">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-5 flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="identifier" className="text-sm font-medium text-slate-200 ml-1">
                        Usuario o Correo
                    </label>
                    <div className="relative flex items-center">
                        <Mail size={20} className="absolute left-3.5 text-slate-400" />
                        <input
                            type="text"
                            id="identifier"
                            placeholder="tu@email.com o usuario"
                            className="input-field"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center ml-1">
                        <label htmlFor="password" className="text-sm font-medium text-slate-200">
                            Contraseña
                        </label>
                        <Link href="/forgot-password" className="text-xs text-indigo-400 hover:underline">
                            ¿Has olvidado tu contraseña?
                        </Link>
                    </div>
                    <div className="relative flex items-center">
                        <Lock size={20} className="absolute left-3.5 text-slate-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3.5 text-slate-400 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="text-center mt-6 text-slate-400 text-sm">
                ¿No tienes una cuenta? <Link href="/register" className="text-indigo-400 font-semibold hover:underline">Regístrate gratis</Link>
            </div>
        </>
    );
}
