'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { forgotPassword } from '@/lib/strapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

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
            toast.success('Petición enviada correctamente');
        } catch (err: any) {
            setError(err.message || 'Error al procesar la solicitud. Intenta de nuevo.');
            toast.error('Error al enviar el enlace');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {success ? 'Verifica tu buzón' : 'Recuperar Cuenta'}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {success
                        ? 'Te hemos enviado las instrucciones por correo'
                        : 'Te enviaremos un enlace para restablecer tu contraseña'
                    }
                </p>
            </div>

            {success ? (
                <div className="space-y-6 animate-in fade-in zoom-in duration-500 text-center">
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
                            <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-lg text-emerald-500">¡Correo enviado!</p>
                                <p className="text-sm text-muted-foreground">
                                    Revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu acceso.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button asChild className="w-full h-11">
                        <Link href="/login">Volver al inicio de sesión</Link>
                    </Button>
                </div>
            ) : (
                <>
                    {error && (
                        <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="pl-10 h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando enlace...
                                </>
                            ) : 'Enviar enlace de recuperación'}
                        </Button>
                    </form>

                    <div className="text-center pt-2">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                            <Link href="/login" className="flex items-center gap-2">
                                <ChevronLeft size={16} />
                                Volver al inicio de sesión
                            </Link>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
