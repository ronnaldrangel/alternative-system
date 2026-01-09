import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Globe, Github } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap size={22} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">StrapiAuth</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-slate-200 transition-all active:scale-95">
            Empezar Gratis
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Nueva Versión 2.0 disponible
        </div>

        <header className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Next.js + Strapi <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Auth de Nueva Generación
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Un sistema de autenticación completo, ultrarrápido y con un diseño premium.
            Integra tu backend de Strapi en segundos con la potencia de Next.js 15.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 group">
              Crear mi cuenta <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="https://github.com" className="px-8 py-4 glass hover:bg-white/10 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Github size={20} /> Ver en GitHub
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              icon: <ShieldCheck className="text-indigo-400" size={32} />,
              title: 'Seguridad Militar',
              desc: 'Protección con JWT, refresco de tokens y rutas protegidas por middleware.'
            },
            {
              icon: <Zap className="text-amber-400" size={32} />,
              title: 'Rendimiento Extremo',
              desc: 'Renderizado híbrido y optimización de imágenes para una carga instantánea.'
            },
            {
              icon: <Globe className="text-emerald-400" size={32} />,
              title: 'Escalable al Infinito',
              desc: 'Arquitectura modular diseñada para soportar millones de usuarios sin esfuerzo.'
            }
          ].map((feat, i) => (
            <div key={i} className="glass group p-8 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-indigo-500/10 transition-colors">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 StrapiAuth Premium. Desarrollado con ❤️ para la comunidad.
        </div>
      </footer>
    </div>
  );
}
