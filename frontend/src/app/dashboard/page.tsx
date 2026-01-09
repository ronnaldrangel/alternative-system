'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Settings, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
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
        <div style={{ minHeight: '100vh', padding: '40px', background: 'var(--background)' }}>
            <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LayoutDashboard size={24} color="var(--primary)" />
                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Dashboard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(to bottom right, var(--primary), var(--accent))', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <UserIcon size={18} color="white" />
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <main>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="glass" style={{ padding: '32px' }}>
                        <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Bienvenido de nuevo!</h2>
                        <p style={{ color: '#94a3b8' }}>Has iniciado sesión correctamente con Strapi. Esta es tu área privada personalizada.</p>
                    </div>
                    <div className="glass" style={{ padding: '32px' }}>
                        <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Tus Datos</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Email:</span>
                                <span>{user.email}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>ID:</span>
                                <span>{user.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
