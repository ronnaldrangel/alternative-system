import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
            <Toaster richColors position="top-right" />
            <div className="w-full max-w-sm md:max-w-4xl">
                <Card className="overflow-hidden rounded-xl shadow-xl">
                    <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
                        <div className="flex flex-col justify-center p-6 md:p-8 bg-card">
                            {children}
                        </div>
                        <div className="relative hidden bg-zinc-900 md:block">
                            <img
                                src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop"
                                alt="Authentication background"
                                className="absolute inset-0 h-full w-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
                                <h3 className="text-2xl font-bold">Alternative System</h3>
                                <p className="text-sm text-zinc-300 mt-2">
                                    Secure, fast, and reliable platform for your business needs.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary mt-8">
                    By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                    and <a href="#">Privacy Policy</a>.
                </div>
            </div>
        </div>
    );
}
