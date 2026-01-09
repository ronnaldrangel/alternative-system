export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-5 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.15),transparent)]">
            <div className="w-full max-w-[450px] glass p-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                {children}
            </div>
        </div>
    );
}
