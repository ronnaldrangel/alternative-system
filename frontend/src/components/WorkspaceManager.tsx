'use client';

import { useState, useEffect } from 'react';
import { Plus, Layout, Loader2, Check, ArrowRight } from 'lucide-react';
import { getWorkspaces, createWorkspace } from '@/lib/strapi';

interface Workspace {
    id: number;
    name: string;
    slug: string;
}

interface WorkspaceManagerProps {
    onWorkspaceSelected: (workspace: Workspace) => void;
}

export default function WorkspaceManager({ onWorkspaceSelected }: WorkspaceManagerProps) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [error, setError] = useState('');

    const fetchWorkspaces = async () => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) return;
            const response = await getWorkspaces(jwt);
            setWorkspaces(response.data.map((item: any) => {
                if (item.attributes) {
                    return { id: item.id, ...item.attributes };
                }
                return item; // Strapi 5 returns flat objects
            }));
        } catch (err) {
            console.error('Error fetching workspaces:', err);
            setError('Error al cargar workspaces');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        setCreating(true);
        setError('');
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) return;
            const response = await createWorkspace(newWorkspaceName, jwt);
            const data = response.data;
            const newWs = data.attributes ? { id: data.id, ...data.attributes } : data;

            setWorkspaces([...workspaces, newWs]);
            setNewWorkspaceName('');
            onWorkspaceSelected(newWs);
        } catch (err: any) {
            setError(err.message || 'Error al crear workspace');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-[#0a0a0c] z-[100] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0c]/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#121216] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-indigo-600/20 p-3 rounded-xl">
                            <Layout className="text-indigo-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Tus Workspaces</h2>
                            <p className="text-slate-400 text-sm">Selecciona o crea un espacio de trabajo para continuar</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {workspaces.map((ws) => (
                            <button
                                key={ws.id}
                                onClick={() => onWorkspaceSelected(ws)}
                                className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-600/10 hover:border-indigo-500/50 transition-all text-left flex items-center justify-between"
                            >
                                <span className="font-medium text-slate-200 group-hover:text-white">{ws.name}</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-8">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Crear nuevo workspace</h3>
                        <form onSubmit={handleCreate} className="flex gap-3">
                            <input
                                type="text"
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                placeholder="Nombre del workspace..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                required
                            />
                            <button
                                type="submit"
                                disabled={creating}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
                            >
                                {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                <span>Crear</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
