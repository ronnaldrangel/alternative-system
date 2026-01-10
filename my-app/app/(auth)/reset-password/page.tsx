"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { resetPassword } from "@/lib/auth-service"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!code) {
            setError("Invalid reset code. Please try requesting a new link.")
            return
        }

        const formData = new FormData(e.currentTarget)
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirm-password") as string

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            await resetPassword(code, password, confirmPassword)
            // Redirect to login or dashboard
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Failed to reset password.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <PasswordInput id="password" name="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <PasswordInput id="confirm-password" name="confirm-password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                        <div className="text-center text-sm">
                            <Link href="/login" className="underline underline-offset-4">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
