import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="auth-container" style={{ flexDirection: 'column', gap: '40px' }}>
      <header style={{ textAlign: 'center', maxWidth: '800px', animation: 'fadeIn 0.8s ease-out' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>
          Next.js + Strapi <br />
          <span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Premium Authentication
          </span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '40px' }}>
          Un sistema de autenticación completo, seguro y con un diseño de vanguardia.
          Conectado directamente a tu backend de Strapi.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/login" className="auth-button" style={{ padding: '16px 32px', minWidth: '180px' }}>
            Iniciar Sesión
          </Link>
          <Link href="/register" className="glass" style={{ padding: '16px 32px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Crear Cuenta <ChevronRight size={18} />
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1000px', width: '100%' }}>
        {[
          { icon: <ShieldCheck color="var(--primary)" />, title: 'Seguridad', desc: 'Implementación robusta con JWT y protección de rutas.' },
          { icon: <Zap color="var(--accent)" />, title: 'Velocidad', desc: 'Cargas instantáneas optimizadas con Next.js App Router.' },
          { icon: <Globe color="var(--secondary)" />, title: 'Escalabilidad', desc: 'Arquitectura lista para crecer junto a tu proyecto.' }
        ].map((feat, i) => (
          <div key={i} className="glass" style={{ padding: '24px', textAlign: 'center', animation: `fadeIn 0.8s ease-out ${0.2 + i * 0.1}s both` }}>
            <div style={{ marginBottom: '16px', display: 'inline-block' }}>{feat.icon}</div>
            <h3 style={{ marginBottom: '8px' }}>{feat.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
