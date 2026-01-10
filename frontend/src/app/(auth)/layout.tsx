import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden font-sans">
            <Toaster richColors position="top-right" />

            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 -z-10"></div>

            <div className="w-full max-w-[480px] border border-border/40 bg-card/50 backdrop-blur-xl p-8 sm:p-12 rounded-[32px] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-700">
                {children}
            </div>
        </div>
    );
}
