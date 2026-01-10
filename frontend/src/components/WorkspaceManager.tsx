'use client';

import { useState, useEffect } from 'react';
import { Plus, Layout, Loader2, ArrowRight } from 'lucide-react';
import { getWorkspaces, createWorkspace } from '@/lib/strapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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

    const fetchWorkspaces = async () => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) return;
            const response = await getWorkspaces(jwt);
            setWorkspaces(response.data.map((item: any) => {
                if (item.attributes) {
                    return { id: item.id, ...item.attributes };
                }
                return item;
            }));
        } catch (err) {
            console.error('Error fetching workspaces:', err);
            toast.error('Error al cargar workspaces');
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
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) return;
            const response = await createWorkspace(newWorkspaceName, jwt);
            const data = response.data;
            const newWs = data.attributes ? { id: data.id, ...data.attributes } : data;

            setWorkspaces([...workspaces, newWs]);
            setNewWorkspaceName('');
            toast.success('Workspace creado correctamente');
            onWorkspaceSelected(newWs);
        } catch (err: any) {
            toast.error(err.message || 'Error al crear workspace');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-border/40 shadow-2xl animate-in fade-in zoom-in duration-300">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <Layout className="text-primary" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Tus Workspaces</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Selecciona o crea un espacio de trabajo para continuar
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {workspaces.map((ws) => (
                            <Button
                                key={ws.id}
                                variant="outline"
                                onClick={() => onWorkspaceSelected(ws)}
                                className="h-auto p-4 flex items-center justify-between group border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                            >
                                <span className="font-medium text-foreground group-hover:text-primary">{ws.name}</span>
                                <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Button>
                        ))}
                        {workspaces.length === 0 && (
                            <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-xl border-border/40">
                                No tienes workspaces. Crea uno para comenzar.
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col border-t border-border/10 pt-6">
                    <h3 className="w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-left">
                        Crear nuevo workspace
                    </h3>
                    <form onSubmit={handleCreate} className="w-full flex gap-3">
                        <Input
                            type="text"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="Nombre del workspace..."
                            className="flex-1 bg-background/50 border-border/40"
                            required
                        />
                        <Button
                            type="submit"
                            disabled={creating}
                            className="flex items-center gap-2"
                        >
                            {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                            <span>Crear</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
