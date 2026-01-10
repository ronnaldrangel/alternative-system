import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Globe, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Luces de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap size={22} className="text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">StrapiAuth</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Link href="/register">Empezar Gratis</Link>
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
        <Badge variant="outline" className="gap-2 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary mb-8 animate-bounce transition-all">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          Nueva Versión 2.0 disponible
        </Badge>

        <header className="text-center max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Next.js + Strapi <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Auth de Nueva Generación
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Un sistema de autenticación completo, ultrarrápido y con un diseño premium.
            Integra tu backend de Strapi en segundos con la potencia de Next.js 15.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 group">
              <Link href="/register" className="flex items-center gap-2">
                Crear mi cuenta <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 border-border/40 rounded-2xl font-bold text-lg hover:bg-secondary/50 transition-all">
              <Link href="https://github.com" className="flex items-center gap-2">
                <Github size={20} /> Ver en GitHub
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              icon: <ShieldCheck className="text-primary" size={32} />,
              title: 'Seguridad Militar',
              desc: 'Protección con JWT, refresco de tokens y rutas protegidas por middleware.'
            },
            {
              icon: <Zap className="text-amber-500" size={32} />,
              title: 'Rendimiento Extremo',
              desc: 'Renderizado híbrido y optimización de imágenes para una carga instantánea.'
            },
            {
              icon: <Globe className="text-emerald-500" size={32} />,
              title: 'Escalable al Infinito',
              desc: 'Arquitectura modular diseñada para soportar millones de usuarios sin esfuerzo.'
            }
          ].map((feat, i) => (
            <Card key={i} className="group border-border/40 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 bg-secondary/10">
              <CardHeader>
                <div className="mb-2 p-4 bg-primary/5 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
                  {feat.icon}
                </div>
                <CardTitle className="text-xl font-bold">{feat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/40 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
          © 2026 StrapiAuth Premium. Desarrollado con ❤️ para la comunidad.
        </div>
      </footer>
    </div>
  );
}
