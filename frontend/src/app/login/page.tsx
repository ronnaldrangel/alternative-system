'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { loginUser } from '@/lib/strapi';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <h1>Bienvenido</h1>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="identifier">Usuario o Correo</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="text"
                                id="identifier"
                                placeholder="tu@email.com o usuario"
                                value={formData.identifier}
                                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? <Loader2 className="loading-spinner" /> : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="auth-footer">
                    ¿No tienes una cuenta? <Link href="/register">Regístrate gratis</Link>
                </div>
            </div>
        </div>
    );
}
