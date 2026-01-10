"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth-service"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = getToken()
        if (token) {
            router.push("/dashboard")
        } else {
            setIsLoading(false)
        }
    }, [router])

    if (isLoading) {
        return null // Or a loading spinner
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </a>
                {children}
            </div>
        </div>
    )
}
