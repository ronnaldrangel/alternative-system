import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function ConfirmEmailPage() {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center flex flex-col items-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Check your email</CardTitle>
                    <CardDescription>
                        We've sent a verification link to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Click the link in the email to verify your account. If you don't see the email, check your spam folder.
                    </p>
                    <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                            Back to Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
