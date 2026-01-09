'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { forgotPassword } from '@/lib/strapi';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al procesar la solicitud. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                    Recuperar Cuenta
                </h1>
                <p className="text-slate-400">Te enviaremos un enlace para restablecer tu contraseña</p>
            </div>

            {success ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex flex-col items-center gap-4 mb-6">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                        <p className="font-medium text-lg">¡Correo enviado con éxito!</p>
                        <p className="text-sm text-slate-400 text-center">
                            Revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu acceso.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="btn-primary w-full inline-flex items-center justify-center"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-5 flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-200 ml-1">
                                Correo electrónico
                            </label>
                            <div className="relative flex items-center">
                                <Mail size={20} className="absolute left-3.5 text-slate-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Enviar enlace de recuperación'}
                        </button>
                    </form>

                    <div className="text-center mt-6 flex flex-col gap-4">
                        <Link
                            href="/login"
                            className="text-slate-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Cancelar y volver
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
