"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { forgotPassword } from "@/lib/auth-service"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string

        try {
            await forgotPassword(email)
            setMessage({ type: 'success', text: "We have sent you an email with a link to reset your password." })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to send reset link." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {message?.type === 'success' ? (
                        <div className="text-center">
                            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                                {message.text}
                            </div>
                            <Link href="/login">
                                <Button className="w-full">Return to Login</Button>
                            </Link>
                        </div>
                    ) : (
                        <form className="grid gap-4" onSubmit={handleSubmit}>
                            {message?.type === 'error' && (
                                <div className="text-red-500 text-sm text-center">{message.text}</div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center text-sm">
                                <Link href="/login" className="underline underline-offset-4">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
